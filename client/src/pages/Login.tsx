import { useState } from "react";
import { useLocation } from "wouter";
import { useLogin } from "@/hooks/use-sehat-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeartPulse, Loader2, Phone, ShieldCheck, Lock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TRUST_BADGES = [
  { icon: ShieldCheck, text: "100% Secure" },
  { icon: Lock, text: "Private Data" },
  { icon: Star, text: "Free to Use" },
];

export default function Login() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [, setLocation] = useLocation();
  const login = useLogin();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast({ title: "Invalid Number", description: "Please enter a valid 10-digit mobile number.", variant: "destructive" });
      return;
    }
    login.mutate(
      { phoneNumber: phone, name: name || "User" },
      {
        onSuccess: () => {
          toast({ title: "Welcome to SehatSaathi 🙏", description: "Your health companion is ready." });
          setLocation("/home");
        },
        onError: () => toast({ title: "Login Failed", description: "Please try again.", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel — desktop only hero */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-primary to-primary/70 text-white p-12">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-2xl p-3">
            <HeartPulse className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display">SehatSaathi</h1>
            <p className="text-white/70 text-sm">Your trusted health companion</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold font-display leading-tight">
            Your health, <br />in your hands.
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Manage medicines, store health records, and chat with your doctor — all in one simple app.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-2">
            {TRUST_BADGES.map(({ icon: Icon, text }) => (
              <div key={text} className="bg-white/10 rounded-2xl p-4 flex flex-col items-center gap-2 text-center border border-white/10">
                <Icon className="w-6 h-6 text-white" />
                <span className="text-sm font-semibold text-white/90">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-xs">© 2025 SehatSaathi. All rights reserved.</p>
      </div>

      {/* Right panel / full-screen on mobile */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden bg-gradient-to-b from-primary to-primary/80 px-6 pt-14 pb-10 flex flex-col items-center text-white">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-150 animate-pulse" />
            <div className="bg-white/20 rounded-3xl p-5 shadow-xl relative z-10 border border-white/30">
              <HeartPulse className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold font-display">SehatSaathi</h1>
          <p className="text-white/80 text-sm mt-1 text-center">Your trusted companion for everyday health</p>
          <div className="flex gap-5 mt-5">
            {TRUST_BADGES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1">
                <div className="bg-white/15 rounded-full p-2"><Icon className="w-4 h-4 text-white" /></div>
                <span className="text-[10px] text-white/80 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-10 bg-white md:justify-center">
          <div className="w-full max-w-sm mx-auto space-y-6">
            {/* Desktop brand */}
            <div className="hidden md:block mb-8">
              <h2 className="text-3xl font-bold text-gray-900 font-display">Welcome back</h2>
              <p className="text-gray-500 mt-2">Enter your details to continue to your health dashboard</p>
            </div>
            <div className="md:hidden">
              <h2 className="text-xl font-bold text-gray-900 font-display">Enter your details</h2>
              <p className="text-gray-500 text-sm mt-1">No password needed</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-gray-700">
                  Your Name <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. Ravi Kumar"
                  className="h-14 text-base px-4 rounded-xl border-2 border-gray-200 focus-visible:ring-primary focus-visible:border-primary"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="input-name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-500 pointer-events-none">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium text-gray-600 border-r border-gray-300 pr-2">+91</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="98765 43210"
                    className="h-14 text-base pl-16 rounded-xl border-2 border-gray-200 focus-visible:ring-primary focus-visible:border-primary font-mono tracking-wider"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 10) setPhone(val);
                    }}
                    required
                    data-testid="input-phone"
                  />
                </div>
                {phone.length > 0 && phone.length < 10 && (
                  <p className="text-xs text-red-500 ml-1">{10 - phone.length} more digits needed</p>
                )}
                {phone.length === 10 && (
                  <p className="text-xs text-green-600 ml-1">✅ Number looks good!</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
                disabled={login.isPending || phone.length < 10}
                data-testid="button-login"
              >
                {login.isPending ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</>
                ) : (
                  "Continue Securely →"
                )}
              </Button>

              <p className="text-xs text-center text-gray-400 leading-relaxed">
                By continuing, you agree to our{" "}
                <span className="text-primary underline cursor-pointer">Terms</span> and{" "}
                <span className="text-primary underline cursor-pointer">Privacy Policy</span>.
                <br />Your data is never shared without consent.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
