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
  sendOtpWithPin,
  verifyOtpForLogin,
  sendOtp,
  registerWithOtp,
  resetPin,
  AuthMethod,
} from "@/lib/data/auth";
import { useAuthStore } from "@/store/use-auth-store";
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Key,
  Phone,
  UserPlus,
  History,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

type FlowState =
  | "phone_entry"
  | "pin_login"
  | "otp_verification"
  | "pin_creation"
  | "pin_reset"
  | "success";

type FlowType = "login" | "registration" | "reset";

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
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [otpMethod, setOtpMethod] = useState<AuthMethod>("whatsapp");

  const getFullPhone = () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) return `+225${digits}`;
    if (digits.startsWith("225")) return `+${digits}`;
    return phone;
  };

  const formatPhoneDisplay = (val: string) =>
    val
      .replace(/\D/g, "")
      .slice(0, 10)
      .replace(/(\d{2})(?=\d)/g, "$1 ");

  const resetForm = () => {
    setError("");
    setPin("");
    setOtp("");
  };

  // ── Étape 1 : vérifier le numéro ──────────────────────
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
        setStep("pin_login");
      } else {
        setFlowType("registration");
        await handleSendOTP("new");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Étape 2 login : vérifier PIN + envoyer OTP (2FA) ──
  const handleLogin = async () => {
    if (pin.length < 4) {
      setError("Le code PIN est trop court.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await sendOtpWithPin(getFullPhone(), pin, otpMethod);
      setStep("otp_verification"); // flowType reste "login"
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Code PIN incorrect.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Envoi OTP sans PIN (nouveau compte ou reset) ────────
  const handleSendOTP = async (type: "new" | "reset") => {
    setIsLoading(true);
    setError("");
    try {
      await sendOtp(getFullPhone(), otpMethod, type);
      setStep("otp_verification");
      if (type === "reset") setFlowType("reset");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Impossible d'envoyer le code.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Vérification OTP ────────────────────────────────────
  const handleVerifyOTP = async () => {
    if (otp.length < 6) return;
    setIsLoading(true);
    setError("");
    try {
      if (flowType === "login") {
        // 2FA : OTP vérifié → JWT
        const res = await verifyOtpForLogin(getFullPhone(), otp);
        if (res.token) {
          setAuthenticated(getFullPhone(), res.token);
          setStep("success");
        }
      } else if (flowType === "registration") {
        setStep("pin_creation");
      } else if (flowType === "reset") {
        setStep("pin_reset");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Code invalide.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Finaliser inscription ───────────────────────────────
  const handleCompleteRegistration = async () => {
    if (pin.length < 4) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await registerWithOtp(getFullPhone(), otp, pin);
      if (res.token) {
        setAuthenticated(getFullPhone(), res.token);
        setStep("success");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la création.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Finaliser reset PIN ─────────────────────────────────
  const handleCompleteReset = async () => {
    if (pin.length < 4) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await resetPin(getFullPhone(), otp, pin);
      if (res.token) {
        setAuthenticated(getFullPhone(), res.token);
        setStep("success");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la réinitialisation.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const Header = ({
    title,
    subtitle,
    icon: Icon,
  }: {
    title: string;
    subtitle: string;
    icon?: React.ComponentType<{ className?: string }>;
  }) => (
    <div className="mb-8">
      {Icon && (
        <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mb-4 text-foreground">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h2 className="text-3xl font-serif mb-2">{title}</h2>
      <p className="text-muted-foreground">{subtitle}</p>
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
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
              otpMethod === m
                ? "bg-zinc-900 text-white border-zinc-900"
                : "text-zinc-500 hover:border-zinc-300"
            }`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Sidebar branding */}
      <div className="hidden lg:flex lg:w-[40%] bg-zinc-950 text-white p-12 flex-col justify-between">
        <Link
          href="/"
          className="opacity-80 hover:opacity-100 transition-opacity"
        >
          <span className="text-2xl font-serif tracking-widest">SILLAGE</span>
        </Link>
        <div className="space-y-6">
          <h1 className="text-5xl font-serif leading-tight">
            Votre voyage <br />
            olfactif commence <br />
            ici.
          </h1>
          <p className="text-zinc-400 text-lg max-w-sm">
            Accédez à vos fragrances préférées et gérez votre collection
            personnelle.
          </p>
        </div>
        <div className="flex gap-6 text-xs text-zinc-500 uppercase tracking-widest">
          <Link href="/aide">Aide</Link>
          <Link href="/terms">CGU</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>

      {/* Zone formulaire */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-100 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 opacity-50" />

        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {/* 1 — Saisie numéro */}
            {step === "phone_entry" && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <Header
                  title="Bienvenue"
                  subtitle="Entrez votre numéro de téléphone pour continuer."
                  icon={Phone}
                />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                      {"Téléphone (Côte d'Ivoire)"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                        +225
                      </span>
                      <Input
                        type="tel"
                        placeholder="07 00 00 00 00"
                        value={formatPhoneDisplay(phone)}
                        onChange={(e) => setPhone(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCheckPhone()}
                        className="pl-16 h-14 text-lg border-zinc-200 focus:border-zinc-900 transition-all rounded-xl"
                      />
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button
                    onClick={handleCheckPhone}
                    disabled={isLoading}
                    className="w-full h-14 rounded-xl text-md font-medium"
                  >
                    {isLoading ? <Spinner /> : "Continuer"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* 2 — Code PIN (compte existant) */}
            {step === "pin_login" && (
              <motion.div
                key="pin_login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <button
                  onClick={() => { setStep("phone_entry"); resetForm(); }}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm">Changer de numéro</span>
                </button>
                <Header
                  title="Code Secret"
                  subtitle={`Entrez votre code pour le +225 ${formatPhoneDisplay(phone)}.`}
                  icon={ShieldCheck}
                />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                      Votre code PIN
                    </label>
                    <Input
                      type="password"
                      placeholder="••••"
                      maxLength={8}
                      value={pin}
                      onChange={(e) =>
                        setPin(e.target.value.replace(/\D/g, ""))
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className="h-14 text-2xl tracking-[0.5em] text-center border-zinc-200 focus:border-zinc-900 transition-all rounded-xl"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <OtpChannelSelector />
                  <Button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full h-14 rounded-xl"
                  >
                    {isLoading ? <Spinner /> : "Continuer"}
                  </Button>
                  <button
                    onClick={() => handleSendOTP("reset")}
                    disabled={isLoading}
                    className="w-full text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors py-2"
                  >
                    Code oublié ? Réinitialiser par OTP
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3 — Vérification OTP */}
            {step === "otp_verification" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <Header
                  title="Vérification"
                  subtitle={`Code envoyé au +225 ${formatPhoneDisplay(phone)} via ${otpMethod === "whatsapp" ? "WhatsApp" : "SMS"}.`}
                  icon={Key}
                />
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="w-12 h-14 text-xl border-zinc-200 rounded-lg"
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
                      className="w-full h-14 rounded-xl"
                    >
                      {isLoading ? <Spinner /> : "Vérifier le code"}
                    </Button>
                    <div className="flex flex-col gap-3 items-center">
                      <OtpChannelSelector />
                      <button
                        onClick={() =>
                          handleSendOTP(
                            flowType === "reset"
                              ? "reset"
                              : flowType === "login"
                                ? "reset"
                                : "new",
                          )
                        }
                        disabled={isLoading}
                        className="text-sm font-medium underline mt-2"
                      >
                        Renvoyer un code
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4 — Création / reset PIN */}
            {(step === "pin_creation" || step === "pin_reset") && (
              <motion.div
                key="pin_create"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <Header
                  title={
                    step === "pin_creation"
                      ? "Nouveau Compte"
                      : "Réinitialisation"
                  }
                  subtitle="Choisissez un code secret de 4 à 8 chiffres pour sécuriser votre accès."
                  icon={step === "pin_creation" ? UserPlus : History}
                />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                      Nouveau code PIN
                    </label>
                    <Input
                      type="password"
                      placeholder="••••"
                      maxLength={8}
                      value={pin}
                      onChange={(e) =>
                        setPin(e.target.value.replace(/\D/g, ""))
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (step === "pin_creation"
                          ? handleCompleteRegistration()
                          : handleCompleteReset())
                      }
                      className="h-14 text-2xl tracking-[0.5em] text-center border-zinc-200 focus:border-zinc-900 transition-all rounded-xl"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button
                    onClick={
                      step === "pin_creation"
                        ? handleCompleteRegistration
                        : handleCompleteReset
                    }
                    disabled={isLoading || pin.length < 4}
                    className="w-full h-14 rounded-xl"
                  >
                    {isLoading ? <Spinner /> : "Confirmer"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* 5 — Succès */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-zinc-900 text-white rounded-full flex items-center justify-center mx-auto mb-8">
                  <Check className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-serif">{"C'est prêt !"}</h2>
                <p className="text-muted-foreground">
                  Votre connexion a été établie avec succès.
                  <br />
                  Redirection en cours…
                </p>
                <Button
                  onClick={() => router.push(redirectTo)}
                  className="w-full h-14 rounded-xl"
                >
                  Accéder à mon compte
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
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
