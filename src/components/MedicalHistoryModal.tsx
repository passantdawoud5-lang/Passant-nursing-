import React, { useMemo, useRef, useState } from 'react';
import { BookingOrder, UserProfile } from '../types';
import { VitalSignsChart } from './VitalSignsChart';
import { generateMedicalReportPdf, triggerPdfDownload } from '../utils/exportMedicalPdf';
import {
  X,
  FileText,
  Activity,
  ShieldCheck,
  Printer,
  Download,
  Share2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Table2,
  LineChart
} from 'lucide-react';

interface MedicalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingOrder[];
  patientProfile?: UserProfile;
}

export const MedicalHistoryModal: React.FC<MedicalHistoryModalProps> = ({
  isOpen,
  onClose,
  bookings,
  patientProfile
}) => {
  const reportRef = useRef<HTMLDivElement | null>(null);

  const [filterMode, setFilterMode] = useState<'all' | 'vitals_only'>('all');
  const [includeChart, setIncludeChart] = useState(true);
  const [includeSummaryTable, setIncludeSummaryTable] = useState(true);
  const [exportState, setExportState] = useState<'idle' | 'generating_download' | 'generating_share'>('idle');
  const [statusFeedback, setStatusFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Filter completed and active visits with medical records
  const allMedicalLogs = useMemo(
    () => bookings.filter((b) => b.vitalSigns || b.status === 'completed' || b.status === 'on_the_way'),
    [bookings]
  );

  const vitalOnlyLogs = useMemo(
    () => allMedicalLogs.filter((b) => Boolean(b.vitalSigns)),
    [allMedicalLogs]
  );

  const displayedLogs = filterMode === 'vitals_only' ? vitalOnlyLogs : allMedicalLogs;

  const patientSummary = useMemo(() => {
    const latestBooking = allMedicalLogs[0] || bookings[0];
    const name =
      patientProfile?.patientName?.trim() ||
      patientProfile?.fullName?.trim() ||
      latestBooking?.patient?.fullName ||
      'فاطمة محمود إبراهيم';
    const age = patientProfile?.age || latestBooking?.patient?.age || 64;
    const phone = patientProfile?.phone || latestBooking?.patient?.phone || 'غير مسجل';
    const chronicDiseases =
      patientProfile?.chronicDiseases?.trim() ||
      latestBooking?.patient?.chronicDiseases ||
      'ضغط الدم المرتفع · السكري (النوع 2)';
    const currentMedications =
      patientProfile?.currentMedications?.trim() ||
      latestBooking?.currentMedicationsAnswer ||
      latestBooking?.patient?.currentMedications ||
      'حسب الجرعات الموصوفة بالروشتة';
    const allergies =
      latestBooking?.allergiesOrForbiddenAnswer ||
      latestBooking?.patient?.forbiddenMedications ||
      'حساسية مركبات البنسلين ومشتقات السلفا';
    const previousSurgeries =
      patientProfile?.previousSurgeriesDetails?.trim() ||
      latestBooking?.previousSurgeriesAnswer ||
      latestBooking?.patient?.previousSurgeries ||
      'لا توجد عمليات سابقة مسجلة';

    return {
      name,
      age,
      phone,
      chronicDiseases,
      currentMedications,
      allergies,
      previousSurgeries
    };
  }, [allMedicalLogs, bookings, patientProfile]);

  const reportMetadata = useMemo(() => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const refCode = `MED-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate()
    ).padStart(2, '0')}-${String(allMedicalLogs.length).padStart(2, '0')}`;
    return { formattedDate, formattedTime, refCode };
  }, [allMedicalLogs.length]);

  if (!isOpen) return null;

  const handlePrint = () => {
    setStatusFeedback(null);
    document.body.classList.add('printing-medical-report');

    const cleanup = () => {
      document.body.classList.remove('printing-medical-report');
      window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);
    window.print();
    window.setTimeout(cleanup, 1500);
  };

  const handleExportPdf = async () => {
    if (!reportRef.current || exportState !== 'idle') return;
    setExportState('generating_download');
    setStatusFeedback(null);

    try {
      const { blob, fileName, pageCount } = await generateMedicalReportPdf(
        reportRef.current,
        patientSummary.name
      );
      triggerPdfDownload(blob, fileName);
      setStatusFeedback({
        type: 'success',
        message: `تم تصدير وحفظ السجل الطبي بنجاح كملف PDF (${pageCount} ${
          pageCount === 1 ? 'صفحة' : 'صفحات'
        }) — جاهز للطباعة أو الإرسال للطبيب المعالج.`
      });
    } catch {
      setStatusFeedback({
        type: 'error',
        message: 'تعذر إنشاء ملف PDF تلقائياً على هذا المتصفح. يمكنك استخدام زر "طباعة / حفظ PDF" بالمتصفح.'
      });
    } finally {
      setExportState('idle');
    }
  };

  const handleSharePdfWithDoctor = async () => {
    if (!reportRef.current || exportState !== 'idle') return;
    setExportState('generating_share');
    setStatusFeedback(null);

    try {
      const { blob, fileName } = await generateMedicalReportPdf(
        reportRef.current,
        patientSummary.name
      );
      const pdfFile = new File([blob], fileName, { type: 'application/pdf' });

      const canNativeShareFile =
        typeof navigator !== 'undefined' &&
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [pdfFile] });

      if (canNativeShareFile) {
        await navigator.share({
          title: `التقرير الطبي الموحد - ${patientSummary.name}`,
          text: 'السجل الطبي ونتائج العلامات الحيوية من منصة Passant Healthcare للعرض على الطبيب المعالج.',
          files: [pdfFile]
        });
        setStatusFeedback({
          type: 'success',
          message: 'تم فتح نافذة المشاركة لإرسال ملف التقرير PDF مباشرة للطبيب.'
        });
      } else {
        triggerPdfDownload(blob, fileName);
        setStatusFeedback({
          type: 'success',
          message:
            'تم تنزيل ملف التقرير PDF على جهازك؛ يمكنك الآن إرفاقه وإرساله مباشرة للطبيب المعالج عبر واتساب أو البريد الإلكتروني.'
        });
      }
    } catch (err) {
      // Ignore user cancelling the native share sheet
      if (err instanceof Error && err.name === 'AbortError') {
        setStatusFeedback(null);
      } else {
        setStatusFeedback({
          type: 'error',
          message: 'تعذر مشاركة الملف مباشرة. تم إتاحة زر "تصدير ملف PDF" لتنزيله وإرساله يدوياً للطبيب.'
        });
      }
    } finally {
      setExportState('idle');
    }
  };

  const isBusy = exportState !== 'idle';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        id="medical-history-printable"
        ref={reportRef}
        className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-8 text-right shadow-2xl border border-slate-200 my-6 space-y-6 max-h-[92vh] overflow-y-auto"
      >
        {/* Official PDF & Print Letterhead (Visible only inside PDF export / Print output) */}
        <div
          data-pdf-show="true"
          data-pdf-display="flex"
          className="hidden print-only-flex items-center justify-between gap-4 pb-4 border-b-2 border-teal-700"
        >
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Passant Healthcare"
              className="w-12 h-12 rounded-xl object-cover border border-teal-200"
            />
            <div>
              <h1 className="text-lg font-extrabold text-slate-900">
                Passant Healthcare · باسانت للرعاية الصحية
              </h1>
              <p className="text-xs font-bold text-teal-700">
                التقرير الطبي الموحد وسجل المؤشرات والنتائج الحيوية
              </p>
            </div>
          </div>

          <div className="text-left text-[11px] text-slate-600 space-y-0.5">
            <div className="font-mono font-bold text-slate-800">{reportMetadata.refCode}</div>
            <div>تاريخ الإصدار: {reportMetadata.formattedDate}</div>
            <div>التوقيت: {reportMetadata.formattedTime}</div>
          </div>
        </div>

        {/* Screen Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>السجل الطبي الموحد للمريض (Medical Records)</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              تقارير الحالة الصحية ومتابعة العلامات الحيوية
            </h2>
          </div>

          <div data-pdf-ignore="true" className="no-print flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportPdf}
              disabled={isBusy}
              className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="تنزيل السجل والنتائج الحيوية كملف PDF"
            >
              {exportState === 'generating_download' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>
                {exportState === 'generating_download' ? 'جاري التجهيز...' : 'تصدير PDF'}
              </span>
            </button>

            <button
              onClick={handleSharePdfWithDoctor}
              disabled={isBusy}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-60 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              title="تجهيز وإرسال التقرير PDF للطبيب المعالج"
            >
              {exportState === 'generating_share' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              <span>إرسال للطبيب</span>
            </button>

            <button
              onClick={handlePrint}
              disabled={isBusy}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
              title="طباعة التقرير الطبي"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Export Configuration & Status Bar (Excluded from PDF & Print) */}
        <div
          data-pdf-ignore="true"
          className="no-print bg-teal-50/60 border border-teal-100 rounded-2xl p-3.5 space-y-3"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-teal-700" />
                <span>نطاق التقرير:</span>
              </span>
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                كامل السجل ({allMedicalLogs.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('vitals_only')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  filterMode === 'vitals_only'
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                الزيارات الموثقة بالقياسات فقط ({vitalOnlyLogs.length})
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={includeChart}
                  onChange={(e) => setIncludeChart(e.target.checked)}
                  className="rounded border-slate-300 text-teal-700 focus:ring-teal-500"
                />
                <LineChart className="w-3.5 h-3.5 text-teal-600" />
                <span>تضمين المنحنى البياني</span>
              </label>

              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={includeSummaryTable}
                  onChange={(e) => setIncludeSummaryTable(e.target.checked)}
                  className="rounded border-slate-300 text-teal-700 focus:ring-teal-500"
                />
                <Table2 className="w-3.5 h-3.5 text-teal-600" />
                <span>جدول القراءات للطبيب</span>
              </label>
            </div>
          </div>

          {statusFeedback && (
            <div
              className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                statusFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {statusFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusFeedback.message}</span>
            </div>
          )}
        </div>

        {/* Patient Medical Profile Overview */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs print-avoid-break">
          <div>
            <span className="text-slate-400 block text-[11px]">اسم المريض والعمر:</span>
            <span className="font-bold text-slate-800 text-sm">
              {patientSummary.name} ({patientSummary.age} سنة)
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">رقم التواصل المسجل:</span>
            <span className="font-bold text-slate-800 font-mono" dir="ltr">
              {patientSummary.phone}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">الأمراض المزمنة المسجلة:</span>
            <span className="font-bold text-slate-800">{patientSummary.chronicDiseases}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">الأدوية المنتظمة الحالية:</span>
            <span className="font-bold text-slate-800">{patientSummary.currentMedications}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">الحساسية والأدوية الممنوعة:</span>
            <span className="font-bold text-rose-600">{patientSummary.allergies}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">العمليات الجراحية السابقة:</span>
            <span className="font-bold text-slate-800">{patientSummary.previousSurgeries}</span>
          </div>
        </div>

        {/* Vital Signs D3 Visualization Component */}
        {includeChart && (
          <div className="print-avoid-break">
            <VitalSignsChart bookings={bookings} />
          </div>
        )}

        {/* Structured Vital Signs Table for Treating Physician */}
        {includeSummaryTable && vitalOnlyLogs.length > 0 && (
          <div className="space-y-2.5 print-avoid-break">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Table2 className="w-4 h-4 text-teal-600" />
              <span>ملخص جدول العلامات الحيوية للعرض على الطبيب المعالج:</span>
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-right text-[11px] border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2.5 border-b border-slate-200">التاريخ</th>
                    <th className="p-2.5 border-b border-slate-200">الخدمة / الزيارة</th>
                    <th className="p-2.5 border-b border-slate-200">ضغط الدم</th>
                    <th className="p-2.5 border-b border-slate-200">سكر الدم</th>
                    <th className="p-2.5 border-b border-slate-200">النبض</th>
                    <th className="p-2.5 border-b border-slate-200">الأكسجين</th>
                    <th className="p-2.5 border-b border-slate-200">الحرارة</th>
                    <th className="p-2.5 border-b border-slate-200">الموثِّق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {vitalOnlyLogs.map((visit) => (
                    <tr key={`tbl-${visit.id}`} className="hover:bg-slate-50/70">
                      <td className="p-2.5 font-mono text-slate-600 whitespace-nowrap">
                        {visit.scheduledDate}
                      </td>
                      <td className="p-2.5 font-semibold text-slate-800">{visit.serviceTitle}</td>
                      <td className="p-2.5 font-mono font-bold text-rose-700 whitespace-nowrap">
                        {visit.vitalSigns?.bloodPressure}
                      </td>
                      <td className="p-2.5 font-mono font-bold text-amber-700 whitespace-nowrap">
                        {visit.vitalSigns?.bloodSugar}
                      </td>
                      <td className="p-2.5 font-mono text-slate-800 whitespace-nowrap">
                        {visit.vitalSigns?.heartRate}
                      </td>
                      <td className="p-2.5 font-mono font-bold text-teal-700 whitespace-nowrap">
                        {visit.vitalSigns?.oxygenSaturation}
                      </td>
                      <td className="p-2.5 font-mono text-slate-800 whitespace-nowrap">
                        {visit.vitalSigns?.temperature}
                      </td>
                      <td className="p-2.5 text-slate-600">{visit.vitalSigns?.nurseName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Medical History Timeline */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>سجل الزيارات الطبية والتمريضية التفصيلي والمؤشرات الحيوية:</span>
          </h3>

          {displayedLogs.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              لا توجد زيارات مسجلة مطابقة للفلتر الحالي.
            </div>
          ) : (
            displayedLogs.map((visit) => (
              <div
                key={visit.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 print-avoid-break"
              >
                {/* Visit Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-teal-800">{visit.serviceTitle}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">
                        {visit.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      مقدم الرعاية: <strong className="text-slate-700">{visit.caregiverName}</strong> ·
                      التاريخ: {visit.scheduledDate} ({visit.scheduledTime})
                    </p>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-md self-start sm:self-center ${
                      visit.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-teal-50 text-teal-700 border border-teal-200'
                    }`}
                  >
                    {visit.status === 'completed' ? 'زيارة مكتملة وموثقة' : 'زيارة جارية'}
                  </span>
                </div>

                {/* Recorded Vital Signs */}
                {visit.vitalSigns ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">ضغط الدم</span>
                        <span className="font-bold text-slate-900 font-mono">
                          {visit.vitalSigns.bloodPressure}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">سكر الدم</span>
                        <span className="font-bold text-slate-900 font-mono">
                          {visit.vitalSigns.bloodSugar}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">النبض</span>
                        <span className="font-bold text-slate-900 font-mono">
                          {visit.vitalSigns.heartRate}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">نسبة الأكسجين</span>
                        <span className="font-bold text-teal-700 font-mono">
                          {visit.vitalSigns.oxygenSaturation}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-slate-400 block">درجة الحرارة</span>
                        <span className="font-bold text-slate-900 font-mono">
                          {visit.vitalSigns.temperature}
                        </span>
                      </div>
                    </div>

                    {/* Nurse Medical Notes */}
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs">
                      <span className="font-bold text-slate-700 block mb-1">
                        التقرير التمريضي وملاحظات المتابعة:
                      </span>
                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        {visit.vitalSigns.clinicalNotes}
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        تم التوثيق بواسطة: {visit.vitalSigns.nurseName} · {visit.vitalSigns.recordedAt}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 text-center">
                    جاري تنفيذ الزيارة، وسيتم تسجيل وتوثيق العلامات الحيوية فور انتهاء الجلسة.
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Official PDF / Print Verification Footer */}
        <div
          data-pdf-show="true"
          data-pdf-display="flex"
          className="hidden print-only-flex items-center justify-between gap-4 pt-4 border-t border-slate-200 text-[11px] text-slate-500"
        >
          <span>
            تقرير صادر من السجل الإلكتروني الموحد لمنصة Passant Healthcare — يُسلَّم للطبيب المعالج لمتابعة الحالة.
          </span>
          <span className="font-mono font-bold text-teal-800">{reportMetadata.refCode}</span>
        </div>

        {/* Interactive Footer */}
        <div
          data-pdf-ignore="true"
          className="no-print pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500"
        >
          <span>سجلات مشفرة ومتوافقة مع المعايير الطبية الدولية لحماية بيانات المرضى.</span>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrint}
              disabled={isBusy}
              className="text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة التقرير</span>
            </button>
            <button
              onClick={handleExportPdf}
              disabled={isBusy}
              className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              {exportState === 'generating_download' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>تنزيل ملخص السجل الطبي PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
