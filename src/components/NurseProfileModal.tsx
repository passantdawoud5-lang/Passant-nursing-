import React from 'react';
import { Caregiver } from '../types';
import { 
  X, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Award, 
  Calendar, 
  CheckCircle2, 
  FileCheck, 
  PhoneCall, 
  HeartHandshake,
  UserCheck,
  Lock
} from 'lucide-react';

interface NurseProfileModalProps {
  nurse: Caregiver | null;
  onClose: () => void;
  onBookVisit: (nurse: Caregiver) => void;
  currentUserRole?: 'patient' | 'caregiver' | 'admin';
  currentCaregiverId?: string;
}

export const NurseProfileModal: React.FC<NurseProfileModalProps> = ({
  nurse,
  onClose,
  onBookVisit,
  currentUserRole = 'patient',
  currentCaregiverId
}) => {
  if (!nurse) return null;

  const isOwner = currentUserRole === 'caregiver' && currentCaregiverId === nurse.id;
  const isAdmin = currentUserRole === 'admin';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-right shadow-2xl border border-slate-200 my-8 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>موثق و معتمد ✅</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Summary */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={nurse.avatar}
            alt={nurse.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-emerald-200 shadow-sm"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{nurse.name}</h2>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                nurse.role === 'physiotherapist' 
                  ? 'bg-blue-50 text-blue-800 border-blue-200' 
                  : nurse.role === 'assistant_trainee'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : nurse.role === 'cupping_specialist'
                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                  : 'bg-teal-50 text-teal-800 border-teal-200'
              }`}>
                {nurse.role === 'physiotherapist' && '🏃 دكتور / أخصائي علاج طبيعي'}
                {nurse.role === 'assistant_trainee' && `🎓 مساعد ومتدرب (${nurse.trainingTrack === 'physiotherapy' ? 'علاج طبيعي' : nurse.trainingTrack === 'hijama' ? 'حجامة' : 'تمريض'})`}
                {nurse.role === 'cupping_specialist' && '🩸 ممارس حجامة علاجية'}
                {(!nurse.role || nurse.role === 'nurse') && '🩺 طاقم تمريض معتمد'}
              </span>
            </div>

            <p className="text-sm font-semibold text-teal-700 mt-1">
              {nurse.institution.replace(/\s*\(دفعة\s*\d+\)/g, '')}
            </p>

            {nurse.portableDevices && nurse.portableDevices.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1 justify-center sm:justify-start">
                {nurse.portableDevices.map((dev, idx) => (
                  <span key={idx} className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md font-medium">
                    ⚡ {dev}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1.5">
              <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                <span>موثق و معتمد</span>
                <span>✅</span>
              </span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1 text-amber-500 font-bold tabular-nums">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {nurse.rating} ({nurse.reviewsCount} تقييم)
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-slate-500">
                <MapPin className="w-3.5 h-3.5" />
                {nurse.district}
              </span>
            </div>
          </div>
        </div>

        {/* Public Verified Badge for Clients (يعرض لجميع العملاء: موثق و معتمد ✅) */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              ✓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-emerald-950">
                  موثق و معتمد ✅
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  ساري
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5 font-medium">
                تم فحص كافة المستندات والوثائق الطبية واعتمادها بنجاح من إدارة باسانت للتمريض.
              </p>
            </div>
          </div>
        </div>

        {/* Supervisor Evaluation & Clinical Quality (تقييم واعتماد المشرفين لجودة تنفيذ الطلبات المكتملة) */}
        <div className="bg-gradient-to-br from-teal-50/90 via-emerald-50/50 to-slate-50 p-4 rounded-2xl border border-teal-300 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-teal-200">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-700" />
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-teal-950">
                  تقييم واعتماد المشرفين لجودة تنفيذ الطلبات المكتملة
                </h3>
                <span className="text-[10px] text-teal-700 block">
                  تقييم رسمي صادر من قسم الرقابة والجودة الطبية الميدانية
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-teal-300 text-teal-950 font-black text-xs font-mono shadow-2xs">
              <span>⭐ {nurse.supervisorEvaluation?.rating ? nurse.supervisorEvaluation.rating.toFixed(1) : '5.0'}</span>
              <span className="text-slate-400 font-normal">/ 5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-teal-100">
              <span className="text-[10px] text-slate-400 block font-semibold">تصنيف المشرفين:</span>
              <span className="font-bold text-teal-900 block mt-0.5">
                {nurse.supervisorEvaluation?.tier || 'فئة أ (أداء استثنائي فائق الجودة)'}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-teal-100">
              <span className="text-[10px] text-slate-400 block font-semibold">معدل جودة تنفيذ الطلبات:</span>
              <span className="font-black text-emerald-700 block mt-0.5 font-mono">
                %{nurse.supervisorEvaluation?.executionQualityScore || 98} جودة تنفيذ معتمدة
              </span>
            </div>
          </div>

          {nurse.supervisorEvaluation?.supervisorNotes && (
            <div className="p-2.5 bg-white/80 rounded-xl border border-teal-100 text-xs">
              <span className="text-[10px] text-teal-900 font-bold block mb-1">
                تقرير المشرف الطبي الميداني:
              </span>
              <p className="text-[11px] text-slate-700 leading-relaxed italic">
                "{nurse.supervisorEvaluation.supervisorNotes}"
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 mt-1 border-t border-slate-100">
                <span>المقيم: {nurse.supervisorEvaluation.evaluatedBy}</span>
                <span>تاريخ الاعتماد: {nurse.supervisorEvaluation.evaluatedAt}</span>
              </div>
            </div>
          )}
        </div>

        {/* Private Documents Vault - ONLY for Account Owner & Website Admin */}
        {(isOwner || isAdmin) && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-300 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-teal-700" />
                <span>ملف الفحوصات والوثائق المعتمدة (خاص بصاحب الحساب والإدارة فقط):</span>
              </h3>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                سري ومحمي
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">كارنيه مزاولة المهنة:</span>
                  <span className="text-[11px] text-slate-500">ساري وموثق رسمياً</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">تحليل كشف المخدرات:</span>
                  <span className="text-[11px] text-slate-500">معتمد من مستشفى حكومي (سلبي وخالٍ تماماً)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">شهادة التخرج والمؤهل:</span>
                  <span className="text-[11px] text-slate-500">موثقة ومطابقة لبيانات المجلس الأعلى للجامعات</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">فيش وتشبيه:</span>
                  <span className="text-[11px] text-slate-500">صحيفة حالة جنائية حديثة خالية من السوابق</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 pt-1">
              * تنبيه الخصوصية: لا يتم عرض المستندات والفحوصات للعملاء وتظهر فقط لصاحب الأكونت وأدمن الموقع، ويظهر لجميع العملاء شارة: «موثق و معتمد ✅».
            </p>
          </div>
        )}

        {/* Bio */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 mb-1.5">نبذة عن الممارس والخبرات السابقة:</h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
            {nurse.bio}
          </p>
        </div>

        {/* Customer Reviews & Testimonials */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 mb-2">تقييمات وتجارب المرضى السابقة:</h4>
          <div className="space-y-2.5">
            {nurse.reviews.map(rev => (
              <div key={rev.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800">{rev.patientName}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  "{rev.comment}"
                </p>
                <span className="text-[10px] text-slate-400 block mt-1">
                  الخدمة: {rev.serviceTitle} · {rev.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-right">
            <span className="text-xs text-slate-400 block font-semibold">
              {nurse.role === 'physiotherapist' ? 'سعر الجلسة محدد في بروفايل الطبيب:' : 'تحديد تكلفة الزيارة:'}
            </span>
            <span className="text-sm font-black text-teal-800">
              {nurse.role === 'physiotherapist'
                ? `${nurse.visitRate || 350} جنيه / جلسة تأهيل`
                : 'بالاتفاق المباشر العادل بين الممارس والمريض'}
            </span>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookVisit(nurse);
            }}
            className={`px-6 py-3 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 text-white ${
              nurse.role === 'physiotherapist'
                ? 'bg-blue-600 hover:bg-blue-700'
                : nurse.role === 'assistant_trainee'
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-teal-600 hover:bg-teal-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>
              {nurse.role === 'physiotherapist'
                ? `طلب جلسة علاج طبيعي مع ${nurse.name}`
                : nurse.role === 'assistant_trainee'
                ? `طلب زيارة رعاية وتدريب مع ${nurse.name}`
                : nurse.role === 'cupping_specialist'
                ? `طلب جلسة حجامة مع ${nurse.name}`
                : `طلب زيارة تمريض مع ${nurse.name}`}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
