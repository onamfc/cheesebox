"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SettingsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const teamId = searchParams.get("teamId");
  const [teamName, setTeamName] = useState("");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [bucketName, setBucketName] = useState("");
  const [region, setRegion] = useState("us-east-1");
  const [mediaConvertRole, setMediaConvertRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importSources, setImportSources] = useState<any[]>([]);
  const [importingFrom, setImportingFrom] = useState("");

  // Email provider state
  const [emailProvider, setEmailProvider] = useState<
    "RESEND" | "AWS_SES" | "SMTP"
  >("RESEND");
  const [fromEmail, setFromEmail] = useState("");
  const [fromName, setFromName] = useState("");
  const [emailApiKey, setEmailApiKey] = useState("");
  const [awsEmailAccessKeyId, setAwsEmailAccessKeyId] = useState("");
  const [awsEmailSecretKey, setAwsEmailSecretKey] = useState("");
  const [awsEmailRegion, setAwsEmailRegion] = useState("us-east-1");
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUsername, setSmtpUsername] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [hasEmailCredentials, setHasEmailCredentials] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailMessage, setTestEmailMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch team name if teamId is present
  useEffect(() => {
    const fetchTeam = async () => {
      if (teamId) {
        try {
          const response = await fetch(`/api/teams/${teamId}`);
          if (response.ok) {
            const data = await response.json();
            setTeamName(data.name);
          }
        } catch (error) {
          console.error("Error fetching team:", error);
        }
      }
    };

    if (status === "authenticated") {
      fetchTeam();
    }
  }, [status, teamId]);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const url = teamId
          ? `/api/aws-credentials?teamId=${teamId}`
          : "/api/aws-credentials";
        const response = await fetch(url);
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
  }, [status, teamId]);

  // Fetch available import sources
  useEffect(() => {
    const fetchImportSources = async () => {
      if (!teamId) return; // Only for team settings

      try {
        const response = await fetch("/api/aws-credentials/sources");
        if (response.ok) {
          const data = await response.json();
          setImportSources(data.sources);
        }
      } catch (error) {
        console.error("Error fetching import sources:", error);
      }
    };

    if (status === "authenticated" && teamId) {
      fetchImportSources();
    }
  }, [status, teamId]);

  useEffect(() => {
    const fetchEmailCredentials = async () => {
      try {
        const response = await fetch("/api/email-credentials");
        if (response.ok) {
          const data = await response.json();
          setEmailProvider(data.provider);
          setFromEmail(data.fromEmail);
          setFromName(data.fromName || "");
          setEmailApiKey(data.apiKey || "");
          setAwsEmailAccessKeyId(data.awsAccessKeyId || "");
          setAwsEmailSecretKey(data.awsSecretKey || "");
          setAwsEmailRegion(data.awsRegion || "us-east-1");
          setSmtpHost(data.smtpHost || "");
          setSmtpPort(data.smtpPort || 587);
          setSmtpUsername(data.smtpUsername || "");
          setSmtpPassword(data.smtpPassword || "");
          setSmtpSecure(data.smtpSecure || false);
          setHasEmailCredentials(true);
        }
      } catch (error) {
        console.error("Error fetching email credentials:", error);
      }
    };

    if (status === "authenticated") {
      fetchEmailCredentials();
    }
  }, [status]);

  const handleImport = async (sourceId: string) => {
    setImportingFrom(sourceId);
    try {
      const url = sourceId === "personal"
        ? "/api/aws-credentials"
        : `/api/aws-credentials?teamId=${sourceId}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setAccessKeyId(data.accessKeyId);
        setSecretAccessKey(data.secretAccessKey);
        setBucketName(data.bucketName);
        setRegion(data.region);
        setMediaConvertRole(data.mediaConvertRole || "");
        setShowImportModal(false);
        setSuccess("Credentials imported successfully! Click 'Save Credentials' to apply them.");
      } else {
        setError("Failed to import credentials");
      }
    } catch (err) {
      setError("Failed to import credentials");
    } finally {
      setImportingFrom("");
    }
  };

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
          ...(teamId && { teamId }), // Include teamId if present
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save credentials");
        setLoading(false);
        return;
      }

      setSuccess(
        teamId
          ? "Team AWS credentials saved successfully!"
          : "AWS credentials saved successfully!"
      );
      setHasCredentials(true);
      setLoading(false);
    } catch (err) {
      setError("Failed to save credentials");
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setTestEmailLoading(true);
    setTestEmailMessage("");
    setEmailError("");
    setEmailSuccess("");

    try {
      const response = await fetch("/api/email-credentials/test", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        setEmailError(data.error || "Failed to send test email");
        setTestEmailLoading(false);
        return;
      }

      setTestEmailMessage(data.message);
      setEmailSuccess(
        `Test email sent! Check your inbox at ${session?.user?.email}`,
      );
      setTestEmailLoading(false);
    } catch (err) {
      setEmailError("Failed to send test email");
      setTestEmailLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess("");
    setEmailLoading(true);

    try {
      const payload: any = {
        provider: emailProvider,
        fromEmail,
        fromName: fromName || undefined,
      };

      // Add provider-specific fields
      if (emailProvider === "RESEND") {
        payload.apiKey = emailApiKey;
      } else if (emailProvider === "AWS_SES") {
        payload.awsAccessKeyId = awsEmailAccessKeyId;
        payload.awsSecretKey = awsEmailSecretKey;
        payload.awsRegion = awsEmailRegion;
      } else if (emailProvider === "SMTP") {
        payload.smtpHost = smtpHost;
        payload.smtpPort = smtpPort;
        payload.smtpUsername = smtpUsername;
        payload.smtpPassword = smtpPassword;
        payload.smtpSecure = smtpSecure;
      }

      const response = await fetch("/api/email-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setEmailError(data.error || "Failed to save email credentials");
        setEmailLoading(false);
        return;
      }

      setEmailSuccess("Email credentials saved successfully!");
      setHasEmailCredentials(true);
      setEmailLoading(false);
    } catch (err) {
      setEmailError("Failed to save email credentials");
      setEmailLoading(false);
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
                Cheesebox
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href={teamId ? `/dashboard/teams/${teamId}` : "/dashboard"}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                {teamId ? "Back to Team" : "Back to Dashboard"}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {teamId ? `Team AWS Settings - ${teamName}` : "AWS Settings"}
          </h1>

          {teamId && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-blue-800 mb-1">
                    Configuring Team Credentials
                  </h3>
                  <p className="text-sm text-blue-700">
                    You are configuring AWS credentials for the team &quot;{teamName}&quot;. All team members will be able to use these credentials to upload videos.
                  </p>
                </div>
                {importSources.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowImportModal(true)}
                    className="ml-4 px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 text-sm font-medium whitespace-nowrap"
                  >
                    Import from...
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Setup Guide Link */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-5 mb-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Need help setting up AWS?
                </h3>
                <p className="text-sm text-blue-800 mb-3">
                  Don&apos;t have your AWS credentials yet? Follow our
                  step-by-step guide to create your S3 bucket, IAM user, and
                  MediaConvert role.
                </p>
                <Link
                  href="/help/aws-setup"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors shadow-sm"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  View AWS Setup Guide
                </Link>
              </div>
            </div>
          </div>

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
              See the{" "}
              <Link
                href="/help/aws-setup"
                className="underline hover:text-blue-900 font-medium"
              >
                setup guide
              </Link>{" "}
              for detailed IAM policy instructions.
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
                  href={teamId ? `/dashboard/teams/${teamId}` : "/dashboard"}
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

          {/* Email Settings Section */}
          <div className="mt-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Email Settings
            </h1>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Configure Your Email Provider
              </h3>
              <p className="text-sm text-blue-700 mb-2">
                Choose your preferred email service to send video sharing
                notifications. Your credentials are encrypted before being
                stored.
              </p>
              <p className="text-sm text-blue-700 mb-3">
                Need help setting up? Follow our step-by-step guide for your email provider.
              </p>
              <Link
                href="/help/email-setup"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors shadow-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                View Email Setup Guide
              </Link>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              {emailError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">{emailError}</p>
                </div>
              )}

              {emailSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm text-green-800">{emailSuccess}</p>
                </div>
              )}

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {/* Provider Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Provider
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setEmailProvider("RESEND")}
                      className={`p-3 border rounded-md ${
                        emailProvider === "RESEND"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      <div className="font-medium text-black">Resend</div>
                      <div className="text-xs text-gray-600">
                        Simple API
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEmailProvider("AWS_SES")}
                      className={`p-3 border rounded-md ${
                        emailProvider === "AWS_SES"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      <div className="font-medium text-black">AWS SES</div>
                      <div className="text-xs text-gray-600">
                        Low cost
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEmailProvider("SMTP")}
                      className={`p-3 border rounded-md ${
                        emailProvider === "SMTP"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      <div className="font-medium text-black">SMTP</div>
                      <div className="text-xs text-gray-600">
                        Universal
                      </div>
                    </button>
                  </div>
                </div>

                {/* Common Fields */}
                <div>
                  <label
                    htmlFor="fromEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    From Email Address
                  </label>
                  <input
                    type="email"
                    id="fromEmail"
                    value={fromEmail}
                    onChange={(e) => setFromEmail(e.target.value)}
                    disabled={emailLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="noreply@yourdomain.com"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Emails will be sent from this address
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="fromName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    From Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="fromName"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    disabled={emailLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Cheesebox"
                  />
                </div>

                {/* Resend Fields */}
                {emailProvider === "RESEND" && (
                  <div>
                    <label
                      htmlFor="emailApiKey"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Resend API Key
                    </label>
                    <input
                      type="password"
                      id="emailApiKey"
                      value={emailApiKey}
                      onChange={(e) => setEmailApiKey(e.target.value)}
                      disabled={emailLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="re_xxxxxxxxxxxxx"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Get your API key from{" "}
                      <a
                        href="https://resend.com/api-keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        resend.com/api-keys
                      </a>
                    </p>
                  </div>
                )}

                {/* AWS SES Fields */}
                {emailProvider === "AWS_SES" && (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="awsEmailAccessKeyId"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        AWS Access Key ID
                      </label>
                      <input
                        type="text"
                        id="awsEmailAccessKeyId"
                        value={awsEmailAccessKeyId}
                        onChange={(e) =>
                          setAwsEmailAccessKeyId(e.target.value)
                        }
                        disabled={emailLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="awsEmailSecretKey"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        AWS Secret Access Key
                      </label>
                      <input
                        type="password"
                        id="awsEmailSecretKey"
                        value={awsEmailSecretKey}
                        onChange={(e) => setAwsEmailSecretKey(e.target.value)}
                        disabled={emailLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="awsEmailRegion"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        AWS Region
                      </label>
                      <select
                        id="awsEmailRegion"
                        value={awsEmailRegion}
                        onChange={(e) => setAwsEmailRegion(e.target.value)}
                        disabled={emailLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      >
                        <option value="us-east-1">US East (N. Virginia)</option>
                        <option value="us-west-2">US West (Oregon)</option>
                        <option value="eu-west-1">EU (Ireland)</option>
                      </select>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <p className="text-xs text-yellow-800">
                        Note: Your sender email must be verified in AWS SES.{" "}
                        <a
                          href="https://docs.aws.amazon.com/ses/latest/dg/verify-email-addresses.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          Learn how
                        </a>
                      </p>
                    </div>
                  </div>
                )}

                {/* SMTP Fields */}
                {emailProvider === "SMTP" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="smtpHost"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          SMTP Host
                        </label>
                        <input
                          type="text"
                          id="smtpHost"
                          value={smtpHost}
                          onChange={(e) => setSmtpHost(e.target.value)}
                          disabled={emailLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                          placeholder="smtp.gmail.com"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="smtpPort"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          SMTP Port
                        </label>
                        <input
                          type="number"
                          id="smtpPort"
                          value={smtpPort}
                          onChange={(e) =>
                            setSmtpPort(parseInt(e.target.value))
                          }
                          disabled={emailLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                          placeholder="587"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="smtpUsername"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="smtpUsername"
                        value={smtpUsername}
                        onChange={(e) => setSmtpUsername(e.target.value)}
                        disabled={emailLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="smtpPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="smtpPassword"
                        value={smtpPassword}
                        onChange={(e) => setSmtpPassword(e.target.value)}
                        disabled={emailLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={smtpSecure}
                          onChange={(e) => setSmtpSecure(e.target.checked)}
                          disabled={emailLoading}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">
                          Use TLS/SSL (port 465)
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  {hasEmailCredentials && (
                    <button
                      type="button"
                      onClick={handleTestEmail}
                      disabled={testEmailLoading || emailLoading}
                      className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300"
                    >
                      {testEmailLoading ? "Sending..." : "Send Test Email"}
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={emailLoading || testEmailLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {emailLoading
                      ? "Saving..."
                      : hasEmailCredentials
                        ? "Update Email Settings"
                        : "Save Email Settings"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Import Credentials Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Import AWS Credentials
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Select a source to copy AWS credentials from:
            </p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {importSources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => handleImport(source.id)}
                  disabled={importingFrom !== ""}
                  className="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-left transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {source.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {source.type === "personal"
                          ? "Your personal AWS account"
                          : `Team: ${source.name}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Bucket: {source.bucketName} ({source.region})
                      </p>
                    </div>
                    {importingFrom === source.id && (
                      <div className="text-blue-600">Importing...</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                disabled={importingFrom !== ""}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
