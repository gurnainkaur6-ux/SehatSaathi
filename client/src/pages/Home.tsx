import { Link } from "wouter";
import { Header } from "@/components/Header";
import { PageContainer } from "@/components/PageContainer";
import { useMedicines } from "@/hooks/use-sehat-api";
import { Pill, FileText, Stethoscope, PhoneCall, ChevronRight, Sun, Moon, Sunset, CheckCircle2, AlertCircle } from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning", icon: Sun };
  if (hour < 17) return { text: "Good Afternoon", icon: Sun };
  if (hour < 20) return { text: "Good Evening", icon: Sunset };
  return { text: "Good Night", icon: Moon };
}

export default function Home() {
  const { data: medicines } = useMedicines();
  const userStr = localStorage.getItem("sehat_user");
  const user = userStr ? JSON.parse(userStr) : null;
  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  const { text: greetingText } = getGreeting();
  const totalMeds = medicines?.length ?? 0;
  const takenMeds = medicines?.filter((m) => m.taken).length ?? 0;
  const pendingMeds = totalMeds - takenMeds;
  const allDone = totalMeds > 0 && takenMeds === totalMeds;

  const cards = [
    {
      title: "Medicines",
      description: "Reminders & Schedule",
      icon: Pill,
      bg: "bg-primary/10",
      iconColor: "text-primary",
      borderColor: "border-primary/20",
      href: "/medicines",
      badge: pendingMeds > 0 ? `${pendingMeds} pending` : takenMeds > 0 ? "All done!" : null,
      badgeColor: pendingMeds > 0 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700",
    },
    {
      title: "Health Records",
      description: "Reports & Prescriptions",
      icon: FileText,
      bg: "bg-secondary/10",
      iconColor: "text-secondary",
      borderColor: "border-secondary/20",
      href: "/records",
      badge: null,
      badgeColor: "",
    },
    {
      title: "Doctor Chat",
      description: "Consult Dr. Sharma",
      icon: Stethoscope,
      bg: "bg-accent/10",
      iconColor: "text-accent",
      borderColor: "border-accent/20",
      href: "/doctor",
      badge: null,
      badgeColor: "",
    },
  ];

  return (
    <PageContainer>
      <Header />

      <main className="p-4 space-y-5 pb-24">
        {/* Greeting */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-5 rounded-2xl shadow-lg shadow-primary/20">
          <p className="text-primary-foreground/80 text-sm font-medium mb-1">{greetingText} 🙏</p>
          <h2 className="text-2xl font-bold font-display capitalize">{firstName}!</h2>
          <p className="text-primary-foreground/80 text-sm mt-1">Stay healthy, stay happy today.</p>
        </div>

        {/* Medicine Progress Card */}
        {totalMeds > 0 && (
          <div className={`p-4 rounded-2xl border-2 flex items-center gap-4 ${allDone ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}>
            <div className={`p-3 rounded-full ${allDone ? "bg-green-100" : "bg-orange-100"}`}>
              {allDone
                ? <CheckCircle2 className="w-7 h-7 text-green-600" />
                : <AlertCircle className="w-7 h-7 text-orange-500" />
              }
            </div>
            <div className="flex-1">
              <p className={`font-bold text-base ${allDone ? "text-green-800" : "text-orange-800"}`}>
                {allDone ? "All medicines taken!" : `${pendingMeds} medicine${pendingMeds > 1 ? "s" : ""} pending`}
              </p>
              <div className="mt-2 bg-white/60 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${allDone ? "bg-green-500" : "bg-orange-400"}`}
                  style={{ width: `${(takenMeds / totalMeds) * 100}%` }}
                />
              </div>
              <p className={`text-xs mt-1 ${allDone ? "text-green-600" : "text-orange-600"}`}>
                {takenMeds} of {totalMeds} taken today
              </p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 px-1">Quick Access</h3>
          <div className="grid grid-cols-1 gap-3">
            {cards.map((card) => (
              <Link key={card.title} href={card.href}>
                <div
                  className={`
                    flex items-center p-4 rounded-2xl border-2 shadow-sm 
                    transition-all duration-200 active:scale-[0.98] cursor-pointer bg-white
                    ${card.borderColor} hover:shadow-md
                  `}
                  data-testid={`nav-card-${card.title.toLowerCase().replace(" ", "-")}`}
                >
                  <div className={`p-3 rounded-xl ${card.bg} ${card.iconColor} mr-4 shrink-0`}>
                    <card.icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-gray-900">{card.title}</h3>
                      {card.badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${card.badgeColor}`}>
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{card.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 shrink-0 ml-2" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Health Tip */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">💡 Today's Health Tip</p>
          <p className="text-sm text-blue-800 leading-relaxed font-medium">
            Drink at least 8 glasses of water daily. Staying hydrated helps your medicines work better!
          </p>
        </div>

        {/* Emergency SOS */}
        <div>
          <button
            className="w-full bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white rounded-2xl p-5 flex items-center justify-center gap-4 shadow-xl shadow-red-200 transition-all"
            data-testid="button-emergency-sos"
            onClick={() => {
              if (typeof window !== "undefined") {
                const utterance = new SpeechSynthesisUtterance("Calling emergency services");
                window.speechSynthesis.speak(utterance);
              }
            }}
          >
            <div className="bg-white/20 p-3 rounded-full animate-pulse">
              <PhoneCall className="w-7 h-7" />
            </div>
            <div className="text-left">
              <p className="text-lg font-bold">Emergency SOS</p>
              <p className="text-sm text-red-100">Tap to call ambulance – 108</p>
            </div>
          </button>
        </div>
      </main>
    </PageContainer>
  );
}
