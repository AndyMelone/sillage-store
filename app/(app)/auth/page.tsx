"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import {
  checkPhone,
  sendLoginOtp,
  verifyOtpForLogin,
  sendRegistrationOtp,
  registerWithOtp,
  AuthMethod,
} from "@/lib/data/auth";
import { useAuthStore } from "@/store/use-auth-store";
import { Check, Phone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

type FlowState = "phone_entry" | "otp_verification" | "success";
type FlowType = "login" | "registration";

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/compte";
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const [step, setStep] = useState<FlowState>("phone_entry");
  const [flowType, setFlowType] = useState<FlowType>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpMethod, setOtpMethod] = useState<AuthMethod>("whatsapp");

  const getFullPhone = () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) return `+221${digits}`;
    if (digits.startsWith("221")) return `+${digits}`;
    return phone;
  };

  const formatPhoneDisplay = (val: string) =>
    val
      .replace(/\D/g, "")
      .slice(0, 10)
      .replace(/(\d{2})(?=\d)/g, "$1 ");

  const handleCheckPhone = async () => {
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Veuillez entrer un numéro valide.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const res = await checkPhone(getFullPhone());
      if (res.exists) {
        setFlowType("login");
        await sendLoginOtp(getFullPhone(), otpMethod);
      } else {
        setFlowType("registration");
        await sendRegistrationOtp(getFullPhone(), otpMethod);
      }
      setStep("otp_verification");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (flowType === "login") {
        await sendLoginOtp(getFullPhone(), otpMethod);
      } else {
        await sendRegistrationOtp(getFullPhone(), otpMethod);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Impossible d'envoyer le code.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) return;
    setIsLoading(true);
    setError("");
    try {
      const res =
        flowType === "login"
          ? await verifyOtpForLogin(getFullPhone(), otp)
          : await registerWithOtp(getFullPhone(), otp);

      if (res.token) {
        setAuthenticated(getFullPhone(), res.token);
        setStep("success");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Code invalide.");
    } finally {
      setIsLoading(false);
    }
  };

  const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="mb-6">
      <span className="inline-flex bg-secondary px-3 py-1 text-sm text-muted-foreground">
        Compte
      </span>
      <h1 className="mt-4 font-heading text-3xl font-bold text-foreground">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );

  const OtpChannelSelector = () => (
    <div className="flex flex-col gap-3 items-center">
      <p className="text-xs text-muted-foreground tracking-wide">
        RECEVOIR PAR
      </p>
      <div className="flex gap-2">
        {(["whatsapp", "sms"] as AuthMethod[]).map((m) => (
          <button
            key={m}
            onClick={() => setOtpMethod(m)}
            className={`px-4 py-2 text-xs font-bold border transition-all ${
              otpMethod === m
                ? "bg-accent text-accent-foreground border-accent"
                : "text-muted-foreground border-border hover:border-foreground/30"
            }`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-md px-4 pt-24 pb-16 sm:px-6 md:pt-28 md:pb-24">
        <div className="bg-secondary p-6 md:p-8">
          <AnimatePresence mode="wait">
            {/* 1 — Saisie numéro */}
            {step === "phone_entry" && (
              <motion.div
                key="phone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Header
                  title="Bienvenue"
                  subtitle="Entrez votre numéro de téléphone pour continuer."
                />
                <div className="space-y-4">
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <span className="absolute left-10 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">
                      +221
                    </span>
                    <Input
                      type="tel"
                      placeholder="07 00 00 00 00"
                      value={formatPhoneDisplay(phone)}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCheckPhone()}
                      className="rounded-none border-border bg-background py-3 pl-24 text-sm focus:border-accent"
                    />
                  </div>
                  <OtpChannelSelector />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button
                    onClick={handleCheckPhone}
                    disabled={isLoading}
                    className="w-full py-3 text-sm font-semibold"
                  >
                    {isLoading ? <Spinner /> : "Continuer"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* 2 — Vérification OTP */}
            {step === "otp_verification" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Header
                  title="Vérification"
                  subtitle={`Code envoyé au +221 ${formatPhoneDisplay(phone)} via ${otpMethod === "whatsapp" ? "WhatsApp" : "SMS"}.`}
                />
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup className="gap-1 sm:gap-2">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="w-10 h-12 sm:w-12 sm:h-14 rounded-none border-border text-lg sm:text-xl"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  )}
                  <div className="space-y-4">
                    <Button
                      onClick={handleVerifyOTP}
                      disabled={isLoading || otp.length < 6}
                      className="w-full py-3 text-sm font-semibold"
                    >
                      {isLoading ? <Spinner /> : "Vérifier le code"}
                    </Button>
                    <div className="flex flex-col gap-3 items-center">
                      <OtpChannelSelector />
                      <button
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className="text-sm font-medium text-accent hover:underline mt-2"
                      >
                        Renvoyer un code
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3 — Succès */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h2 className="font-heading text-2xl font-bold">
                  {"C'est prêt !"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  Votre connexion a été établie avec succès.
                  <br />
                  Redirection en cours…
                </p>
                <Button
                  onClick={() => router.push(redirectTo)}
                  className="w-full py-3 text-sm font-semibold"
                >
                  Accéder à mon compte
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-medium text-accent hover:underline">
            Retour à la boutique
          </Link>
        </p>
      </main>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense>
      <ConnexionForm />
    </Suspense>
  );
}
