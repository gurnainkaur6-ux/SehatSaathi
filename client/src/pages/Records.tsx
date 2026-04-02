import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { PageContainer } from "@/components/PageContainer";
import { useHealthRecords, useCreateHealthRecord } from "@/hooks/use-sehat-api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Camera, Upload, Calendar, FlaskConical, Receipt, StickyNote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  prescription: "bg-green-50 text-green-700 border-green-100",
  report: "bg-blue-50 text-blue-700 border-blue-100",
  bill: "bg-orange-50 text-orange-700 border-orange-100",
};

export default function Records() {
  const { data: records, isLoading } = useHealthRecords();
  const createRecord = useCreateHealthRecord();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [type, setType] = useState("prescription");
  const [notes, setNotes] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

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
        type,
        notes,
        userId: 1,
        date: new Date().toLocaleDateString(),
        doctorName: "Dr. Anjali Sharma",
        imageUrl:
          imagePreview ||
          "https://images.unsplash.com/photo-1555617981-d1a11e5f762d?q=80&w=200&auto=format&fit=crop",
      },
      {
        onSuccess: () => {
          setOpen(false);
          setNotes("");
          setImagePreview(null);
          toast({ title: "✅ Record Saved", description: "Stored securely in your health folder." });
        },
      }
    );
  };

  const filteredRecords =
    activeTab === "all" ? records : records?.filter((r) => r.type === activeTab);

  return (
    <PageContainer>
      <Header title="Health Records" showBack />

      <main className="p-4 space-y-5 pb-24">
        {/* Header Row */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800 font-display">My Documents</h2>
            <p className="text-xs text-gray-400 mt-0.5">{records?.length ?? 0} records stored</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="rounded-full bg-accent hover:bg-accent/90 text-white h-12 w-12 shadow-lg shadow-accent/20"
                size="icon"
                data-testid="button-add-record"
              >
                <Camera className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Record</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors min-h-[120px]"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="upload-area"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 font-semibold">Tap to take photo or upload</p>
                      <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, PDF</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileChange}
                    data-testid="input-file-upload"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Document Type</label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="h-12" data-testid="select-record-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prescription">💊 Prescription</SelectItem>
                      <SelectItem value="report">🧪 Lab Report</SelectItem>
                      <SelectItem value="bill">🧾 Medical Bill</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Notes (Optional)</label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Fever medication, blood test"
                    className="h-12"
                    data-testid="input-record-notes"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={createRecord.isPending}
                  data-testid="button-save-record"
                >
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
                activeTab === tab.value
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
              data-testid={`tab-${tab.value}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Records List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredRecords?.length === 0 ? (
          <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
            <FileText className="w-14 h-14 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold text-lg">No records found</p>
            <p className="text-sm text-gray-400 mt-1">
              {activeTab === "all"
                ? "Tap the camera button to add your first record"
                : `No ${activeTab}s yet`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecords?.map((record) => {
              const TypeIcon = RECORD_TYPE_ICONS[record.type] ?? FileText;
              const colorClass = RECORD_TYPE_COLORS[record.type] ?? "bg-gray-50 text-gray-600 border-gray-100";
              return (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 p-4 hover:shadow-md transition-all active:scale-[0.99]"
                  data-testid={`card-record-${record.id}`}
                >
                  {record.imageUrl ? (
                    <img
                      src={record.imageUrl}
                      alt={record.type}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100"
                    />
                  ) : (
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 border ${colorClass}`}>
                      <TypeIcon className="w-8 h-8" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className={cn("inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-1", colorClass)}>
                      {record.type}
                    </span>
                    {record.notes && (
                      <p className="text-sm font-semibold text-gray-800 truncate">{record.notes}</p>
                    )}
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {record.date}
                    </p>
                  </div>
                  <TypeIcon className={cn("w-5 h-5 shrink-0", colorClass.split(" ")[1])} />
                </div>
              );
            })}
          </div>
        )}
      </main>
    </PageContainer>
  );
}
