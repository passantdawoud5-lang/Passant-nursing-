import React, { useState } from 'react';
import { Check, Copy, Smartphone, Wallet, ShieldCheck } from 'lucide-react';
import { PaymentMethod } from '../types';

export const OFFICIAL_PAYMENT_NUMBER = '01034562904';

export function formatPaymentMethodLabel(method: PaymentMethod | string): string {
  switch (method) {
    case 'instapay':
      return 'إنستاباي (InstaPay)';
    case 'vodafone_cash':
      return 'فودافون كاش (Vodafone Cash)';
    case 'card':
      return 'بطاقة بنكية';
    default:
      return 'إنستاباي / فودافون كاش';
  }
}

interface PaymentMethodSectionProps {
  paymentMethod: 'instapay' | 'vodafone_cash';
  onSelectMethod: (method: 'instapay' | 'vodafone_cash') => void;
  transactionRef: string;
  onChangeTransactionRef: (value: string) => void;
  accent?: 'teal' | 'amber' | 'blue';
}

export const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  paymentMethod,
  onSelectMethod,
  transactionRef,
  onChangeTransactionRef,
  accent = 'teal',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(OFFICIAL_PAYMENT_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const containerStyle =
    accent === 'amber'
      ? 'bg-amber-50/70 border-amber-200'
      : accent === 'blue'
      ? 'bg-blue-50/60 border-blue-200'
      : 'bg-teal-50/60 border-teal-200';

  const activeCardStyle =
    accent === 'amber'
      ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
      : accent === 'blue'
      ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
      : 'bg-teal-600 text-white border-teal-700 shadow-sm';

  return (
    <div className={`p-4 rounded-2xl border space-y-3.5 text-right ${containerStyle}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-teal-700 shrink-0" />
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
            طريقة الدفع المعتمدة
          </h4>
        </div>
        <span className="text-[11px] font-bold bg-white px-2.5 py-0.5 rounded-full border border-slate-200 text-slate-700 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>إنستاباي أو فودافون كاش فقط</span>
        </span>
      </div>

      {/* Official payment number display + copy button */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] text-slate-500 font-semibold block">
            رقم التحويل المعتمد (إنستاباي / فودافون كاش):
          </span>
          <span className="text-base sm:text-lg font-black text-slate-900 font-mono tracking-wider" dir="ltr">
            {OFFICIAL_PAYMENT_NUMBER}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyNumber}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
            copied
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>تم النسخ</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-600" />
              <span>نسخ الرقم</span>
            </>
          )}
        </button>
      </div>

      {/* Two Method Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onSelectMethod('instapay')}
          className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-2 ${
            paymentMethod === 'instapay'
              ? activeCardStyle
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black text-xs ${
                paymentMethod === 'instapay'
                  ? 'bg-white/20 text-white'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              IP
            </div>
            <div>
              <span className="font-bold text-xs block">إنستاباي (InstaPay)</span>
              <span
                className={`text-[10px] block font-mono ${
                  paymentMethod === 'instapay' ? 'text-white/90' : 'text-slate-500'
                }`}
              >
                تحويل على {OFFICIAL_PAYMENT_NUMBER}
              </span>
            </div>
          </div>
          {paymentMethod === 'instapay' && <Check className="w-4 h-4 text-white shrink-0" />}
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod('vodafone_cash')}
          className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-2 ${
            paymentMethod === 'vodafone_cash'
              ? activeCardStyle
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                paymentMethod === 'vodafone_cash'
                  ? 'bg-white/20 text-white'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs block">فودافون كاش (Vodafone Cash)</span>
              <span
                className={`text-[10px] block font-mono ${
                  paymentMethod === 'vodafone_cash' ? 'text-white/90' : 'text-slate-500'
                }`}
              >
                محفظة على {OFFICIAL_PAYMENT_NUMBER}
              </span>
            </div>
          </div>
          {paymentMethod === 'vodafone_cash' && <Check className="w-4 h-4 text-white shrink-0" />}
        </button>
      </div>

      {/* Optional Transfer Reference */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
          رقم المحول منه أو رقم مرجع التحويل (اختياري - يمكن تأكيده بعد المراجعة):
        </label>
        <input
          type="text"
          value={transactionRef}
          onChange={(e) => onChangeTransactionRef(e.target.value)}
          placeholder={`مثال: تم التحويل عبر ${paymentMethod === 'instapay' ? 'إنستاباي' : 'فودافون كاش'} من رقم 010XXXXXXXX`}
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 text-right"
        />
      </div>
    </div>
  );
};
