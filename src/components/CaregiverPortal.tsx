import React, { useState, useEffect } from 'react';
import { Caregiver, BookingOrder, BookingStatus, VitalSignsRecord } from '../types';
import { 
  Bell, 
  CheckCircle2, 
  MapPin, 
  PhoneCall, 
  MessageSquare, 
  Activity, 
  FileText, 
  User, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Award,
  AlertTriangle,
  Send,
  Navigation,
  Zap,
  Flame,
  Lock,
  ShoppingBag,
  Receipt,
  Upload,
  Eye,
  Camera,
  Check,
  Plus
} from 'lucide-react';
import { formatPaymentMethodLabel } from './PaymentMethodSection';

interface CaregiverPortalProps {
  caregiver: Caregiver;
  bookings: BookingOrder[];
  onUpdateStatus: (bookingId: string, status: BookingStatus, stage: number) => void;
  onSubmitVitalSigns: (bookingId: string, vitals: VitalSignsRecord) => void;
  onOpenChat: (booking: BookingOrder) => void;
  onOpenTracking?: (booking: BookingOrder) => void;
  onUpdateMedicineInvoice?: (
    bookingId: string,
    medicineCost: number,
    invoiceUrl: string,
    invoiceFileName?: string
  ) => void;
}

export const CaregiverPortal: React.FC<CaregiverPortalProps> = ({
  caregiver,
  bookings,
  onUpdateStatus,
  onSubmitVitalSigns,
  onOpenChat,
  onOpenTracking,
  onUpdateMedicineInvoice
}) => {
  // Active urgent alert simulation
  const [showIncomingAlert, setShowIncomingAlert] = useState(true);
  const [alertSeconds, setAlertSeconds] = useState(45);

  // Medicine Invoice Entry State
  const [medicineCostInput, setMedicineCostInput] = useState('');
  const [pharmacyInvoiceUrl, setPharmacyInvoiceUrl] = useState('');
  const [pharmacyInvoiceFileName, setPharmacyInvoiceFileName] = useState('');
  const [isEditingInvoice, setIsEditingInvoice] = useState(false);
  const [invoiceSuccessMsg, setInvoiceSuccessMsg] = useState(false);
  const [previewInvoiceModal, setPreviewInvoiceModal] = useState<{ url: string; fileName: string; cost?: number } | null>(null);

  // Vital signs entry form state
  const [selectedBookingForVitals, setSelectedBookingForVitals] = useState<BookingOrder | null>(null);
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [bloodSugar, setBloodSugar] = useState('115 mg/dL');
  const [heartRate, setHeartRate] = useState('74 bpm');
  const [oxygenSaturation, setOxygenSaturation] = useState('98%');
  const [temperature, setTemperature] = useState('36.8 °C');
  const [clinicalNotes, setClinicalNotes] = useState('المريض بحالة مستقرة، تم عمل الغيار المعقم والمحلول الوريدي بكفاءة وبدون أي ارتشاح.');

  const caregiverBookings = bookings.filter(b => b.caregiverId === caregiver.id || b.caregiverName.includes(caregiver.name.slice(0, 5)));
  const activeVisit = caregiverBookings.find(b => b.status === 'on_the_way' || b.status === 'arrived_in_progress' || b.status === 'confirmed');

  // Sync medicine request data when activeVisit changes
  useEffect(() => {
    if (activeVisit?.medicineRequest?.requested) {
      if (activeVisit.medicineRequest.medicineCost !== undefined && activeVisit.medicineRequest.medicineCost > 0) {
        setMedicineCostInput(String(activeVisit.medicineRequest.medicineCost));
        setPharmacyInvoiceUrl(activeVisit.medicineRequest.pharmacyInvoiceUrl || '');
        setPharmacyInvoiceFileName(activeVisit.medicineRequest.pharmacyInvoiceFileName || '');
        setIsEditingInvoice(false);
      } else {
        setMedicineCostInput('');
        setPharmacyInvoiceUrl('');
        setPharmacyInvoiceFileName('');
        setIsEditingInvoice(true);
      }
    }
  }, [activeVisit?.id, activeVisit?.medicineRequest?.medicineCost, activeVisit?.medicineRequest?.pharmacyInvoiceUrl]);

  const handleInvoiceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPharmacyInvoiceUrl(result);
        setPharmacyInvoiceFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMedicineInvoice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeVisit) return;
    const cost = parseFloat(medicineCostInput) || 0;
    const invUrl = pharmacyInvoiceUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80';
    const invName = pharmacyInvoiceFileName || 'فاتورة_صيدلية_معتمدة.jpg';

    if (onUpdateMedicineInvoice) {
      onUpdateMedicineInvoice(activeVisit.id, cost, invUrl, invName);
    }
    setIsEditingInvoice(false);
    setInvoiceSuccessMsg(true);
    setTimeout(() => setInvoiceSuccessMsg(false), 4000);
  };

  const handleVitalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForVitals) return;

    const vitalsRecord: VitalSignsRecord = {
      bloodPressure,
      bloodSugar,
      heartRate,
      oxygenSaturation,
      temperature,
      clinicalNotes,
      recordedAt: new Date().toISOString(),
      nurseName: caregiver.name
    };

    onSubmitVitalSigns(selectedBookingForVitals.id, vitalsRecord);
    onUpdateStatus(selectedBookingForVitals.id, 'completed', 4);
    setSelectedBookingForVitals(null);
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Caregiver Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-right">
            <img
              src={caregiver.avatar}
              alt={caregiver.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-teal-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{caregiver.name}</h1>
                <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                  ممرض معتمد
                </span>
              </div>
              <p className="text-xs font-semibold text-teal-800 mt-1">{caregiver.institution.replace(/\s*\(دفعة\s*\d+\)/g, '')}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2 text-xs">
                <span className="font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                  <span>موثق و معتمد</span>
                  <span>✅</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  (هذه الشارة تظهر لجميع العملاء لحماية سرية مستنداتك)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center w-full sm:w-auto">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 min-w-[90px]">
              <span className="text-lg font-black text-slate-900 tabular-nums">{caregiver.acceptanceRate}%</span>
              <span className="text-[10px] text-slate-500 block">نسبة القبول</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 min-w-[90px]">
              <span className="text-lg font-black text-emerald-600 tabular-nums">{caregiver.punctualityScore}%</span>
              <span className="text-[10px] text-slate-500 block">انضباط المواعيد</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 min-w-[90px]">
              <span className="text-lg font-black text-teal-700 tabular-nums">{caregiver.completedVisits}</span>
              <span className="text-[10px] text-slate-500 block">زيارة منجزة</span>
            </div>
          </div>
        </div>

        {/* Private Documents Vault - Strictly for Account Owner */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-700" />
              <h3 className="text-sm font-bold text-slate-900">
                ملفي ومستنداتي المهنية المعتمدة (خاص بصاحب الأكونت):
              </h3>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <span>الحالة المعروضة للعملاء: موثق و معتمد</span>
              <span>✅</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">كارنيه مزاولة المهنة:</span>
                <span className="text-[11px] text-slate-500">ساري وموثق رسمياً</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">تحليل كشف المخدرات:</span>
                <span className="text-[11px] text-slate-500">معتمد من مستشفى حكومي (سلبي وخالٍ تماماً)</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">شهادة التخرج والمؤهل:</span>
                <span className="text-[11px] text-slate-500">موثقة ومطابقة للأصل</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">فيش وتشبيه:</span>
                <span className="text-[11px] text-slate-500">صحيفة حالة جنائية حديثة خالية من السوابق</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>حماية الخصوصية:</strong> لا يتم عرض هذه المستندات لأي مريض أو عميل في ملفك الشخصي؛ وتظهر لهم فقط شارة <strong>«موثق و معتمد ✅»</strong> لتأكيد أمان ومصداقية تقديم الخدمة.
            </span>
          </p>
        </div>

        {/* Real-time Push Alert for Caregiver on New Urgent Request (Specifically requested in prompt) */}
        {showIncomingAlert && (
          <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-teal-950 rounded-3xl p-6 text-white shadow-xl border-2 border-rose-500/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-500/40 animate-pulse">
                  <Flame className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>🚨 طلب تمريضي عاجل (أولوية طوارئ - سعره أعلى)!</span>
                    <span className="text-[11px] bg-rose-500 text-white font-mono px-2 py-0.5 rounded-full">
                      متبقي 45 ثانية
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    المريض في نطاق منطقتك (على بُعد 1.8 كم - المعادي) · يشمل بدل استجابة طارئة (+150 ج.م)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIncomingAlert(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                تخطي
              </button>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">الخدمة المطلوبة:</span>
                <span className="font-bold text-teal-300">تركيب محاليل وكانيولا وريدية (IV Infusion)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">المريض:</span>
                <span className="font-bold text-white">فاطمة محمود (64 سنة)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">نوع الطلب والتسعير:</span>
                <span className="font-bold text-rose-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>طلب عاجل (370 ج.م شامل +150 طوارئ)</span>
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">حالة الأدوية:</span>
                <span className="font-bold text-amber-300">العلاج غير متاح (الممرض يحضره)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => {
                  setShowIncomingAlert(false);
                  if (activeVisit) {
                    onUpdateStatus(activeVisit.id, 'on_the_way', 2);
                  }
                }}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>قبول الطلب العاجل فوراً والتحرك إلى المريض</span>
              </button>
              <button
                onClick={() => setShowIncomingAlert(false)}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all"
              >
                رفض الطلب
              </button>
            </div>
          </div>
        )}

        {/* Current Active Visit Management */}
        {activeVisit && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-500/40 shadow-md space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-teal-600 animate-pulse"></span>
                <h2 className="text-lg font-bold text-slate-900">الزيارة الجارية حالياً تحت إشرافك</h2>
                <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {activeVisit.id}
                </span>
                {activeVisit.isUrgent && (
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-rose-600" />
                    <span>طلب عاجل (+{activeVisit.urgentFee || 150} ج.م)</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-lg">
                  {activeVisit.serviceTitle}
                </span>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg font-mono">
                  {activeVisit.payment.amount} ج.م
                </span>
              </div>
            </div>

            {/* Patient pre-booking details for the nurse */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">المريض والعنوان:</span>
                <span className="font-bold text-slate-800">{activeVisit.patient.fullName} ({activeVisit.patient.age} سنة)</span>
                <p className="text-[11px] text-slate-600 mt-0.5">{activeVisit.patient.address}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">الأمراض المزمنة والحساسية:</span>
                <span className="font-bold text-slate-800">{activeVisit.patient.chronicDiseases}</span>
                <p className="text-[11px] text-rose-600 font-semibold mt-0.5">
                  حساسية: {activeVisit.patient.forbiddenMedications}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">مستلزمات الصيدلية:</span>
                <span className="font-bold text-amber-700">
                  {activeVisit.patient.medicationAvailable ? 'متوفرة بالمنزل' : 'يجب إحضار العلاج من الصيدلية'}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  المرفقات: {activeVisit.patient.medicalReports.join(' · ')}
                </p>
              </div>
            </div>

            {/* Medicine Request & Pharmacy Invoice Card for Nurse (إحضار أدوية) */}
            {activeVisit.medicineRequest?.requested && (
              <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-50 border-2 border-amber-300 shadow-xs space-y-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-amber-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold">
                      <ShoppingBag className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        طلب إحضار أدوية من الصيدلية بواسطة الممرض
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        طلب العميل شراء وتوصيل مستلزمات طبية، قم بتسجيل التكلفة الفعلية وإرفاق الفاتورة فور الوصول.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-900 font-black px-3 py-1 rounded-xl border border-amber-300 text-xs flex items-center gap-1.5 shadow-2xs">
                      <span>سعر الخدمة: 30 جنيه</span>
                      <span className="text-amber-600">✓</span>
                    </span>
                  </div>
                </div>

                {/* Requested Medicines Details from Patient */}
                <div className="bg-white p-3.5 rounded-2xl border border-amber-200 space-y-1.5 shadow-2xs">
                  <span className="text-[11px] font-bold text-amber-950 block">
                    الأدوية والمستلزمات المطلوبة من العميل:
                  </span>
                  <p className="text-slate-800 font-semibold text-xs leading-relaxed">
                    {activeVisit.medicineRequest.details || 'لم يتم تحديد تفاصيل إضافية'}
                  </p>
                </div>

                {/* Success alert on save */}
                {invoiceSuccessMsg && (
                  <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl border border-emerald-300 flex items-center gap-2 font-bold animate-in fade-in">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>تم اعتماد فاتورة الأدوية بنجاح وتحديث إجمالي حساب الزيارة تلقائياً!</span>
                  </div>
                )}

                {/* Display Mode (when already recorded and not editing) */}
                {!isEditingInvoice && activeVisit.medicineRequest.medicineCost !== undefined && activeVisit.medicineRequest.medicineCost > 0 ? (
                  <div className="bg-white/80 p-4 rounded-2xl border border-emerald-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span className="font-bold text-slate-900 text-xs">
                          تم توثيق فاتورة الأدوية والأسعار بنجاح
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditingInvoice(true)}
                        className="text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline"
                      >
                        تعديل أسعار الفاتورة والمرفق
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">سعر الأدوية الفعلي (من الفاتورة)</span>
                        <span className="font-black text-slate-900 text-sm font-mono">
                          {activeVisit.medicineRequest.medicineCost} ج.م
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">سعر خدمة إحضار الأدوية</span>
                        <span className="font-black text-teal-800 text-sm font-mono">
                          +30 ج.م
                        </span>
                      </div>
                      <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                        <span className="text-[10px] text-amber-800 block font-bold">إجمالي إضافي على الزيارة</span>
                        <span className="font-black text-amber-950 text-sm font-mono">
                          {(activeVisit.medicineRequest.medicineCost || 0) + 30} ج.م
                        </span>
                      </div>
                    </div>

                    {/* Invoice Receipt Thumbnail / Link */}
                    {activeVisit.medicineRequest.pharmacyInvoiceUrl && (
                      <div className="flex items-center justify-between gap-3 p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-emerald-700" />
                          <span className="font-bold text-slate-800 text-xs">صورة فاتورة الصيدلية المرفقة:</span>
                          <span className="font-mono text-[11px] text-slate-600 truncate max-w-[180px]">
                            {activeVisit.medicineRequest.pharmacyInvoiceFileName || 'فاتورة_صيدلية.jpg'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewInvoiceModal({
                            url: activeVisit.medicineRequest?.pharmacyInvoiceUrl || '',
                            fileName: activeVisit.medicineRequest?.pharmacyInvoiceFileName || 'فاتورة الصيدلية',
                            cost: activeVisit.medicineRequest?.medicineCost
                          })}
                          className="px-3 py-1 bg-white hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg border border-emerald-300 flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>معاينة الفاتورة</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Form to enter actual price and upload pharmacy invoice */
                  <form onSubmit={handleSaveMedicineInvoice} className="bg-white p-4 rounded-2xl border border-amber-300/80 space-y-4 shadow-2xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 1. Actual Medicine Price */}
                      <div>
                        <label className="block font-bold text-slate-800 text-xs mb-1">
                          سعر الأدوية الفعلي المكتوب بفاتورة الصيدلية (ج.م) *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            required
                            value={medicineCostInput}
                            onChange={(e) => setMedicineCostInput(e.target.value)}
                            placeholder="مثال: 145"
                            className="w-full pl-12 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                          />
                          <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                            ج.م
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          اكتب إجمالي قيمة الأدوية المدفوعة في الصيدلية بدقة طبقاً للإيصال الورقي.
                        </span>
                      </div>

                      {/* 2. Pharmacy Invoice Image Upload */}
                      <div>
                        <label className="block font-bold text-slate-800 text-xs mb-1">
                          إرفاق صورة فاتورة الصيدلية المعتمدة *
                        </label>
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor="nurse-invoice-upload-input"
                            className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-dashed border-amber-300 transition-colors"
                          >
                            <Camera className="w-4 h-4 text-amber-700" />
                            <span>
                              {pharmacyInvoiceFileName ? 'تغيير صورة الفاتورة' : 'تصوير أو رفع صورة الفاتورة'}
                            </span>
                          </label>
                          <input
                            id="nurse-invoice-upload-input"
                            type="file"
                            accept="image/*"
                            onChange={handleInvoiceFileUpload}
                            className="hidden"
                          />
                        </div>
                        {pharmacyInvoiceFileName && (
                          <div className="flex items-center justify-between gap-2 mt-1 text-[11px] text-emerald-700 font-bold">
                            <span className="truncate">✓ تم اختيار: {pharmacyInvoiceFileName}</span>
                            {pharmacyInvoiceUrl && (
                              <button
                                type="button"
                                onClick={() => setPreviewInvoiceModal({
                                  url: pharmacyInvoiceUrl,
                                  fileName: pharmacyInvoiceFileName,
                                  cost: parseFloat(medicineCostInput) || undefined
                                })}
                                className="text-teal-700 hover:underline"
                              >
                                معاينة
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Demo Pre-fills for ease of testing */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] text-slate-400">أمثلة سريعة للتجربة:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setMedicineCostInput('145');
                          setPharmacyInvoiceUrl('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80');
                          setPharmacyInvoiceFileName('فاتورة_صيدلية_العزبي_145جم.jpg');
                        }}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-semibold"
                      >
                        فاتورة صيدلية العزبي (145 ج.م)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMedicineCostInput('85');
                          setPharmacyInvoiceUrl('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80');
                          setPharmacyInvoiceFileName('فاتورة_صيدلية_19011_85جم.jpg');
                        }}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-semibold"
                      >
                        فاتورة صيدلية 19011 (85 ج.م)
                      </button>
                    </div>

                    {/* Calculation breakdown */}
                    <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-2 text-slate-700">
                        <span>سعر الأدوية: <strong className="text-slate-900 font-mono">{medicineCostInput || '0'} ج.م</strong></span>
                        <span>+</span>
                        <span>سعر خدمة الإحضار: <strong className="text-teal-800 font-mono">30 ج.م</strong></span>
                        <span>=</span>
                        <span>الإجمالي المضاف: <strong className="text-amber-950 font-mono font-black text-sm">{(parseFloat(medicineCostInput) || 0) + 30} ج.م</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isEditingInvoice && activeVisit.medicineRequest.medicineCost && (
                          <button
                            type="button"
                            onClick={() => setIsEditingInvoice(false)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                          >
                            إلغاء التعديل
                          </button>
                        )}
                        <button
                          type="submit"
                          className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>حفظ واعتماد فاتورة الأدوية والأسعار</span>
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Live Location and Risk Protection Status for the nurse */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm">البث المباشر للموقع مفعل لحمايتك ولحماية العميل</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>
                  <span className="text-[11px] text-slate-300">
                    يستمر التتبع المباشر المشفر حتى نهاية الجلسة لتوثيق سلامة الإجراء ومكافحة المخاطر.
                  </span>
                </div>
              </div>
              {onOpenTracking && (
                <button
                  type="button"
                  onClick={() => onOpenTracking(activeVisit)}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>عرض خريطة التتبع المباشر</span>
                </button>
              )}
            </div>

            {/* Caregiver Live Status Actions */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 block">
                تحديث مسار وحالة الزيارة لحظياً للمريض:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => onUpdateStatus(activeVisit.id, 'on_the_way', 2)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeVisit.status === 'on_the_way'
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Navigation className="w-4 h-4" />
                  <span>1. أنا في الطريق للمريض</span>
                </button>

                <button
                  onClick={() => onUpdateStatus(activeVisit.id, 'arrived_in_progress', 3)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeVisit.status === 'arrived_in_progress'
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>2. وصلت للمريض وبدأت الإجراء</span>
                </button>

                <button
                  onClick={() => setSelectedBookingForVitals(activeVisit)}
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>3. تسجيل العلامات وإنهاء الزيارة</span>
                </button>
              </div>
            </div>

            {/* Quick Chat & Call with Patient */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => onOpenChat(activeVisit)}
                className="px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span>شات المريض والتنسيق المباشر</span>
              </button>

              <a
                href={`tel:${activeVisit.patient.phone}`}
                className="px-4 py-2.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-teal-600" />
                <span>الاتصال بالمريض: {activeVisit.patient.phone}</span>
              </a>
            </div>
          </div>
        )}

        {/* All Caregiver Assigned Visits */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">سجل طلبات وزيارات الممرض:</h3>
          
          <div className="space-y-3">
            {caregiverBookings.map((bk) => (
              <div
                key={bk.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{bk.serviceTitle}</span>
                    <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                      {bk.id}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    المريض: <strong className="text-slate-800">{bk.patient.fullName}</strong> · العنوان: {bk.patient.address}
                  </p>
                  <p className="text-slate-400 mt-0.5">
                    الموعد: {bk.scheduledDate} ({bk.scheduledTime}) · الدفع: {formatPaymentMethodLabel(bk.payment.method)} ({bk.payment.amount} ج.م)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                    bk.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : bk.status === 'on_the_way'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {bk.status === 'completed' ? 'مكتملة' : bk.status === 'on_the_way' ? 'في الطريق' : 'قيد التنفيذ'}
                  </span>

                  <button
                    onClick={() => onOpenChat(bk)}
                    className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200"
                    title="محادثة"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Vital Signs Entry Modal */}
      {selectedBookingForVitals && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 text-right shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                تسجيل العلامات الحيوية وإنهاء الزيارة ({selectedBookingForVitals.id})
              </h3>
              <button
                onClick={() => setSelectedBookingForVitals(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleVitalsSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ضغط الدم (Blood Pressure)</label>
                  <input
                    type="text"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    placeholder="120/80"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">سكر الدم (Blood Sugar)</label>
                  <input
                    type="text"
                    value={bloodSugar}
                    onChange={(e) => setBloodSugar(e.target.value)}
                    placeholder="110 mg/dL"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">معدل النبض (Heart Rate)</label>
                  <input
                    type="text"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    placeholder="75 bpm"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">نسبة الأكسجين (O2 Saturation)</label>
                  <input
                    type="text"
                    value={oxygenSaturation}
                    onChange={(e) => setOxygenSaturation(e.target.value)}
                    placeholder="98%"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">درجة الحرارة</label>
                <input
                  type="text"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="36.8 °C"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  التقرير التمريضي وملاحظات الإجراء:
                </label>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForVitals(null)}
                  className="text-xs text-slate-500 font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  اعتماد التقرير وإنهاء الزيارة بنجاح
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pharmacy Invoice Preview Modal */}
      {previewInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-right shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  معاينة فاتورة الصيدلية المرفقة
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewInvoiceModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs bg-amber-50 p-3 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-950">
                  {previewInvoiceModal.fileName}
                </span>
                {previewInvoiceModal.cost !== undefined && (
                  <span className="font-mono font-black text-slate-900">
                    قيمة الفاتورة: {previewInvoiceModal.cost} ج.م
                  </span>
                )}
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center max-h-[60vh]">
                <img
                  src={previewInvoiceModal.url}
                  alt={previewInvoiceModal.fileName}
                  className="w-full h-auto object-contain max-h-[60vh]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPreviewInvoiceModal(null)}
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

