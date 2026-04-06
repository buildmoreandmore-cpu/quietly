"use client";

import OnboardingModal from "@/components/onboarding/OnboardingModal";
import Dashboard from "@/components/dashboard/Dashboard";
import Paywall from "@/components/dashboard/Paywall";

export default function AppPage() {
  return (
    <>
      <OnboardingModal />
      <Paywall />
      <Dashboard />
    </>
  );
}
