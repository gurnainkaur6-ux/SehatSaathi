import { useState } from "react";
import { Header } from "@/components/Header";
import { PageContainer } from "@/components/PageContainer";
import { useMedicines, useToggleMedicine, useCreateMedicine } from "@/hooks/use-sehat-api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Plus, Volume2, Pill, Clock, Syringe, GlassWater } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Medicines() {
  const { data: medicines, isLoading } = useMedicines();
  const toggleMedicine = useToggleMedicine();
  const createMedicine = useCreateMedicine();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("pill");

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMedicine.mutate(
      { name, dosage, time, type, userId: 1, frequency: "Daily", instructions: "Take with water" },
      {
        onSuccess: () => {
          setOpen(false);
          setName("");
          setDosage("");
          setTime("");
          toast({ title: "Medicine Added", description: "Reminder set successfully." });
        },
      }
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "syrup": return GlassWater;
      case "injection": return Syringe;
      default: return Pill;
    }
  };

  return (
    <PageContainer>
      <Header title="Medicines" showBack />
      
      <main className="p-4 space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-800">Today's Schedule</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Medicine</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Medicine Name</label>
                  <Input placeholder="e.g. Paracetamol" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dosage</label>
                    <Input placeholder="e.g. 1 tablet" value={dosage} onChange={e => setDosage(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <Input type="time" value={time} onChange={e => setTime(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pill">Pill / Tablet</SelectItem>
                      <SelectItem value="syrup">Syrup</SelectItem>
                      <SelectItem value="injection">Injection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full mt-2" disabled={createMedicine.isPending}>
                  {createMedicine.isPending ? "Adding..." : "Add Medicine"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : medicines?.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Pill className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No medicines added yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medicines?.map((med) => {
              const Icon = getIcon(med.type);
              return (
                <div 
                  key={med.id} 
                  className={cn(
                    "flex items-center p-4 rounded-2xl border transition-all duration-300",
                    med.taken 
                      ? "bg-green-50 border-green-200 opacity-80" 
                      : "bg-white border-gray-100 shadow-sm hover:shadow-md"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-full mr-4 transition-colors",
                    med.taken ? "bg-green-200 text-green-700" : "bg-blue-100 text-blue-600"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={cn("text-lg font-bold", med.taken ? "text-green-800 line-through" : "text-gray-900")}>
                        {med.name}
                      </h3>
                      <button 
                        onClick={(e) => { e.stopPropagation(); speak(`Time to take ${med.dosage} of ${med.name}`); }}
                        className="p-1 text-gray-400 hover:text-primary transition-colors"
                        aria-label="Read aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span className="flex items-center bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold uppercase">
                        <Clock className="w-3 h-3 mr-1" />
                        {med.time}
                      </span>
                      <span>{med.dosage}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleMedicine.mutate({ id: med.id, taken: !med.taken })}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all active:scale-90",
                      med.taken 
                        ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-200" 
                        : "border-gray-200 text-gray-300 hover:border-primary hover:text-primary"
                    )}
                  >
                    <Check className="w-6 h-6" strokeWidth={3} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </PageContainer>
  );
}
