import React from 'react';
import { 
  Clock, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  PhoneCall, 
  ArrowLeft,
  Syringe,
  FileBadge2
} from 'lucide-react';

interface HeroSectionProps {
  onBookNow: () => void;
  onExploreNurses: () => void;
  onOpenApplication: () => void;
  onOpenCuppingBooking?: () => void;
  onOpenPhysiotherapyBooking?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBookNow,
  onExploreNurses,
  onOpenApplication,
  onOpenCuppingBooking,
  onOpenPhysiotherapyBooking
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-teal-50/50 via-slate-50 to-white pt-8 pb-16 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Right Column (in RTL, main copy) */}
          <div className="lg:col-span-7 space-y-6 text-right">

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              تمريض منزلي، علاج طبيعي وتأهيل، وحجامة طبية <span className="text-teal-600">بأعلى معايير الأمان</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              منصة <strong className="text-slate-800 font-semibold">Passant Nursing</strong> تجمعك بنخبة طاقم التمريض المنزلي، دكاترة العلاج الطبيعي والتأهيل الحركي، وممارسي الحجامة المعتمدين.
            </p>

            {/* Verification checklist pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-700 font-medium pt-1">
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>جلسات علاج طبيعي وتأهيل حركي منزلي بأجهزة حديثة</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تتبع GPS حي حتى باب المنزل</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>إمكانية طلب مساعد متدرب للمرافقة</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onBookNow}
                className="px-5 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>طلب زيارة تمريض</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              {onOpenPhysiotherapyBooking && (
                <button
                  onClick={onOpenPhysiotherapyBooking}
                  className="px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-blue-500"
                >
                  <span>🏃 طلب علاج طبيعي</span>
                </button>
              )}

              {onOpenCuppingBooking && (
                <button
                  onClick={onOpenCuppingBooking}
                  className="px-4 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-amber-300"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>طلب حجامة</span>
                </button>
              )}

              <button
                onClick={onExploreNurses}
                className="px-4 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-xs sm:text-sm rounded-xl transition-all"
              >
                تصفح الفريق والتقييمات
              </button>

              <button
                onClick={onOpenApplication}
                className="px-3 py-3.5 text-teal-700 hover:text-teal-900 font-semibold text-xs flex items-center gap-1.5 underline-offset-4 hover:underline"
              >
                <FileBadge2 className="w-4 h-4" />
                <span>انضم كأخصائي أو متدرب</span>
              </button>
            </div>

            {/* Quick Stats Strip */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-right">
              <div>
                <span className="block text-2xl font-black text-slate-900 tabular-nums">1,850+</span>
                <span className="text-xs text-slate-500 font-medium">زيارة منزلية ناجحة</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-slate-900 tabular-nums">4.94 ★</span>
                <span className="text-xs text-slate-500 font-medium">متوسط تقييم المرضى</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-slate-900 tabular-nums">100%</span>
                <span className="text-xs text-slate-500 font-medium">ممرضون مرخصون ومفحوصون</span>
              </div>
            </div>

          </div>

          {/* Left Column (Hero Image & Real-time Live Status Snapshot) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-xl bg-slate-900 group">
              <img
                src="/src/assets/images/hero_home_nursing_1793095931516.jpg"
                alt="رعاية تمريضية منزلية متخصصة"
                className="w-full h-[430px] object-cover group-hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>

              {/* Live Dispatch Badge Floating Card */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-100 max-w-xs text-right">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-900">نظام توجيه فوري للممرضين</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  متوسط وصول الممرض إلى موقع المريض: <span className="font-bold text-teal-700">22 دقيقة</span> في نطاق القاهرة والجيزة
                </p>
              </div>

              {/* Bottom Card Preview */}
              <div className="absolute bottom-4 inset-x-4 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                      RN
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">سارة عبد الرحمن · بكالوريوس تمريض</h4>
                      <p className="text-[11px] text-slate-500">في الطريق إلى المريض (المعادي) · متبقي 8 دقائق</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200">
                    مباشر GPS
                  </span>
                </div>
              </div>
            </div>

            {/* Floating verification emblem */}
            <div className="absolute -bottom-5 -right-5 bg-white rounded-xl shadow-lg border border-slate-200 p-3 hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-900">كوادر تمريضية وطبية</span>
                <span className="text-[11px] text-emerald-600 font-bold">موثق ومعتمد ✅</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
