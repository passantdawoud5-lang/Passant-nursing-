import React, { useState } from 'react';
import { Caregiver } from '../types';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  Award, 
  Clock, 
  FileCheck, 
  UserCheck, 
  Search, 
  CheckCircle2, 
  Filter,
  Calendar,
  Sparkles
} from 'lucide-react';

interface NursesDirectoryProps {
  caregivers: Caregiver[];
  onSelectNurse: (nurse: Caregiver) => void;
  onViewProfile: (nurse: Caregiver) => void;
}

export const NursesDirectory: React.FC<NursesDirectoryProps> = ({
  caregivers,
  onSelectNurse,
  onViewProfile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'nurse' | 'physiotherapy' | 'hijama' | 'assistant_trainee'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [qualificationFilter, setQualificationFilter] = useState<string>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');

  const filteredCaregivers = caregivers.filter(nurse => {
    // Role filter
    if (roleFilter !== 'all') {
      if (roleFilter === 'physiotherapy') {
        const isPT = nurse.role === 'physiotherapist' || nurse.specialties.some(s => s.includes('طبيعي') || s.includes('تأهيل') || s.includes('حركي'));
        if (!isPT) return false;
      } else if (roleFilter === 'hijama') {
        const isCupping = nurse.role === 'cupping_specialist' || nurse.specialties.some(s => s.includes('حجامة'));
        if (!isCupping) return false;
      } else if (roleFilter === 'assistant_trainee') {
        if (nurse.role !== 'assistant_trainee') return false;
      } else if (roleFilter === 'nurse') {
        if (nurse.role === 'physiotherapist' || nurse.role === 'assistant_trainee') return false;
      }
    }

    // Gender filter
    if (genderFilter !== 'all' && nurse.gender !== genderFilter) return false;

    // Qualification filter
    if (qualificationFilter !== 'all' && nurse.qualification !== qualificationFilter) return false;

    // Specialty filter
    if (specialtyFilter !== 'all') {
      if (specialtyFilter === 'hijama' && !nurse.specialties.some(s => s.includes('حجامة'))) return false;
      if (specialtyFilter === 'elderly' && !nurse.specialties.some(s => s.includes('مسنين') || s.includes('كبار'))) return false;
      if (specialtyFilter === 'icu' && !nurse.specialties.some(s => s.includes('مركزة') || s.includes('حرجة'))) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = nurse.name.toLowerCase().includes(q);
      const matchInst = nurse.institution.toLowerCase().includes(q);
      const matchDist = nurse.district.toLowerCase().includes(q);
      const matchSpec = nurse.specialties.some(s => s.toLowerCase().includes(q));
      if (!matchName && !matchInst && !matchDist && !matchSpec) return false;
    }

    return true;
  });

  return (
    <section className="py-14 bg-slate-50 border-t border-slate-200" id="nurses">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-right max-w-3xl ml-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>طاقم طبي مفحوص وموثق رسمياً</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            طاقم التمريض في خدمة 24 ساعة
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            طاقم رعاية وتمريض منزلي متاح على مدار 24 ساعة، معتمد وموثق رسمياً (موثق و معتمد ✅) ومصنف بإشراف طبي دقيق مع تقييم جودة تنفيذ الطلبات المكتملة.
          </p>
        </div>

        {/* Filters & Search Control Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs mb-8 space-y-4">
          
          {/* Main Role / Discipline Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 text-xs font-bold scrollbar-none">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                roleFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>جميع الكوادر الطبية</span>
              <span className="font-mono text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">{caregivers.length}</span>
            </button>

            <button
              onClick={() => setRoleFilter('nurse')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                roleFilter === 'nurse'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>تمريض منزلي ورعاية</span>
            </button>

            <button
              onClick={() => setRoleFilter('physiotherapy')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                roleFilter === 'physiotherapy'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-200" />
              <span>العلاج الطبيعي والتأهيل</span>
            </button>

            <button
              onClick={() => setRoleFilter('hijama')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                roleFilter === 'hijama'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-200" />
              <span>الحجامة النبوية والطبية</span>
            </button>

            <button
              onClick={() => setRoleFilter('assistant_trainee')}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                roleFilter === 'assistant_trainee'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>المساعدون والمتدربون</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative text-right">
              <input
                type="text"
                placeholder="ابحث باسم الممرض، التخصص، أو المنطقة (مثال: المعادي، حجامة...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all text-right"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>

            {/* Gender Filters */}
            <div className="md:col-span-3 flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setGenderFilter('all')}
                className={`flex-1 py-1.5 rounded-lg transition-colors whitespace-nowrap text-center ${
                  genderFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                الكل ({caregivers.length})
              </button>
              <button
                onClick={() => setGenderFilter('female')}
                className={`flex-1 py-1.5 rounded-lg transition-colors whitespace-nowrap text-center ${
                  genderFilter === 'female' ? 'bg-white text-teal-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ممرضات (إناث)
              </button>
              <button
                onClick={() => setGenderFilter('male')}
                className={`flex-1 py-1.5 rounded-lg transition-colors whitespace-nowrap text-center ${
                  genderFilter === 'male' ? 'bg-white text-teal-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ممرضون (ذكور)
              </button>
            </div>

            {/* Qualification Filter */}
            <div className="md:col-span-4 flex items-center gap-2">
              <select
                value={qualificationFilter}
                onChange={(e) => setQualificationFilter(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-teal-500"
              >
                <option value="all">جميع المؤهلات العلمية</option>
                <option value="college">خريجو كليات التمريض (بكالوريوس)</option>
                <option value="institute">خريجو المعاهد الفنية الصحية</option>
                <option value="academy">أكاديميات العلوم التمريضية المعتمدة</option>
              </select>
            </div>
          </div>

          {/* Specialty Quick Chips */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-medium pt-1 border-t border-slate-100">
            <span className="text-slate-400 text-[11px] whitespace-nowrap">التخصصات:</span>
            <button
              onClick={() => setSpecialtyFilter('all')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
                specialtyFilter === 'all' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setSpecialtyFilter('hijama')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
                specialtyFilter === 'hijama' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              متخصصو الحجامة الطبية
            </button>
            <button
              onClick={() => setSpecialtyFilter('icu')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
                specialtyFilter === 'icu' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              رعاية حرجة وقدم سكري
            </button>
            <button
              onClick={() => setSpecialtyFilter('elderly')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
                specialtyFilter === 'elderly' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              رعاية كبار السن والشفتات
            </button>
          </div>
        </div>

        {/* Nurses List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCaregivers.map(nurse => (
            <div
              key={nurse.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-teal-400 p-5 sm:p-6 transition-all hover:shadow-md text-right flex flex-col justify-between"
            >
              <div>
                {/* Nurse Top Profile Row */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative shrink-0">
                    <img
                      src={nurse.avatar}
                      alt={nurse.name}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-teal-100 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    {nurse.isAvailable ? (
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full border-2 border-white">
                        متاح
                      </span>
                    ) : (
                      <span className="absolute -bottom-1 -right-1 bg-slate-400 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full border-2 border-white">
                        في زيارة
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-500 flex items-center text-xs font-bold tabular-nums">
                          <Star className="w-3.5 h-3.5 fill-amber-400 ml-1" />
                          {nurse.rating}
                        </span>
                        <span className="text-[11px] text-slate-400">({nurse.reviewsCount} تقييم)</span>
                      </div>
                      {nurse.supervisorEvaluation?.tier && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 truncate max-w-[130px]">
                          {nurse.supervisorEvaluation.tier.split(' ')[0]} {nurse.supervisorEvaluation.tier.split(' ')[1]}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 truncate">
                      {nurse.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      {nurse.role === 'physiotherapist' ? (
                        <span className="text-[10px] bg-teal-100 text-teal-900 border border-teal-300 font-bold px-2 py-0.5 rounded-full">
                          دكتور / أخصائي علاج طبيعي 🏃
                        </span>
                      ) : nurse.role === 'assistant_trainee' ? (
                        <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full">
                          مساعد ومتدرب ({nurse.trainingTrack === 'physiotherapy' ? 'مسار علاج طبيعي' : nurse.trainingTrack === 'hijama' ? 'مسار حجامة' : 'مسار تمريض'}) 🎓
                        </span>
                      ) : nurse.role === 'cupping_specialist' ? (
                        <span className="text-[10px] bg-rose-100 text-rose-900 border border-rose-300 font-bold px-2 py-0.5 rounded-full">
                          ممارس حجامة طبية معتمد 🩸
                        </span>
                      ) : (
                        <span className="text-[10px] bg-blue-100 text-blue-900 border border-blue-300 font-bold px-2 py-0.5 rounded-full">
                          طاقم تمريض معتمد 🩺
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-teal-800 font-semibold mt-1 line-clamp-1">
                      {nurse.institution.replace(/\s*\(دفعة\s*\d+\)/g, '')}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{nurse.district}</span>
                    </div>

                    {nurse.portableDevices && nurse.portableDevices.length > 0 && (
                      <div className="mt-2 p-2 bg-teal-50/70 rounded-xl border border-teal-100 text-[11px] text-teal-900">
                        <span className="font-bold text-[10px] text-teal-950 block mb-1">الأجهزة المحمولة المتوفرة بحوزته:</span>
                        <div className="flex flex-wrap gap-1">
                          {nurse.portableDevices.slice(0, 3).map((d, i) => (
                            <span key={i} className="text-[10px] bg-white text-teal-800 px-1.5 py-0.5 rounded border border-teal-200">
                              ⚡ {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification Accreditation Badge */}
                <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                      <span>موثق و معتمد</span>
                      <span className="text-emerald-700">✅</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    معتمد رسمياً
                  </span>
                </div>

                {/* Supervisor Evaluation & Completed Orders Quality (تقييم المشرفين لجودة تنفيذ الطلبات المكتملة) */}
                <div className="bg-gradient-to-r from-teal-50/90 via-emerald-50/60 to-blue-50/50 p-3 rounded-2xl border border-teal-200 mb-3.5 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-extrabold text-teal-950">
                      <Award className="w-4 h-4 text-teal-700 shrink-0" />
                      <span>تقييم المشرفين لجودة التنفيذ:</span>
                    </div>
                    <span className="font-mono font-bold text-teal-900 bg-white px-2 py-0.5 rounded-md border border-teal-200 text-[11px] flex items-center gap-1">
                      <span>⭐ {nurse.supervisorEvaluation?.rating ? nurse.supervisorEvaluation.rating.toFixed(1) : '5.0'}</span>
                      <span className="text-slate-400 font-normal">/ 5</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] pt-1 border-t border-teal-200/50">
                    <span className="text-teal-900 font-bold">
                      {nurse.supervisorEvaluation?.tier || 'فئة أ (أداء استثنائي فائق الجودة)'}
                    </span>
                    <span className="text-emerald-800 font-black">
                      جودة تنفيذ الطلبات: %{nurse.supervisorEvaluation?.executionQualityScore || 98}
                    </span>
                  </div>

                  {nurse.supervisorEvaluation?.supervisorNotes && (
                    <p className="text-[10px] text-slate-600 line-clamp-1 italic bg-white/80 px-2 py-1 rounded-lg border border-teal-100">
                      "{nurse.supervisorEvaluation.supervisorNotes}"
                    </p>
                  )}
                </div>

                {/* Specialties tags */}
                <div className="mb-4">
                  <span className="text-[11px] text-slate-500 font-medium block mb-1.5">أبرز الخبرات والمهارات:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {nurse.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience & Punctuality Strip */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50/80 rounded-xl border border-slate-100 text-center text-xs text-slate-600 mb-4">
                  <div>
                    <span className="block font-black text-slate-900 tabular-nums">{nurse.experienceYears} سنوات</span>
                    <span className="text-[10px] text-slate-400">خبرة عملية</span>
                  </div>
                  <div className="border-x border-slate-200">
                    <span className="block font-black text-slate-900 tabular-nums">{nurse.completedVisits}</span>
                    <span className="text-[10px] text-slate-400">زيارة ناجحة</span>
                  </div>
                  <div>
                    <span className="block font-black text-emerald-600 tabular-nums">%{nurse.punctualityScore}</span>
                    <span className="text-[10px] text-slate-400">انضباط مواعيد</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Direct Pricing (بين الممرض والعميل فقط ما عدا دكتور العلاج الطبيعي محدد ببروفايله) */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    {nurse.role === 'physiotherapist' ? 'سعر الجلسة بالبروفايل:' : 'تحديد التكلفة:'}
                  </span>
                  {nurse.role === 'physiotherapist' ? (
                    <span className="text-xs font-black text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 inline-block">
                      {nurse.visitRate ? `${nurse.visitRate} جنيه / جلسة` : '350 جنيه / جلسة'}
                    </span>
                  ) : (
                    <span className="text-xs font-black text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 inline-block">
                      بالاتفاق بين الممرض والعميل
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewProfile(nurse)}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    الملف والتقييمات
                  </button>

                  <button
                    onClick={() => onSelectNurse(nurse)}
                    className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>طلب زيارة</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {filteredCaregivers.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">لم يتم العثور على ممرضين يطابقون خيارات البحث</h3>
            <p className="text-xs text-slate-500 mt-1">يرجى تعديل الفلاتر أو تجربة كلمات بحث أخرى.</p>
            <button
              onClick={() => { setSearchQuery(''); setGenderFilter('all'); setQualificationFilter('all'); setSpecialtyFilter('all'); }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
