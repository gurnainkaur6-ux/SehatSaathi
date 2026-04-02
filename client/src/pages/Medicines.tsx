import { useState } from "react";
import { Header } from "@/components/Header";
import { PageContainer } from "@/components/PageContainer";
import {
  useMedicines, useToggleMedicine, useCreateMedicine,
  useDeleteMedicine, useUpdateMedicine, useResetMedicines
} from "@/hooks/use-sehat-api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Plus, Volume2, Pill, Clock, Syringe, GlassWater, CheckCircle2, Trash2, Pencil, RefreshCw, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Medicine } from "@shared/schema";

const FREQUENCIES = ["Once Daily", "Twice Daily", "Three Times Daily", "Every Morning", "Every Night", "Every 8 Hours", "As Needed"];

function MedicineForm({
  initial,
  onSubmit,
  isPending,
  submitLabel,
}: {
  initial?: Partial<Medicine>;
  onSubmit: (data: any) => void;
  isPending: boolean;
  submitLabel: string;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [dosage, setDosage] = useState(initial?.dosage ?? "");
  const [time, setTime] = useState(initial?.time ?? "");
  const [type, setType] = useState(initial?.type ?? "pill");
  const [frequency, setFrequency] = useState(initial?.frequency ?? "Once Daily");
  const [instructions, setInstructions] = useState(initial?.instructions ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, dosage, time, type, frequency, instructions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">Medicine Name</label>
        <Input placeholder="e.g. Paracetamol 500mg" value={name} onChange={(e) => setName(e.target.value)} className="h-12 text-base" required data-testid="input-medicine-name" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Dosage</label>
          <Input placeholder="e.g. 1 tablet" value={dosage} onChange={(e) => setDosage(e.target.value)} className="h-12" required data-testid="input-medicine-dosage" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Time</label>
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-12" required data-testid="input-medicine-time" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pill">💊 Pill / Tablet</SelectItem>
              <SelectItem value="syrup">🥤 Syrup</SelectItem>
              <SelectItem value="injection">💉 Injection</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Frequency</label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
            <SelectContent>
              {FREQUENCIES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">Instructions <span className="text-gray-400 font-normal">(optional)</span></label>
        <Input placeholder="e.g. Take after food" value={instructions} onChange={(e) => setInstructions(e.target.value)} className="h-12" data-testid="input-medicine-instructions" />
      </div>
      <Button type="submit" className="w-full h-12 text-base mt-1" disabled={isPending}>
        {isPending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

function getIcon(type: string) {
  if (type === "syrup") return GlassWater;
  if (type === "injection") return Syringe;
  return Pill;
}

export default function Medicines() {
  const { data: medicines, isLoading } = useMedicines();
  const toggleMedicine = useToggleMedicine();
  const createMedicine = useCreateMedicine();
  const updateMedicine = useUpdateMedicine();
  const deleteMedicine = useDeleteMedicine();
  const resetMedicines = useResetMedicines();
  const { toast } = useToast();

  const [addOpen, setAddOpen] = useState(false);
  const [editMed, setEditMed] = useState<Medicine | null>(null);
  const [deleteMedId, setDeleteMedId] = useState<number | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [infoMed, setInfoMed] = useState<Medicine | null>(null);

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(u);
  };

  const totalMeds = medicines?.length ?? 0;
  const takenMeds = medicines?.filter((m) => m.taken).length ?? 0;
  const pendingList = medicines?.filter((m) => !m.taken) ?? [];
  const takenList = medicines?.filter((m) => m.taken) ?? [];
  const progressPercent = totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 0;

  return (
    <PageContainer>
      <Header title="Medicines" showBack />

      <main className="p-4 md:p-8 space-y-5 pb-24 md:pb-8 md:max-w-4xl md:mx-auto md:w-full">

        {/* Progress Card */}
        {totalMeds > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Today's Adherence</p>
                <p className="text-2xl font-bold text-gray-900 font-display mt-0.5">
                  {takenMeds} <span className="text-base font-normal text-gray-400">of {totalMeds} taken</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full border-4 border-primary/20 flex items-center justify-center bg-primary/5">
                  <span className="text-sm font-bold text-primary">{progressPercent}%</span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full text-gray-400 hover:text-orange-500 hover:border-orange-200"
                  onClick={() => setResetConfirm(true)}
                  title="Reset today's medicines"
                  data-testid="button-reset-medicines"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
              <div className="h-3 rounded-full bg-primary transition-all duration-700" style={{ width: `${progressPercent}%` }} />
            </div>
            {takenMeds === totalMeds && totalMeds > 0 && (
              <div className="flex items-center gap-2 bg-green-50 rounded-xl p-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-sm font-semibold text-green-700">Excellent! All medicines taken today 🎉</p>
              </div>
            )}
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 font-display">Today's Schedule</h2>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 gap-1 px-4 h-10" data-testid="button-add-medicine">
                <Plus className="w-4 h-4" /> Add Medicine
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>Add New Medicine</DialogTitle></DialogHeader>
              <MedicineForm
                submitLabel="Add Medicine"
                isPending={createMedicine.isPending}
                onSubmit={(data) => {
                  createMedicine.mutate(data, {
                    onSuccess: () => {
                      setAddOpen(false);
                      toast({ title: `✅ ${data.name} added`, description: `Reminder set for ${data.time}` });
                    },
                  });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl" />)}
          </div>
        ) : medicines?.length === 0 ? (
          <div className="text-center py-14 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Pill className="w-14 h-14 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold text-lg">No medicines yet</p>
            <p className="text-gray-400 text-sm mt-1">Tap "Add Medicine" to set your first reminder</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending */}
            {pendingList.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-500 px-1">⏳ Pending ({pendingList.length})</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pendingList.map((med) => {
                    const Icon = getIcon(med.type);
                    return (
                      <div key={med.id} className="flex items-center p-4 rounded-2xl border-2 border-orange-100 bg-white shadow-sm hover:shadow-md transition-all" data-testid={`card-medicine-${med.id}`}>
                        <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4 shrink-0"><Icon className="w-6 h-6" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-base font-bold text-gray-900">{med.name}</h3>
                            <button onClick={() => speak(`Time to take ${med.dosage} of ${med.name}. ${med.instructions || ''}`)} className="text-gray-400 hover:text-primary" data-testid={`button-speak-${med.id}`}>
                              <Volume2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => setInfoMed(med)} className="text-gray-400 hover:text-secondary" data-testid={`button-info-${med.id}`}>
                              <Info className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold"><Clock className="w-3 h-3" />{med.time}</span>
                            <span className="text-xs text-gray-500">{med.dosage}</span>
                            <span className="text-xs text-gray-400">{med.frequency}</span>
                          </div>
                          {med.instructions && (
                            <p className="text-xs text-blue-600 mt-1 italic">ℹ️ {med.instructions}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-center gap-2 ml-3 shrink-0">
                          <button
                            onClick={() => { toggleMedicine.mutate({ id: med.id, taken: true }); toast({ title: `✅ ${med.name} marked as taken!` }); }}
                            className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-gray-200 text-gray-300 hover:border-primary hover:text-primary transition-all active:scale-90"
                            data-testid={`button-take-medicine-${med.id}`}
                          >
                            <Check className="w-6 h-6" strokeWidth={3} />
                          </button>
                          <div className="flex gap-1">
                            <button onClick={() => setEditMed(med)} className="p-1 text-gray-300 hover:text-blue-500 transition-colors" data-testid={`button-edit-medicine-${med.id}`}><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setDeleteMedId(med.id)} className="p-1 text-gray-300 hover:text-red-500 transition-colors" data-testid={`button-delete-medicine-${med.id}`}><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Taken */}
            {takenList.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-green-600 px-1">✅ Taken ({takenList.length})</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {takenList.map((med) => {
                    const Icon = getIcon(med.type);
                    return (
                      <div key={med.id} className="flex items-center p-4 rounded-2xl border border-green-100 bg-green-50 opacity-85 transition-all" data-testid={`card-medicine-taken-${med.id}`}>
                        <div className="p-3 rounded-full bg-green-200 text-green-700 mr-4 shrink-0"><Icon className="w-6 h-6" /></div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-green-800 line-through">{med.name}</h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded text-xs font-semibold text-green-700"><Clock className="w-3 h-3" />{med.time}</span>
                            <span className="text-xs text-green-600">{med.dosage}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-2 ml-3 shrink-0">
                          <button
                            onClick={() => toggleMedicine.mutate({ id: med.id, taken: false })}
                            className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500 border-2 border-green-500 text-white shadow-md shadow-green-200 transition-all active:scale-90"
                            data-testid={`button-untake-medicine-${med.id}`}
                          >
                            <Check className="w-6 h-6" strokeWidth={3} />
                          </button>
                          <button onClick={() => setDeleteMedId(med.id)} className="p-1 text-green-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Edit Medicine Dialog */}
      {editMed && (
        <Dialog open={!!editMed} onOpenChange={(o) => !o && setEditMed(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Edit Medicine</DialogTitle></DialogHeader>
            <MedicineForm
              initial={editMed}
              submitLabel="Save Changes"
              isPending={updateMedicine.isPending}
              onSubmit={(data) => {
                updateMedicine.mutate({ id: editMed.id, data }, {
                  onSuccess: () => {
                    setEditMed(null);
                    toast({ title: "✅ Medicine updated" });
                  },
                });
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Medicine Info Dialog */}
      {infoMed && (
        <Dialog open={!!infoMed} onOpenChange={(o) => !o && setInfoMed(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader><DialogTitle>{infoMed.name}</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              {[
                { label: "Dosage", value: infoMed.dosage },
                { label: "Type", value: infoMed.type },
                { label: "Frequency", value: infoMed.frequency },
                { label: "Time", value: infoMed.time },
                { label: "Instructions", value: infoMed.instructions || "No specific instructions" },
                { label: "Status", value: infoMed.taken ? "✅ Taken today" : "⏳ Not yet taken" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50 text-sm">
                  <span className="text-gray-500 font-medium">{label}</span>
                  <span className="text-gray-800 font-semibold text-right max-w-[60%]">{value}</span>
                </div>
              ))}
              <Button className="w-full mt-2" onClick={() => { speak(`${infoMed.name}, ${infoMed.dosage}, ${infoMed.frequency}. ${infoMed.instructions || ''}`); }}>
                <Volume2 className="w-4 h-4 mr-2" /> Read Aloud
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteMedId} onOpenChange={(o) => !o && setDeleteMedId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medicine?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove this medicine from your schedule.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                if (deleteMedId) {
                  deleteMedicine.mutate(deleteMedId, {
                    onSuccess: () => {
                      setDeleteMedId(null);
                      toast({ title: "🗑️ Medicine removed" });
                    },
                  });
                }
              }}
              data-testid="button-confirm-delete-medicine"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Confirm */}
      <AlertDialog open={resetConfirm} onOpenChange={setResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Today's Medicines?</AlertDialogTitle>
            <AlertDialogDescription>All medicines will be marked as "not taken". Use this at the start of each new day.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetMedicines.mutate(undefined, {
                  onSuccess: () => {
                    setResetConfirm(false);
                    toast({ title: "🔄 Medicines reset for today" });
                  },
                });
              }}
              data-testid="button-confirm-reset"
            >
              Reset All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}
