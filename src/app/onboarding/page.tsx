"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import PathSelectionStep from "@/components/onboarding/PathSelectionStep";
import HowItWorksStep from "@/components/onboarding/HowItWorksStep";
import AWSSetupStep from "@/components/onboarding/AWSSetupStep";
import EmailSetupStep from "@/components/onboarding/EmailSetupStep";
import SharingDemoStep from "@/components/onboarding/SharingDemoStep";
import CompletionStep from "@/components/onboarding/CompletionStep";

type OnboardingPath = "uploader" | "recipient" | "skipped" | null;

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPath, setSelectedPath] = useState<OnboardingPath>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedStep = localStorage.getItem("onboarding_step");
    const savedPath = localStorage.getItem("onboarding_path");

    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10));
    }
    if (savedPath) {
      setSelectedPath(savedPath as OnboardingPath);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("onboarding_step", currentStep.toString());
    if (selectedPath) {
      localStorage.setItem("onboarding_path", selectedPath);
    }
  }, [currentStep, selectedPath]);

  // Calculate total steps based on path
  const getTotalSteps = () => {
    if (selectedPath === "recipient") {
      return 3; // Welcome → Path → Completion
    } else if (selectedPath === "uploader") {
      return 7; // Welcome → Path → How It Works → AWS → Email → Sharing → Completion
    }
    return 7; // Default to 7 before path is selected
  };

  // Complete onboarding in database
  const completeOnboarding = async (path: "uploader" | "recipient" | "skipped") => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/onboarding", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: true,
          path,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update onboarding status");
      }

      // Clear localStorage
      localStorage.removeItem("onboarding_step");
      localStorage.removeItem("onboarding_path");

      return true;
    } catch (error) {
      console.error("Error completing onboarding:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSkip = async () => {
    await completeOnboarding("skipped");
    router.push("/dashboard");
    router.refresh();
  };

  const handleSkipToDashboard = async () => {
    await completeOnboarding("skipped");
    router.push("/dashboard");
    router.refresh();
  };

  // Path selection handler
  const handleSelectPath = (path: "uploader" | "recipient") => {
    setSelectedPath(path);
    if (path === "recipient") {
      // Skip straight to completion for recipients
      setCurrentStep(3); // Jump to completion step (step 3 of 3)
    } else {
      // Continue to How It Works for uploaders
      handleNext();
    }
  };

  // Render appropriate step based on current step and path
  const renderStep = () => {
    // Step 1: Welcome (always shown)
    if (currentStep === 1) {
      return <WelcomeStep onNext={handleNext} />;
    }

    // Step 2: Path selection (always shown)
    if (currentStep === 2) {
      return <PathSelectionStep onSelectPath={handleSelectPath} />;
    }

    // Recipient path: Jump directly to completion (step 7)
    if (selectedPath === "recipient" && currentStep >= 3) {
      return <CompletionStep path="recipient" />;
    }

    // Uploader path: Steps 3-7
    if (selectedPath === "uploader") {
      switch (currentStep) {
        case 3:
          return <HowItWorksStep onNext={handleNext} onBack={handleBack} />;
        case 4:
          return (
            <AWSSetupStep
              onNext={handleNext}
              onBack={handleBack}
              onSkipToDashboard={handleSkipToDashboard}
            />
          );
        case 5:
          return <EmailSetupStep onNext={handleNext} onBack={handleBack} />;
        case 6:
          return <SharingDemoStep onNext={handleNext} onBack={handleBack} />;
        case 7:
          return <CompletionStep path="uploader" />;
        default:
          return <WelcomeStep onNext={handleNext} />;
      }
    }

    // Skipped path or completion
    if (selectedPath === "skipped" || currentStep === 7) {
      return <CompletionStep path={selectedPath || "skipped"} />;
    }

    // Default fallback
    return <WelcomeStep onNext={handleNext} />;
  };

  // Mark onboarding complete when reaching final step
  useEffect(() => {
    const finalStep = selectedPath === "recipient" ? 3 : 7;
    if (currentStep === finalStep && selectedPath) {
      completeOnboarding(selectedPath);
    }
  }, [currentStep, selectedPath]);

  const finalStep = selectedPath === "recipient" ? 3 : 7;

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={getTotalSteps()}
      onSkip={currentStep < finalStep ? handleSkip : undefined}
      showSkip={currentStep < finalStep}
    >
      {renderStep()}
    </OnboardingLayout>
  );
}
