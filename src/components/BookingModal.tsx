import React, { useState, useEffect } from 'react';
import { 
  Caregiver, 
  ServiceItem, 
  BookingOrder, 
  UserProfile,
  TimingChoice,
  AdminOrderStatus
} from '../types';
import { INITIAL_SERVICES } from '../data/mockData';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Upload, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  User, 
  Phone, 
  CheckCircle2, 
  Pill, 
  HeartPulse,
  Navigation,
  FileCheck,
  Zap,
  Flame,
  Check,
  Trash2,
  Stethoscope,
  Info,
  ExternalLink
} from 'lucide-react';
import { GoogleMapsPickerModal } from './GoogleMapsPickerModal';
import { PaymentMethodSection, OFFICIAL_PAYMENT_NUMBER } from './PaymentMethodSection';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceItem | null;
  selectedNurse: Caregiver | null;
  caregivers: Caregiver[];
  currentUser?: UserProfile;
  services?: ServiceItem[];
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

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  service,
  selectedNurse,
  caregivers,
  currentUser,
  services = INITIAL_SERVICES,
  onConfirmBooking
}) => {
  // Selected Service
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    service ? service.id : (services[0]?.id || 'srv-cannula-iv')
  );

  const activeService = services.find(s => s.id === selectedServiceId) || service || services[0];

  // 1. بيانات المريض
  const [patientName, setPatientName] = useState(
    currentUser?.patientName || currentUser?.fullName || ''
  );
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [age, setAge] = useState<number | ''>(currentUser?.age || 58);

  // تاريخ الزيارة
  const todayStr = new Date().toISOString().split('T')[0];
  const [visitDate, setVisitDate] = useState<string>(todayStr);

  // اختيار الوقت المناسب:- (تحديد معاد / فوري / مستعجل)
  const [timingChoice, setTimingChoice] = useState<TimingChoice>('تحديد معاد');
  const [customTime, setCustomTime] = useState<string>('02:00 م');

  // 3. عنوان الزيارة
  const [governorate, setGovernorate] = useState<string>(
    currentUser?.governorate || 'القاهرة'
  );
  const [detailedAddress, setDetailedAddress] = useState<string>(
    currentUser?.address || ''
  );
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number; addressName: string }>(
    currentUser?.locationCoordinates || {
      lat: 0,
      lng: 0,
      addressName: ''
    }
  );
  const [isLocationConfirmed, setIsLocationConfirmed] = useState<boolean>(
    Boolean(currentUser?.locationCoordinates?.lat && currentUser.locationCoordinates.lat !== 0 && currentUser.locationCoordinates.addressName)
  );
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [showGoogleMapsModal, setShowGoogleMapsModal] = useState(false);
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>(
    currentUser?.locationCoordinates?.lat ? `https://www.google.com/maps?q=${currentUser.locationCoordinates.lat},${currentUser.locationCoordinates.lng}` : ''
  );

  // اضافه الروشتة
  const [prescriptionFileName, setPrescriptionFileName] = useState<string>(
    'روشتة_الطبيب_المعالج_أكتوبر_2026.pdf'
  );
  const [prescriptionPreview, setPrescriptionPreview] = useState<string | null>(null);

  // الأسئلة الطبية الإلزامية لسلامة الإجراء:
  // 1. هل يعاني المريض من أي أمراض مزمنة؟
  const [chronicDiseases, setChronicDiseases] = useState<string>(
    currentUser?.chronicDiseases || 'ارتفاع ضغط الدم والسكري'
  );

  // 2. ما هي الأدوية التي يتناولها المريض بانتظام حالياً؟ (الأدوية اللي ماشي عليها) *
  const [currentMedications, setCurrentMedications] = useState<string>(
    currentUser?.currentMedications || 'كونكور 5 مجم · جانوفيا 100 مجم'
  );

  // 3. هل في أدوية معينة ممنوعة أو حساسية مفرطة؟ (مثل حساسية البنسلين ومشتقاته)
  const [forbiddenMedications, setForbiddenMedications] = useState<string>(
    'لا توجد حساسية دوائية معروفة'
  );

  // 4. هل أجرى المريض أي عمليات جراحية سابقة؟ (هل عامل عمليات قبل كدا ولا لا) *
  const [hasSurgeries, setHasSurgeries] = useState<boolean>(
    currentUser?.hasPreviousSurgeries ?? true
  );
  const [surgeriesDetails, setSurgeriesDetails] = useState<string>(
    currentUser?.previousSurgeriesDetails || 'عملية قسطرة قلبية وتركيب دعامة عام 2023'
  );

  // 4. حالة توفر الأدوية والمحاليل في المنزل:
  // العلاج متاح بالمنزل - الأدوية والمحاليل متوفرة بحوزتي حالياً
  const [medicationAvailableAtHome, setMedicationAvailableAtHome] = useState<boolean>(true);

  // خانة إحضار أدوية (سعر الخدمة 30 جنيه)
  const [requestMedicines, setRequestMedicines] = useState<boolean>(false);
  const [medicineRequestDetails, setMedicineRequestDetails] = useState<string>('');

  // طريقة الدفع المعتمدة (إنستاباي أو فودافون كاش)
  const [paymentMethod, setPaymentMethod] = useState<'instapay' | 'vodafone_cash'>('instapay');
  const [transactionRef, setTransactionRef] = useState<string>('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Submission success state
  const [submittedBooking, setSubmittedBooking] = useState<BookingOrder | null>(null);

  // Update defaults when currentUser or service changes
  useEffect(() => {
    if (currentUser) {
      if (!patientName) setPatientName(currentUser.patientName || currentUser.fullName || '');
      if (!phone) setPhone(currentUser.phone || '');
      if (currentUser.age) setAge(currentUser.age);
      if (currentUser.governorate) setGovernorate(currentUser.governorate);
      if (!detailedAddress && currentUser.address) setDetailedAddress(currentUser.address);
      if (currentUser.chronicDiseases) setChronicDiseases(currentUser.chronicDiseases);
      if (currentUser.currentMedications) setCurrentMedications(currentUser.currentMedications);
      if (currentUser.hasPreviousSurgeries !== undefined) setHasSurgeries(currentUser.hasPreviousSurgeries);
      if (currentUser.previousSurgeriesDetails) setSurgeriesDetails(currentUser.previousSurgeriesDetails);
    }
  }, [currentUser]);

  useEffect(() => {
    if (service) {
      setSelectedServiceId(service.id);
    }
  }, [service]);

  if (!isOpen) return null;

  // Handle GPS detection
  const handleDetectGPS = () => {
    setIsDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setGpsLocation({
            lat: latitude,
            lng: longitude,
            addressName: `الموقع الجغرافي المباشر (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
          });
          setGoogleMapsUrl(`https://www.google.com/maps?q=${latitude},${longitude}`);
          setIsLocationConfirmed(true);
          setIsDetectingGps(false);
        },
        () => {
          setIsDetectingGps(false);
          alert('تعذر قراءة GPS بدقة، يرجى فتح الخريطة لتثبيت اللوكيشن.');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setIsDetectingGps(false);
      setShowGoogleMapsModal(true);
    }
  };

  // Handle prescription file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPrescriptionFileName(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPrescriptionPreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPrescriptionPreview(null);
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!patientName.trim()) {
      errs.patientName = 'يرجى إدخال اسم المريض';
    }
    if (!phone.trim() || phone.trim().length < 10) {
      errs.phone = 'يرجى إدخال رقم هاتف صحيح للتواصل';
    }
    if (!age || Number(age) <= 0) {
      errs.age = 'يرجى إدخال عمر المريض';
    }
    if (!detailedAddress.trim()) {
      errs.detailedAddress = 'يرجى إدخال المنطقة والعنوان بالتفصيل';
    }
    if (!isLocationConfirmed || !gpsLocation.lat || gpsLocation.lat === 0 || !gpsLocation.addressName || !googleMapsUrl) {
      errs.gpsLocation = 'تحديد اللوكيشن وتثبيته عبر خريطة جوجل أو الـ GPS إلزامي لتأكيد الزيارة';
    }
    if (!currentMedications.trim()) {
      errs.currentMedications = 'يرجى كتابة الأدوية الحالية أو كتابة (لا يتناول أدوية)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-2026-${randomNum}`;
    const bookingId = `BK-${randomNum}`;

    const assignedNurse = selectedNurse || caregivers[0];
    const isUrgent = timingChoice === 'مستعجل';
    const urgentFee = isUrgent ? 150 : 0;
    const transportationFee = isUrgent ? 200 : 50;
    const baseAmount = activeService?.price || 150;
    const medicineServiceFee = requestMedicines ? 30 : 0;
    const totalAmount = baseAmount + transportationFee + medicineServiceFee;

    const scheduledTime = 
      timingChoice === 'تحديد معاد' ? customTime :
      timingChoice === 'فوري' ? 'فوري (وصول سريع خلال 20-30 دقيقة)' :
      'مستعجل (وصول طارئ فوري)';

    const newBooking: BookingOrder = {
      id: bookingId,
      orderNumber,
      createdAt: new Date().toISOString(),
      serviceId: activeService.id,
      serviceTitle: activeService.title,
      category: activeService.category,
      orderType: isUrgent ? 'urgent' : 'standard',
      isUrgent,
      urgentFee,
      caregiverId: assignedNurse.id,
      caregiverName: assignedNurse.name,
      caregiverAvatar: assignedNurse.avatar,
      caregiverPhone: assignedNurse.phone,
      
      // Scheduling & Timing
      visitDate,
      timingChoice,
      preferredTime: scheduledTime,
      scheduledDate: visitDate,
      scheduledTime,

      // Address
      governorate,
      detailedAddress: detailedAddress.trim(),

      // Prescription
      prescriptionFileName: prescriptionFileName || undefined,
      prescriptionUrl: prescriptionPreview || undefined,

      // Medical questions answers
      hasChronicDiseasesAnswer: chronicDiseases.trim() || 'لا يوجد أمراض مزمنة',
      currentMedicationsAnswer: currentMedications.trim(),
      allergiesOrForbiddenAnswer: forbiddenMedications.trim() || 'لا توجد حساسية معروفة',
      previousSurgeriesAnswer: hasSurgeries ? surgeriesDetails.trim() : 'لا توجد عمليات جراحية سابقة',
      hasPreviousSurgeries: hasSurgeries,

      medicationAvailableAtHome: requestMedicines ? false : medicationAvailableAtHome,

      // خانة إحضار أدوية
      medicineRequest: {
        requested: requestMedicines,
        details: medicineRequestDetails.trim() || 'طلب إحضار أدوية ومستلزمات من الصيدلية',
        serviceFee: 30,
        medicineCost: undefined,
        pharmacyInvoiceUrl: undefined
      },

      // Google Maps Location
      googleMapsUrl,

      // Admin status: starts as 'جديد'
      adminStatus: 'جديد' as AdminOrderStatus,

      patient: {
        fullName: patientName.trim(),
        phone: phone.trim(),
        age: Number(age),
        address: `${governorate} - ${detailedAddress.trim()}`,
        governorate,
        locationCoordinates: gpsLocation,
        chronicDiseases: chronicDiseases.trim() || 'لا يوجد أمراض مزمنة',
        currentMedications: currentMedications.trim(),
        forbiddenMedications: forbiddenMedications.trim() || 'لا توجد حساسية معروفة',
        hasPreviousSurgeries: hasSurgeries,
        previousSurgeries: hasSurgeries ? surgeriesDetails.trim() : 'لا توجد عمليات جراحية سابقة',
        medicationAvailable: requestMedicines ? false : medicationAvailableAtHome,
        medicalReports: prescriptionFileName ? [prescriptionFileName] : [],
        preferredCaregiverGender: selectedNurse ? selectedNurse.gender : 'any'
      },
      status: 'pending_acceptance',
      payment: {
        method: paymentMethod,
        status: 'pending',
        amount: totalAmount,
        baseAmount,
        urgentFee,
        transportationFee,
        medicationServiceFee: medicineServiceFee,
        invoiceNumber: `INV-2026-${randomNum}`,
        walletNumber: OFFICIAL_PAYMENT_NUMBER,
        transactionRef: transactionRef.trim() || undefined
      },
      liveTracking: {
        nurseLocation: {
          lat: 30.0150,
          lng: 31.2100,
          addressName: isUrgent ? 'طلب مستعجل: جاري التوجيه الفوري' : 'تم استلام الطلب'
        },
        estimatedArrivalMinutes: isUrgent ? 15 : 30,
        currentStage: 0,
        lastUpdated: 'تم إرسال الطلب، سيتم التواصل لتأكيد الزيارة',
        patientCoordinates: gpsLocation,
        isLiveLocationActive: false,
        riskProtectionEnabled: true
      }
    };

    setSubmittedBooking(newBooking);
    onConfirmBooking(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 text-right shadow-2xl border border-slate-200 my-6">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                طلب زيارة تمريض
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              املأ البيانات وسيتم التواصل معك لتأكيد الطلب
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If submitted, show confirmation view */}
        {submittedBooking ? (
          <div className="py-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold bg-teal-50 text-teal-800 px-3 py-1 rounded-full border border-teal-200 inline-block">
                رقم الطلب: {submittedBooking.orderNumber || submittedBooking.id}
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                تم استلام طلب زيارة التمريض بنجاح
              </h3>
              <p className="text-sm font-semibold text-emerald-800 bg-emerald-50 py-2.5 px-4 rounded-xl border border-emerald-200 max-w-md mx-auto">
                سيتم مراجعة الطلب والتواصل معك لتأكيد الزيارة.
              </p>
            </div>

            {/* Quick summary box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-md mx-auto text-right text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-500">اسم المريض:</span>
                <span className="font-bold text-slate-900">{submittedBooking.patient.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-500">الخدمة المطلوبة:</span>
                <span className="font-bold text-teal-800">{submittedBooking.serviceTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-500">موعد الزيارة:</span>
                <span className="font-bold text-slate-900">
                  {submittedBooking.visitDate} ({submittedBooking.timingChoice} - {submittedBooking.preferredTime})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-500">عنوان الزيارة:</span>
                <span className="font-bold text-slate-900">{submittedBooking.detailedAddress} ({submittedBooking.governorate})</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">حالة الطلب:</span>
                <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  {submittedBooking.adminStatus || 'جديد'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs"
              >
                تم ومتابعة
              </button>
            </div>
          </div>
        ) : (
          /* Main Form */
          <form onSubmit={handleSubmit} className="space-y-6 pt-5">
            
            {/* 1. بيانات المريض */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600" />
                <span>1. بيانات المريض</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* اسم المريض */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    اسم المريض <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="مثال: محمد أحمد إبراهيم"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                  {errors.patientName && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.patientName}</p>
                  )}
                </div>

                {/* عمر المريض */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    عمر المريض <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="مثال: 58"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                  />
                  {errors.age && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.age}</p>
                  )}
                </div>
              </div>

              {/* رقم الهاتف */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  رقم الهاتف للتواصل والمتابعة <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010XXXXXXXX"
                    className="w-full pl-3 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500 font-mono text-right"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* نوع الخدمة المطلوبة */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                <span>نوع الخدمة المطلوبة</span>
              </label>
              
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-teal-500 focus:bg-white"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.durationMinutes ? `المدة: ${s.durationMinutes} دقيقة` : 'وقت الزيارة حسب الحالة'})
                  </option>
                ))}
              </select>

              {activeService && (
                <div className="p-2.5 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center justify-between text-xs text-teal-900">
                  <span className="font-semibold">{activeService.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-white px-2.5 py-0.5 rounded-lg border border-teal-200 font-bold text-teal-900">
                      السعر بالتنسيق المباشر مع الممرض
                    </span>
                    {activeService.durationMinutes > 0 && (
                      <span className="text-teal-700 font-medium">
                        (وقت الخدمة: {activeService.durationMinutes} دقيقة)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* تاريخ الزيارة & اختيار الوقت المناسب */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* تاريخ الزيارة */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>تاريخ الزيارة</span>
                </label>
                <input
                  type="date"
                  value={visitDate}
                  min={todayStr}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              {/* اختيار الوقت المناسب (تحديد معاد / فوري / مستعجل) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>اختيار الوقت المناسب:</span>
                </label>
                
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setTimingChoice('تحديد معاد')}
                    className={`py-2 rounded-lg transition-colors text-center ${
                      timingChoice === 'تحديد معاد'
                        ? 'bg-white text-teal-800 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    تحديد معاد
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimingChoice('فوري')}
                    className={`py-2 rounded-lg transition-colors text-center ${
                      timingChoice === 'فوري'
                        ? 'bg-teal-600 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    فوري
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimingChoice('مستعجل')}
                    className={`py-2 rounded-lg transition-colors text-center ${
                      timingChoice === 'مستعجل'
                        ? 'bg-rose-600 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-rose-700'
                    }`}
                  >
                    مستعجل
                  </button>
                </div>
              </div>
            </div>

            {/* If تحديد معاد selected, show time dropdown or text */}
            {timingChoice === 'تحديد معاد' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                  الساعة المناسبة للزيارة:
                </span>
                <input
                  type="text"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  placeholder="مثال: 10:00 صباحاً أو 04:30 عصراً"
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>
            )}

            {timingChoice === 'فوري' && (
              <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-200 text-xs text-teal-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-600 shrink-0" />
                <span><strong>طلب فوري:</strong> يتم توجيه أقرب ممرض متاح للوصول خلال 20 - 30 دقيقة.</span>
              </div>
            )}

            {timingChoice === 'مستعجل' && (
              <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-600 shrink-0 animate-pulse" />
                <span><strong>طلب مستعجل:</strong> استدعاء طارئ بأولوية قصوى وسيارة خاصة للوصول الفوري السريع.</span>
              </div>
            )}

            {/* 3. عنوان الزيارة واللوكيشن (إلزامي) */}
            <div className={`space-y-3 p-4 rounded-2xl border transition-all ${
              isLocationConfirmed 
                ? 'bg-slate-50 border-slate-200' 
                : 'bg-teal-50/40 border-teal-300'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    <span>3. عنوان الزيارة واللوكيشن</span>
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    isLocationConfirmed 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                      : 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                  }`}>
                    {isLocationConfirmed ? 'تم تأكيد وتثبيت الموقع ✅' : 'مطلوب إلزامي ⚠️'}
                  </span>
                </div>
                
                {/* زر دمج خرائط جوجل بجانب العنوان */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowGoogleMapsModal(true)}
                    className="text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-xl border border-teal-500 flex items-center gap-1.5 transition-all shadow-2xs"
                  >
                    <MapPin className="w-3.5 h-3.5 text-white" />
                    <span>تحديد الموقع عبر خرائط جوجل (Google Maps)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    className="text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1 transition-colors"
                    title="التقاط تلقائي عبر GPS الهاتف"
                  >
                    <Navigation className="w-3 h-3 text-teal-600" />
                    <span>{isDetectingGps ? 'جاري القراءة...' : 'GPS'}</span>
                  </button>
                </div>
              </div>

              {/* المحافظة */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  المحافظة <span className="text-rose-500">*</span>
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500"
                >
                  {EGYPT_GOVERNORATES.map((gov) => (
                    <option key={gov} value={gov}>{gov}</option>
                  ))}
                </select>
              </div>

              {/* المنطقة والعنوان بالتفصيل مع زر خرائط جوجل الداخلي */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    المنطقة والعنوان بالتفصيل <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowGoogleMapsModal(true)}
                    className="text-[11px] text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1"
                  >
                    <span>فتح الخريطة لتثبيت العنوان بدقة</span>
                    <span>📍</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={detailedAddress}
                    onChange={(e) => setDetailedAddress(e.target.value)}
                    placeholder="اسم المنطقة، الشارع، رقم العمارة، الطابق، رقم الشقة، علامة مميزة"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                {errors.detailedAddress && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.detailedAddress}</p>
                )}
              </div>

              {/* Google Maps Location Verified Card */}
              {isLocationConfirmed && gpsLocation.addressName && (
                <div className="p-2.5 bg-white rounded-xl border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[11px] text-slate-600">الموقع الجغرافي المعتمد:</span>
                    <strong className="text-teal-950 font-bold">{gpsLocation.addressName}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">({gpsLocation.lat.toFixed(4)}, {gpsLocation.lng.toFixed(4)})</span>
                  </div>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 underline"
                  >
                    <span>معاينة على خرائط جوجل</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {errors.gpsLocation && (
                <p className="text-[11px] text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200 flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>{errors.gpsLocation}</span>
                </p>
              )}
            </div>

            {/* اضافه الروشتة */}
            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span>اضافه الروشتة</span>
                </label>
                <label className="cursor-pointer text-xs font-bold text-teal-700 bg-white hover:bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 transition-colors flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-teal-600" />
                  <span>رفع صورة الروشتة</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {prescriptionFileName ? (
                <div className="p-2.5 bg-white rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-800 truncate">
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold truncate">{prescriptionFileName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPrescriptionFileName('');
                      setPrescriptionPreview(null);
                    }}
                    className="text-rose-500 hover:text-rose-700 p-1"
                    title="حذف الملف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">
                  يمكنك رفع صورة الروشتة الطبية لمساعدة التمريض على تجهيز المستلزمات بدقة.
                </p>
              )}
            </div>

            {/* الأسئلة الطبية الإلزامية لسلامة الإجراء */}
            <div className="space-y-3.5 p-4 bg-amber-50/50 rounded-2xl border border-amber-200">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>الأسئلة الطبية الإلزامية لسلامة الإجراء:</span>
              </h3>

              {/* 1. هل يعاني المريض من أي أمراض مزمنة؟ */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                  <span>1. هل يعاني المريض من أي أمراض مزمنة؟</span>
                </label>
                <input
                  type="text"
                  value={chronicDiseases}
                  onChange={(e) => setChronicDiseases(e.target.value)}
                  placeholder="مثال: ضغط، سكر، قلب، سيولة، كلى (أو اكتب: لا يوجد)"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* 2. ما هي الأدوية التي يتناولها المريض بانتظام حالياً؟ (الأدوية اللي ماشي عليها) * */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-teal-600" />
                  <span>2. ما هي الأدوية التي يتناولها المريض بانتظام حالياً؟ (الأدوية اللي ماشي عليها) <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                  placeholder="مثال: كونكور 5 مجم، أسبوسيد أطفال، إنسولين لانتوس (أو اكتب: لا يتناول أدوية)"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500"
                />
                {errors.currentMedications && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.currentMedications}</p>
                )}
              </div>

              {/* 3. هل في أدوية معينة ممنوعة أو حساسية مفرطة؟ (مثل حساسية البنسلين ومشتقاته) */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  3. هل في أدوية معينة ممنوعة أو حساسية مفرطة؟ (مثل حساسية البنسلين ومشتقاته)
                </label>
                <input
                  type="text"
                  value={forbiddenMedications}
                  onChange={(e) => setForbiddenMedications(e.target.value)}
                  placeholder="مثال: حساسية بنسلين، حساسية سلفا، أو اكتب: لا توجد حساسية معروفة"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* 4. هل أجرى المريض أي عمليات جراحية سابقة؟ (هل عامل عمليات قبل كدا ولا لا) * */}
              <div className="space-y-2 pt-1 border-t border-amber-200/70">
                <label className="block text-xs font-bold text-slate-800">
                  4. هل أجرى المريض أي عمليات جراحية سابقة؟ (هل عامل عمليات قبل كدا ولا لا) <span className="text-rose-500">*</span>
                </label>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setHasSurgeries(true)}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                      hasSurgeries
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    نعم، أجرى عمليات سابقة
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasSurgeries(false)}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                      !hasSurgeries
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    لا، لم يجرِ أي عمليات سابقة
                  </button>
                </div>

                {hasSurgeries && (
                  <input
                    type="text"
                    value={surgeriesDetails}
                    onChange={(e) => setSurgeriesDetails(e.target.value)}
                    placeholder="اذكر نوع العملية وتاريخها التقريبي (مثال: قسطرة قلبية 2023)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500 mt-1.5"
                  />
                )}
              </div>
            </div>

            {/* 4. حالة توفر الأدوية والمحاليل في المنزل */}
            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="block text-xs sm:text-sm font-bold text-slate-900">
                4. حالة توفر الأدوية والمحاليل في المنزل:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setMedicationAvailableAtHome(true)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    medicationAvailableAtHome
                      ? 'bg-teal-50/80 border-teal-500 shadow-xs text-teal-950'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    medicationAvailableAtHome ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'
                  }`}>
                    {medicationAvailableAtHome && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold block">العلاج متاح بالمنزل</span>
                    <span className="text-[11px] text-slate-500 block">
                      الأدوية والمحاليل متوفرة بحوزتي حالياً
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setMedicationAvailableAtHome(false)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    !medicationAvailableAtHome
                      ? 'bg-amber-50/80 border-amber-500 shadow-xs text-amber-950'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    !medicationAvailableAtHome ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                  }`}>
                    {!medicationAvailableAtHome && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold block">الممرض يحضر العلاج</span>
                    <span className="text-[11px] text-slate-500 block">
                      يقوم بشرائه من الصيدلية مع إحضار الفاتورة
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* خانة إحضار أدوية (طلب أدوية من الممرض + سعر الخدمة 30 جنيه + إضافة فاتورة الأدوية) */}
            <div className="space-y-3 p-4 bg-gradient-to-r from-teal-50/70 via-emerald-50/40 to-slate-50 rounded-2xl border-2 border-teal-300 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-teal-600" />
                  <span>إحضار أدوية (طلب أدوية ومستلزمات من الصيدلية)</span>
                </label>
                <span className="text-[11px] font-black bg-teal-600 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                  سعر الخدمة: 30 جنيه
                </span>
              </div>

              <div className="space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer bg-white p-3 rounded-xl border border-teal-200 hover:border-teal-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={requestMedicines}
                    onChange={(e) => {
                      setRequestMedicines(e.target.checked);
                      if (e.target.checked) {
                        setMedicationAvailableAtHome(false);
                      }
                    }}
                    className="w-4 h-4 text-teal-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      نعم، أرغب في طلب أدوية أو محاليل أو مستلزمات طبية من الممرض
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      يضاف 30 جنيه لسعر الطلب كرسوم خدمة إحضار وتوصيل الأدوية، مع كتابة الممرض للأسعار وإضافة فاتورة الصيدلية عند الوصول.
                    </span>
                  </div>
                </label>

                {requestMedicines && (
                  <div className="space-y-2.5 p-3.5 bg-white rounded-xl border border-teal-300 animate-in fade-in duration-200">
                    <label className="block text-xs font-bold text-slate-800">
                      اكتب الأدوية أو المحاليل أو المستلزمات المطلوبة بالتفصيل: <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={medicineRequestDetails}
                      onChange={(e) => setMedicineRequestDetails(e.target.value)}
                      placeholder="مثال: كيس محلول ملح 500 مل + كانيولا مقاس 20 زرقاء + لاصق طبي وبلاستر + أمبول مسكن كيتولاك"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
                    />

                    {/* تنبيه إجراء الفاتورة */}
                    <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 space-y-1">
                      <p className="font-bold">🧾 إجراءات الفاتورة والأسعار عند وصول الممرض:</p>
                      <p>• الممرض سيقوم بشراء الأدوية من الصيدلية وإحضار الفاتورة الرسمية المعتمدة.</p>
                      <p>• عند وصول الممرض، سيقوم بكتابة وتسجيل سعر الأدوية الفعلي من واقع الفاتورة وإرفاق صورة فاتورة الأدوية في الطلب (سعر الخدمة 30 جنيه + ثمن الأدوية بالفاتورة).</p>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold text-teal-900 pt-1 border-t border-slate-100">
                      <span>رسوم خدمة إحضار الأدوية:</span>
                      <span className="font-mono text-sm font-black text-teal-700">+ 30 ج.م</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* طريقة الدفع المعتمدة */}
            <PaymentMethodSection
              paymentMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
              transactionRef={transactionRef}
              onChangeTransactionRef={setTransactionRef}
              accent="teal"
            />

            {/* Note & Assurance */}
            <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-3.5 flex items-center gap-3 text-teal-900 text-xs font-semibold">
              <Info className="w-4 h-4 text-teal-700 shrink-0" />
              <span>سيتم مراجعة الطلب والتواصل معك لتأكيد الزيارة.</span>
            </div>

            {/* Submit Action */}
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
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>إرسال طلب زيارة التمريض</span>
                <span>✓</span>
              </button>
            </div>

          </form>
        )}

      </div>

      {/* Google Maps Pin Picker Modal */}
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
            setIsLocationConfirmed(true);
            setDetailedAddress(prev => prev ? `${loc.addressName} - ${prev}` : loc.addressName);
            setGoogleMapsUrl(loc.googleMapsUrl);
            setShowGoogleMapsModal(false);
          }}
          onClose={() => setShowGoogleMapsModal(false)}
        />
      )}
    </div>
  );
};
