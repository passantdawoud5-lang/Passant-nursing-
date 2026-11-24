import React from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Lock, 
  Headphones,
  CheckCircle2
} from 'lucide-react';
import { SocialLinks, SOCIAL_LINKS, FacebookIcon, InstagramIcon, GmailIcon } from './SocialLinks';

interface FooterProps {
  onOpenApplication: () => void;
  onOpenLogin?: () => void;
  onOpenReminders: () => void;
  onOpenHistory: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenApplication,
  onOpenLogin,
  onOpenReminders,
  onOpenHistory
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-right pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 24/7 Support Banner */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 border border-teal-800/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-right">
            <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-bold">
              <Headphones className="w-4 h-4" />
              <span>دعم فني وطبي مستمر على مدار 24 ساعة طوال أيام الأسبوع</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              هل تواجه أي استفسار طبي عاجل أو تحتاج مساعدة فورية؟
            </h3>
            <p className="text-xs text-slate-400">
              فريق خدمة العملاء والمنسقين الطبيين في باسانت جاهزون للرد وتوجيه أقرب ممرض لموقعك.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={SOCIAL_LINKS.gmail.href}
              className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <GmailIcon className="w-4 h-4" />
              <span>تواصل معنا عبر البريد: passantnursing@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="bg-white p-2 rounded-xl inline-block shadow-sm">
              <img
                src="/logo.jpg"
                alt="Passant Nursing Logo"
                className="h-10 w-auto object-contain rounded"
              />
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              منصة الرعاية التمريضية المنزلية والحجامة الطبية الأولى في مصر. نضمن أعلى معايير الأمان عبر الفحص الجنائي والمخبري والترخيص النقابي لجميع الكوادر.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px] pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>سرية كاملة وتشفير لكافة السجلات والبيانات</span>
            </div>
            {/* Social Icons in Brand block */}
            <div className="pt-2">
              <p className="text-slate-400 text-[11px] mb-2 font-medium">تابعنا وتواصل معنا:</p>
              <SocialLinks variant="footer" />
            </div>
          </div>

          {/* Services Links */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white mb-3">خدمات التمريض والحجامة</h4>
            <ul className="space-y-2 text-slate-400">
              <li>تركيب المحاليل والكانيولا الوريدية</li>
              <li>إعطاء الحقن واختبارات الحساسية</li>
              <li>غيار الجروح وقرح الفراش وعمليات العظام</li>
              <li>الحجامة النبوية والطبية المعقمة</li>
              <li>رعاية كبار السن والشفتات التمريضية</li>
              <li>جلسات الاستنشاق والأكسجين المنزلي</li>
            </ul>
          </div>

          {/* Quick Access */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white mb-3">روابط وتسهيلات المرضى</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={onOpenReminders} className="hover:text-teal-400 transition-colors">
                  جدول تنبيهات ومواعيد الأدوية
                </button>
              </li>
              <li>
                <button onClick={onOpenHistory} className="hover:text-teal-400 transition-colors">
                  السجل الطبي ومتابعة المؤشرات الحيوية
                </button>
              </li>
              <li>
                <button onClick={onOpenApplication} className="hover:text-teal-400 transition-colors">
                  تسجيل كممرض/ة (كليات ومعاهد التمريض)
                </button>
              </li>
              {onOpenLogin && (
                <li>
                  <button onClick={onOpenLogin} className="hover:text-teal-400 transition-colors font-bold text-slate-200">
                    تسجيل دخول العميل (طلب مريض وإدارة الحساب)
                  </button>
                </li>
              )}
              <li>شروط ومكافحة العدوى والتعقيم</li>
              <li>سياسة الخصوصية وسرية السجلات الطبية</li>
            </ul>
          </div>

          {/* Contact & Verification badge */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white mb-3">التغطية وقنوات التواصل</h4>
            <div className="space-y-2 text-slate-400 text-[11px]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>نغطي كافة جميع المحافظات في مصر</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-400 shrink-0" />
                <span>الدفع الإلكتروني المعتمد: إنستاباي (InstaPay) أو فودافون كاش على رقم <span className="font-mono font-bold text-white" dir="ltr">01034562904</span>.</span>
              </div>
              <a 
                href={SOCIAL_LINKS.gmail.href}
                className="flex items-center gap-2 text-slate-300 hover:text-red-400 transition-colors group"
                title="راسلنا عبر الجيميل"
              >
                <div className="w-4 h-4 rounded text-red-400 shrink-0 flex items-center justify-center">
                  <GmailIcon className="w-4 h-4" />
                </div>
                <span className="font-mono text-slate-300 group-hover:underline">passantnursing@gmail.com</span>
              </a>
            </div>

            {/* Social Media Link Badges */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <p className="text-white font-bold text-xs">مواقع التواصل الاجتماعي</p>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={SOCIAL_LINKS.facebook.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-[#1877F2] text-slate-300 hover:text-white transition-all text-[11px] font-medium"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                  <span>فيسبوك</span>
                </a>
                <a
                  href={SOCIAL_LINKS.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-gradient-to-r hover:from-amber-500 hover:to-pink-600 text-slate-300 hover:text-white transition-all text-[11px] font-medium"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>انستغرام</span>
                </a>
                <a
                  href={SOCIAL_LINKS.gmail.href}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-[#EA4335] text-slate-300 hover:text-white transition-all text-[11px] font-medium"
                >
                  <GmailIcon className="w-3.5 h-3.5" />
                  <span>الجيميل</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Passant Nursing. جميع الحقوق محفوظة لخدمات التمريض المنزلي والرعاية الصحية.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">تابعنا:</span>
              <SocialLinks variant="compact" />
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

