import React, { useState } from 'react';
import { BookingOrder, ChatMessage } from '../types';
import { 
  X, 
  Send, 
  Paperclip, 
  Mic, 
  ShieldCheck, 
  PhoneCall, 
  CheckCheck,
  FileText
} from 'lucide-react';

interface DirectChatModalProps {
  booking: BookingOrder | null;
  messages: ChatMessage[];
  onClose: () => void;
  onSendMessage: (bookingId: string, text: string, isVoice?: boolean, attachmentName?: string) => void;
}

export const DirectChatModal: React.FC<DirectChatModalProps> = ({
  booking,
  messages,
  onClose,
  onSendMessage
}) => {
  const [inputVal, setInputVal] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  if (!booking) return null;

  const quickReplies = [
    'أنا منتظر حضرتك في العنوان المحدد.',
    'هل تحتاج أي مستلزمات أو أمبولات من الصيدلية؟',
    'الروشتة الطبية مرفقة بالطلب.',
    'وصلت تحت العمارة وسأصعد الآن.'
  ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    onSendMessage(booking.id, inputVal.trim());
    setInputVal('');
  };

  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      onSendMessage(booking.id, 'رسالة صوتية مسجلة (0:18 ثانية)', true);
    }, 1200);
  };

  const handleSimulateAttach = () => {
    const fileName = 'صورة_مكان_الحقن_أو_الجرح.jpg';
    onSendMessage(booking.id, 'تم إرفاق صورة توضيحية للحالة', false, fileName);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full h-[620px] flex flex-col text-right shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Chat Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={booking.caregiverAvatar}
              alt={booking.caregiverName}
              className="w-11 h-11 rounded-full object-cover border-2 border-teal-400"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="text-sm font-bold leading-tight">{booking.caregiverName}</h3>
              <p className="text-[11px] text-teal-300 flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>متصل الآن · تمريض وحجامة باسانت</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${booking.caregiverPhone}`}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl transition-colors"
              title="اتصال هاتفي"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security & Confidentiality Tag */}
        <div className="bg-teal-50 px-4 py-2 border-b border-teal-100 flex items-center justify-between text-[11px] text-teal-900">
          <span className="flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
            محادثة طبية مشفرة ومحمية بسرية تامة
          </span>
          <span className="text-teal-700 font-mono">حجز #{booking.id}</span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {messages.map((msg) => {
            const isMe = msg.senderRole === 'patient';
            const isSystem = msg.senderRole === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="text-center my-2">
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-3 py-1 rounded-full inline-block">
                    {msg.text}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs shadow-2xs ${
                    isMe
                      ? 'bg-teal-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <span className="block text-[10px] font-bold mb-1 opacity-80">
                    {msg.senderName}
                  </span>

                  {msg.isVoice ? (
                    <div className="flex items-center gap-2 py-1">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-1.5 w-24 bg-white/40 rounded-full"></div>
                        <span className="text-[10px] font-mono">{msg.text}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="leading-relaxed">{msg.text}</p>
                  )}

                  {msg.attachmentName && (
                    <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-1.5 text-[11px]">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="underline">{msg.attachmentName}</span>
                    </div>
                  )}

                  <div className="mt-1 flex items-center justify-end gap-1 text-[9px] opacity-70 font-mono">
                    <span>{msg.timestamp}</span>
                    <CheckCheck className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick replies */}
        <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(booking.id, reply)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 rounded-lg whitespace-nowrap shrink-0 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={handleSimulateAttach}
            className="p-2 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="إرفاق صورة أو روشتة"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleSimulateVoice}
            className={`p-2 rounded-xl transition-colors ${
              isRecording ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-500 hover:text-teal-700 hover:bg-slate-100'
            }`}
            title="تسجيل رسالة صوتية"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            placeholder={isRecording ? 'جاري تسجيل الصوت...' : 'اكتب رسالتك للممرض هنا...'}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isRecording}
            className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500"
          />

          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>

      </div>
    </div>
  );
};
