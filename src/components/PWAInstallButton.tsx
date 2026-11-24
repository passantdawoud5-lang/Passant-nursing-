import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'mobile';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className={
          variant === 'mobile'
            ? 'w-full py-2.5 px-3 text-center text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xs'
            : 'inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-300 rounded-xl shadow-2xs transition-all whitespace-nowrap'
        }
        title="تثبيت التطبيق على الهاتف أو الكمبيوتر"
      >
        <Download className="w-3.5 h-3.5 text-teal-700 shrink-0" />
        <span className={variant === 'mobile' ? 'text-white' : ''}>تثبيت التطبيق</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={
            variant === 'mobile'
              ? 'w-full py-2.5 px-3 text-center text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors flex items-center justify-center gap-2'
              : 'inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-300 rounded-xl shadow-2xs transition-all whitespace-nowrap'
          }
        >
          <Smartphone className="w-3.5 h-3.5 text-teal-700 shrink-0" />
          <span>تثبيت على iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 text-right">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-teal-600" />
                  <span>تثبيت التطبيق على iPhone / iPad</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ol className="space-y-2 text-xs text-slate-700 leading-relaxed list-decimal list-inside">
                <li>
                  اضغط على زر <strong>المشاركة (Share)</strong> في شريط متصفح Safari بالأسفل.
                </li>
                <li>
                  مرر للأسفل واختر <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.
                </li>
                <li>
                  اضغط <strong>إضافة (Add)</strong> ليظهر التطبيق بأيقونة مستقلة على هاتفك.
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 py-2.5 text-xs font-bold text-white transition-colors"
              >
                حسناً، فهمت
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
