"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { sendOtp, verifyOtp, resendOtp } from "@/lib/data/auth";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Step = "credentials" | "otp" | "success";

export default function ConnexionPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("credentials");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [clientCode, setClientCode] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpMethod, setOtpMethod] = useState<"sms" | "whatsapp">("sms");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Formater le numéro pour l'API (ex: "0700000000" → "+2250700000000")
  const getFullPhone = () => {
    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.startsWith("225")) return `+${digits}`;
    return `+225${digits}`;
  };

  const handleSendOTP = async () => {
    if (!phoneNumber || !clientCode) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await sendOtp({ phone: getFullPhone(), channel: otpMethod });
      setStep("otp");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Impossible d'envoyer le code.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpValue.length !== 6) {
      setError("Veuillez entrer le code complet");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await verifyOtp({
        phone: getFullPhone(),
        otp: otpValue,
        pin: clientCode,
        action: "register",
      });

      // Stocker le token JWT pour les prochaines requêtes
      if (res.token) {
        document.cookie = `medusa_token=${res.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }

      setStep("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Code invalide.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError("");
    try {
      await resendOtp({ phone: getFullPhone(), channel: otpMethod });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Impossible de renvoyer le code.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.slice(0, 10);
  };

  const formatPhoneDisplay = (phone: string) => {
    return phone.replace(/(\d{2})(?=\d)/g, "$1 ");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground text-background flex-col justify-between p-12">
        <div>
          <Link href="/" className="inline-block">
            <Image
              width={100}
              height={100}
              src="/logo/sillage.webp"
              className="w-20 rounded-full"
              alt="sillage logo"
            />
          </Link>
        </div>

        <div className="max-w-md">
          <h2 className="text-4xl font-semibold leading-tight mb-6 text-balance">
            Connectez-vous pour acceder a votre espace client
          </h2>
          <p className="text-muted-foreground text-lg">
            Gerez vos commandes, suivez vos livraisons et profitez de nos
            services exclusifs.
          </p>
        </div>

        <div className="flex items-center gap-8 text-sm text-muted-foreground">
          <Link
            href="/aide"
            className="hover:text-background transition-colors"
          >
            Aide
          </Link>
          <Link
            href="/contact"
            className="hover:text-background transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/confidentialite"
            className="hover:text-background transition-colors"
          >
            Confidentialite
          </Link>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl font-semibold tracking-tight">SILLAGE</h1>
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                step === "credentials"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step !== "credentials" ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <div className="w-12 h-px bg-border" />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                step === "otp"
                  ? "bg-foreground text-background"
                  : step === "success"
                    ? "bg-muted text-muted-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step === "success" ? <Check className="w-4 h-4" /> : "2"}
            </div>
            <div className="w-12 h-px bg-border" />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                step === "success"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              3
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Credentials */}
            {step === "credentials" && (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-2">
                    Identifiez-vous
                  </h2>
                  <p className="text-muted-foreground">
                    Entrez votre numero de telephone et votre code client.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      NUMERO DE TELEPHONE
                    </label>
                    <Input
                      type="tel"
                      placeholder="06 12 34 56 78"
                      value={formatPhoneDisplay(phoneNumber)}
                      onChange={(e) =>
                        setPhoneNumber(formatPhoneNumber(e.target.value))
                      }
                      className="h-12 bg-background border-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      CODE DE SÉCURITÉ (PIN)
                    </label>
                    <Input
                      type="password"
                      placeholder="1234"
                      maxLength={8}
                      value={clientCode}
                      onChange={(e) =>
                        setClientCode(e.target.value.replace(/\D/g, ""))
                      }
                      className="h-12 bg-background border-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      RECEVOIR LE CODE PAR
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setOtpMethod("sms")}
                        className={`flex items-center justify-center gap-2 p-4 rounded-lg border transition-all ${
                          otpMethod === "sms"
                            ? "border-foreground bg-foreground text-background"
                            : "border-input hover:border-foreground/50"
                        }`}
                      >
                        <span className="text-sm font-medium">SMS</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOtpMethod("whatsapp")}
                        className={`flex items-center justify-center gap-2 p-4 rounded-lg border transition-all ${
                          otpMethod === "whatsapp"
                            ? "border-foreground bg-foreground text-background"
                            : "border-input hover:border-foreground/50"
                        }`}
                      >
                        <span className="text-sm font-medium">WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-destructive text-sm"
                    >
                      {error}
                    </motion.p>
                  )}

                  <Button
                    onClick={handleSendOTP}
                    disabled={isLoading}
                    className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background font-medium"
                  >
                    {isLoading ? (
                      <Spinner className="w-5 h-5" />
                    ) : (
                      <>
                        Recevoir le code
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-8">
                  Pas encore client ?{" "}
                  <Link
                    href="/inscription"
                    className="text-foreground font-medium hover:underline"
                  >
                    Creer un compte
                  </Link>
                </p>
              </motion.div>
            )}

            {/* Step 2: OTP Verification */}
            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => {
                    setStep("credentials");
                    setOtpValue("");
                    setError("");
                  }}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Retour</span>
                </button>

                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Verification</h2>
                  <p className="text-muted-foreground">
                    Un code a 6 chiffres a ete envoye par{" "}
                    <span className="font-medium text-foreground">
                      {otpMethod === "sms" ? "SMS" : "WhatsApp"}
                    </span>{" "}
                    au{" "}
                    <span className="font-medium text-foreground">
                      {formatPhoneDisplay(phoneNumber)}
                    </span>
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otpValue}
                      onChange={(value) => setOtpValue(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-12 h-14 text-lg" />
                        <InputOTPSlot index={1} className="w-12 h-14 text-lg" />
                        <InputOTPSlot index={2} className="w-12 h-14 text-lg" />
                        <InputOTPSlot index={3} className="w-12 h-14 text-lg" />
                        <InputOTPSlot index={4} className="w-12 h-14 text-lg" />
                        <InputOTPSlot index={5} className="w-12 h-14 text-lg" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-destructive text-sm text-center"
                    >
                      {error}
                    </motion.p>
                  )}

                  <Button
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otpValue.length !== 6}
                    className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background font-medium"
                  >
                    {isLoading ? (
                      <Spinner className="w-5 h-5" />
                    ) : (
                      "Verifier le code"
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {"Vous n'avez pas recu le code ?"}
                    </p>
                    <button
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-foreground font-medium text-sm hover:underline disabled:opacity-50"
                    >
                      Renvoyer le code
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground text-background mb-6"
                >
                  <Check className="w-8 h-8" />
                </motion.div>

                <h2 className="text-2xl font-semibold mb-2">
                  Connexion reussie
                </h2>
                <p className="text-muted-foreground mb-8">
                  Bienvenue sur votre espace client.
                </p>

                <Button
                  onClick={() => router.push("/compte")}
                  className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background font-medium"
                >
                  Acceder a mon compte
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-10">
            En vous connectant, vous acceptez nos{" "}
            <Link
              href="/conditions"
              className="underline hover:text-foreground"
            >
              conditions generales
            </Link>{" "}
            et notre{" "}
            <Link
              href="/confidentialite"
              className="underline hover:text-foreground"
            >
              politique de confidentialite
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
