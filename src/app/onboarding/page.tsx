import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OnboardingClient } from "./client";

export default async function OnboardingPage({ searchParams }: { searchParams: { step?: string } }) {
  const session = await auth();
  if (!session || session.user.role !== "OWNER") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { store: true }
  });

  if (!user) {
    redirect("/login");
  }

  if (user.onboardingStep >= 4 && searchParams.step !== "4") {
    redirect("/dashboard");
  }

  const currentStep = searchParams.step ? parseInt(searchParams.step) : user.onboardingStep || 1;

  // We should force the step to be at max the user's allowed step to prevent skipping via URL
  const actualStep = Math.min(currentStep, user.onboardingStep || 1);

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center p-4 py-12" dir="rtl">
      <div className="w-full max-w-lg bg-white rounded-[2rem] overflow-hidden animate-fade-in shadow-sm border border-surface-100">
        <div className="p-6 md:p-8">
          <OnboardingClient 
            step={actualStep} 
            storeName={user.store?.name || ""} 
            subdomain={user.store?.subdomain || ""} 
          />
        </div>
      </div>
    </div>
  );
}
