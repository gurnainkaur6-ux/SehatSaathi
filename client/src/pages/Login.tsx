import { useState } from "react";
import { useLocation } from "wouter";
import { useLogin } from "@/hooks/use-sehat-api";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeartPulse, Loader2, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [, setLocation] = useLocation();
  const login = useLogin();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit mobile number.",
        variant: "destructive",
      });
      return;
    }

    login.mutate(
      { phoneNumber: phone, name: name || "User" },
      {
        onSuccess: () => {
          toast({
            title: "Welcome to SehatSaathi",
            description: "Your health companion is ready.",
          });
          setLocation("/home");
        },
        onError: () => {
          toast({
            title: "Login Failed",
            description: "Please try again later.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <PageContainer className="bg-white justify-center px-6">
      <div className="flex flex-col items-center justify-center space-y-8 py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse" />
          <div className="bg-primary rounded-3xl p-6 shadow-xl relative z-10">
            <HeartPulse className="w-16 h-16 text-white" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary font-display">SehatSaathi</h1>
          <p className="text-muted-foreground text-lg">Your trusted companion for everyday health</p>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-6 mt-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 ml-1">
                Your Name (Optional)
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="h-14 text-lg px-4 rounded-xl border-2 focus-visible:ring-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700 ml-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="98765 43210"
                  className="h-14 text-lg pl-12 rounded-xl border-2 focus-visible:ring-primary font-mono tracking-wide"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 10) setPhone(val);
                  }}
                  required
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            disabled={login.isPending || phone.length < 10}
          >
            {login.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Continue Securely"
            )}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>
    </PageContainer>
  );
}
