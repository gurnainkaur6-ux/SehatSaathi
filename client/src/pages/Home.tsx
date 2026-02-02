import { Link } from "wouter";
import { Header } from "@/components/Header";
import { PageContainer } from "@/components/PageContainer";
import { Pill, FileText, Stethoscope, PhoneCall, ChevronRight } from "lucide-react";

export default function Home() {
  const cards = [
    {
      title: "Medicines",
      description: "Reminders & Schedule",
      icon: Pill,
      color: "bg-primary/10 text-primary",
      borderColor: "border-primary/20",
      href: "/medicines",
    },
    {
      title: "Records",
      description: "Reports & Prescriptions",
      icon: FileText,
      color: "bg-secondary/10 text-secondary",
      borderColor: "border-secondary/20",
      href: "/records",
    },
    {
      title: "Doctor",
      description: "Chat & Consultation",
      icon: Stethoscope,
      color: "bg-accent/10 text-accent",
      borderColor: "border-accent/20",
      href: "/doctor",
    },
  ];

  return (
    <PageContainer>
      <Header />
      
      <main className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-primary/10 to-transparent p-6 rounded-2xl border border-primary/10">
          <h2 className="text-2xl font-bold text-primary font-display mb-2">Namaste! 🙏</h2>
          <p className="text-gray-600 leading-relaxed">
            Welcome to your health dashboard. What would you like to do today?
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 gap-4">
          {cards.map((card) => (
            <Link key={card.title} href={card.href}>
              <div className={`
                flex items-center p-5 rounded-2xl border-2 shadow-sm 
                transition-all duration-200 active:scale-[0.98] cursor-pointer bg-white
                ${card.borderColor} hover:shadow-md
              `}>
                <div className={`p-4 rounded-xl ${card.color} mr-5`}>
                  <card.icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{card.title}</h3>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            </Link>
          ))}
        </div>

        {/* Emergency Section */}
        <div className="mt-8">
          <button className="w-full bg-red-50 hover:bg-red-100 border-2 border-red-100 rounded-2xl p-5 flex items-center justify-between group transition-all active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="bg-red-500 text-white p-3 rounded-full shadow-lg shadow-red-200 animate-pulse">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-red-700">Emergency SOS</h3>
                <p className="text-sm text-red-600">Tap to call ambulance</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-red-300 group-hover:text-red-500" />
          </button>
        </div>
      </main>
    </PageContainer>
  );
}
