import { useState } from "react";
import { Header } from "@/components/Header";
import { PageContainer } from "@/components/PageContainer";
import { useMedicines, useToggleMedicine, useCreateMedicine } from "@/hooks/use-sehat-api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Plus, Volume2, Pill, Clock, Syringe, GlassWater, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Medicines() {
  const { data: medicines, isLoading } = useMedicines();
  const toggleMedicine = useToggleMedicine();
  const createMedicine = useCreateMedicine();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

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
          toast({ title: "✅ Medicine Added", description: `${name} reminder set successfully.` });
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

  const totalMeds = medicines?.length ?? 0;
  const takenMeds = medicines?.filter((m) => m.taken).length ?? 0;
  const pendingList = medicines?.filter((m) => !m.taken) ?? [];
  const takenList = medicines?.filter((m) => m.taken) ?? [];
  const progressPercent = totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 0;

  return (
    <PageContainer>
      <Header title="Medicines" showBack />

      <main className="p-4 space-y-5 pb-24">
        {/* Progress Card */}
        {totalMeds > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Today's Progress</p>
                <p className="text-2xl font-bold text-gray-900 font-display mt-0.5">
                  {takenMeds} <span className="text-base font-normal text-gray-400">of {totalMeds} taken</span>
                </p>
              </div>
              <div className="w-14 h-14 rounded-full border-4 border-primary/20 flex items-center justify-center bg-primary/5">
                <span className="text-sm font-bold text-primary">{progressPercent}%</span>
              </div>
            </div>
            <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-primary transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {takenMeds === totalMeds && (
              <div className="flex items-center gap-2 bg-green-50 rounded-xl p-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-sm font-semibold text-green-700">Great job! All medicines taken today 🎉</p>
              </div>
            )}
          </div>
        )}

        {/* Header Row */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 font-display">Today's Schedule</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="rounded-full bg-primary hover:bg-primary/90 gap-1 px-4 h-10"
                data-testid="button-add-medicine"
              >
                <Plus className="w-4 h-4" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Medicine</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Medicine Name</label>
                  <Input
                    placeholder="e.g. Paracetamol 500mg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 text-base"
                    required
                    data-testid="input-medicine-name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Dosage</label>
                    <Input
                      placeholder="e.g. 1 tablet"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      className="h-12"
                      required
                      data-testid="input-medicine-dosage"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Time</label>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="h-12"
                      required
                      data-testid="input-medicine-time"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Medicine Type</label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="h-12" data-testid="select-medicine-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pill">💊 Pill / Tablet</SelectItem>
                      <SelectItem value="syrup">🥤 Syrup / Liquid</SelectItem>
                      <SelectItem value="injection">💉 Injection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={createMedicine.isPending}
                  data-testid="button-submit-medicine"
                >
                  {createMedicine.isPending ? "Adding..." : "Add Medicine"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : medicines?.length === 0 ? (
          <div className="text-center py-14 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Pill className="w-14 h-14 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold text-lg">No medicines yet</p>
            <p className="text-gray-400 text-sm mt-1">Tap "Add" to set your first reminder</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending Medicines */}
            {pendingList.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-500 px-1">⏳ Pending ({pendingList.length})</p>
                {pendingList.map((med) => {
                  const Icon = getIcon(med.type);
                  return (
                    <div
                      key={med.id}
                      className="flex items-center p-4 rounded-2xl border-2 border-orange-100 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                      data-testid={`card-medicine-${med.id}`}
                    >
                      <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4 shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-gray-900 truncate">{med.name}</h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speak(`Time to take ${med.dosage} of ${med.name}`);
                            }}
                            className="p-1 text-gray-400 hover:text-primary transition-colors shrink-0"
                            aria-label="Read aloud"
                            data-testid={`button-speak-${med.id}`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold">
                            <Clock className="w-3 h-3" />
                            {med.time}
                          </span>
                          <span className="text-xs text-gray-500">{med.dosage}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          toggleMedicine.mutate({ id: med.id, taken: true });
                          toast({ title: `✅ ${med.name} marked as taken` });
                        }}
                        className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-gray-200 text-gray-300 hover:border-primary hover:text-primary transition-all active:scale-90 shrink-0 ml-3"
                        data-testid={`button-take-medicine-${med.id}`}
                      >
                        <Check className="w-6 h-6" strokeWidth={3} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Taken Medicines */}
            {takenList.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-green-600 px-1">✅ Taken ({takenList.length})</p>
                {takenList.map((med) => {
                  const Icon = getIcon(med.type);
                  return (
                    <div
                      key={med.id}
                      className="flex items-center p-4 rounded-2xl border border-green-100 bg-green-50 opacity-80 transition-all duration-300"
                      data-testid={`card-medicine-taken-${med.id}`}
                    >
                      <div className="p-3 rounded-full bg-green-200 text-green-700 mr-4 shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-green-800 line-through truncate">{med.name}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded text-xs font-semibold text-green-700">
                            <Clock className="w-3 h-3" />
                            {med.time}
                          </span>
                          <span className="text-xs text-green-600">{med.dosage}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleMedicine.mutate({ id: med.id, taken: false })}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500 border-2 border-green-500 text-white shadow-md shadow-green-200 transition-all active:scale-90 shrink-0 ml-3"
                        data-testid={`button-untake-medicine-${med.id}`}
                      >
                        <Check className="w-6 h-6" strokeWidth={3} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </PageContainer>
  );
}
