import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { PageContainer } from "@/components/PageContainer";
import { useMessages, useSendMessage } from "@/hooks/use-sehat-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, User, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Doctor() {
  const { data: messages, isLoading } = useMessages();
  const sendMessage = useSendMessage();
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    sendMessage.mutate(
      { userId: 1, sender: "user", content: text, type: "text" },
      {
        onSuccess: () => setText(""),
      }
    );
  };

  const handleMic = () => {
    setIsRecording(true);
    // Simulate recording delay
    setTimeout(() => {
      setIsRecording(false);
      setText("I have a headache since morning.");
    }, 1500);
  };

  return (
    <PageContainer className="h-screen overflow-hidden flex flex-col">
      <Header title="Dr. Sharma" showBack />
      
      {/* Chat Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        ref={scrollRef}
      >
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center mb-6">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 flex items-center justify-center shadow-sm text-primary">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-gray-900">Dr. Anjali Sharma</h3>
          <p className="text-sm text-gray-500">General Physician • Available</p>
          <p className="text-xs text-blue-600 mt-2">Typically replies in 10 mins</p>
        </div>

        {isLoading ? (
           <div className="flex justify-center p-4"><span className="loading loading-dots loading-sm"></span></div>
        ) : (
          messages?.map((msg) => {
            const isMe = msg.sender === "user";
            return (
              <div key={msg.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                <div className={cn("flex max-w-[80%] gap-2", isMe ? "flex-row-reverse" : "flex-row")}>
                  <Avatar className="w-8 h-8 border-2 border-white mt-1 shadow-sm">
                    <AvatarFallback className={isMe ? "bg-primary text-white" : "bg-white text-gray-600"}>
                      {isMe ? <User className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={cn(
                    "p-3 rounded-2xl shadow-sm text-sm leading-relaxed",
                    isMe 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 mb-[64px]">
        <form onSubmit={handleSend} className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full w-12 h-12 shrink-0 transition-all", 
              isRecording ? "bg-red-50 text-red-500 border-red-200 animate-pulse" : "text-gray-500"
            )}
            onClick={handleMic}
          >
            <Mic className="w-5 h-5" />
          </Button>

          <Input 
            value={text} 
            onChange={e => setText(e.target.value)} 
            placeholder="Type or speak..." 
            className="h-12 rounded-full border-gray-200 bg-gray-50 focus-visible:ring-primary px-5"
          />

          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 shrink-0"
            disabled={!text.trim() && !isRecording}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </PageContainer>
  );
}
