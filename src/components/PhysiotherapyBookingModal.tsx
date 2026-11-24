import React, { useState, useEffect } from 'react';
import { 
  Caregiver, 
  ServiceItem, 
  BookingOrder, 
  UserProfile,
  AdminOrderStatus,
  PhysiotherapyBookingDetails
} from '../types';
import { 
  X, 
  Activity, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  User, 
  Phone, 
  Check, 
  Info, 
  Calendar, 
  Clock, 
  Zap, 
  ExternalLink,
  Flame,
  FileText,
  Users,
  ShieldCheck,
  Stethoscope,
  Sparkles
} from 'lucide-react';
import { GoogleMapsPickerModal } from './GoogleMapsPickerModal';
import { PaymentMethodSection, OFFICIAL_PAYMENT_NUMBER } from './PaymentMethodSection';

interface PhysiotherapyBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  caregivers: Caregiver[];
  currentUser?: UserProfile;
  service?: ServiceItem;
  physioService?: ServiceItem;
  onConfirmBooking: (newBooking: BookingOrder) => void;
}

const EGYPT_GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'القليوبية',
  'الشرقية',
  'الدقهلية',
  'الغربية',
  'المنوفية',
  'البحيرة',
  'كفر الشيخ',
  'دمياط',
  'بورسعيد',
  'الإسماعيلية',
  'السويس',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'البحر الأحمر',
  'مطروح',
  'الوادي الجديد',
  'شمال سيناء',
  'جنوب سيناء'
];

const CONDITION_CATEGORIES: Array<{
  id: PhysiotherapyBookingDetails['conditionCategory'];
  title: string;
  desc: string;
  icon: string;
}> = [
  {
    id: 'تأهيل جلطات ومخ وأعصاب (Stroke & Neuro Rehab)',
    title: 'تأهيل جلطات ومخ وأعصاب',
    desc: 'شلل نصفي، جلطات دماغية، نزيف مخ، تدريب حركي وتحفيز عصبي',
    icon: '🧠'
  },
  {
    id: 'غضاريف وعمود فقري وآلام الظهر والرقبة (Disc & Spine)',
    title: 'غضاريف وعمود فقري ورقبة',
    desc: 'انزلاق غضروفي، عرق النسا، خشونة وفقرات قطنية وعنقية',
    icon: '🦴'
  },
  {
    id: 'تأهيل ما بعد الكسور والعمليات وتغيير المفاصل (Post-Op & Fractures)',
    title: 'ما بعد الكسور وتغيير المفاصل',
    desc: 'تأهيل تغيير مفصل الركبة والحوض، ما بعد فك الجبس والشرائح والمسامير',
    icon: '🩼'
  },
  {
    id: 'علاج طبيعي لشلل العصب السابع والوجه (Bell\'s Palsy)',
    title: 'علاج طبيعي لشلل العصب السابع',
    desc: 'شلل الوجه، تنبيه كهربائي للعضلات، تمارين تعبيرية وتدليك ميكرو',
    icon: '⚡'
  },
  {
    id: 'تأهيل كبار السن وحالات الاتزان والمشية (Geriatric Balance)',
    title: 'تأهيل كبار السن والاتزان الحركي',
    desc: 'الوقاية من السقوط، تقوية العضلات الضعيفة، واستعادة المشية الآمنة',
    icon: '🚶'
  },
  {
    id: 'إصابات ملاعب وتمزق أربطة وغضاريف الركبة (Sports Injuries)',
    title: 'إصابات ملاعب وأربطة وغضاريف',
    desc: 'رباط صليبي، تمزق عضلي، التواء الكاحل، وإعادة التأهيل البدني',
    icon: '⚽'
  },
  {
    id: 'علاج طبيعي للأطفال وحالات الشلل الدماغي (Pediatric Rehab)',
    title: 'علاج طبيعي للأطفال والشلل الدماغي',
    desc: 'تأخر نمو حركي، ضمور عضلات، تمارين متخصصة لتحسين الحركة',
    icon: '👶'
  }
];

const MOBILITY_STATUS_OPTIONS: Array<{
  id: PhysiotherapyBookingDetails['mobilityStatus'];
  label: string;
  badge: string;
}> = [
  {
    id: 'طريح الفراش بالكامل (غير قادر على الحركة)',
    label: 'طريح الفراش بالكامل (غير قادر على الحركة بمفرده)',
    badge: 'يتطلب رعاية حركية خاصة وتمارين بالفراش'
  },
  {
    id: 'يتحرك بمساعدة مشاية أو عكاز أو مرافق',
    label: 'يتحرك بمساعدة مشاية أو عكاز أو مساندة مرافق',
    badge: 'يحتاج تدريب على الاتزان وتقوية الأطراف'
  },
  {
    id: 'يتحرك ذاتياً مع وجود ألم شديد وتيبس بالحركة',
    label: 'يتحرك ذاتياً مع وجود صعوبة وألم وتيبس بالمفاصل',
    badge: 'جلسات تسكين ألم واستعادة مرونة الحركة'
  }
];

const AVAILABLE_DEVICES = [
  'جهاز تنبيه كهربائي ومسكن للألم (TENS / EMS)',
  'جهاز موجات فوق صوتية علاجية (Therapeutic Ultrasound)',
  'كمادات حرارية علاجية وأشعة تحت حمراء',
  'جهاز مساج اهتزازي عميق وتصريف ليمفاوي',
  'أشرطة التثبيت الحركي الطبية (Kinesiology Taping)',
  'أحزمة شد فقرات وأدوات تمارين المقاومة المتنقلة'
];

export const PhysiotherapyBookingModal: React.FC<PhysiotherapyBookingModalProps> = ({
  isOpen,
  onClose,
  caregivers,
  currentUser,
  service,
  physioService,
  onConfirmBooking
}) => {
  const activeService = service || physioService;
  // 1. بيانات المريض الأساسية
  const [patientName, setPatientName] = useState(currentUser?.patientName || currentUser?.fullName || '');
  const [age, setAge] = useState<number | ''>(currentUser?.age || 55);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [relationship, setRelationship] = useState(currentUser?.relationshipToPatient || 'المريض نفسه');

  // 2. العنوان وموقع الخريطة
  const [governorate, setGovernorate] = useState(currentUser?.governorate || 'القاهرة');
  const [detailedAddress, setDetailedAddress] = useState(currentUser?.address || '');
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number; addressName: string }>(
    currentUser?.locationCoordinates || { lat: 0, lng: 0, addressName: '' }
  );
  const [isLocationConfirmed, setIsLocationConfirmed] = useState<boolean>(
    Boolean(currentUser?.locationCoordinates?.lat && currentUser.locationCoordinates.lat !== 0 && currentUser.locationCoordinates.addressName)
  );
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [showGoogleMapsModal, setShowGoogleMapsModal] = useState(false);
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>(
    currentUser?.locationCoordinates?.lat ? `https://www.google.com/maps?q=${currentUser.locationCoordinates.lat},${currentUser.locationCoordinates.lng}` : ''
  );

  // 3. أسئلة العلاج الطبيعي التخصصية
  const [conditionCategory, setConditionCategory] = useState<PhysiotherapyBookingDetails['conditionCategory']>(
    'تأهيل جلطات ومخ وأعصاب (Stroke & Neuro Rehab)'
  );
  const [mobilityStatus, setMobilityStatus] = useState<PhysiotherapyBookingDetails['mobilityStatus']>(
    'يتحرك بمساعدة مشاية أو عكاز أو مرافق'
  );
  const [affectedBodyParts, setAffectedBodyParts] = useState<string>('الجانب الأيمن (ذراع ورجل) وصعوبة بالتوازن');
  const [sessionGoal, setSessionGoal] = useState<string>('استعادة المشي وتقوية عضلات الساق وتخفيف التيبس العضلي');
  const [medicalDiagnosisNotes, setMedicalDiagnosisNotes] = useState<string>('');
  const [hasTraumaticFractureOrPins, setHasTraumaticFractureOrPins] = useState<boolean>(false);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([
    'جهاز تنبيه كهربائي ومسكن للألم (TENS / EMS)',
    'جهاز موجات فوق صوتية علاجية (Therapeutic Ultrasound)'
  ]);
  const [sessionFrequency, setSessionFrequency] = useState<PhysiotherapyBookingDetails['sessionFrequency']>(
    'جلسة تقييم وتأهيل فردية'
  );

  // 4. طلب مساعد أو متدرب مصاحب للأخصائي
  const [requestAssistant, setRequestAssistant] = useState<boolean>(false);
  const [assistantNote, setAssistantNote] = useState<string>('مطلوب مساعد متدرب لمعاونة دكتور العلاج الطبيعي في رفع المريض وتطبيق التمارين بأمان تام');

  // 5. الموعد والتوقيت
  const [visitDate, setVisitDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [timingChoice, setTimingChoice] = useState<'تحديد معاد' | 'فوري' | 'مستعجل'>('تحديد معاد');
  const [preferredTime, setPreferredTime] = useState<string>('12:00 م - 02:00 م');

  // طريقة الدفع المعتمدة (إنستاباي أو فودافون كاش)
  const [paymentMethod, setPaymentMethod] = useState<'instapay' | 'vodafone_cash'>('instapay');
  const [transactionRef, setTransactionRef] = useState<string>('');

  // 6. التحقق والتقديم
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedBooking, setSubmittedBooking] = useState<BookingOrder | null>(null);

  // مزامنة البيانات مع البروفايل
  useEffect(() => {
    if (currentUser?.fullName) {
      setPatientName(currentUser.fullName);
    }
    if (currentUser?.phone) {
      setPhone(currentUser.phone);
    }
    if (currentUser?.age) {
      setAge(currentUser.age);
    }
    if (currentUser?.address) {
      setDetailedAddress(currentUser.address);
    }
    if (currentUser?.governorate) {
      setGovernorate(currentUser.governorate);
    }
    if (currentUser?.locationCoordinates) {
      setGpsLocation(currentUser.locationCoordinates);
      setGoogleMapsUrl(`https://www.google.com/maps?q=${currentUser.locationCoordinates.lat},${currentUser.locationCoordinates.lng}`);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const toggleDevice = (dev: string) => {
    setSelectedDevices(prev => 
      prev.includes(dev) ? prev.filter(d => d !== dev) : [...prev, dev]
    );
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('خدمة تحديد الموقع الجغرافي غير مدعومة في متصفحك.');
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newCoords = {
          lat: latitude,
          lng: longitude,
          addressName: `الموقع الجغرافي المباشر (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
        };
        setGpsLocation(newCoords);
        setGoogleMapsUrl(`https://www.google.com/maps?q=${latitude},${longitude}`);
        setIsLocationConfirmed(true);
        setIsDetectingGps(false);
      },
      () => {
        setIsDetectingGps(false);
        alert('تعذر جلب موقعك بدقة، يرجى تحديده عبر الخريطة التفاعلية.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!patientName.trim()) newErrors.patientName = 'يرجى إدخال اسم المريض ثلاثي';
    if (!phone.trim()) {
      newErrors.phone = 'يرجى إدخال رقم الهاتف للتواصل والواتساب';
    } else if (!/^01[0125][0-9]{8}$/.test(phone.trim().replace(/\s+/g, ''))) {
      newErrors.phone = 'يرجى إدخال رقم هاتف مصري صحيح يبدأ بـ 01 ويتكون من 11 رقم';
    }
    if (!detailedAddress.trim()) newErrors.detailedAddress = 'يرجى كتابة العنوان بالتفصيل وملاحظات الوصول';
    if (!isLocationConfirmed || !gpsLocation.lat || gpsLocation.lat === 0 || !googleMapsUrl || !gpsLocation.addressName) {
      newErrors.gpsLocation = 'تحديد اللوكيشن وتثبيته عبر خريطة جوجل أو الـ GPS إلزامي لتأكيد الزيارة';
    }
    if (!affectedBodyParts.trim()) newErrors.affectedBodyParts = 'يرجى تحديد الطرف أو الجزء المصاب المطلوب تأهيله';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // العثور على أخصائي علاج طبيعي مناسب من القائمة إن وجد
    const ptCaregiver = caregivers.find(c => c.role === 'physiotherapist' || c.specialties.some(s => s.includes('طبيعي') || s.includes('تأهيل'))) || caregivers[0];

    const orderId = `ORD-PT-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking: BookingOrder = {
      id: orderId,
      orderNumber: orderId,
      createdAt: new Date().toISOString(),
      serviceId: physioService?.id || 'srv-pt-comprehensive',
      serviceTitle: `جلسة علاج طبيعي وتأهيل حركي منزلي - ${conditionCategory.split('(')[0].trim()}`,
      category: 'physiotherapy',
      orderType: timingChoice === 'مستعجل' ? 'urgent' : 'standard',
      isUrgent: timingChoice === 'مستعجل',
      urgentFee: timingChoice === 'مستعجل' ? 50 : 0,
      caregiverId: ptCaregiver?.id || 'cg-pt-1',
      caregiverName: ptCaregiver?.name || 'د. ماجد سامي (دكتوراه العلاج الطبيعي والتأهيل)',
      caregiverAvatar: ptCaregiver?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
      caregiverPhone: ptCaregiver?.phone || '01099887766',

      visitDate: visitDate,
      timingChoice: timingChoice,
      preferredTime: timingChoice === 'تحديد معاد' ? preferredTime : timingChoice,
      scheduledDate: visitDate,
      scheduledTime: timingChoice === 'تحديد معاد' ? preferredTime : 'خلال أقرب وقت',

      governorate: governorate,
      detailedAddress: detailedAddress,

      hasChronicDiseasesAnswer: 'تم تسجيل تفاصيل الحالة في استبيان العلاج الطبيعي',
      currentMedicationsAnswer: 'يحددها الأخصائي أثناء الفحص والتقييم الطبي',
      allergiesOrForbiddenAnswer: 'لا يوجد تحسس جلدي من أدوات المساج والتنبيه',
      previousSurgeriesAnswer: hasTraumaticFractureOrPins ? 'يوجد شرائح/مسامير أو جراحة سابقة' : 'لا توجد جراحات تعيق التأهيل',
      hasPreviousSurgeries: hasTraumaticFractureOrPins,
      medicationAvailableAtHome: true,

      isPhysiotherapyOrder: true,
      physiotherapyDetails: {
        conditionCategory: conditionCategory,
        mobilityStatus: mobilityStatus,
        affectedBodyParts: affectedBodyParts,
        sessionGoal: sessionGoal,
        requiredDevices: selectedDevices,
        sessionFrequency: sessionFrequency,
        medicalDiagnosisNotes: medicalDiagnosisNotes,
        hasTraumaticFractureOrPins: hasTraumaticFractureOrPins,
        accompanyingAssistantRequested: requestAssistant,
        assistantNote: requestAssistant ? assistantNote : undefined,
        directPricingAgreed: true
      },

      assistantRequested: requestAssistant ? {
        requested: true,
        track: 'physiotherapy',
        note: assistantNote,
        companionGender: gender
      } : undefined,

      adminStatus: 'جديد' as AdminOrderStatus,

      patient: {
        fullName: patientName,
        phone: phone,
        age: Number(age) || 50,
        address: `${governorate} - ${detailedAddress}`,
        governorate: governorate,
        locationCoordinates: gpsLocation,
        chronicDiseases: conditionCategory,
        forbiddenMedications: 'لا يوجد',
        hasPreviousSurgeries: hasTraumaticFractureOrPins,
        previousSurgeries: hasTraumaticFractureOrPins ? 'جراحة عظام أو مخ وأعصاب سابقة' : 'لا يوجد',
        medicationAvailable: true,
        medicalReports: ['تشخيص وتقييم دكتور العلاج الطبيعي'],
        preferredCaregiverGender: gender === 'female' ? 'female' : 'any'
      },

      status: 'pending_acceptance',
      payment: {
        method: paymentMethod,
        status: 'pending',
        amount: 350, // سعر جلسة العلاج الطبيعي المحدد ببروفايل الطبيب
        baseAmount: 350,
        invoiceNumber: `INV-PT-${Date.now().toString().slice(-6)}`,
        walletNumber: OFFICIAL_PAYMENT_NUMBER,
        transactionRef: transactionRef.trim() || undefined
      },
      googleMapsUrl: googleMapsUrl,
      liveTracking: {
        estimatedArrivalMinutes: 25,
        currentStage: 0,
        lastUpdated: 'تم إرسال طلب العلاج الطبيعي بنجاح، جاري المراجعة وتوجيه الأخصائي',
        isLiveLocationActive: false,
        riskProtectionEnabled: true,
        patientCoordinates: gpsLocation
      }
    };

    setSubmittedBooking(newBooking);
    onConfirmBooking(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden text-right flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="absolute left-4 top-4 p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-300" />
              <span>قسم العلاج الطبيعي والتأهيل الحركي المنزلي</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-400/30">
              دكاترة وأخصائيون مرخصون
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            طلب زيارة علاج طبيعي وتأهيل حركي منزلي
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1 leading-relaxed">
            استمارة طبية تخصصية لتشخيص الحالة الحركية وتجهيز الأجهزة المحمولة المطلوبة (تنبيه كهربائي، موجات فوق صوتية، تمارين تأهيلية) مع إمكانية مرافقة مساعد متدرب.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {submittedBooking ? (
            <div className="text-center py-8 space-y-5 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">تم تسجيل طلب جلسة العلاج الطبيعي بنجاح!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  تم إرسال طلبك برقم <strong className="font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">{submittedBooking.orderNumber}</strong>. يتواصل معك دكتور العلاج الطبيعي لتأكيد الموعد المناسب وتفاصيل الأجهزة.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-md mx-auto text-xs space-y-2 text-right">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">اسم المريض:</span>
                  <span className="font-bold text-slate-900">{submittedBooking.patient.fullName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">التصنيف الحركي:</span>
                  <span className="font-bold text-teal-800">{submittedBooking.physiotherapyDetails?.conditionCategory.split('(')[0]}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">مساعد متدرب مرافق:</span>
                  <span className="font-bold text-slate-800">
                    {submittedBooking.physiotherapyDetails?.accompanyingAssistantRequested ? 'نعم، تم طلب مساعد لمعاونة الطبيب' : 'لا، الطبيب فقط'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-medium">سعر الجلسة / الكورس:</span>
                  <span className="font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    بالاتفاق المباشر بين الأخصائي والمريض
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  إغلاق ومتابعة التتبع الحي
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* 1. بيانات المريض للتواصل */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 text-slate-900 font-bold text-sm">
                  <User className="w-4 h-4 text-teal-600" />
                  <span>1. البيانات الشخصية ومعلومات المريض</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      اسم المريض بالكامل <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="مثال: محمد عبد العزيز أحمد"
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 transition-colors text-right ${
                        errors.patientName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    {errors.patientName && <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.patientName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      رقم الهاتف والتواصل / واتساب <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01xxxxxxxxx"
                      dir="ltr"
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 transition-colors text-right font-mono ${
                        errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    {errors.phone && <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">عمر المريض (سنوات)</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                      placeholder="مثال: 58"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 transition-colors text-right font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">صلة القرابة بمقدم الطلب</label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 transition-colors text-right"
                    >
                      <option value="المريض نفسه">المريض نفسه</option>
                      <option value="الوالد / الوالدة">الوالد / الوالدة</option>
                      <option value="الزوج / الزوجة">الزوج / الزوجة</option>
                      <option value="الابن / الابنة">الابن / الابنة</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. عنوان الزيارة وموقع GPS خرائط جوجل */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 text-slate-900 font-bold text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    <span>2. عنوان الزيارة المنزلية وتحديد الموقع بدقة</span>
                  </div>
                  <span className="text-[11px] font-normal text-slate-500">لضمان وصول الدكتور في الميعاد المحدد</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">المحافظة</label>
                    <select
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 transition-colors text-right"
                    >
                      {EGYPT_GOVERNORATES.map(gov => (
                        <option key={gov} value={gov}>{gov}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      المنطقة، الشارع، رقم العمارة والشقة <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={detailedAddress}
                      onChange={(e) => setDetailedAddress(e.target.value)}
                      placeholder="مثال: المعادي الجديدة، شارع النصر، عمارة 14 الدور الثالث، بجوار مسجد الفاروق"
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 transition-colors text-right ${
                        errors.detailedAddress ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    {errors.detailedAddress && <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.detailedAddress}</p>}
                  </div>
                </div>

                {/* Google Maps Pin & GPS Locator (إلزامي لكل طلب) */}
                <div className={`p-3.5 bg-white rounded-xl border transition-all space-y-2.5 ${
                  errors.gpsLocation 
                    ? 'border-rose-400 bg-rose-50/20 shadow-xs' 
                    : isLocationConfirmed 
                    ? 'border-emerald-300 bg-emerald-50/20' 
                    : 'border-amber-300 bg-amber-50/30'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isLocationConfirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        <Navigation className={`w-4 h-4 ${isLocationConfirmed ? 'text-emerald-700' : 'text-amber-700'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 block">نقطة الموقع الجغرافي واللوكيشن:</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            isLocationConfirmed 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                              : 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                          }`}>
                            {isLocationConfirmed ? 'تم تأكيد وتثبيت الموقع ✅' : 'مطلوب إلزامي ⚠️'}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-600 font-mono block mt-0.5">
                          {isLocationConfirmed && gpsLocation.addressName 
                            ? gpsLocation.addressName 
                            : 'اضغط على (تحديد بالخريطة) أو (موقعي الحالي) لإلزامية تثبيت اللوكيشن'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleGetCurrentLocation}
                        disabled={isDetectingGps}
                        className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg font-bold border border-teal-200 transition-colors flex items-center gap-1.5 text-xs"
                      >
                        <Navigation className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
                        <span>{isDetectingGps ? 'جاري التحديد...' : 'موقعي الحالي'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowGoogleMapsModal(true)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs transition-colors flex items-center gap-1.5 text-xs"
                      >
                        <MapPin className="w-3.5 h-3.5 text-white" />
                        <span>تحديد بالخريطة (Google Maps)</span>
                      </button>

                      {googleMapsUrl && isLocationConfirmed && (
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-teal-700 hover:text-teal-900 transition-colors"
                          title="فتح في Google Maps"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {errors.gpsLocation && (
                    <p className="text-[11px] text-rose-600 font-bold bg-rose-50 p-2 rounded-lg border border-rose-200">
                      ⚠️ {errors.gpsLocation}
                    </p>
                  )}
                </div>
              </div>

              {/* 3. استبيان الحالة الحركية للعلاج الطبيعي (Specialized PT Questionnaire) */}
              <div className="bg-gradient-to-br from-teal-50/60 via-white to-blue-50/40 p-4 sm:p-5 rounded-2xl border border-teal-200 space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-teal-200 text-teal-950 font-bold text-sm">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-teal-700" />
                    <span>3. تشخيص الحالة السابق</span>
                  </div>
                </div>

                {/* أ- تصنيف الحالة المرضية */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    أ) نوع الحالة والتشخيص الطبي المستهدف:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CONDITION_CATEGORIES.map((cat) => {
                      const isSelected = conditionCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setConditionCategory(cat.id)}
                          className={`p-3 rounded-xl border text-right transition-all flex items-start gap-2.5 ${
                            isSelected 
                              ? 'bg-teal-600 text-white border-teal-700 shadow-xs' 
                              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                          }`}
                        >
                          <span className="text-xl shrink-0 mt-0.5">{cat.icon}</span>
                          <div className="flex-1">
                            <span className="font-bold text-xs block">{cat.title}</span>
                            <span className={`text-[10px] block mt-0.5 leading-snug ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                              {cat.desc}
                            </span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ب- القدرة الحركية الحالية */}
                <div className="space-y-2 pt-2 border-t border-teal-100">
                  <label className="block text-xs font-bold text-slate-800">
                    ب) القدرة الحركية الحالية للمريض:
                  </label>
                  <div className="space-y-2">
                    {MOBILITY_STATUS_OPTIONS.map((opt) => {
                      const isSelected = mobilityStatus === opt.id;
                      return (
                        <label
                          key={opt.id}
                          onClick={() => setMobilityStatus(opt.id)}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-teal-50 border-teal-500 text-teal-950 font-bold shadow-2xs' 
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="mobilityStatus"
                              checked={isSelected}
                              onChange={() => setMobilityStatus(opt.id)}
                              className="text-teal-600 focus:ring-teal-500 w-4 h-4"
                            />
                            <span className="text-xs">{opt.label}</span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-teal-200/60 text-teal-900 font-semibold' : 'bg-slate-100 text-slate-500'}`}>
                            {opt.badge}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* ج- الطرف المصاب والهدف من الجلسة */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-teal-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      الطرف أو الجزء المصاب <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={affectedBodyParts}
                      onChange={(e) => setAffectedBodyParts(e.target.value)}
                      placeholder="مثال: الشلل النصفي الأيمن / الركبة اليسرى / الفقرات القطنية"
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 transition-colors text-right ${
                        errors.affectedBodyParts ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    {errors.affectedBodyParts && <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.affectedBodyParts}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      الهدف الأساسي من الجلسة
                    </label>
                    <input
                      type="text"
                      value={sessionGoal}
                      onChange={(e) => setSessionGoal(e.target.value)}
                      placeholder="مثال: استعادة المشي، تخفيف التيبس، تسكين ألم العصب"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 transition-colors text-right"
                    />
                  </div>
                </div>

                {/* د- ملاحظات الجراحة والشرائح والمسامير */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      هل خضع المريض لجراحة حديثة أو تم تركيب شرائح ومسامير تثبيت؟
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setHasTraumaticFractureOrPins(true)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          hasTraumaticFractureOrPins ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        نعم يوجد
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasTraumaticFractureOrPins(false)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          !hasTraumaticFractureOrPins ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        لا يوجد
                      </button>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={medicalDiagnosisNotes}
                      onChange={(e) => setMedicalDiagnosisNotes(e.target.value)}
                      placeholder="أي ملاحظات من طبيب العظام أو المخ والأعصاب، أو تاريخ العملية الجراحية..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-500 text-right"
                    />
                  </div>
                </div>

                {/* هـ- الأجهزة المحمولة المطلوبة بالجلسة */}
                <div className="space-y-2 pt-2 border-t border-teal-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      الأجهزة والمستلزمات المحمولة المطلوبة في الجلسة:
                    </label>
                    <span className="text-[10px] text-teal-700">يحضرها الأخصائي معه بالكامل</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AVAILABLE_DEVICES.map((device) => {
                      const isChecked = selectedDevices.includes(device);
                      return (
                        <button
                          key={device}
                          type="button"
                          onClick={() => toggleDevice(device)}
                          className={`p-2.5 rounded-xl border text-right text-xs transition-all flex items-center justify-between ${
                            isChecked 
                              ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold' 
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{device}</span>
                          <span className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                            isChecked ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                          }`}>
                            {isChecked && <Check className="w-3 h-3" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* 4. ميزة طلب مساعد أو متدرب مصاحب للأخصائي (New Role Feature!) */}
              <div className="bg-amber-50/70 p-4 sm:p-5 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-700" />
                      <h4 className="font-extrabold text-amber-950 text-sm">
                        طلب مساعد / متدرب مرافق مع دكتور العلاج الطبيعي
                      </h4>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      هل ترغب في حضور مساعد أو متدرب معتمد تحت إشراف الدكتور لمعاونته في رفع وتقليب المريض وتكرار التمارين التأهيلية بكفاءة وأمان إضافي؟
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={requestAssistant}
                      onChange={(e) => setRequestAssistant(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                {requestAssistant && (
                  <div className="pt-3 border-t border-amber-200/80 space-y-2 animate-in fade-in duration-200">
                    <label className="block text-xs font-bold text-amber-950">
                      ملاحظات واحتياجات خاصة للمساعد المتدرب:
                    </label>
                    <input
                      type="text"
                      value={assistantNote}
                      onChange={(e) => setAssistantNote(e.target.value)}
                      placeholder="مثال: يفضل مساعد قوي البنية للمساعدة في رفع المريض والتدريب على المشاية"
                      className="w-full px-3.5 py-2 bg-white border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-600 text-right"
                    />
                    <div className="flex items-center gap-2 text-[11px] text-amber-800 bg-amber-100/70 p-2 rounded-lg">
                      <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>المساعدون والمتدربون معتمدون من كليات ومعاهد العلاج الطبيعي والتمريض ويعملون تحت إشراف الطبيب المسؤول مباشرة.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. موعد وتوقيت الزيارة */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-900 font-bold text-sm">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>5. موعد وتوقيت جلسة العلاج الطبيعي</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">تاريخ الزيارة</label>
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">طبيعة التوقيت</label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-200 p-1 rounded-xl text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setTimingChoice('تحديد معاد')}
                        className={`py-1.5 rounded-lg transition-all ${
                          timingChoice === 'تحديد معاد' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        ميعاد
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimingChoice('فوري')}
                        className={`py-1.5 rounded-lg transition-all ${
                          timingChoice === 'فوري' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        فوري
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimingChoice('مستعجل')}
                        className={`py-1.5 rounded-lg transition-all ${
                          timingChoice === 'مستعجل' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        مستعجل
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">الفترة الزمنية المفضلة</label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      disabled={timingChoice !== 'تحديد معاد'}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 text-right disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="09:00 ص - 11:00 ص">صباحاً (09:00 ص - 11:00 ص)</option>
                      <option value="11:00 ص - 01:00 م">ظهراً (11:00 ص - 01:00 م)</option>
                      <option value="01:00 م - 04:00 م">بعد الظهر (01:00 م - 04:00 م)</option>
                      <option value="04:00 م - 07:00 م">عصراً (04:00 م - 07:00 م)</option>
                      <option value="07:00 م - 10:00 م">مساءً (07:00 م - 10:00 م)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* تسعيرة جلسة العلاج الطبيعي محددة بواسطة الدكتور على بروفايله */}
              <div className="p-4 bg-gradient-to-r from-blue-50 via-teal-50/50 to-blue-50 rounded-2xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-950">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                    ⚡
                  </div>
                  <div>
                    <span className="font-bold text-blue-950 block text-xs sm:text-sm">سعر جلسة العلاج الطبيعي والتأهيل:</span>
                    <span className="text-[11px] text-blue-700">يتم تحديد السعر رسمياً من دكتور العلاج الطبيعي على بروفايله الخاص</span>
                  </div>
                </div>
                <div className="text-right sm:text-left bg-white px-3.5 py-1.5 rounded-xl border border-blue-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block font-semibold">سعر الجلسة في ملف الطبيب:</span>
                  <span className="text-sm font-black text-blue-900 font-mono">
                    350 جنيه / جلسة
                  </span>
                </div>
              </div>

              {/* طريقة الدفع المعتمدة */}
              <PaymentMethodSection
                paymentMethod={paymentMethod}
                onSelectMethod={setPaymentMethod}
                transactionRef={transactionRef}
                onChangeTransactionRef={setTransactionRef}
                accent="blue"
              />

              {/* Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>تأكيد طلب جلسة العلاج الطبيعي والتأهيل</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

      {/* Google Maps Interactive Pin Picker Modal */}
      {showGoogleMapsModal && (
        <GoogleMapsPickerModal
          initialCoordinates={gpsLocation}
          initialGovernorate={governorate}
          onClose={() => setShowGoogleMapsModal(false)}
          onSelectLocation={(location) => {
            setGpsLocation({ lat: location.lat, lng: location.lng, addressName: location.addressName });
            setGoogleMapsUrl(location.googleMapsUrl);
            setIsLocationConfirmed(true);
            if (location.addressName && !detailedAddress) {
              setDetailedAddress(location.addressName);
            }
            setShowGoogleMapsModal(false);
          }}
        />
      )}
    </div>
  );
};
