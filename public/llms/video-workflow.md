# Video Workflow

Complete guide to video upload, processing, and delivery pipeline.

## Overview

```
Upload → S3 → MediaConvert → HLS → Presigned URLs → Playback
```

## Upload Phase

### 1. Initialize Upload

**Client Request:**
```typescript
POST /api/videos/init
{
  "title": "My Video",
  "description": "Description",
  "teamId": "optional"
}
```

**Server Response:**
- Creates database record with status `PENDING`
- Generates unique video ID
- Creates presigned S3 PUT URL (valid 1 hour)
- Returns upload URL and video metadata

### 2. Direct S3 Upload

**Client uploads directly to S3:**
```typescript
await fetch(uploadUrl, {
  method: 'PUT',
  body: videoFile,
  headers: {
    'Content-Type': videoFile.type
  }
});
```

**Benefits:**
- No file size limits from Cheesebox
- Faster uploads (direct to S3)
- Lower server costs
- Automatic multipart upload for large files

### 3. Trigger Transcoding

**Client Request:**
```typescript
POST /api/videos/transcode
{
  "videoId": "clx...",
  "inputKey": "videos/user-id/video-id/source.mp4"
}
```

**Server Actions:**
- Updates status to `PROCESSING`
- Creates MediaConvert job
- Stores job ID in database

## Transcoding Phase

### AWS MediaConvert Job

**Input:**
- Source video from S3 input bucket
- Any codec, resolution, bitrate

**Output:**
- HLS playlist (m3u8)
- Multiple quality renditions
- Segmented transport streams (ts files)

**Job Configuration:**
```json
{
  "Role": "arn:aws:iam::ACCOUNT:role/MediaConvert_Default_Role",
  "Settings": {
    "Inputs": [{
      "FileInput": "s3://input-bucket/videos/user-id/video-id/source.mp4"
    }],
    "OutputGroups": [{
      "OutputGroupSettings": {
        "Type": "HLS_GROUP_SETTINGS",
        "HlsGroupSettings": {
          "Destination": "s3://output-bucket/transcoded/user-id/video-id/"
        }
      },
      "Outputs": [
        {
          "VideoDescription": {
            "Width": 1920,
            "Height": 1080,
            "CodecSettings": { "Codec": "H_264" }
          },
          "AudioDescriptions": [{
            "CodecSettings": { "Codec": "AAC" }
          }],
          "ContainerSettings": { "Container": "M3U8" }
        },
        {
          "VideoDescription": {
            "Width": 1280,
            "Height": 720
          }
        },
        {
          "VideoDescription": {
            "Width": 640,
            "Height": 360
          }
        }
      ]
    }]
  }
}
```

### Polling Job Status

Cheesebox polls MediaConvert every 30 seconds:

```typescript
const job = await mediaConvert.getJob({ Id: jobId });
if (job.Job.Status === 'COMPLETE') {
  await prisma.video.update({
    where: { id: videoId },
    data: { transcodingStatus: 'COMPLETED' }
  });
}
```

**Statuses:**
- `SUBMITTED`: Job queued
- `PROGRESSING`: Currently transcoding
- `COMPLETE`: Finished successfully
- `CANCELED`: User or system cancelled
- `ERROR`: Failed (check error message)

## Playback Phase

### 1. Request Playback URLs

**Client Request:**
```typescript
POST /api/videos/[id]/play
```

**Permission Check:**
- Video owner: Always allowed
- Shared with user's email: Allowed
- Public video: Allowed
- Team member: Allowed

### 2. Generate Presigned URLs

**Server generates URLs for:**
- Master playlist (m3u8)
- All segment playlists
- All TS video segments

**URL expiration: 3 hours**

**Example Response:**
```json
{
  "manifestUrl": "https://bucket.s3.amazonaws.com/transcoded/.../master.m3u8?X-Amz-Expires=10800&...",
  "segmentUrls": {
    "1080p.m3u8": "https://...",
    "720p.m3u8": "https://...",
    "segment_001.ts": "https://...",
    "segment_002.ts": "https://..."
  },
  "expiresIn": 10800
}
```

### 3. HLS Player Loads Video

**Player sequence:**
1. Fetch master m3u8
2. Parse available quality levels
3. Select quality based on bandwidth
4. Fetch segments sequentially
5. Decode and display

**Adaptive Bitrate:**
- Monitors network speed
- Switches quality automatically
- Provides smooth playback

## File Structure

### Input Bucket

```
videos/
  [user-id]/
    [video-id]/
      source.mp4              # Original uploaded file
      thumbnail.jpg           # Optional thumbnail
```

### Output Bucket

```
transcoded/
  [user-id]/
    [video-id]/
      master.m3u8             # Master playlist
      1080p/
        playlist.m3u8         # 1080p playlist
        segment_00001.ts
        segment_00002.ts
        ...
      720p/
        playlist.m3u8
        segment_00001.ts
        ...
      360p/
        playlist.m3u8
        segment_00001.ts
        ...
```

## Error Handling

### Upload Failures

**Common issues:**
- Network interruption
- File too large for browser memory
- S3 permissions error

**Recovery:**
- Retry upload with same presigned URL
- Request new presigned URL if expired
- Check browser console for specific error

### Transcoding Failures

**Common causes:**
- Unsupported codec
- Corrupted source file
- MediaConvert permissions
- Insufficient IAM role permissions

**Recovery:**
1. Check MediaConvert job details
2. Download source file and verify
3. Re-upload if corrupted
4. Update MediaConvert role if permissions issue

### Playback Failures

**Common issues:**
- Expired presigned URLs
- CORS configuration
- Browser codec support

**Recovery:**
- Request new presigned URLs
- Check S3 CORS settings
- Verify HLS browser compatibility

## Performance Optimization

### Faster Transcoding

- Use smaller video files when possible
- Choose optimal frame rate (30fps vs 60fps)
- Limit number of quality renditions

### Reduced Costs

- Delete source files after transcoding
- Use S3 lifecycle policies
- Implement CloudFront CDN
- Choose appropriate MediaConvert tier

### Better Playback

- Use CloudFront for global distribution
- Enable HTTP/2 and QUIC
- Optimize segment duration (6-10 seconds)
- Implement video preloading

## Monitoring

### Track Metrics

- Upload success rate
- Average transcoding time
- Playback start time
- Buffering events
- Error rates

### Logging

```typescript
// Upload initiated
console.log('[VIDEO_UPLOAD_INIT]', { videoId, userId, size });

// Transcoding started
console.log('[VIDEO_TRANSCODE_START]', { videoId, jobId });

// Transcoding completed
console.log('[VIDEO_TRANSCODE_COMPLETE]', { videoId, duration });

// Playback requested
console.log('[VIDEO_PLAY]', { videoId, userId });
```

## Next Steps

- [HLS Streaming Details](/llms/hls-streaming.md)
- [Presigned URL Security](/llms/presigned-urls.md)
- [Troubleshooting Guide](/llms/troubleshooting.md)
