import React, { useState } from 'react';
import { 
  ServiceItem 
} from '../types';
import { 
  Syringe, 
  Activity, 
  HeartPulse, 
  Stethoscope, 
  ShieldPlus, 
  Sparkles, 
  UserCheck, 
  Flame,
  Check,
  Clock,
  Banknote,
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectService: (service: ServiceItem) => void;
  onOpenCuppingBooking?: () => void;
  onOpenPhysiotherapyBooking?: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectService,
  onOpenCuppingBooking,
  onOpenPhysiotherapyBooking
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedServiceForDetails, setSelectedServiceForDetails] = useState<ServiceItem | null>(null);

  const categories = [
    { id: 'all', label: 'جميع الخدمات' },
    { id: 'nursing', label: 'التمريض والمحاليل والجروح' },
    { id: 'physiotherapy', label: 'العلاج الطبيعي والتأهيل' },
    { id: 'hijama', label: 'الحجامة النبوية والطبية' },
    { id: 'elderly', label: 'رعاية كبار السن والشفتات' },
    { id: 'emergency', label: 'الطوارئ والعلامات الحيوية' }
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Syringe': return <Syringe className="w-5 h-5 text-teal-600" />;
      case 'Activity': return <Activity className="w-5 h-5 text-teal-600" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-teal-600" />;
      case 'Stethoscope': return <Stethoscope className="w-5 h-5 text-teal-600" />;
      case 'ShieldPlus': return <ShieldPlus className="w-5 h-5 text-amber-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-600" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5 text-indigo-600" />;
      case 'Flame': return <Flame className="w-5 h-5 text-rose-600" />;
      default: return <Activity className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <section className="py-14 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-right max-w-3xl ml-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span>خدمات طبية معتمدة على مدار الساعة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            خدمات التمريض المنزلي وجلسات الحجامة المتخصصة
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            جميع الإجراءات تتم بأيدي ممرضين مرخصين من كليات ومعاهد التمريض، باستخدام أدوات ومستهلكات طبية معقمة أحادية الاستخدام تُفتح أمام المريض.
          </p>
        </div>

        {/* Dedicated Cupping Therapy Spotlight Banner */}
        <div className="mb-12 bg-gradient-to-r from-amber-900 via-amber-950 to-slate-900 rounded-2xl overflow-hidden text-white shadow-lg border border-amber-800/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-4 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>قسم الحجامة الطبية الوقائية والعلاجية المتخصصة</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-100">
                الحجامة النبوية والطبية المعقمة بإشراف ممارسين صحيين
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                نلتزم بأعلى معايير مكافحة العدوى: كؤوس حجامة ومشارط ميكرو جراحية معقمة مفردة الاستخدام، تعقيم بزيت الزيتون البكر وزيت الحبة السوداء ومطهرات طبية، مع قياس ضغط الدم والسكر قبل وبعد الجلسة لضمان أمان المريض التام.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-amber-200">
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-amber-400" />
                  أدوات مفردة تُفتح أمام المريض وتُعدم فوراً
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-amber-400" />
                  تخفيف آلام الظهر والرقبة والصداع النصفي
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-amber-400" />
                  ممارسون وممارسات مرخصون (ذكور وإناث)
                </span>
              </div>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {onOpenCuppingBooking && (
                  <button
                    onClick={onOpenCuppingBooking}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-2 border border-amber-300"
                  >
                    <Sparkles className="w-4 h-4 text-amber-950" />
                    <span>طلب حجامة</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedCategory('hijama')}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-amber-100 font-bold text-xs rounded-xl transition-all border border-amber-400/30"
                >
                  تصفح باقات وأسعار الحجامة
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 h-64 lg:h-full min-h-[260px] relative">
              <img
                src="/src/assets/images/cupping_therapy_hijama_1793095931928.jpg"
                alt="أدوات الحجامة الطبية المعقمة"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-amber-950/70 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Dedicated Physiotherapy Spotlight Banner */}
        <div className="mb-12 bg-gradient-to-r from-teal-950 via-slate-900 to-teal-900 rounded-2xl overflow-hidden text-white shadow-lg border border-teal-800/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-4 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                <Activity className="w-3.5 h-3.5" />
                <span>قسم العلاج الطبيعي والتأهيل الحركي المنزلي</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-teal-100">
                تأهيل جلطات المخ والأعصاب، الغضاريف، وما بعد الكسور وتغيير المفاصل
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                جلسات منزلية متخصصة بأيدي أطباء واستشاريين مرخصين ومجهزين بأحدث أجهزة التنبيه الكهربائي والموجات فوق الصوتية وأدوات استعادة الاتزان، مع إمكانية طلب حضور مساعد متدرب لمعاونة الطبيب في رفع وتأهيل المريض.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-teal-200">
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-teal-400" />
                  أجهزة تنبيه كهربائي TENS/EMS وموجات فوق صوتية
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-teal-400" />
                  إمكانية مرافقة مساعد متدرب
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-teal-400" />
                  سعر الجلسة محدد ومعلن ببروفايل الطبيب
                </span>
              </div>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {onOpenPhysiotherapyBooking && (
                  <button
                    onClick={onOpenPhysiotherapyBooking}
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-2 border border-teal-400"
                  >
                    <Activity className="w-4 h-4 text-white" />
                    <span>طلب زيارة علاج طبيعي</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedCategory('physiotherapy')}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-teal-100 font-bold text-xs rounded-xl transition-all border border-teal-400/30"
                >
                  تصفح خدمات العلاج الطبيعي
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 h-64 lg:h-full min-h-[260px] relative bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
                alt="جلسات علاج طبيعي وتأهيل حركي منزلي"
                className="w-full h-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/80 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-semibold scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-teal-400 p-6 flex flex-col justify-between transition-all hover:shadow-md group text-right"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="text-xs font-black text-teal-900 bg-teal-50 px-2.5 py-1.5 rounded-xl border border-teal-200">
                    السعر بالتنسيق بين الممرض والعميل
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    {getIcon(service.iconName)}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold">
                    متاح طلب عادي وعاجل
                  </span>
                  {service.isPopular && (
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      الأكثر طلباً
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                  {service.title}
                </h3>

                <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {service.shortDesc}
                </p>

                {/* Duration & Included Items */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>متوسط المدة:</span>
                    </span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {service.durationMinutes >= 60 ? `${service.durationMinutes / 60} ساعة` : `${service.durationMinutes} دقيقة`}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700 block mb-1">المستلزمات المشمولة بالزيارة:</span>
                    <ul className="space-y-1">
                      {service.includedSupplies.slice(0, 2).map((supply, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-slate-600">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{supply}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => {
                    if (service.category === 'hijama' && onOpenCuppingBooking) {
                      onOpenCuppingBooking();
                    } else if (service.category === 'physiotherapy' && onOpenPhysiotherapyBooking) {
                      onOpenPhysiotherapyBooking();
                    } else {
                      onSelectService(service);
                    }
                  }}
                  className={`flex-1 py-2.5 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 ${
                    service.category === 'hijama'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border border-amber-400'
                      : service.category === 'physiotherapy'
                      ? 'bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700 text-white border border-teal-600'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  {service.category === 'hijama' ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                      <span>طلب حجامة</span>
                    </>
                  ) : service.category === 'physiotherapy' ? (
                    <>
                      <Activity className="w-3.5 h-3.5 text-teal-200" />
                      <span>طلب علاج طبيعي</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>طلب زيارة تمريض</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedServiceForDetails(service)}
                  className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                  title="تفاصيل إضافية والتحضيرات"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Service Details Drawer / Modal */}
      {selectedServiceForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-right shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-teal-700">تفاصيل الخدمة والتحضيرات الطبية</span>
              <button
                onClick={() => setSelectedServiceForDetails(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              {selectedServiceForDetails.title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedServiceForDetails.fullDesc}
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-800">الأدوات والمستهلكات المعقمة المشمولة:</h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {selectedServiceForDetails.includedSupplies.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedServiceForDetails.preparationNotes && (
              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 flex items-start gap-2.5 text-right">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-amber-900">تعليمات وتحضيرات المريض:</h5>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    {selectedServiceForDetails.preparationNotes}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block font-semibold">تحديد التكلفة:</span>
                <span className="text-xs sm:text-sm font-bold text-teal-800">
                  بالاتفاق المباشر بين الممرض والعميل
                </span>
              </div>
              <button
                onClick={() => {
                  const s = selectedServiceForDetails;
                  setSelectedServiceForDetails(null);
                  if (s.category === 'hijama' && onOpenCuppingBooking) {
                    onOpenCuppingBooking();
                  } else {
                    onSelectService(s);
                  }
                }}
                className={`px-6 py-2.5 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 ${
                  selectedServiceForDetails.category === 'hijama'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border border-amber-400'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                {selectedServiceForDetails.category === 'hijama' ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>طلب حجامة</span>
                  </>
                ) : (
                  <span>طلب زيارة تمريض</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
