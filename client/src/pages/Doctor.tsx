import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { PageContainer } from "@/components/PageContainer";
import { useMessages, useSendMessage } from "@/hooks/use-sehat-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, Stethoscope, User, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const QUICK_REPLIES = [
  "I have a headache",
  "My BP is high today",
  "I missed my medicine",
  "I feel weak and tired",
  "When to take medicine?",
];

function formatTime(dateStr: string | Date | null | undefined) {
  if (!dateStr) return "";
  const d = new Date(dateStr as string);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Doctor() {
  const { data: messages, isLoading } = useMessages();
  const sendMessage = useSendMessage();
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (content: string) => {
    const msg = content.trim();
    if (!msg) return;
    setText("");
    setIsTyping(true);
    sendMessage.mutate(
      { userId: 1, sender: "user", content: msg, type: "text" },
      {
        onSuccess: () => setTimeout(() => setIsTyping(false), 2000),
        onError: () => setIsTyping(false),
      }
    );
  };

  const handleMic = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setText("I have a headache since morning.");
    }, 1500);
  };

  return (
    <PageContainer className="flex flex-col h-screen md:h-auto md:min-h-screen overflow-hidden">
      <Header title="Dr. Anjali Sharma" showBack />

      {/* Doctor Info Bar */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-3 flex items-center gap-3 shadow-sm">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Stethoscope className="w-5 h-5" />
          </div>
          <Circle className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 text-green-500 fill-green-500" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-gray-900">Dr. Anjali Sharma</p>
          <p className="text-xs text-green-600 font-medium">● Online · General Physician</p>
        </div>
        <span className="hidden md:block text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border">Replies in ~10 min</span>
      </div>

      {/* Layout wrapper: on desktop show side-by-side info + chat */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop: Doctor info panel */}
        <div className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-gray-100 p-5 gap-4">
          <div className="bg-primary/5 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Dr. Anjali Sharma</p>
              <p className="text-xs text-gray-500 mt-0.5">MBBS, MD — General Physician</p>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">● Available Now</span>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Quick Info</p>
            {[
              { label: "Experience", value: "12+ years" },
              { label: "Languages", value: "Hindi, English" },
              { label: "Consult Fee", value: "Free via app" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm py-2 border-b border-gray-50">
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold text-gray-800">{value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Quick Send</p>
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSend(reply)}
                className="w-full text-left text-xs bg-gray-50 hover:bg-primary/10 hover:text-primary text-gray-600 rounded-xl px-3 py-2.5 font-medium transition-colors"
                data-testid={`sidebar-quick-reply-${reply.slice(0, 8).replace(/\s+/g, "-").toLowerCase()}`}
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Column */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 bg-gray-50" ref={scrollRef}>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center mb-2">
              <p className="text-sm text-blue-700 font-medium">💙 You are connected with Dr. Sharma.</p>
              <p className="text-xs text-blue-500 mt-1">All conversations are private and secure</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center p-4 text-gray-400 text-sm">Loading messages...</div>
            ) : (
              messages?.map((msg) => {
                const isMe = msg.sender === "user";
                return (
                  <div key={msg.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                    <div className={cn("flex max-w-[80%] md:max-w-[70%] gap-2", isMe ? "flex-row-reverse" : "flex-row")}>
                      <Avatar className="w-8 h-8 border-2 border-white mt-1 shadow-sm shrink-0">
                        <AvatarFallback className={isMe ? "bg-primary text-white" : "bg-white text-gray-600"}>
                          {isMe ? <User className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div
                          className={cn(
                            "px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed",
                            isMe ? "bg-primary text-white rounded-tr-sm" : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
                          )}
                          data-testid={`message-bubble-${msg.id}`}
                        >
                          {msg.content}
                        </div>
                        <p className={cn("text-[10px] text-gray-400 mt-1 px-1", isMe ? "text-right" : "text-left")}>
                          {formatTime((msg as any).timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {isTyping && (
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-white text-gray-600"><Stethoscope className="w-4 h-4" /></AvatarFallback>
                </Avatar>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Replies — mobile only */}
          <div className="px-4 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto scrollbar-none md:hidden">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSend(reply)}
                className="shrink-0 text-xs bg-primary/10 text-primary rounded-full px-3 py-2 font-medium hover:bg-primary/20 transition-colors active:scale-95 whitespace-nowrap"
                data-testid={`button-quick-reply-${reply.slice(0, 10).replace(/\s+/g, "-").toLowerCase()}`}
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 md:p-4 bg-white border-t border-gray-100 mb-[64px] md:mb-0">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(text); }}
              className="flex gap-2 md:max-w-2xl"
            >
              <Button
                type="button"
                variant="outline"
                size="icon"
                className={cn("rounded-full w-12 h-12 shrink-0 transition-all", isRecording ? "bg-red-50 text-red-500 border-red-200 animate-pulse" : "text-gray-500")}
                onClick={handleMic}
                data-testid="button-voice-input"
              >
                <Mic className="w-5 h-5" />
              </Button>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your message..."
                className="h-12 rounded-full border-gray-200 bg-gray-50 focus-visible:ring-primary px-5"
                data-testid="input-chat-message"
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 shrink-0"
                disabled={!text.trim()}
                data-testid="button-send-message"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
