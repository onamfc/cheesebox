import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  MediaConvertClient,
  CreateJobCommand,
  DescribeEndpointsCommand,
} from "@aws-sdk/client-mediaconvert";

export interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  region: string;
  mediaConvertRole?: string;
}

export function createS3Client(credentials: AWSCredentials): S3Client {
  return new S3Client({
    region: credentials.region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    },
  });
}

export async function uploadToS3(
  s3Client: S3Client,
  bucketName: string,
  key: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);
}

export async function deleteFromS3(
  s3Client: S3Client,
  bucketName: string,
  key: string,
): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await s3Client.send(command);
}

export async function deleteS3Directory(
  s3Client: S3Client,
  bucketName: string,
  prefix: string,
): Promise<void> {
  // List all objects with the given prefix
  const listCommand = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
  });

  const listedObjects = await s3Client.send(listCommand);

  if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
    return; // No objects to delete
  }

  // Delete all objects in the directory
  const deleteCommand = new DeleteObjectsCommand({
    Bucket: bucketName,
    Delete: {
      Objects: listedObjects.Contents.map((obj) => ({ Key: obj.Key })),
    },
  });

  await s3Client.send(deleteCommand);

  // If there are more objects (pagination), recursively delete
  if (listedObjects.IsTruncated) {
    await deleteS3Directory(s3Client, bucketName, prefix);
  }
}

export async function generatePresignedUrl(
  s3Client: S3Client,
  bucketName: string,
  key: string,
  expiresIn: number = 10800, // 3 hours in seconds
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
}

export async function createMediaConvertClient(
  credentials: AWSCredentials,
): Promise<MediaConvertClient> {
  // First, get the MediaConvert endpoint
  const tempClient = new MediaConvertClient({
    region: credentials.region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    },
  });

  const endpointsCommand = new DescribeEndpointsCommand({ MaxResults: 1 });
  const endpointsResponse = await tempClient.send(endpointsCommand);

  if (
    !endpointsResponse.Endpoints ||
    endpointsResponse.Endpoints.length === 0
  ) {
    throw new Error("No MediaConvert endpoints found");
  }

  const endpoint = endpointsResponse.Endpoints[0].Url;

  // Create the actual client with the endpoint
  return new MediaConvertClient({
    region: credentials.region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    },
    endpoint,
  });
}

export interface TranscodeJobParams {
  inputKey: string;
  outputKeyPrefix: string;
  bucketName: string;
  role: string;
}

export async function createHLSTranscodeJob(
  mediaConvertClient: MediaConvertClient,
  params: TranscodeJobParams,
): Promise<string> {
  const { inputKey, outputKeyPrefix, bucketName, role } = params;

  const jobSettings = {
    Inputs: [
      {
        FileInput: `s3://${bucketName}/${inputKey}`,
        AudioSelectors: {
          "Audio Selector 1": {
            DefaultSelection: "DEFAULT",
          },
        },
        VideoSelector: {
          // Auto-rotate video based on metadata (preserves portrait orientation)
          Rotate: "AUTO",
        },
      },
    ],
    OutputGroups: [
      {
        Name: "Apple HLS",
        OutputGroupSettings: {
          Type: "HLS_GROUP_SETTINGS",
          HlsGroupSettings: {
            Destination: `s3://${bucketName}/${outputKeyPrefix}`,
            SegmentLength: 10,
            MinSegmentLength: 0,
            DirectoryStructure: "SINGLE_DIRECTORY",
          },
        },
        Outputs: [
          {
            NameModifier: "_hls",
            ContainerSettings: {
              Container: "M3U8",
              M3u8Settings: {},
            },
            VideoDescription: {
              CodecSettings: {
                Codec: "H_264",
                H264Settings: {
                  MaxBitrate: 5000000,
                  RateControlMode: "QVBR",
                  SceneChangeDetect: "TRANSITION_DETECTION",
                },
              },
            },
            AudioDescriptions: [
              {
                CodecSettings: {
                  Codec: "AAC",
                  AacSettings: {
                    Bitrate: 96000,
                    CodingMode: "CODING_MODE_2_0",
                    SampleRate: 48000,
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  };

  const command = new CreateJobCommand({
    Role: role,
    Settings: jobSettings as any,
  });

  const response = await mediaConvertClient.send(command);

  if (!response.Job?.Id) {
    throw new Error("Failed to create MediaConvert job");
  }

  return response.Job.Id;
}
