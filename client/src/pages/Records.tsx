import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { PageContainer } from "@/components/PageContainer";
import { useHealthRecords, useCreateHealthRecord, useDeleteHealthRecord } from "@/hooks/use-sehat-api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Camera, Upload, Calendar, FlaskConical, Receipt, StickyNote, Trash2, ZoomIn, X, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { HealthRecord } from "@shared/schema";

const CATEGORY_TABS = [
  { label: "All", value: "all" },
  { label: "💊 Prescription", value: "prescription" },
  { label: "🧪 Lab Report", value: "report" },
  { label: "🧾 Bill", value: "bill" },
];

const RECORD_TYPE_ICONS: Record<string, React.ElementType> = {
  prescription: StickyNote,
  report: FlaskConical,
  bill: Receipt,
};

const RECORD_TYPE_COLORS: Record<string, string> = {
  prescription: "bg-green-50 text-green-700 border-green-200",
  report: "bg-blue-50 text-blue-700 border-blue-200",
  bill: "bg-orange-50 text-orange-700 border-orange-200",
};

const RECORD_TYPE_BADGES: Record<string, string> = {
  prescription: "bg-green-100 text-green-700",
  report: "bg-blue-100 text-blue-700",
  bill: "bg-orange-100 text-orange-700",
};

function RecordDetailModal({ record, onClose, onDelete }: { record: HealthRecord; onClose: () => void; onDelete: () => void }) {
  const TypeIcon = RECORD_TYPE_ICONS[record.type] ?? FileText;
  const colorClass = RECORD_TYPE_COLORS[record.type] ?? "bg-gray-50 text-gray-600 border-gray-200";
  const badgeClass = RECORD_TYPE_BADGES[record.type] ?? "bg-gray-100 text-gray-600";

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        {/* Image */}
        <div className="relative bg-gray-900 flex items-center justify-center min-h-[200px]">
          {record.imageUrl ? (
            <img src={record.imageUrl} alt={record.type} className="w-full max-h-72 object-contain" />
          ) : (
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center ${colorClass} border`}>
              <TypeIcon className="w-12 h-12" />
            </div>
          )}
          <button onClick={onClose} className="absolute top-3 right-3 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details */}
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${badgeClass} mb-2`}>
                {record.type}
              </span>
              {record.notes && <p className="text-lg font-bold text-gray-900">{record.notes}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Calendar, label: "Date", value: record.date },
              { icon: User, label: "Doctor", value: record.doctorName || "—" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                </div>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete Record
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Records() {
  const { data: records, isLoading } = useHealthRecords();
  const createRecord = useCreateHealthRecord();
  const deleteRecord = useDeleteHealthRecord();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [type, setType] = useState("prescription");
  const [notes, setNotes] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [viewRecord, setViewRecord] = useState<HealthRecord | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRecord.mutate(
      {
        type, notes, doctorName: doctorName || "Dr. Anjali Sharma",
        userId: 0, // overridden by hook
        date: new Date().toLocaleDateString("en-IN"),
        imageUrl: imagePreview || undefined,
      },
      {
        onSuccess: () => {
          setAddOpen(false); setNotes(""); setDoctorName(""); setImagePreview(null); setType("prescription");
          toast({ title: "✅ Record Saved", description: "Stored securely in your health folder." });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteRecord.mutate(id, {
      onSuccess: () => {
        setDeleteId(null);
        setViewRecord(null);
        toast({ title: "🗑️ Record deleted" });
      },
    });
  };

  const filteredRecords = activeTab === "all" ? records : records?.filter((r) => r.type === activeTab);

  const typeCount = (type: string) => records?.filter((r) => r.type === type).length ?? 0;

  return (
    <PageContainer>
      <Header title="Health Records" showBack />

      <main className="p-4 md:p-8 space-y-5 pb-24 md:pb-8 md:max-w-4xl md:mx-auto md:w-full">

        {/* Stats Row */}
        {(records?.length ?? 0) > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Prescriptions", count: typeCount("prescription"), color: "text-green-600 bg-green-50", border: "border-green-100" },
              { label: "Lab Reports", count: typeCount("report"), color: "text-blue-600 bg-blue-50", border: "border-blue-100" },
              { label: "Bills", count: typeCount("bill"), color: "text-orange-600 bg-orange-50", border: "border-orange-100" },
            ].map(({ label, count, color, border }) => (
              <div key={label} className={`rounded-2xl border ${border} p-3 text-center`}>
                <p className={`text-2xl font-bold font-display ${color.split(" ")[0]}`}>{count}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Header Row */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800 font-display">My Documents</h2>
            <p className="text-xs text-gray-400 mt-0.5">{records?.length ?? 0} total records</p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20 gap-2 px-4 h-11" data-testid="button-add-record">
                <Camera className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold">Upload Record</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Upload Health Record</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-3">
                {/* Upload Area */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors min-h-[140px]"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="upload-area"
                >
                  {imagePreview ? (
                    <div className="relative w-full">
                      <img src={imagePreview} alt="Preview" className="max-h-44 rounded-lg object-contain mx-auto" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      ><X className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 font-semibold">Tap to take photo or upload</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF</p>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Document Type</label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prescription">💊 Prescription</SelectItem>
                        <SelectItem value="report">🧪 Lab Report</SelectItem>
                        <SelectItem value="bill">🧾 Medical Bill</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Doctor Name</label>
                    <Input value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="e.g. Dr. Sharma" className="h-12" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                  <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Monthly blood test, fever check" className="h-12" data-testid="input-record-notes" />
                </div>

                <Button type="submit" className="w-full h-12 text-base" disabled={createRecord.isPending}>
                  {createRecord.isPending ? "Saving..." : "Save Record"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition-all whitespace-nowrap",
                activeTab === tab.value ? "bg-primary text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
              data-testid={`tab-${tab.value}`}
            >
              {tab.label} {tab.value !== "all" && `(${typeCount(tab.value)})`}
            </button>
          ))}
        </div>

        {/* Records */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl" />)}
          </div>
        ) : filteredRecords?.length === 0 ? (
          <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
            <FileText className="w-14 h-14 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold text-lg">No records found</p>
            <p className="text-sm text-gray-400 mt-1">
              {activeTab === "all" ? "Tap 'Upload Record' to add your first document" : `No ${activeTab}s added yet`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredRecords?.map((record) => {
              const TypeIcon = RECORD_TYPE_ICONS[record.type] ?? FileText;
              const colorClass = RECORD_TYPE_COLORS[record.type] ?? "bg-gray-50 text-gray-600 border-gray-200";
              const badgeClass = RECORD_TYPE_BADGES[record.type] ?? "bg-gray-100 text-gray-600";
              return (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group cursor-pointer"
                  data-testid={`card-record-${record.id}`}
                >
                  {/* Image area */}
                  <div
                    className="relative h-36 bg-gray-50 flex items-center justify-center overflow-hidden"
                    onClick={() => setViewRecord(record)}
                  >
                    {record.imageUrl ? (
                      <>
                        <img src={record.imageUrl} alt={record.type} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </>
                    ) : (
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${colorClass}`}>
                        <TypeIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Info area */}
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeClass} mb-1`}>
                          {record.type}
                        </span>
                        {record.notes && <p className="text-sm font-semibold text-gray-800 truncate">{record.notes}</p>}
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />{record.date}
                        </p>
                        {record.doctorName && (
                          <p className="text-xs text-gray-400 truncate">{record.doctorName}</p>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteId(record.id); }}
                        className="p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 shrink-0"
                        data-testid={`button-delete-record-${record.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Record Detail View */}
      {viewRecord && (
        <RecordDetailModal
          record={viewRecord}
          onClose={() => setViewRecord(null)}
          onDelete={() => { setDeleteId(viewRecord.id); setViewRecord(null); }}
        />
      )}

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>This document will be permanently removed from your health folder.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => deleteId && handleDelete(deleteId)}
              data-testid="button-confirm-delete-record"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}
