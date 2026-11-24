import React, { useState, useEffect } from 'react';
import { 
  Caregiver, 
  ServiceItem, 
  BookingOrder, 
  UserProfile,
  AdminOrderStatus 
} from '../types';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Navigation, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  Phone, 
  Check, 
  Info, 
  Home, 
  Building2,
  Calendar,
  Clock,
  HeartPulse,
  Droplet,
  ExternalLink
} from 'lucide-react';
import { GoogleMapsPickerModal } from './GoogleMapsPickerModal';
import { PaymentMethodSection, OFFICIAL_PAYMENT_NUMBER } from './PaymentMethodSection';

interface CuppingBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  caregivers: Caregiver[];
  currentUser?: UserProfile;
  cuppingService?: ServiceItem;
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

const CUPPING_TYPES = [
  { id: 'wet', label: 'حجامة دموية (رطبة)', desc: 'تشريط سطحي دقيق لإخراج الأخلاط الدموية (تتطلب عدم وجود سيولة أو أمراض مزمنة)' },
  { id: 'dry', label: 'حجامة جافة (كؤوس هواء)', desc: 'تحفيز الدورة الدموية وتسكين آلام العضلات والمفاصل دون أي تشريط (آمنة تماماً)' },
  { id: 'massage', label: 'حجامة مساج / متزحلقة', desc: 'تدليك علاجي بكؤوس الهواء وزيوت طبيعية لتليين العضلات والأوتار' },
  { id: 'preventive', label: 'حجامة وقائية عامة', desc: 'نقاط وقائية كلاسيكية لدعم مناعة الجسم والتخلص من الإجهاد العام' },
  { id: 'therapeutic', label: 'حجامة علاجية متخصصة', desc: 'تحديد نقاط الألم والأعصاب وفقاً لشكوى المريض تحت إشراف متخصص' }
];

export const CuppingBookingModal: React.FC<CuppingBookingModalProps> = ({
  isOpen,
  onClose,
  caregivers,
  currentUser,
  cuppingService,
  onConfirmBooking
}) => {
  // 1. بيانات الحجز الأساسية
  const [patientName, setPatientName] = useState(currentUser?.patientName || currentUser?.fullName || '');
  const [age, setAge] = useState<number | ''>(currentUser?.age || 38);
  const [gender, setGender] = useState<'ذكر' | 'أنثى'>('ذكر');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  
  // العنوان واللوكيشن الإلزامي
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

  // أسئلة طبية :-
  // هل تعاني من اي ضغط او سكر؟!
  const [hasHypertensionOrDiabetes, setHasHypertensionOrDiabetes] = useState<boolean>(false);
  // هل تعاني سيولة؟!
  const [hasBleedingTendency, setHasBleedingTendency] = useState<boolean>(false);
  // هل لديك اي أمراض تعاني منها؟!
  const [hasOtherDiseases, setHasOtherDiseases] = useState<boolean>(false);
  const [otherDiseasesDetails, setOtherDiseasesDetails] = useState<string>('');
  // هل تعاني من امراض جلدية او جروح في جسمك؟؟
  const [hasSkinDiseasesOrWounds, setHasSkinDiseasesOrWounds] = useState<boolean>(false);
  const [skinDiseasesDetails, setSkinDiseasesDetails] = useState<string>('');
  // متي اخر حجامه سابقة و اي مضاعفات حصلت؟!
  const [lastCuppingAndComplications, setLastCuppingAndComplications] = useState<string>('أول مرة، لا توجد حجامة سابقة');

  // مكان الزيارة؟! (المركز / المنزل)
  const [locationType, setLocationType] = useState<'المركز' | 'المنزل'>('المنزل');

  // نوع الحجامة المطلوبة؟!
  const [cuppingType, setCuppingType] = useState<string>('حجامة دموية (رطبة)');

  // توقيت مقترح
  const [visitDate, setVisitDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [timingNote, setTimingNote] = useState<string>('أقرب موعد متاح اليوم');

  // طريقة الدفع المعتمدة (إنستاباي أو فودافون كاش)
  const [paymentMethod, setPaymentMethod] = useState<'instapay' | 'vodafone_cash'>('instapay');
  const [transactionRef, setTransactionRef] = useState<string>('');

  // Validation & Submission State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedBooking, setSubmittedBooking] = useState<BookingOrder | null>(null);

  // Sync with currentUser profile updates
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
  }, [currentUser]);

  // Mandatory Safety Rule:
  // لو مقدم الطلب يعاني من اي امراض مثل السيولة او ضغط او سكر فهوا لم يفعل حجامة دموية و ستكون حجامه جافه
  const isRestrictedToDryCupping = hasHypertensionOrDiabetes || hasBleedingTendency;

  useEffect(() => {
    if (isRestrictedToDryCupping && cuppingType === 'حجامة دموية (رطبة)') {
      setCuppingType('حجامة جافة (كؤوس هواء)');
    }
  }, [isRestrictedToDryCupping, cuppingType]);

  // GPS detection handler
  const handleDetectGPS = () => {
    setIsDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetectingGps(false);
          const newGps = {
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5)),
            addressName: `تم التقاط الإحداثيات: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
          };
          setGpsLocation(newGps);
          setGoogleMapsUrl(`https://www.google.com/maps?q=${newGps.lat},${newGps.lng}`);
          setIsLocationConfirmed(true);
          if (!detailedAddress) {
            setDetailedAddress(`الموقع الجغرافي المسجل: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          }
        },
        () => {
          setIsDetectingGps(false);
          alert('تعذر جلب موقعك تلقائياً، يرجى تحديده بالخريطة التفاعلية.');
        },
        { enableHighAccuracy: true, timeout: 7000 }
      );
    } else {
      setIsDetectingGps(false);
    }
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!patientName.trim()) {
      newErrors.patientName = 'يرجى كتابة الاسم بالكامل';
    }
    if (!phone.trim()) {
      newErrors.phone = 'يرجى إدخال رقم الهاتف للتواصل';
    }
    if (!age || Number(age) < 10) {
      newErrors.age = 'يرجى إدخال سن صحيح';
    }
    if (!detailedAddress.trim()) {
      newErrors.detailedAddress = 'يرجى إدخال العنوان بالتفصيل';
    }
    if (!isLocationConfirmed || !gpsLocation.lat || gpsLocation.lat === 0 || !gpsLocation.addressName || !googleMapsUrl) {
      newErrors.gpsLocation = 'تحديد اللوكيشن وتثبيته عبر خريطة جوجل أو الـ GPS إلزامي لتأكيد حجز الحجامة';
    }
    if (hasOtherDiseases && !otherDiseasesDetails.trim()) {
      newErrors.otherDiseasesDetails = 'يرجى توضيح الأمراض الأخرى لسلامة الإجراء';
    }
    if (hasSkinDiseasesOrWounds && !skinDiseasesDetails.trim()) {
      newErrors.skinDiseasesDetails = 'يرجى توضيح موضع الأمراض الجلدية أو الجروح';
    }
    if (!lastCuppingAndComplications.trim()) {
      newErrors.lastCuppingAndComplications = 'يرجى الإجابة عن الحجامة السابقة ومضاعفاتها إن وجدت';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    // Find cupping specialist from caregivers
    const cuppingSpecialist = caregivers.find(c => 
      c.specialties.some(s => s.includes('حجامة') || s.includes('العلاج بالرسم') || s.includes('طب تكميلي'))
    ) || caregivers[0];

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `HJ-${Date.now().toString().slice(-4)}`;
    const orderNumber = `HJ-2026-${randomNum}`;

    const effectiveCuppingType = isRestrictedToDryCupping ? 'حجامة جافة (كؤوس هواء)' : cuppingType;
    const finalPrice = cuppingService?.price || 250;

    const newBooking: BookingOrder = {
      id: bookingId,
      orderNumber,
      createdAt: new Date().toISOString(),
      serviceId: cuppingService?.id || 'srv-cupping-home',
      serviceTitle: `طلب حجامة: ${effectiveCuppingType} (${locationType})`,
      category: 'hijama',
      orderType: 'standard',
      isUrgent: false,
      caregiverId: cuppingSpecialist.id,
      caregiverName: cuppingSpecialist.name,
      caregiverAvatar: cuppingSpecialist.avatar,
      caregiverPhone: cuppingSpecialist.phone,
      
      // Scheduling
      visitDate,
      timingChoice: 'تحديد معاد',
      preferredTime: timingNote,
      scheduledDate: visitDate,
      scheduledTime: timingNote,

      // Address
      governorate,
      detailedAddress: locationType === 'المركز' ? 'مقر المركز والعيادة المجهزة' : `${governorate} - ${detailedAddress.trim()}`,

      // Cupping details flag
      isCuppingOrder: true,
      cuppingDetails: {
        hasHypertensionOrDiabetes,
        hasBleedingTendency,
        hasOtherDiseases,
        otherDiseasesDetails: hasOtherDiseases ? otherDiseasesDetails.trim() : undefined,
        hasSkinDiseasesOrWounds,
        skinDiseasesDetails: hasSkinDiseasesOrWounds ? skinDiseasesDetails.trim() : undefined,
        lastCuppingAndComplications: lastCuppingAndComplications.trim(),
        locationType,
        cuppingType: effectiveCuppingType,
        gender,
        isRestrictedToDryCupping
      },

      // Medical questions mapping for admin dashboard compatibility
      hasChronicDiseasesAnswer: hasHypertensionOrDiabetes 
        ? 'يعاني من ضغط أو سكر (تم تقييد الحجامة إلى جافة)' 
        : (hasOtherDiseases ? `أمراض أخرى: ${otherDiseasesDetails}` : 'لا يعاني من ضغط أو سكر أو أمراض أخرى'),
      currentMedicationsAnswer: hasBleedingTendency 
        ? '⚠️ يعاني من سيولة أو أدوية مميعات الدم (تتطلب مراجعة الأخصائي)' 
        : 'لا توجد سيولة مسجلة',
      allergiesOrForbiddenAnswer: hasSkinDiseasesOrWounds 
        ? `⚠️ أمراض جلدية/جروح: ${skinDiseasesDetails}` 
        : 'لا توجد أمراض جلدية أو جروح',
      previousSurgeriesAnswer: `حجامة سابقة ومضاعفاتها: ${lastCuppingAndComplications.trim()}`,
      hasPreviousSurgeries: false,

      medicationAvailableAtHome: true,
      adminStatus: 'جديد' as AdminOrderStatus,

      patient: {
        fullName: patientName.trim(),
        phone: phone.trim(),
        age: Number(age),
        address: locationType === 'المركز' ? 'مقر المركز الرئيسي' : `${governorate} - ${detailedAddress.trim()}`,
        governorate,
        locationCoordinates: gpsLocation,
        chronicDiseases: hasHypertensionOrDiabetes ? 'ضغط أو سكر' : 'لا يوجد',
        currentMedications: hasBleedingTendency ? 'أدوية سيولة / مميعات دم' : 'لا توجد أدوية سيولة',
        forbiddenMedications: hasSkinDiseasesOrWounds ? skinDiseasesDetails : 'لا يوجد',
        hasPreviousSurgeries: false,
        previousSurgeries: `سوابق الحجامة: ${lastCuppingAndComplications.trim()}`,
        medicationAvailable: true,
        medicalReports: [],
        preferredCaregiverGender: gender === 'ذكر' ? 'male' : 'female'
      },
      status: 'pending_acceptance',
      payment: {
        method: paymentMethod,
        status: 'pending',
        amount: finalPrice,
        baseAmount: finalPrice,
        invoiceNumber: `INV-HJ-${randomNum}`,
        walletNumber: OFFICIAL_PAYMENT_NUMBER,
        transactionRef: transactionRef.trim() || undefined
      },
      googleMapsUrl,
      liveTracking: {
        nurseLocation: {
          lat: 30.0444,
          lng: 31.2357,
          addressName: 'تم استلام طلب الحجامة، قيد مراجعة الأخصائي'
        },
        estimatedArrivalMinutes: 30,
        currentStage: 0,
        lastUpdated: 'تم إرسال طلب الحجامة، سيراجع الأخصائي الحالة أولاً',
        patientCoordinates: gpsLocation,
        isLiveLocationActive: false,
        riskProtectionEnabled: true
      }
    };

    setSubmittedBooking(newBooking);
    onConfirmBooking(newBooking);
  };

  // Important: Check isOpen at the end after all hooks to maintain React 19 safety
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto" dir="rtl">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 text-right shadow-2xl border border-amber-200 my-6">
        
        {/* Header - Distinct Cupping Identity */}
        <div className="flex items-start justify-between pb-4 border-b border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  حجز مستقل ومخصص
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">كؤوس معقمة ذات استخدام واحد</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                طلب حجامة طبية
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Screen */}
        {submittedBooking ? (
          <div className="py-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-amber-300 inline-block">
                رقم طلب الحجامة: {submittedBooking.orderNumber || submittedBooking.id}
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                تم استلام طلب الحجامة بنجاح
              </h3>
              
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 max-w-lg mx-auto text-right text-xs space-y-2 text-amber-950">
                <p className="font-bold flex items-center gap-1.5 text-amber-900">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>تنبيه هام ومتابعة طبية:</span>
                </p>
                <p className="leading-relaxed">
                  عدم اعتبار تسجيل الطلب موافقة تلقائية على إجراء الحجامة؛ سيقوم الأخصائي بمراجعة حالتك الصحية وتاريخك الطبي، ومراجعة الأدوية خصوصاً مميعات الدم قبل اعتماد الموعد وتأكيد الزيارة.
                </p>
                {submittedBooking.cuppingDetails?.isRestrictedToDryCupping && (
                  <p className="font-bold text-rose-800 bg-rose-50 p-2 rounded-xl border border-rose-200">
                    ⚠️ نظراً لبيانات الضغط / السكر / السيولة المسجلة، تم اعتماد الجلسة كـ «حجامة جافة» لحمايتك التامة.
                  </p>
                )}
              </div>
            </div>

            {/* Quick summary box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-md mx-auto text-right text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-500">الاسم:</span>
                <span className="font-bold text-slate-900">{submittedBooking.patient.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-500">نوع الحجامة:</span>
                <span className="font-bold text-amber-900">{submittedBooking.cuppingDetails?.cuppingType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-500">مكان الجلسة:</span>
                <span className="font-bold text-slate-900">{submittedBooking.cuppingDetails?.locationType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-500">العنوان:</span>
                <span className="font-bold text-slate-900">{submittedBooking.detailedAddress}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">حالة الطلب:</span>
                <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  قيد مراجعة الأخصائي
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
            >
              تم ومتابعة
            </button>
          </div>
        ) : (
          /* Main Cupping Form */
          <form onSubmit={handleSubmit} className="space-y-6 pt-5">
            
            {/* 1. بيانات المتقدم للطلب (الاسم، السن، النوع، العنوان، اللوكيشن) */}
            <div className="space-y-3 bg-amber-50/40 p-4 rounded-2xl border border-amber-200/80">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-600" />
                <span>البيانات الشخصية</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* الاسم */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    الاسم بالكامل <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="اكتب اسم متلقي الجلسة"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                  {errors.patientName && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.patientName}</p>
                  )}
                </div>

                {/* السن */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    السن <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="مثال: 38"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  {errors.age && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.age}</p>
                  )}
                </div>
              </div>

              {/* النوع ورقم الهاتف */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* النوع */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    النوع <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setGender('ذكر')}
                      className={`py-2 rounded-lg transition-colors text-center ${
                        gender === 'ذكر'
                          ? 'bg-amber-500 text-slate-950 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ذكر
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('أنثى')}
                      className={`py-2 rounded-lg transition-colors text-center ${
                        gender === 'أنثى'
                          ? 'bg-amber-500 text-slate-950 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      أنثى (أخصائية حجامة)
                    </button>
                  </div>
                </div>

                {/* رقم الهاتف */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    رقم الهاتف للتواصل <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010XXXXXXXX"
                      className="w-full pl-3 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 font-mono text-right"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* العنوان واللوكيشن الإلزامي */}
              <div className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                errors.gpsLocation
                  ? 'bg-rose-50/30 border-rose-400'
                  : isLocationConfirmed
                  ? 'bg-emerald-50/20 border-emerald-300'
                  : 'bg-amber-50/40 border-amber-300'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-amber-200/50">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      <span>العنوان واللوكيشن (تثبيت الموقع إلزامي)</span>
                    </label>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      isLocationConfirmed 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                        : 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                    }`}>
                      {isLocationConfirmed ? 'تم تأكيد وتثبيت الموقع ✅' : 'مطلوب إلزامي ⚠️'}
                    </span>
                  </div>
                  
                  {/* أزرار خرائط جوجل و GPS */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowGoogleMapsModal(true)}
                      className="text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded-xl border border-amber-500 flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <MapPin className="w-3.5 h-3.5 text-white" />
                      <span>تحديد الموقع عبر خرائط جوجل (Google Maps)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDetectGPS}
                      className="text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1 transition-colors"
                      title="التقاط تلقائي عبر GPS"
                    >
                      <Navigation className="w-3 h-3 text-amber-700" />
                      <span>{isDetectingGps ? 'جاري التحديد...' : 'GPS'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">المحافظة</label>
                    <select
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    >
                      {EGYPT_GOVERNORATES.map(gov => (
                        <option key={gov} value={gov}>{gov}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] text-slate-600">العنوان بالتفصيل</label>
                      <button
                        type="button"
                        onClick={() => setShowGoogleMapsModal(true)}
                        className="text-[11px] text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1"
                      >
                        <span>تثبيت العنوان على الخريطة</span>
                        <span>📍</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={detailedAddress}
                      onChange={(e) => setDetailedAddress(e.target.value)}
                      placeholder="المنطقة، الشارع، العمارة، الطابق، الشقة"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                    {errors.detailedAddress && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.detailedAddress}</p>
                    )}
                  </div>
                </div>

                {isLocationConfirmed && gpsLocation.addressName && (
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-[11px] text-slate-600">اللوكيشن المعتمد:</span>
                      <strong className="text-emerald-950 font-bold">{gpsLocation.addressName}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">({gpsLocation.lat.toFixed(4)}, {gpsLocation.lng.toFixed(4)})</span>
                    </div>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 underline"
                    >
                      <span>معاينة على خرائط جوجل</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {errors.gpsLocation && (
                  <p className="text-[11px] text-rose-600 font-bold bg-rose-50 p-2 rounded-lg border border-rose-200">
                    ⚠️ {errors.gpsLocation}
                  </p>
                )}
              </div>
            </div>

            {/* 2. أسئلة طبية :- */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  أسئلة طبية لسلامة الإجراء :-
                </h3>
              </div>

              {/* السؤال 1: هل تعاني من اي ضغط او سكر؟! */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    هل تعاني من اي ضغط او سكر؟!
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHasHypertensionOrDiabetes(true)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        hasHypertensionOrDiabetes
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      نعم
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasHypertensionOrDiabetes(false)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        !hasHypertensionOrDiabetes
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      لا
                    </button>
                  </div>
                </div>
              </div>

              {/* السؤال 2: هل تعاني سيولة؟! */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-rose-500" />
                    <span>هل تعاني سيولة؟! (أو تتناول مميعات للدم مثل الأسبرين والماريفان)</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHasBleedingTendency(true)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        hasBleedingTendency
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      نعم
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasBleedingTendency(false)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        !hasBleedingTendency
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      لا
                    </button>
                  </div>
                </div>
              </div>

              {/* السؤال 3: هل لديك اي أمراض تعاني منها؟! */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    هل لديك اي أمراض تعاني منها؟!
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHasOtherDiseases(true)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        hasOtherDiseases
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      نعم
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasOtherDiseases(false)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        !hasOtherDiseases
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      لا
                    </button>
                  </div>
                </div>
                {hasOtherDiseases && (
                  <div className="pt-2">
                    <input
                      type="text"
                      value={otherDiseasesDetails}
                      onChange={(e) => setOtherDiseasesDetails(e.target.value)}
                      placeholder="اذكر نوع الأمراض (مثال: قصور كلوي، أمراض كبدية، مناعة، أخرى)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                    {errors.otherDiseasesDetails && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.otherDiseasesDetails}</p>
                    )}
                  </div>
                )}
              </div>

              {/* السؤال 4: هل تعاني من امراض جلدية او جروح في جسمك؟؟ */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    هل تعاني من امراض جلدية او جروح في جسمك؟؟
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHasSkinDiseasesOrWounds(true)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        hasSkinDiseasesOrWounds
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      نعم
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasSkinDiseasesOrWounds(false)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        !hasSkinDiseasesOrWounds
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      لا
                    </button>
                  </div>
                </div>
                {hasSkinDiseasesOrWounds && (
                  <div className="pt-2">
                    <input
                      type="text"
                      value={skinDiseasesDetails}
                      onChange={(e) => setSkinDiseasesDetails(e.target.value)}
                      placeholder="وضح موضع المرض الجلدي أو الجرح (مثال: صدفية أو إكزيما في الظهر، جرح قديم)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                    {errors.skinDiseasesDetails && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.skinDiseasesDetails}</p>
                    )}
                  </div>
                )}
              </div>

              {/* السؤال 5: متي اخر حجامه سابقة و اي مضاعفات حصلت؟! */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  متي اخر حجامه سابقة و اي مضاعفات حصلت؟!
                </label>
                <input
                  type="text"
                  value={lastCuppingAndComplications}
                  onChange={(e) => setLastCuppingAndComplications(e.target.value)}
                  placeholder="مثال: أول مرة، أو: منذ 5 شهور ولم تحدث أي مضاعفات"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
                {errors.lastCuppingAndComplications && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.lastCuppingAndComplications}</p>
                )}
              </div>
            </div>

            {/* 3. مكان الزيارة؟! (المركز / المنزل) */}
            <div className="space-y-2 p-4 bg-amber-50/50 rounded-2xl border border-amber-200">
              <label className="block text-xs sm:text-sm font-bold text-slate-900">
                مكان الزيارة؟!
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLocationType('المركز')}
                  className={`p-3.5 rounded-xl border-2 transition-all flex items-center justify-center gap-2.5 text-xs font-bold ${
                    locationType === 'المركز'
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>المركز (عيادتنا المجهزة)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLocationType('المنزل')}
                  className={`p-3.5 rounded-xl border-2 transition-all flex items-center justify-center gap-2.5 text-xs font-bold ${
                    locationType === 'المنزل'
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>المنزل (جلسة معقمة في بيتك)</span>
                </button>
              </div>
            </div>

            {/* 4. نوع الحجامة المطلوبة؟! */}
            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="block text-xs sm:text-sm font-bold text-slate-900">
                نوع الحجامة المطلوبة؟!
              </label>

              <div className="space-y-2">
                {CUPPING_TYPES.map(type => {
                  const isWet = type.id === 'wet';
                  const isBlockedDueToHealth = isWet && isRestrictedToDryCupping;

                  return (
                    <div
                      key={type.id}
                      onClick={() => {
                        if (!isBlockedDueToHealth) {
                          setCuppingType(type.label);
                        }
                      }}
                      className={`p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                        cuppingType === type.label
                          ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-400'
                          : isBlockedDueToHealth
                          ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        cuppingType === type.label
                          ? 'border-amber-600 bg-amber-500 text-slate-950'
                          : 'border-slate-300'
                      }`}>
                        {cuppingType === type.label && <Check className="w-3 h-3 text-slate-950" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{type.label}</span>
                          {isBlockedDueToHealth && (
                            <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded">
                              محظورة طبياً لوجود سيولة أو ضغط أو سكر
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{type.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* تاريخ وميعاد الزيارة المقترح */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>تاريخ الجلسة المقترح</span>
                </label>
                <input
                  type="date"
                  value={visitDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>الوقت المفضل</span>
                </label>
                <input
                  type="text"
                  value={timingNote}
                  onChange={(e) => setTimingNote(e.target.value)}
                  placeholder="مثال: عصراً (04:00 م) أو صباحاً"
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* الملحوظة الطبية الإلزامية المشددة المطلوبة نصياً من المستخدم */}
            <div className="space-y-3 p-4 rounded-2xl border bg-amber-50/90 border-amber-300 text-right">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-xs sm:text-sm">
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
                <span>ملحوظة طبية واحترازية هامة:</span>
              </div>

              <div className="space-y-2 text-xs text-amber-950 leading-relaxed font-medium">
                {isRestrictedToDryCupping && (
                  <div className="p-2.5 bg-rose-100 border border-rose-300 rounded-xl text-rose-950 font-bold">
                    ⚠️ <strong>تنبيه طبي وقائي:</strong> نظراً لأنك تعاني من {hasHypertensionOrDiabetes ? 'ضغط أو سكر' : ''} {hasBleedingTendency ? 'أو سيولة' : ''}، فلن يتم إجراء حجامة دموية وستكون الجلسة <strong>حجامة جافة</strong> آمنة تماماً لحماية صحتك وتجنب النزيف أو هبوط الدورة الدموية.
                  </div>
                )}
                
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-700 mt-1.5 shrink-0"></div>
                  <span>لو مقدم الطلب يعاني من أي أمراض مثل السيولة أو ضغط أو سكر فهو لن يفعل حجامة دموية وستكون حجامة جافة.</span>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-700 mt-1.5 shrink-0"></div>
                  <span>مراجعة الأدوية، خصوصاً مميعات الدم ومضادات التجلط قبل اتخاذ أي إجراء.</span>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-700 mt-1.5 shrink-0"></div>
                  <span><strong>عدم اعتبار تسجيل الطلب موافقة تلقائية على إجراء الحجامة؛</strong> لازم المختص يراجع الحالة أولاً والتأكد من ملاءمتها الطبية.</span>
                </div>
              </div>
            </div>

            {/* طريقة الدفع المعتمدة */}
            <PaymentMethodSection
              paymentMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
              transactionRef={transactionRef}
              onChangeTransactionRef={setTransactionRef}
              accent="amber"
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                إلغاء
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 border border-amber-400"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>إرسال طلب الحجامة للمراجعة الطبية</span>
              </button>
            </div>

          </form>
        )}

      </div>

      {/* Google Maps Pin Picker Modal for Cupping */}
      {showGoogleMapsModal && (
        <GoogleMapsPickerModal
          initialCoordinates={gpsLocation}
          initialGovernorate={governorate}
          onSelectLocation={(loc) => {
            setGpsLocation({
              lat: loc.lat,
              lng: loc.lng,
              addressName: loc.addressName
            });
            setDetailedAddress(prev => prev ? `${loc.addressName} - ${prev}` : loc.addressName);
            setGoogleMapsUrl(loc.googleMapsUrl);
            setIsLocationConfirmed(true);
            setShowGoogleMapsModal(false);
          }}
          onClose={() => setShowGoogleMapsModal(false)}
        />
      )}
    </div>
  );
};
