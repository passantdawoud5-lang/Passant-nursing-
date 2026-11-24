import React, { useState, useEffect } from 'react';
import { BookingOrder } from '../types';
import { 
  Star, 
  X, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Award, 
  MessageSquare, 
  ThumbsUp, 
  HeartHandshake, 
  UserCheck
} from 'lucide-react';

interface ImmediateReviewModalProps {
  isOpen: boolean;
  booking: BookingOrder | null;
  onClose: () => void;
  onSubmitReview: (
    bookingId: string, 
    reviewData: {
      rating: number;
      professionalismRating: number;
      cleanlinessRating: number;
      punctualityRating: number;
      comment: string;
      tags: string[];
      wouldRecommend: boolean;
    }
  ) => void;
}

export const ImmediateReviewModal: React.FC<ImmediateReviewModalProps> = ({
  isOpen,
  booking,
  onClose,
  onSubmitReview
}) => {
  // Three required rating criteria
  const [professionalismRating, setProfessionalismRating] = useState<number>(5);
  const [cleanlinessRating, setCleanlinessRating] = useState<number>(5);
  const [punctualityRating, setPunctualityRating] = useState<number>(5);

  // Hover states for preview
  const [hoverProf, setHoverProf] = useState<number | null>(null);
  const [hoverClean, setHoverClean] = useState<number | null>(null);
  const [hoverPunct, setHoverPunct] = useState<number | null>(null);

  // Text feedback
  const [comment, setComment] = useState<string>('');
  
  // Selected tags
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'تعقيم فائق وأدوات مغلفة',
    'يد خفيفة وبدون ألم'
  ]);

  // Would recommend
  const [wouldRecommend, setWouldRecommend] = useState<boolean>(true);

  // Submission state
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Reset state when a new booking opens
  useEffect(() => {
    if (isOpen && booking) {
      setProfessionalismRating(5);
      setCleanlinessRating(5);
      setPunctualityRating(5);
      setComment('');
      setSelectedTags(['تعقيم فائق وأدوات مغلفة', 'يد خفيفة وبدون ألم']);
      setWouldRecommend(true);
      setIsSubmitted(false);
    }
  }, [isOpen, booking]);

  if (!isOpen || !booking) return null;

  // Calculate dynamic overall rating average (rounded to 1 decimal place)
  const currentOverall = Number(
    ((professionalismRating + cleanlinessRating + punctualityRating) / 3).toFixed(1)
  );

  const availableTags = [
    'أدوات معقمة فُتحت أمامي',
    'يد خفيفة وبدون ألم',
    'شرح وافٍ وتطمين للمريض',
    'حضور دقيق في الموعد',
    'التزام كامل بالقفازات والكمامة',
    'أخلاق عالية وأمانة'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const getRatingDescription = (stars: number) => {
    switch (stars) {
      case 5: return 'ممتاز ومثالي (5/5)';
      case 4: return 'جيد جداً (4/5)';
      case 3: return 'جيد ومقبول (3/5)';
      case 2: return 'يحتاج إلى تحسين (2/5)';
      case 1: return 'غير مرضٍ (1/5)';
      default: return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview(booking.id, {
      rating: currentOverall,
      professionalismRating,
      cleanlinessRating,
      punctualityRating,
      comment: comment.trim() || 'خدمة ممتازة وتمريض عالي الجودة والتعقيم.',
      tags: selectedTags,
      wouldRecommend
    });

    setIsSubmitted(true);
  };

  // Reusable Star Rating Row
  const renderStarRow = (
    label: string, 
    subLabel: string, 
    currentValue: number, 
    hoverValue: number | null, 
    onChange: (val: number) => void, 
    onHover: (val: number | null) => void,
    colorClass: string
  ) => {
    const activeValue = hoverValue !== null ? hoverValue : currentValue;

    return (
      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 block">{label}</span>
            <span className="text-[11px] text-slate-500">{subLabel}</span>
          </div>
          <span className="text-[11px] font-bold text-teal-800 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs font-mono">
            {getRatingDescription(activeValue)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5" dir="ltr">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = star <= activeValue;
              return (
                <button
                  type="button"
                  key={star}
                  onClick={() => onChange(star)}
                  onMouseEnter={() => onHover(star)}
                  onMouseLeave={() => onHover(null)}
                  className="p-1 rounded-lg hover:scale-110 active:scale-95 transition-transform focus:outline-none"
                  aria-label={`${star} من 5 نجوم`}
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      isFilled 
                        ? `${colorClass} fill-current drop-shadow-xs` 
                        : 'text-slate-200 hover:text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <span className="text-xs font-extrabold text-slate-700 font-mono">
            {activeValue} / 5
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 text-right shadow-2xl border border-slate-200 my-6 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          title="إغلاق النافذة"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Success / Confirmation Screen */
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block">
                شكراً لمشاركتك رأيك القيّم
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                تم استلام تقييم الزيارة بنجاح!
              </h3>
            </div>

            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              تم توثيق تقييمك وحفظه مباشرة في السجل المهني للممرض <strong>{booking.caregiverName}</strong>، وساهم في تعزيز نقاط الالتزام وجودة الرعاية داخل منظومة <strong>Passant Nursing</strong>.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 inline-block text-center space-y-1 min-w-[240px]">
              <div className="flex items-center justify-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.round(currentOverall) ? 'fill-current' : 'text-slate-200'}`} 
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800 block">
                متوسط التقييم الممنوح: {currentOverall} من 5 نجوم
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold block">
                تم إضافة 50 نقطة ولاء إلى حسابك الطبي
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                إغلاق والعودة للسجل
              </button>
            </div>
          </div>
        ) : (
          /* Active Review Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header Badge */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>تقييم فوري للزيارة التمريضية المكتملة</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                كيف كانت تجربتك مع مقدم الرعاية؟
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                أغلق الممرض الزيارة للتو. رأيك يساعدنا على مكافأة المتميزين وضمان أعلى معايير الأمان الطبي.
              </p>
            </div>

            {/* Nurse & Visit Summary Card */}
            <div className="bg-teal-50/60 p-3.5 rounded-2xl border border-teal-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={booking.caregiverAvatar}
                  alt={booking.caregiverName}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {booking.caregiverName}
                  </h3>
                  <span className="text-[11px] text-teal-800 font-medium block">
                    {booking.serviceTitle}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    كود الزيارة: {booking.id}
                  </span>
                </div>
              </div>

              {/* Overall Calculated Badge */}
              <div className="bg-white px-3 py-1.5 rounded-xl border border-teal-200 text-center shadow-2xs">
                <div className="flex items-center justify-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-sm font-extrabold text-slate-900 font-mono">
                    {currentOverall}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 block">التقييم الإجمالي</span>
              </div>
            </div>

            {/* 3 Explicit Rating Categories */}
            <div className="space-y-3">
              {/* 1. Professionalism */}
              {renderStarRow(
                '1. الاحترافية والمهارة التمريضية',
                'الكفاءة في سحب العينات، تركيب الكانيولا أو الحجامة، والتعامل الطبي المحترف',
                professionalismRating,
                hoverProf,
                setProfessionalismRating,
                setHoverProf,
                'text-amber-500'
              )}

              {/* 2. Cleanliness & Sterilization */}
              {renderStarRow(
                '2. النظافة والتعقيم وسلامة الأدوات',
                'استخدام أدوات معقمة أحادية الاستخدام، ارتداء القفازات والكمامة، وتطهير الموقع',
                cleanlinessRating,
                hoverClean,
                setCleanlinessRating,
                setHoverClean,
                'text-emerald-500'
              )}

              {/* 3. Punctuality */}
              {renderStarRow(
                '3. الالتزام بالوقت والمواعيد',
                'الوصول في التوقيت المحدد، سرعة الاستجابة، والتواصل قبل التحرك',
                punctualityRating,
                hoverPunct,
                setPunctualityRating,
                setHoverPunct,
                'text-sky-500'
              )}
            </div>

            {/* Quick Compliment Tags */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                مزايا لاحظتها خلال الزيارة (اختياري):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        isSelected
                          ? 'bg-teal-700 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Text Feedback Field (حقل الملاحظات النصية) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                  <span>ملاحظاتك وتقييمك النصي للخدمة:</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {comment.length} / 500
                </span>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                rows={3}
                placeholder="اكتب انطباعك عن أسلوب الممرض، دقته، مدى ارتياح المريض، أو أي ملاحظات ترغب في إيصالها لإدارة التمريض..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Would Recommend Toggle */}
            <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={wouldRecommend}
                onChange={(e) => setWouldRecommend(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded-md focus:ring-teal-500 accent-teal-600"
              />
              <span className="text-xs text-slate-700 font-medium">
                أوصي بهذا الممرض لمرضى آخرين ولزيارات عائلتي القادمة 👍
              </span>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>إرسال التقييم واعتماده فوراً</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-colors"
              >
                تخطي الآن
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
