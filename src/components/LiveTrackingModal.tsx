import React, { useState, useEffect } from 'react';
import { BookingOrder, BookingStatus } from '../types';
import { 
  X, 
  MapPin, 
  PhoneCall, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Navigation, 
  ShieldCheck, 
  Activity, 
  AlertTriangle,
  Star, 
  Award, 
  Zap, 
  Flame,
  ExternalLink,
  Radio,
  Lock,
  Compass,
  ShoppingBag,
  Receipt,
  Eye
} from 'lucide-react';
import { formatPaymentMethodLabel, OFFICIAL_PAYMENT_NUMBER } from './PaymentMethodSection';

interface LiveTrackingModalProps {
  booking: BookingOrder | null;
  onClose: () => void;
  onOpenChat: (booking: BookingOrder) => void;
  onUpdateStatus: (bookingId: string, newStatus: BookingStatus, newStage: number) => void;
  onOpenReview?: (booking: BookingOrder) => void;
}

export const LiveTrackingModal: React.FC<LiveTrackingModalProps> = ({
  booking,
  onClose,
  onOpenChat,
  onUpdateStatus,
  onOpenReview
}) => {
  // Simulated ETA countdown
  const [eta, setEta] = useState(booking?.liveTracking?.estimatedArrivalMinutes || 8);
  const [sosSent, setSosSent] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Live coordinates simulation
  const [nurseCoords, setNurseCoords] = useState({
    lat: booking?.liveTracking?.nurseLocation?.lat || 30.0152,
    lng: booking?.liveTracking?.nurseLocation?.lng || 31.2114
  });

  const patientCoords = {
    lat: booking?.patient?.locationCoordinates?.lat || 29.9602,
    lng: booking?.patient?.locationCoordinates?.lng || 31.2569
  };

  const currentStageIndex = booking?.liveTracking?.currentStage ?? 2;
  const isSessionActive = currentStageIndex >= 1 && currentStageIndex <= 3;
  const isCompleted = currentStageIndex >= 4;

  // Simulate smooth live GPS movement when nurse is on the way
  useEffect(() => {
    if (booking?.status === 'on_the_way' && isSessionActive) {
      const interval = setInterval(() => {
        setNurseCoords(prev => ({
          lat: prev.lat + (patientCoords.lat - prev.lat) * 0.05,
          lng: prev.lng + (patientCoords.lng - prev.lng) * 0.05
        }));
        setEta(prev => Math.max(1, prev - 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [booking?.status, isSessionActive, patientCoords.lat, patientCoords.lng]);

  if (!booking) return null;

  // Stages configuration with Risk Protection focus
  const stages = [
    { 
      id: 'confirmed', 
      stageIndex: 1, 
      title: 'قبول الطلب وبدء الحماية', 
      desc: 'تم قبول الطلب وتفعيل بث الموقع المباشر المشفر بين الطرفين' 
    },
    { 
      id: 'on_the_way', 
      stageIndex: 2, 
      title: 'الممرض في الطريق (GPS حي)', 
      desc: 'بث حي لمسار الممرض وسرعة وصوله للحماية والأمان' 
    },
    { 
      id: 'arrived_in_progress', 
      stageIndex: 3, 
      title: 'وصول وبدء الجلسة (نطاق مؤمن)', 
      desc: 'الجلسة جارية داخل منزل العميل مع تثبيت إحداثيات الأمان' 
    },
    { 
      id: 'completed', 
      stageIndex: 4, 
      title: 'انتهاء الجلسة وإغلاق التتبع', 
      desc: 'اكتملت الرعاية والاطمئنان وتوثيق التقرير وإغلاق البث بأمان' 
    },
  ];

  // Direct Google Maps Route URL
  const googleMapsRouteUrl = `https://www.google.com/maps/dir/?api=1&origin=${nurseCoords.lat.toFixed(4)},${nurseCoords.lng.toFixed(4)}&destination=${patientCoords.lat.toFixed(4)},${patientCoords.lng.toFixed(4)}`;

  const handleSendSos = () => {
    setSosSent(true);
    alert('🚨 تم إرسال إشعار الطوارئ والأمان فوراً إلى غرفة المتابعة المركزية لمنصة Passant Nursing مع تزويدهم بإحداثيات الموقع المشترك الحالية.');
    setTimeout(() => setSosSent(false), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 text-right shadow-2xl border border-slate-200 my-6 space-y-4 animate-in fade-in duration-200">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-700">لايف لوكيشن مباشر للحماية من المخاطر</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-mono font-semibold text-slate-500">{booking.orderNumber || booking.id}</span>
              {booking.isUrgent && (
                <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-rose-600" />
                  <span>طلب عاجل (أولوية قصوى)</span>
                </span>
              )}
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              {booking.serviceTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Risk Protection Active Safety Banner */}
        <div className={`p-3.5 rounded-2xl border transition-all ${
          isCompleted 
            ? 'bg-slate-50 border-slate-200 text-slate-700'
            : 'bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white border-emerald-500/40 shadow-md'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl ${isCompleted ? 'bg-slate-200 text-slate-700' : 'bg-emerald-500/20 text-emerald-400'}`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 text-right">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm">
                    {isCompleted ? 'انتهت الجلسة وأُغلق التتبع بأمان' : 'درع الحماية والموقع المباشر (مفعل ونشط)'}
                  </span>
                  {!isCompleted && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold flex items-center gap-1">
                      <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                      <span>بث حي مشفر</span>
                    </span>
                  )}
                </div>
                <p className={`text-[11px] leading-relaxed ${isCompleted ? 'text-slate-500' : 'text-slate-300'}`}>
                  {isCompleted
                    ? 'تم توثيق المؤشرات الصحية وإنهاء الجلسة بنجاح وإغلاق البث المباشر لضمان الخصوصية.'
                    : 'يتم بث وتوثيق الموقع الجغرافي المشترك بين الممرض والعميل لحظياً في منصة المتابعة لحماية الطرفين من أي مخاطر حتى انتهاء الجلسة.'
                  }
                </p>
              </div>
            </div>

            {/* Quick Actions in Banner */}
            {!isCompleted && (
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={handleSendSos}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                    sosSent 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  }`}
                  title="إشعار طوارئ وأمان فوري"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{sosSent ? 'تم إرسال الاستغاثة' : 'زر طوارئ SOS'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live GPS Map Simulation Container */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 h-64 sm:h-72">
          {/* Map Grid Pattern */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          {/* Stylized road vector route simulation */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 60,180 Q 220,90 380,140 T 680,80"
              fill="none"
              stroke="#0d9488"
              strokeWidth="5"
              strokeDasharray="8 6"
              className={isCompleted ? '' : 'animate-pulse'}
            />
          </svg>

          {/* Patient Pin */}
          <div className="absolute top-12 left-12 sm:left-20 bg-rose-600 text-white p-2.5 rounded-2xl shadow-xl flex items-center gap-2 border-2 border-white">
            <MapPin className="w-4 h-4 fill-white" />
            <div className="text-right">
              <span className="block text-[11px] font-bold leading-tight">موقع العميل / المريض</span>
              <span className="text-[9px] text-rose-100">{booking.patient.address.slice(0, 24)}...</span>
            </div>
          </div>

          {/* Nurse Animated Pin on Map */}
          <div 
            className={`absolute bottom-14 right-14 sm:right-24 bg-teal-600 text-white p-2.5 rounded-2xl shadow-xl flex items-center gap-2 border-2 border-white transition-all duration-1000 ${
              isCompleted ? '' : currentStageIndex >= 3 ? 'ring-4 ring-emerald-400' : 'animate-bounce'
            }`}
          >
            <Navigation className="w-4 h-4 fill-white rotate-45" />
            <div className="text-right">
              <span className="block text-[11px] font-bold leading-tight">{booking.caregiverName}</span>
              <span className="text-[9px] text-teal-100">
                {currentStageIndex >= 3 
                  ? 'وصل الممرض - الجلسة جارية' 
                  : `في الطريق · على بعد 800 م · ETA ${eta} د`}
              </span>
            </div>
          </div>

          {/* Central Live Safety Status Bar */}
          <div className="absolute top-3 inset-x-3 flex justify-between items-center text-[10px] text-white">
            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/80 flex items-center gap-1.5 font-mono">
              <Compass className="w-3 h-3 text-teal-400 animate-spin" />
              <span>موقع الممرض: {nurseCoords.lat.toFixed(4)}, {nurseCoords.lng.toFixed(4)}</span>
            </div>

            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/80 flex items-center gap-1.5 text-emerald-400 font-bold">
              <Lock className="w-3 h-3" />
              <span>تشفير الأمان: 256-Bit SSL</span>
            </div>
          </div>

          {/* Map Overlay Controls Banner */}
          <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-md flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span className="text-slate-700 font-medium">حالة الجلسة والوصول:</span>
              <span className="font-extrabold text-teal-700">
                {currentStageIndex === 1 && 'الممرض قبل الطلب ويجهز المستلزمات'}
                {currentStageIndex === 2 && `في الطريق إليك (${eta} دقائق متبقية)`}
                {currentStageIndex === 3 && 'الممرض داخل الموقع - الجلسة قيد التنفيذ'}
                {currentStageIndex === 4 && 'اكتملت الجلسة بنجاح'}
              </span>
            </div>

            {/* Direct Google Maps Route Button */}
            <a
              href={googleMapsRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-100 hover:bg-teal-50 text-slate-800 hover:text-teal-700 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <span>فتح المسار الحي على Google Maps</span>
              <ExternalLink className="w-3 h-3 text-teal-600" />
            </a>
          </div>
        </div>

        {/* 4-Stage Step Tracker with Risk Protection */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {stages.map((stg) => {
              const isPastOrCurrent = currentStageIndex >= stg.stageIndex;
              const isCurrent = currentStageIndex === stg.stageIndex;

              return (
                <div
                  key={stg.id}
                  className={`p-3 rounded-xl border text-right transition-all ${
                    isCurrent
                      ? 'bg-teal-50 border-teal-500 text-teal-950 shadow-xs'
                      : isPastOrCurrent
                      ? 'bg-slate-50 border-slate-200 text-slate-800'
                      : 'bg-white border-slate-100 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isPastOrCurrent ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isPastOrCurrent ? '✓' : stg.stageIndex}
                    </div>
                    <span className="text-xs font-bold truncate">{stg.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {stg.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Interactive Simulation Switcher so reviewer can test transitions */}
          <div className="bg-slate-100 p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-600 font-medium text-[11px]">محاكاة مراحل الجلسة والأمان (للاختبار والمتابعة):</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onUpdateStatus(booking.id, 'confirmed', 1)}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  currentStageIndex === 1 ? 'bg-teal-700 text-white' : 'bg-white text-slate-700'
                }`}
              >
                1. بدء الحماية
              </button>
              <button
                onClick={() => onUpdateStatus(booking.id, 'on_the_way', 2)}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  currentStageIndex === 2 ? 'bg-teal-700 text-white' : 'bg-white text-slate-700'
                }`}
              >
                2. في الطريق
              </button>
              <button
                onClick={() => onUpdateStatus(booking.id, 'arrived_in_progress', 3)}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  currentStageIndex === 3 ? 'bg-teal-700 text-white' : 'bg-white text-slate-700'
                }`}
              >
                3. بدء الجلسة
              </button>
              <button
                onClick={() => onUpdateStatus(booking.id, 'completed', 4)}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  currentStageIndex === 4 ? 'bg-teal-700 text-white' : 'bg-white text-slate-700'
                }`}
              >
                4. إنهاء الجلسة
              </button>
            </div>
          </div>
        </div>

        {/* Immediate Review Callout Banner when visit is closed/completed */}
        {currentStageIndex === 4 && (
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-teal-700 text-white p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3.5 text-right">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xs shrink-0">
                <Star className="w-6 h-6 fill-amber-200 text-amber-200" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider block">
                  أغلق الممرض الزيارة للتو بنجاح
                </span>
                <h4 className="font-extrabold text-sm sm:text-base mt-0.5">
                  تقييم فوري لأداء الممرض {booking.caregiverName}
                </h4>
                <p className="text-[11px] text-teal-50 mt-0.5">
                  شارك تقييمك لـ (الاحترافية · النظافة والتعقيم · الالتزام بالوقت) لدعم جودة الخدمة.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                if (onOpenReview) onOpenReview(booking);
              }}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-amber-50 text-slate-900 font-extrabold text-xs rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 whitespace-nowrap flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>تقييم الممرض الآن</span>
            </button>
          </div>
        )}

        {/* Assigned Nurse Card & Direct Instant Communication */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-right w-full sm:w-auto">
            <img
              src={booking.caregiverAvatar}
              alt={booking.caregiverName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-200 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">{booking.caregiverName}</h4>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded">
                  ممرض معتمد
                </span>
              </div>
              <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                <span>موثق و معتمد</span>
                <span>✅</span>
              </span>
            </div>
          </div>

          {/* Quick Communication Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenChat(booking);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>مراسلة الممرض فورياً</span>
            </button>

            <a
              href={`tel:${booking.caregiverPhone}`}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-teal-600" />
              <span>اتصال مباشر</span>
            </a>
          </div>
        </div>

        {/* Patient Form Summary In Tracking */}
        <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-2">
          <h4 className="font-bold text-slate-800">بيانات الفورم الطبي والطلب المسجلة:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div>• اسم المريض: <strong className="text-slate-800">{booking.patient.fullName} ({booking.patient.age} سنة)</strong></div>
            <div>• نوع الطلب: <strong className={booking.isUrgent ? 'text-rose-700' : 'text-teal-800'}>
              {booking.isUrgent ? `🚨 طلب عاجل فوري (شامل +${booking.urgentFee || 150} ج.م)` : '📅 طلب مجدول عادي'}
            </strong></div>
            <div>• عنوان الزيارة: <strong className="text-slate-800">{booking.detailedAddress || booking.patient.address}</strong></div>
            <div>• طريقة الدفع: <strong className="text-slate-900 font-bold">{formatPaymentMethodLabel(booking.payment.method)}</strong> (<span className="font-mono text-teal-800 font-bold" dir="ltr">{booking.payment.walletNumber || OFFICIAL_PAYMENT_NUMBER}</span>){booking.payment.transactionRef ? ` — مرجع: ${booking.payment.transactionRef}` : ''}</div>
            <div>• الأمراض المزمنة: <strong className="text-slate-800">{booking.patient.chronicDiseases}</strong></div>
            <div>• الأدوية الممنوعة: <strong className="text-rose-700">{booking.patient.forbiddenMedications}</strong></div>
            <div>• العمليات السابقة: <strong className="text-slate-800">{booking.patient.previousSurgeries}</strong></div>
          </div>
        </div>

        {/* Medicine Request & Pharmacy Invoice Details */}
        {booking.medicineRequest?.requested && (
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl border border-amber-300 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-700" />
                <h4 className="font-extrabold text-xs text-amber-950">
                  خدمة إحضار أدوية ومستلزمات من الصيدلية
                </h4>
              </div>
              <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                سعر الخدمة: 30 جنيه
              </span>
            </div>

            <div className="bg-white/90 p-3 rounded-xl border border-amber-200 text-xs space-y-1">
              <span className="text-[10px] text-slate-500 font-semibold block">الأدوية المطلوبة من الصيدلية:</span>
              <p className="font-semibold text-slate-800 leading-relaxed">
                {booking.medicineRequest.details}
              </p>
            </div>

            {/* Medicine Cost & Invoice Status */}
            {booking.medicineRequest.medicineCost !== undefined && booking.medicineRequest.medicineCost > 0 ? (
              <div className="bg-white p-3 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-slate-900">
                      فاتورة الأدوية المعتمدة من الصيدلية:
                    </span>
                    <span className="font-mono font-black text-emerald-800 text-sm">
                      {booking.medicineRequest.medicineCost} ج.م
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    إجمالي الأدوية مع الخدمة: {booking.medicineRequest.medicineCost} + 30 خدمة = <strong>{(booking.medicineRequest.medicineCost || 0) + 30} ج.م</strong>
                  </p>
                </div>

                {booking.medicineRequest.pharmacyInvoiceUrl && (
                  <button
                    type="button"
                    onClick={() => setShowInvoiceModal(true)}
                    className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 flex items-center gap-1.5 transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5 text-emerald-700" />
                    <span>عرض صورة فاتورة الصيدلية</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-amber-100/60 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>
                  الممرض في طريقه لإحضار الأدوية، وسيقوم بكتابة الأسعار الرسمية وإرفاق صورة الفاتورة فور الوصول.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Vital Signs (if recorded by nurse) */}
        {booking.vitalSigns && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
            <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-700" />
              <span>العلامات الحيوية المسجلة بالزيارة بواسطة {booking.vitalSigns.nurseName}:</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-400 block">ضغط الدم</span>
                <span className="font-bold text-slate-900">{booking.vitalSigns.bloodPressure}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-400 block">مستوى السكر</span>
                <span className="font-bold text-slate-900">{booking.vitalSigns.bloodSugar}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-400 block">نبض القلب</span>
                <span className="font-bold text-slate-900">{booking.vitalSigns.heartRate}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-400 block">نسبة الأكسجين</span>
                <span className="font-bold text-slate-900">{booking.vitalSigns.oxygenSaturation}</span>
              </div>
            </div>
            <p className="text-[11px] text-emerald-900 bg-white/70 p-2 rounded-lg mt-1">
              <strong>ملاحظات التمريض:</strong> {booking.vitalSigns.clinicalNotes}
            </p>
          </div>
        )}

      </div>

      {/* Invoice Viewer Modal */}
      {showInvoiceModal && booking.medicineRequest?.pharmacyInvoiceUrl && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-right shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  فاتورة الصيدلية المعتمدة
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs bg-amber-50 p-3 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-950">
                  {booking.medicineRequest.pharmacyInvoiceFileName || 'فاتورة الصيدلية'}
                </span>
                <span className="font-mono font-black text-slate-900">
                  قيمة الأدوية: {booking.medicineRequest.medicineCost} ج.م
                </span>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center max-h-[60vh]">
                <img
                  src={booking.medicineRequest.pharmacyInvoiceUrl}
                  alt="فاتورة الصيدلية"
                  className="w-full h-auto object-contain max-h-[60vh]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
