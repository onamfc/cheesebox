"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [bucketName, setBucketName] = useState("");
  const [region, setRegion] = useState("us-east-1");
  const [mediaConvertRole, setMediaConvertRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await fetch("/api/aws-credentials");
        if (response.ok) {
          const data = await response.json();
          setAccessKeyId(data.accessKeyId);
          setSecretAccessKey(data.secretAccessKey);
          setBucketName(data.bucketName);
          setRegion(data.region);
          setMediaConvertRole(data.mediaConvertRole || "");
          setHasCredentials(true);
        }
      } catch (error) {
        console.error("Error fetching credentials:", error);
      }
    };

    if (status === "authenticated") {
      fetchCredentials();
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/aws-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessKeyId,
          secretAccessKey,
          bucketName,
          region,
          mediaConvertRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save credentials");
        setLoading(false);
        return;
      }

      setSuccess("AWS credentials saved successfully!");
      setHasCredentials(true);
      setLoading(false);
    } catch (err) {
      setError("Failed to save credentials");
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="text-xl font-bold text-gray-900"
              >
                Private Video
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            AWS Settings
          </h1>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Required AWS IAM Permissions
            </h3>
            <p className="text-sm text-blue-700 mb-2">
              Your AWS credentials must have the following permissions:
            </p>
            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>S3: PutObject, GetObject, DeleteObject, ListBucket</li>
              <li>MediaConvert: CreateJob, DescribeEndpoints, GetJob</li>
              <li>Optionally SES: SendEmail (if using AWS SES for emails)</li>
            </ul>
            <p className="text-sm text-blue-700 mt-2">
              See the README for a sample IAM policy.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="accessKeyId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  AWS Access Key ID
                </label>
                <input
                  type="text"
                  id="accessKeyId"
                  value={accessKeyId}
                  onChange={(e) => setAccessKeyId(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="AKIAIOSFODNN7EXAMPLE"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="secretAccessKey"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  AWS Secret Access Key
                </label>
                <input
                  type="password"
                  id="secretAccessKey"
                  value={secretAccessKey}
                  onChange={(e) => setSecretAccessKey(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Your credentials are encrypted before being stored
                </p>
              </div>

              <div>
                <label
                  htmlFor="bucketName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  S3 Bucket Name
                </label>
                <input
                  type="text"
                  id="bucketName"
                  value={bucketName}
                  onChange={(e) => setBucketName(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="my-private-videos-bucket"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="region"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  AWS Region
                </label>
                <select
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                  required
                >
                  <option value="us-east-1">US East (N. Virginia)</option>
                  <option value="us-east-2">US East (Ohio)</option>
                  <option value="us-west-1">US West (N. California)</option>
                  <option value="us-west-2">US West (Oregon)</option>
                  <option value="eu-west-1">EU (Ireland)</option>
                  <option value="eu-west-2">EU (London)</option>
                  <option value="eu-central-1">EU (Frankfurt)</option>
                  <option value="ap-southeast-1">
                    Asia Pacific (Singapore)
                  </option>
                  <option value="ap-southeast-2">Asia Pacific (Sydney)</option>
                  <option value="ap-northeast-1">Asia Pacific (Tokyo)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="mediaConvertRole"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  MediaConvert IAM Role ARN (Required for video transcoding)
                </label>
                <input
                  type="text"
                  id="mediaConvertRole"
                  value={mediaConvertRole}
                  onChange={(e) => setMediaConvertRole(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="arn:aws:iam::123456789012:role/MediaConvertRole"
                />
                <p className="mt-1 text-xs text-gray-500">
                  The IAM role that MediaConvert will use to access your S3
                  bucket.{" "}
                  <a
                    href="https://docs.aws.amazon.com/mediaconvert/latest/ug/iam-role.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-500 underline"
                  >
                    How to create this role
                  </a>
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading
                    ? "Saving..."
                    : hasCredentials
                      ? "Update Credentials"
                      : "Save Credentials"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
