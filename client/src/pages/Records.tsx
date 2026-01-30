import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { PageContainer } from "@/components/PageContainer";
import { useHealthRecords, useCreateHealthRecord } from "@/hooks/use-sehat-api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Camera, Upload, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Records() {
  const { data: records, isLoading } = useHealthRecords();
  const createRecord = useCreateHealthRecord();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("prescription");
  const [notes, setNotes] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
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
        doctorName: "Dr. Smith", // Simulated
        imageUrl: imagePreview || "https://images.unsplash.com/photo-1555617981-d1a11e5f762d?q=80&w=200&auto=format&fit=crop" 
      },
      {
        onSuccess: () => {
          setOpen(false);
          setNotes("");
          setImagePreview(null);
          toast({ title: "Record Saved", description: "Your health record has been stored securely." });
        },
      }
    );
  };

  return (
    <PageContainer>
      <Header title="Health Records" showBack />
      
      <main className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">My Documents</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="h-12 w-12 rounded-full bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">
                <Camera className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Record</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 font-medium">Tap to take photo or upload</p>
                    </>
                  )}
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Document Type</label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="report">Lab Report</SelectItem>
                      <SelectItem value="bill">Medical Bill</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes (Optional)</label>
                  <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Fever medication" />
                </div>

                <Button type="submit" className="w-full h-12" disabled={createRecord.isPending}>
                  {createRecord.isPending ? "Uploading..." : "Save Record"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {isLoading ? (
            [1, 2, 3, 4].map(i => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl animate-pulse" />)
          ) : records?.length === 0 ? (
             <div className="col-span-2 text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
               <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
               <p className="text-gray-500 font-medium">No records found</p>
               <p className="text-sm text-gray-400 mt-1">Tap the camera button to add one</p>
             </div>
          ) : (
            records?.map((record) => (
              <div key={record.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm border hover:shadow-md transition-all">
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                  {/* unsplash placeholder if no image url provided */}
                  {record.imageUrl ? (
                    <img src={record.imageUrl} alt={record.type} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <FileText className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
                      {record.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {record.date}
                  </p>
                  {record.notes && (
                    <p className="text-sm font-medium text-gray-800 mt-1 truncate">{record.notes}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </PageContainer>
  );
}
