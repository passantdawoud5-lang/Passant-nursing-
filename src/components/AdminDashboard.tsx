import React, { useState } from 'react';
import { 
  BookingOrder, 
  CaregiverApplication, 
  Caregiver, 
  UserProfile,
  AdminOrderStatus,
  SupervisorEvaluation,
  SupervisorTier
} from '../types';
import { 
  ShieldCheck, 
  FileCheck, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Clock, 
  Star, 
  Search, 
  Activity, 
  MapPin, 
  AlertTriangle, 
  Award, 
  Filter, 
  Pill, 
  HeartPulse, 
  User, 
  Zap, 
  Phone, 
  FileText, 
  Calendar, 
  Sparkles, 
  PhoneCall, 
  Flame, 
  Check, 
  ChevronDown, 
  ExternalLink, 
  Receipt, 
  ShoppingBag,
  Sliders,
  ThumbsUp
} from 'lucide-react';
import { formatPaymentMethodLabel, OFFICIAL_PAYMENT_NUMBER } from './PaymentMethodSection';

interface AdminDashboardProps {
  bookings: BookingOrder[];
  applications: CaregiverApplication[];
  caregivers: Caregiver[];
  registeredUsers?: UserProfile[];
  onApproveApplication: (appId: string) => void;
  onRejectApplication: (appId: string) => void;
  onUpdateOrderStatus: (bookingId: string, status: any, stage: number) => void;
  onUpdateAdminStatus?: (bookingId: string, newAdminStatus: AdminOrderStatus, nurseId?: string) => void;
  onUpdateSupervisorEvaluation?: (nurseId: string, evaluation: SupervisorEvaluation) => void;
}

const ADMIN_STATUS_OPTIONS: AdminOrderStatus[] = [
  'جديد',
  'قيد المراجعة',
  'تم تعيين ممرض',
  'مكتمل',
  'ملغي'
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  applications,
  caregivers,
  registeredUsers = [],
  onApproveApplication,
  onRejectApplication,
  onUpdateOrderStatus,
  onUpdateAdminStatus,
  onUpdateSupervisorEvaluation
}) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'orders' | 'caregivers' | 'patients'>('orders');
  const [selectedApp, setSelectedApp] = useState<CaregiverApplication | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<BookingOrder | null>(null);

  // Status Filter for Orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedInvoiceModal, setSelectedInvoiceModal] = useState<{
    url: string;
    fileName: string;
    cost?: number;
    orderId?: string;
  } | null>(null);

  // Supervisor Evaluation State for Caregivers
  const [evaluatingNurse, setEvaluatingNurse] = useState<Caregiver | null>(null);
  const [evalRating, setEvalRating] = useState<number>(5);
  const [evalTier, setEvalTier] = useState<SupervisorTier>('فئة أ (أداء استثنائي فائق الجودة)');
  const [evalQualityScore, setEvalQualityScore] = useState<number>(98);
  const [evalNotes, setEvalNotes] = useState<string>('');
  const [evalEvaluatedBy, setEvalEvaluatedBy] = useState<string>('د. سامح رضوان (مدير الإشراف والمتابعة الطبية)');
  const [evalSuccessMsg, setEvalSuccessMsg] = useState<string | null>(null);

  const handleOpenEvaluationModal = (nurse: Caregiver) => {
    setEvaluatingNurse(nurse);
    setEvalRating(nurse.supervisorEvaluation?.rating || 5);
    setEvalTier(nurse.supervisorEvaluation?.tier || 'فئة أ (أداء استثنائي فائق الجودة)');
    setEvalQualityScore(nurse.supervisorEvaluation?.executionQualityScore || 98);
    setEvalNotes(nurse.supervisorEvaluation?.supervisorNotes || 'التزام فائق بالبروتوكولات الطبية والتعقيم، وحسن تعامل مع المريض وملاحظات ممتازة في كافة الطلبات المكتملة.');
    setEvalEvaluatedBy(nurse.supervisorEvaluation?.evaluatedBy || 'د. سامح رضوان (مدير الإشراف والمتابعة الطبية)');
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingNurse) return;

    const evaluation: SupervisorEvaluation = {
      rating: evalRating,
      tier: evalTier,
      executionQualityScore: evalQualityScore,
      punctualityScore: evaluatingNurse.punctualityScore || 98,
      hygieneAndSterilizationScore: 100,
      supervisorNotes: evalNotes,
      evaluatedBy: evalEvaluatedBy,
      evaluatedAt: new Date().toISOString().split('T')[0]
    };

    if (onUpdateSupervisorEvaluation) {
      onUpdateSupervisorEvaluation(evaluatingNurse.id, evaluation);
    }
    setEvalSuccessMsg(`تم حفظ وتحديث تقييم المشرفين وتصنيف جودة الممرض (${evaluatingNurse.name}) بنجاح.`);
    setTimeout(() => {
      setEvalSuccessMsg(null);
      setEvaluatingNurse(null);
    }, 1200);
  };

  // Handle Status Update
  const handleStatusChange = (bookingId: string, newStatus: AdminOrderStatus, nurseId?: string) => {
    if (onUpdateAdminStatus) {
      onUpdateAdminStatus(bookingId, newStatus, nurseId);
    } else {
      // Fallback
      let legacyStatus = 'pending_acceptance';
      let stage = 0;
      if (newStatus === 'تم تعيين ممرض') {
        legacyStatus = 'confirmed';
        stage = 1;
      } else if (newStatus === 'مكتمل') {
        legacyStatus = 'completed';
        stage = 4;
      } else if (newStatus === 'ملغي') {
        legacyStatus = 'cancelled';
        stage = 0;
      }
      onUpdateOrderStatus(bookingId, legacyStatus, stage);
    }

    if (selectedOrder && selectedOrder.id === bookingId) {
      setSelectedOrder(prev => prev ? { ...prev, adminStatus: newStatus } : null);
    }
  };

  // Filtered Orders
  const filteredOrders = bookings.filter((order) => {
    const currentAdminStatus = order.adminStatus || (
      order.status === 'completed' ? 'مكتمل' :
      order.status === 'on_the_way' ? 'تم تعيين ممرض' :
      order.status === 'cancelled' ? 'ملغي' : 'جديد'
    );

    if (orderStatusFilter !== 'all' && currentAdminStatus !== orderStatusFilter) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = order.patient.fullName.toLowerCase().includes(q);
      const matchPhone = order.patient.phone.includes(q);
      const matchService = order.serviceTitle.toLowerCase().includes(q);
      const matchId = (order.orderNumber || order.id).toLowerCase().includes(q);
      const matchGov = (order.governorate || '').toLowerCase().includes(q);
      return matchName || matchPhone || matchService || matchId || matchGov;
    }

    return true;
  });

  const getStatusBadgeClass = (status: AdminOrderStatus | string) => {
    switch (status) {
      case 'جديد':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'قيد المراجعة':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'تم تعيين ممرض':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'مكتمل':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'ملغي':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/logo.jpg"
              alt="Passant Nursing Logo"
              className="h-12 w-auto object-contain rounded-lg border border-slate-100 hidden sm:block"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                <span className="text-xs font-bold text-teal-700">لوحة تحكم المشرفين والإدارة المركزية</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                إدارة طلبات زيارات التمريض وطاقم الرعاية
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                متابعة بيانات المرضى، إجابات الأسئلة الطبية، مواعيد وعناوين الزيارات، وتعيين الممرضين.
              </p>
            </div>
          </div>

          {/* Quick Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'orders' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              طلبات الزيارات ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'applications' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              تسجيل الممرضين ({applications.filter(a => a.status === 'reviewing').length})
            </button>
            <button
              onClick={() => setActiveTab('caregivers')}
              className={`px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'caregivers' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              طاقم التمريض ({caregivers.length})
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'patients' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              سجل المرضى ({registeredUsers.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Orders & Requests Management (Explicitly requested by user) */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
              
              {/* Header and Filter Strip */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-teal-600" />
                    <span>بيانات طلبات زيارات التمريض للإدارة</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    رقم الطلب، اسم المريض والهاتف، الخدمة، الأسئلة الطبية، موعد وعنوان الزيارة، وتحديث الحالة.
                  </p>
                </div>

                {/* Search input */}
                <div className="relative min-w-[240px]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="بحث برقم الطلب، اسم المريض، الهاتف..."
                    className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              {/* Status Filter Buttons: جديد / قيد المراجعة / تم تعيين ممرض / مكتمل / ملغي */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOrderStatusFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    orderStatusFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  الكل ({bookings.length})
                </button>

                {ADMIN_STATUS_OPTIONS.map((st) => {
                  const count = bookings.filter(b => (b.adminStatus || 'جديد') === st).length;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                        orderStatusFilter === st
                          ? 'ring-2 ring-teal-500 bg-white font-extrabold shadow-xs'
                          : 'bg-white hover:bg-slate-50'
                      } ${getStatusBadgeClass(st)}`}
                    >
                      <span>{st}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-white/70 border border-current">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Orders List / Cards */}
              {filteredOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Activity className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold">لا توجد طلبات تطابق الفلتر المحدد حالياً.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const currentStatus: AdminOrderStatus = order.adminStatus || (
                      order.status === 'completed' ? 'مكتمل' :
                      order.status === 'on_the_way' ? 'تم تعيين ممرض' :
                      order.status === 'cancelled' ? 'ملغي' : 'جديد'
                    );

                    return (
                      <div
                        key={order.id}
                        className="p-5 bg-slate-50 hover:bg-slate-50/90 rounded-2xl border border-slate-200 transition-all text-xs space-y-4"
                      >
                        {/* Top row: Order Number, Service, Admin Status Dropdown, and Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="text-xs font-mono font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                              رقم الطلب: {order.orderNumber || order.id}
                            </span>
                            <span className="font-bold text-sm text-teal-800">
                              {order.serviceTitle}
                            </span>
                            {order.timingChoice === 'مستعجل' ? (
                              <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                                <Flame className="w-3 h-3 text-rose-600 animate-pulse" />
                                <span>طلب مستعجل</span>
                              </span>
                            ) : order.timingChoice === 'فوري' ? (
                              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full border border-teal-200 flex items-center gap-1">
                                <Zap className="w-3 h-3 text-teal-600" />
                                <span>طلب فوري</span>
                              </span>
                            ) : (
                              <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                                ميعاد محدد
                              </span>
                            )}

                            {/* Live Location Risk Protection Badge */}
                            {(currentStatus === 'تم تعيين ممرض' || order.status === 'on_the_way' || order.status === 'arrived_in_progress') && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>لايف لوكيشن نشط للحماية</span>
                              </span>
                            )}
                          </div>

                          {/* Status changer & View full sheet button */}
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-semibold">حالة الطلب:</span>
                            <select
                              value={currentStatus}
                              onChange={(e) => handleStatusChange(order.id, e.target.value as AdminOrderStatus)}
                              className={`p-1.5 rounded-xl text-xs font-bold border focus:outline-none ${getStatusBadgeClass(currentStatus)}`}
                            >
                              {ADMIN_STATUS_OPTIONS.map((st) => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>

                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 rounded-xl transition-colors flex items-center gap-1 shadow-2xs"
                              title="عرض التفاصيل الطبية كاملة"
                            >
                              <Eye className="w-3.5 h-3.5 text-teal-700" />
                              <span>التفاصيل كاملة</span>
                            </button>
                          </div>
                        </div>

                        {/* Middle: Patient info, Visit Timing, Visit Address */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* 1. اسم المريض ورقم الهاتف */}
                          <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-1.5">
                            <span className="text-[10px] text-slate-400 block font-semibold">بيانات المريض للتواصل:</span>
                            <h4 className="font-bold text-slate-900 text-sm">{order.patient.fullName}</h4>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-slate-500 font-mono text-[11px]">{order.patient.phone}</span>
                              <div className="flex items-center gap-1">
                                <a
                                  href={`tel:${order.patient.phone}`}
                                  className="p-1 text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md"
                                  title="اتصال هاتفي"
                                >
                                  <PhoneCall className="w-3 h-3" />
                                </a>
                                <a
                                  href={`https://wa.me/2${order.patient.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md text-[10px] font-bold"
                                  title="مراسلة واتساب"
                                >
                                  واتساب
                                </a>
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-400 block">العمر: {order.patient.age} سنة</span>
                          </div>

                          {/* 2. موعد الزيارة */}
                          <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-1.5">
                            <span className="text-[10px] text-slate-400 block font-semibold">موعد وتوقيت الزيارة:</span>
                            <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                              <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                              <span className="font-mono">{order.visitDate || order.scheduledDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{order.timingChoice || 'تحديد معاد'} · <strong className="text-teal-800">{order.preferredTime || order.scheduledTime}</strong></span>
                            </div>
                            <div className="pt-1 text-[10px] text-slate-500">
                              الممرض: <strong className="text-slate-800">{order.caregiverName || 'في انتظار التعيين'}</strong>
                            </div>
                          </div>

                          {/* 3. عنوان المريض */}
                          <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-1.5">
                            <span className="text-[10px] text-slate-400 block font-semibold">عنوان الزيارة:</span>
                            <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span>{order.governorate || order.patient.governorate || 'القاهرة'}</span>
                            </div>
                            <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                              {order.detailedAddress || order.patient.address}
                            </p>
                            <div className="flex flex-wrap items-center justify-between gap-1 pt-1">
                              <span className="text-[10px] text-teal-700 block font-semibold">
                                {order.medicationAvailableAtHome ? 'العلاج متاح بالمنزل' : 'يحضر الممرض العلاج'}
                              </span>
                              {(order.googleMapsUrl || order.patient?.locationCoordinates) && (
                                <a
                                  href={order.googleMapsUrl || `https://www.google.com/maps?q=${order.patient.locationCoordinates?.lat},${order.patient.locationCoordinates?.lng}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 flex items-center gap-1 transition-colors"
                                >
                                  <span>خرائط جوجل</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Medical Questions Answers (اجابة الاسئلة الطبية) */}
                        {order.isPhysiotherapyOrder || order.physiotherapyDetails ? (
                          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-300 space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-blue-200">
                              <span className="font-bold text-blue-950 flex items-center gap-1.5 text-xs">
                                <Activity className="w-3.5 h-3.5 text-blue-700" />
                                <span>استمارة تقييم العلاج الطبيعي والتأهيل الحركي:</span>
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-white px-2 py-0.5 rounded-md font-bold text-slate-800 border border-blue-200">
                                  الحالة: {order.physiotherapyDetails?.conditionCategory || order.serviceTitle}
                                </span>
                                <span className="text-[10px] bg-blue-200 text-blue-950 px-2 py-0.5 rounded-md font-black">
                                  قدرة الحركة: {order.physiotherapyDetails?.mobilityStatus || 'غير محدد'}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
                              <div className="bg-white p-2 rounded-lg border border-blue-200">
                                <span className="text-slate-400 block text-[10px]">الأطراف ومناطق الإصابة:</span>
                                <span className="font-bold text-blue-950">
                                  {Array.isArray(order.physiotherapyDetails?.affectedBodyParts)
                                    ? order.physiotherapyDetails.affectedBodyParts.join('، ')
                                    : (order.physiotherapyDetails?.affectedBodyParts || 'كافة الأطراف')}
                                </span>
                              </div>

                              <div className="bg-white p-2 rounded-lg border border-blue-200">
                                <span className="text-slate-400 block text-[10px]">الهدف الأساسي من الجلسات:</span>
                                <span className="font-bold text-slate-800">
                                  {order.physiotherapyDetails?.sessionGoal || 'استعادة الحركة والتوازن وتقليل الألم'}
                                </span>
                              </div>

                              <div className="bg-white p-2 rounded-lg border border-blue-200">
                                <span className="text-slate-400 block text-[10px]">الأجهزة المطلوبة بالجلسة:</span>
                                <span className="font-bold text-teal-800">
                                  {order.physiotherapyDetails?.portableDevicesNeeded?.join('، ') || 'تمارين يدوية فقط'}
                                </span>
                              </div>

                              <div className="bg-white p-2 rounded-lg border border-blue-200">
                                <span className="text-slate-400 block text-[10px]">مساعد متدرب مرافق:</span>
                                <span className={`font-bold ${order.assistantRequested?.requested ? 'text-amber-800' : 'text-slate-500'}`}>
                                  {order.assistantRequested?.requested ? `نعم (${order.assistantRequested.track === 'physiotherapy' ? 'تدريب علاج طبيعي' : 'تدريب تمريض'})` : 'لا'}
                                </span>
                              </div>
                            </div>

                            {order.physiotherapyDetails?.hasHeartPacemakerOrMetalImplants && (
                              <div className="p-2 bg-rose-50 border border-rose-300 rounded-lg text-[11px] text-rose-950 font-bold flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                                <span>تنبيه خطورة: المريض لديه شرائح/مسامير أو منظم ضربات قلب (ممنوع استخدام أجهزة التيارات الكهربائية TENS العميقة والموجات القصيرة).</span>
                              </div>
                            )}
                          </div>
                        ) : order.isCuppingOrder || order.cuppingDetails ? (
                          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-300 space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-amber-200">
                              <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                                <span>بيانات واستمارة الحجامة الطبية التخصصية:</span>
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-white px-2 py-0.5 rounded-md font-bold text-slate-800 border border-amber-200">
                                  مكان الزيارة: {order.cuppingDetails?.locationType || (order.detailedAddress.includes('المركز') ? 'المركز' : 'المنزل')}
                                </span>
                                <span className="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md font-black">
                                  {order.cuppingDetails?.cuppingType || order.serviceTitle}
                                </span>
                              </div>
                            </div>

                            {/* Medical Assessment for Cupping */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-[11px]">
                              {/* 1. ضغط أو سكر */}
                              <div className="bg-white p-2 rounded-lg border border-amber-200">
                                <span className="text-slate-400 block text-[10px]">1. ضغط أو سكر:</span>
                                <span className={`font-bold ${order.cuppingDetails?.hasHypertensionOrDiabetes ? 'text-rose-700' : 'text-emerald-700'}`}>
                                  {order.cuppingDetails?.hasHypertensionOrDiabetes ? 'نعم (يُمنع التشريط)' : 'لا'}
                                </span>
                              </div>

                              {/* 2. سيولة أو مميعات */}
                              <div className="bg-white p-2 rounded-lg border border-amber-200">
                                <span className="text-slate-400 block text-[10px]">2. سيولة أو مميعات:</span>
                                <span className={`font-bold ${order.cuppingDetails?.hasBleedingTendency ? 'text-rose-700' : 'text-emerald-700'}`}>
                                  {order.cuppingDetails?.hasBleedingTendency ? 'نعم (ممنوع الحجامة الدموية)' : 'لا'}
                                </span>
                              </div>

                              {/* 3. أمراض أخرى */}
                              <div className="bg-white p-2 rounded-lg border border-amber-200">
                                <span className="text-slate-400 block text-[10px]">3. أمراض أخرى:</span>
                                <span className="font-bold text-slate-800">
                                  {order.cuppingDetails?.hasOtherDiseases ? (order.cuppingDetails.otherDiseasesDetails || 'نعم') : 'لا'}
                                </span>
                              </div>

                              {/* 4. أمراض جلدية أو جروح */}
                              <div className="bg-white p-2 rounded-lg border border-amber-200">
                                <span className="text-slate-400 block text-[10px]">4. أمراض جلدية أو جروح:</span>
                                <span className={`font-bold ${order.cuppingDetails?.hasSkinDiseasesOrWounds ? 'text-amber-800' : 'text-slate-800'}`}>
                                  {order.cuppingDetails?.hasSkinDiseasesOrWounds ? (order.cuppingDetails.skinDiseasesDetails || 'نعم') : 'لا'}
                                </span>
                              </div>

                              {/* 5. آخر حجامة ومضاعفاتها */}
                              <div className="bg-white p-2 rounded-lg border border-amber-200">
                                <span className="text-slate-400 block text-[10px]">5. آخر حجامة ومضاعفاتها:</span>
                                <span className="font-bold text-slate-800 truncate block">
                                  {order.cuppingDetails?.lastCuppingAndComplications || order.previousSurgeriesAnswer || 'لا توجد'}
                                </span>
                              </div>
                            </div>

                            {/* Medical Warning & Instruction */}
                            <div className="p-2 bg-amber-100/70 border border-amber-300 rounded-lg text-[11px] text-amber-950 font-medium flex items-start gap-1.5">
                              <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                              <span>
                                <strong>توجيه إداري وطبي:</strong> {order.cuppingDetails?.isRestrictedToDryCupping ? 'تم تقييد الجلسة إلى حجامة جافة لوجود ضغط/سكر/سيولة. ' : ''}
                                يجب مراجعة الأدوية (خصوصاً مميعات الدم)، وعدم اعتبار تسجيل الطلب موافقة تلقائية على الإجراء حتى يراجع الأخصائي الحالة وفحوصاتها.
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-2">
                            <span className="font-bold text-amber-950 flex items-center gap-1.5 text-[11px]">
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                              <span>اجابة الاسئلة الطبية الإلزامية لسلامة الإجراء:</span>
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
                              {/* 1. أمراض مزمنة */}
                              <div className="bg-white p-2 rounded-lg border border-amber-200/50">
                                <span className="text-slate-400 block text-[10px]">1. أمراض مزمنة:</span>
                                <span className="font-bold text-slate-800">
                                  {order.hasChronicDiseasesAnswer || order.patient.chronicDiseases || 'لا يوجد'}
                                </span>
                              </div>

                              {/* 2. الأدوية اللي ماشي عليها */}
                              <div className="bg-white p-2 rounded-lg border border-amber-200/50">
                                <span className="text-slate-400 block text-[10px]">2. أدوية منتظمة:</span>
                                <span className="font-bold text-teal-900">
                                  {order.currentMedicationsAnswer || order.patient.currentMedications || 'لا يتناول أدوية'}
                                </span>
                              </div>

                              {/* 3. أدوية ممنوعة أو حساسية */}
                              <div className="bg-white p-2 rounded-lg border border-amber-200/50">
                                <span className="text-slate-400 block text-[10px]">3. أدوية ممنوعة/حساسية:</span>
                                <span className="font-bold text-rose-800">
                                  {order.allergiesOrForbiddenAnswer || order.patient.forbiddenMedications || 'لا توجد'}
                                </span>
                              </div>

                              {/* 4. عمليات جراحية سابقة */}
                              <div className="bg-white p-2 rounded-lg border border-amber-200/50">
                                <span className="text-slate-400 block text-[10px]">4. عمليات سابقة:</span>
                                <span className="font-bold text-slate-800">
                                  {order.previousSurgeriesAnswer || order.patient.previousSurgeries || 'لا توجد عمليات'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Medicine Request & Pharmacy Invoice in Admin Order View */}
                        {order.medicineRequest?.requested && (
                          <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50/60 rounded-xl border border-amber-300 space-y-2 text-xs">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-amber-700" />
                                <span className="font-extrabold text-amber-950">
                                  طلب إحضار أدوية من الصيدلية (سعر الخدمة: 30 جنيه)
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {order.medicineRequest.medicineCost !== undefined && order.medicineRequest.medicineCost > 0 ? (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded border border-emerald-300">
                                    فاتورة الأدوية: {order.medicineRequest.medicineCost} ج.م
                                  </span>
                                ) : (
                                  <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                                    بانتظار تسجيل الفاتورة من الممرض عند الوصول
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="bg-white/90 p-2.5 rounded-lg border border-amber-200 text-[11px]">
                              <span className="text-slate-400 block text-[10px] font-semibold">الأدوية والمستلزمات المطلوبة من العميل:</span>
                              <span className="font-semibold text-slate-800 leading-relaxed">{order.medicineRequest.details}</span>
                            </div>

                            {order.medicineRequest.pharmacyInvoiceUrl && (
                              <div className="flex items-center justify-between gap-2 pt-1 border-t border-amber-200/60">
                                <span className="text-[11px] text-slate-600 flex items-center gap-1">
                                  <Receipt className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>فاتورة الصيدلية المرفقة: <strong>{order.medicineRequest.pharmacyInvoiceFileName || 'مرفقة'}</strong></span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setSelectedInvoiceModal({
                                    url: order.medicineRequest?.pharmacyInvoiceUrl || '',
                                    fileName: order.medicineRequest?.pharmacyInvoiceFileName || 'فاتورة الصيدلية',
                                    cost: order.medicineRequest?.medicineCost,
                                    orderId: order.orderNumber || order.id
                                  })}
                                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-[10px] rounded border border-emerald-300 flex items-center gap-1 transition-colors"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>معاينة الفاتورة المعتمدة</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Prescription and Bottom footer */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5 text-teal-600" />
                              <span>الروشتة المرفقة:</span>
                              <strong className="text-teal-800 font-mono">
                                {order.prescriptionFileName || order.patient.medicalReports?.[0] || 'لا توجد روشتة مرفقة'}
                              </strong>
                            </span>
                            <span>·</span>
                            <span>حالة العلاج: <strong>{order.medicationAvailableAtHome ? 'متوفر بحوزة المريض' : 'يحضرها التمريض'}</strong></span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-bold text-slate-900">
                              الدفع: <span className="text-teal-800">{formatPaymentMethodLabel(order.payment.method)}</span>
                              <span className="text-[10px] font-mono text-slate-600 mr-1.5 bg-white px-2 py-0.5 rounded border border-slate-200" dir="ltr">
                                {order.payment.walletNumber || OFFICIAL_PAYMENT_NUMBER}
                              </span>
                              {order.payment.transactionRef && (
                                <span className="text-[10px] text-amber-800 font-semibold mr-1.5">
                                  (مرجع: {order.payment.transactionRef})
                                </span>
                              )}
                            </span>
                            <span className="font-bold text-slate-900">
                              قيمة الزيارة: <span className="font-mono text-teal-700">{order.payment.amount} ج.م</span>
                              {order.medicineRequest?.requested && (
                                <span className="text-[10px] text-slate-500 font-normal mr-1.5 font-mono">
                                  (خدمة: {order.payment.baseAmount || (order.payment.amount - 30 - (order.medicineRequest.medicineCost || 0))} ج.م + إحضار أدوية: 30 ج.م{order.medicineRequest.medicineCost ? ` + أدوية: ${order.medicineRequest.medicineCost} ج.م` : ''})
                                </span>
                              )}
                            </span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        )}

        {/* Tab 2: Nurse Applications & Document Screening */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-teal-600" />
                  <span>طلبات تسجيل الممرضين والمستندات الرسمية:</span>
                </h2>
                <span className="text-xs text-slate-500">
                  إجمالي الطلبات: {applications.length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <th className="py-3 px-4">مقدم الطلب</th>
                      <th className="py-3 px-4">المؤهل والتخصص</th>
                      <th className="py-3 px-4">المحافظة والخبرة</th>
                      <th className="py-3 px-4">فحص الوثائق (البطاقة/الترخيص/المؤهل)</th>
                      <th className="py-3 px-4">الحالة</th>
                      <th className="py-3 px-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span>{app.fullName}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                              app.applicantRole === 'physiotherapist'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : app.applicantRole === 'assistant_trainee'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : app.applicantRole === 'cupping_specialist'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : 'bg-teal-50 text-teal-800 border-teal-200'
                            }`}>
                              {app.applicantRole === 'physiotherapist' && 'طبيب علاج طبيعي'}
                              {app.applicantRole === 'assistant_trainee' && `مساعد متدرب (${app.trainingTrack === 'physiotherapy' ? 'علاج طبيعي' : app.trainingTrack === 'hijama' ? 'حجامة' : 'تمريض'})`}
                              {app.applicantRole === 'cupping_specialist' && 'ممارس حجامة'}
                              {(!app.applicantRole || app.applicantRole === 'nurse') && 'تمريض'}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono font-normal text-slate-500">{app.phone}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-teal-800 block">{app.institutionName}</span>
                          <span className="text-[10px] text-slate-500">
                            {app.physiotherapySpecialty || app.traineeEducationLevel || app.nursingSpecialty || (app.qualification === 'college' ? 'بكالوريوس' : 'معهد')}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800">{app.governorate || app.city}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">خبرة {app.experienceYears} سنوات</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>ترخيص مزاولة · بطاقة شخصية · مؤهل</span>
                          </div>
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="text-[11px] text-teal-700 underline font-semibold mt-0.5 block"
                          >
                            معاينة الوثائق
                          </button>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            app.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {app.status === 'approved' ? 'مقبول ومعتمد' : app.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {app.status === 'reviewing' && (
                              <>
                                <button
                                  onClick={() => onApproveApplication(app.id)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>قبول واعتماد</span>
                                </button>
                                <button
                                  onClick={() => onRejectApplication(app.id)}
                                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px]"
                                >
                                  رفض
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="p-1.5 text-slate-500 hover:text-slate-800"
                              title="عرض التفاصيل"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Caregivers Performance & KPI */}
        {activeTab === 'caregivers' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-600" />
                  <span>نظام تقييم وتصنيف المشرفين لطاقم التمريض:</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  تصنيف الممرضين وتحديد فئات الجودة ونسبة الأداء الميداني بناءً على جودة تنفيذ الطلبات المكتملة.
                </p>
              </div>
              <span className="text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 rounded-xl">
                {caregivers.length} ممرضين معتمدين
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caregivers.map((nurse) => (
                <div
                  key={nurse.id}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3.5 hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={nurse.avatar}
                        alt={nurse.name}
                        className="w-12 h-12 rounded-xl object-cover border border-teal-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{nurse.name}</h4>
                        <p className="text-[11px] text-teal-700">{nurse.institution.replace(/\s*\(دفعة\s*\d+\)/g, '')}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="flex items-center gap-1 text-amber-500 font-bold tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {nurse.rating}
                      </span>
                      <span className="text-[10px] text-slate-400">تقييم المرضى</span>
                    </div>
                  </div>

                  {/* Operational Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200/70">
                    <div className="bg-white p-2 rounded-xl border border-slate-100">
                      <span className="font-black text-slate-900 block tabular-nums">{nurse.acceptanceRate}%</span>
                      <span className="text-[10px] text-slate-400">معدل القبول</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-100">
                      <span className="font-black text-emerald-600 block tabular-nums">{nurse.punctualityScore}%</span>
                      <span className="text-[10px] text-slate-400">الالتزام بالميعاد</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-100">
                      <span className="font-black text-teal-700 block tabular-nums">{nurse.completedVisits}</span>
                      <span className="text-[10px] text-slate-400">زيارات مكتملة</span>
                    </div>
                  </div>

                  {/* Supervisor Quality Evaluation & Tier Display */}
                  <div className="p-3 bg-gradient-to-r from-teal-50 via-emerald-50/50 to-blue-50/40 rounded-xl border border-teal-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-teal-950">
                        <Award className="w-4 h-4 text-teal-700 shrink-0" />
                        <span>تقييم وتصنيف المشرفين لجودة التنفيذ:</span>
                      </div>
                      <span className="font-mono font-black text-teal-900 bg-white px-2 py-0.5 rounded border border-teal-200 text-[11px]">
                        ⭐ {nurse.supervisorEvaluation?.rating ? nurse.supervisorEvaluation.rating.toFixed(1) : '5.0'} / 5
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                      <span className="font-bold text-teal-900">
                        {nurse.supervisorEvaluation?.tier || 'فئة أ (أداء استثنائي فائق الجودة)'}
                      </span>
                      <span className="font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        جودة تنفيذ الطلبات: %{nurse.supervisorEvaluation?.executionQualityScore || 98}
                      </span>
                    </div>

                    {nurse.supervisorEvaluation?.supervisorNotes && (
                      <p className="text-[11px] text-slate-700 italic bg-white/80 p-2 rounded-lg border border-teal-100 leading-relaxed">
                        "{nurse.supervisorEvaluation.supervisorNotes}"
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>المشرف المقيم: {nurse.supervisorEvaluation?.evaluatedBy || 'الإشراف الطبي المركزي'}</span>
                      <span>تاريخ التقييم: {nurse.supervisorEvaluation?.evaluatedAt || '2026-10-25'}</span>
                    </div>
                  </div>

                  {/* Action to update/edit evaluation */}
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      موثق و معتمد ✅
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenEvaluationModal(nurse)}
                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>تعديل تصنيف وتقييم الممرض</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Registered Patients */}
        {activeTab === 'patients' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" />
                  <span>سجل المرضى المسجلين والبيانات الصحية:</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  يتضمن اسم المريض، السن، المحافظة، المرض المزمن، الأدوية، واللوكيشن.
                </p>
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
                {registeredUsers.length} مرضى مسجلين
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {registeredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3 hover:border-teal-400 transition-colors"
                >
                  <div className="flex items-start justify-between pb-2 border-b border-slate-200/80">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{user.fullName}</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        السن: <strong className="text-slate-800">{user.age || 58} سنة</strong> · الهاتف: {user.phone}
                      </p>
                    </div>
                    <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold font-mono">
                      {user.id}
                    </span>
                  </div>

                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">المحافظة:</span>
                      <span className="font-bold text-slate-800">{user.governorate || user.city || 'القاهرة'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">المرض المزمن:</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <HeartPulse className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{user.chronicDiseases || 'لا يوجد'}</span>
                      </span>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">الأدوية اللي ماشي عليها:</span>
                      <span className="font-medium text-teal-900 flex items-center gap-1">
                        <Pill className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="line-clamp-2">{user.currentMedications || 'لا يتناول أدوية'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200 text-[11px] text-amber-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>العنوان واللوكيشن:</span>
                    </div>
                    <p className="text-slate-700 leading-tight">{user.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Order Details & Nurse Assignment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-right shadow-2xl border border-slate-200 space-y-5 my-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded border border-teal-200">
                  رقم الطلب: {selectedOrder.orderNumber || selectedOrder.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  تفاصيل طلب زيارة: {selectedOrder.serviceTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Quick status selector */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-600 block">تحديث حالة الطلب:</span>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getStatusBadgeClass(selectedOrder.adminStatus || 'جديد')}`}>
                  الحالة الحالية: {selectedOrder.adminStatus || 'جديد'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {ADMIN_STATUS_OPTIONS.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(selectedOrder.id, st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                      (selectedOrder.adminStatus || 'جديد') === st
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-2xl border border-slate-200">
              <div>• اسم المريض: <strong className="text-slate-900 text-sm">{selectedOrder.patient.fullName}</strong></div>
              <div>• رقم الهاتف: <span className="font-mono font-bold text-slate-900">{selectedOrder.patient.phone}</span></div>
              <div>• عمر المريض: <span className="font-bold text-slate-900">{selectedOrder.patient.age} سنة</span></div>
              <div>• المحافظة: <strong className="text-slate-900">{selectedOrder.governorate || selectedOrder.patient.governorate || 'القاهرة'}</strong></div>
              <div className="sm:col-span-2 pt-1 border-t border-slate-100">
                • المنطقة والعنوان بالتفصيل: <span className="text-slate-800 font-medium">{selectedOrder.detailedAddress || selectedOrder.patient.address}</span>
              </div>
            </div>

            {/* Timing & Scheduling */}
            <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 text-xs space-y-1.5">
              <h4 className="font-bold text-teal-950 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-700" />
                <span>موعد واختيار وقت الزيارة:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div>تاريخ الزيارة: <strong className="font-mono text-slate-900">{selectedOrder.visitDate || selectedOrder.scheduledDate}</strong></div>
                <div>نوع الوقت: <strong className="text-teal-800">{selectedOrder.timingChoice || 'تحديد معاد'}</strong></div>
                <div>التوقيت: <strong className="text-slate-900">{selectedOrder.preferredTime || selectedOrder.scheduledTime}</strong></div>
              </div>
            </div>

            {/* Medical Questions Answers (اجابة الاسئلة الطبية) */}
            {selectedOrder.isPhysiotherapyOrder || selectedOrder.physiotherapyDetails ? (
              <div className="p-4 bg-blue-50/90 rounded-2xl border border-blue-300 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-blue-950 flex items-center gap-1.5 text-sm">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span>ملف ومتابعة جلسة العلاج الطبيعي والتأهيل:</span>
                  </h4>
                  <span className="text-xs bg-blue-200 text-blue-950 font-black px-2.5 py-0.5 rounded-md">
                    {selectedOrder.physiotherapyDetails?.conditionCategory || selectedOrder.serviceTitle}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-blue-200">
                    <span className="text-[11px] text-slate-500 block font-semibold">1. قدرة المريض الحركية الحالية:</span>
                    <span className="font-bold text-blue-950 block mt-0.5">
                      {selectedOrder.physiotherapyDetails?.mobilityStatus || 'غير محدد'}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-blue-200">
                    <span className="text-[11px] text-slate-500 block font-semibold">2. الأطراف ومناطق الإصابة:</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {Array.isArray(selectedOrder.physiotherapyDetails?.affectedBodyParts)
                        ? selectedOrder.physiotherapyDetails.affectedBodyParts.join('، ')
                        : (selectedOrder.physiotherapyDetails?.affectedBodyParts || 'كافة الأطراف')}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-blue-200">
                    <span className="text-[11px] text-slate-500 block font-semibold">3. الهدف التأهيلي المطلوب:</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {selectedOrder.physiotherapyDetails?.sessionGoal || 'استعادة الحركة وتخفيف الألم'}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-blue-200">
                    <span className="text-[11px] text-slate-500 block font-semibold">4. الأجهزة الطبية المتنقلة المطلوبة:</span>
                    <span className="font-bold text-teal-800 block mt-0.5">
                      {selectedOrder.physiotherapyDetails?.portableDevicesNeeded?.join('، ') || 'تمارين واستطالة يدوية'}
                    </span>
                  </div>

                  {selectedOrder.physiotherapyDetails?.postFractureOrSurgeryNotes && (
                    <div className="bg-white p-2.5 rounded-xl border border-blue-200 sm:col-span-2">
                      <span className="text-[11px] text-slate-500 block font-semibold">5. تفاصيل وتاريخ الكسر أو الجراحة:</span>
                      <span className="font-bold text-slate-900 block mt-0.5">
                        {selectedOrder.physiotherapyDetails.postFractureOrSurgeryNotes}
                      </span>
                    </div>
                  )}

                  {selectedOrder.assistantRequested?.requested && (
                    <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-300 sm:col-span-2">
                      <span className="text-[11px] text-amber-900 block font-bold">🎓 طلب مرافقة مساعد / متدرب:</span>
                      <span className="font-medium text-slate-800 block mt-0.5">
                        مسار التدريب: {selectedOrder.assistantRequested.track === 'physiotherapy' ? 'علاج طبيعي وتأهيل' : 'تمريض'} · الجنس المفضل: {selectedOrder.assistantRequested.companionGender === 'male' ? 'مساعد ذكر' : selectedOrder.assistantRequested.companionGender === 'female' ? 'مساعدة أنثى' : 'أي متاح'}
                      </span>
                      {selectedOrder.assistantRequested.note && (
                        <p className="text-[11px] text-slate-600 mt-1">ملاحظة: "{selectedOrder.assistantRequested.note}"</p>
                      )}
                    </div>
                  )}
                </div>

                {selectedOrder.physiotherapyDetails?.hasHeartPacemakerOrMetalImplants && (
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-[11px] text-rose-950 font-semibold space-y-1">
                    <div>⚠️ <strong>تنبيه طبي هام للأخصائي:</strong></div>
                    <div>المريض لديه شرائح/مسامير أو جهاز تنظيم ضربات قلب. تجنب التيارات الكهربائية TENS العميقة والموجات القصيرة.</div>
                  </div>
                )}
              </div>
            ) : selectedOrder.isCuppingOrder || selectedOrder.cuppingDetails ? (
              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-300 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-950 flex items-center gap-1.5 text-sm">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>الملف الطبي التخصصي لطلب الحجامة:</span>
                  </h4>
                  <span className="text-xs bg-amber-200 text-amber-950 font-black px-2.5 py-0.5 rounded-md">
                    {selectedOrder.cuppingDetails?.cuppingType || selectedOrder.serviceTitle}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                    <span className="text-[11px] text-slate-500 block font-semibold">1. هل تعاني من أي ضغط أو سكر؟!</span>
                    <span className={`font-bold block mt-0.5 ${selectedOrder.cuppingDetails?.hasHypertensionOrDiabetes ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {selectedOrder.cuppingDetails?.hasHypertensionOrDiabetes ? 'نعم (ممنوع الحجامة الدموية)' : 'لا'}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                    <span className="text-[11px] text-slate-500 block font-semibold">2. هل تعاني سيولة؟!</span>
                    <span className={`font-bold block mt-0.5 ${selectedOrder.cuppingDetails?.hasBleedingTendency ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {selectedOrder.cuppingDetails?.hasBleedingTendency ? 'نعم (ممنوع الحجامة الدموية / مميعات دم)' : 'لا'}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                    <span className="text-[11px] text-slate-500 block font-semibold">3. هل لديك أي أمراض تعاني منها؟!</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {selectedOrder.cuppingDetails?.hasOtherDiseases ? (selectedOrder.cuppingDetails.otherDiseasesDetails || 'نعم') : 'لا'}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                    <span className="text-[11px] text-slate-500 block font-semibold">4. هل تعاني من أمراض جلدية أو جروح؟!</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {selectedOrder.cuppingDetails?.hasSkinDiseasesOrWounds ? (selectedOrder.cuppingDetails.skinDiseasesDetails || 'نعم') : 'لا'}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-amber-200 sm:col-span-2">
                    <span className="text-[11px] text-slate-500 block font-semibold">5. متى آخر حجامة سابقة وأي مضاعفات حصلت؟!</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {selectedOrder.cuppingDetails?.lastCuppingAndComplications || selectedOrder.previousSurgeriesAnswer || 'لا توجد سوابق'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-950 font-semibold space-y-1">
                  <div>⚠️ <strong>تنبيه الإشراف والمراجعة الطبية:</strong></div>
                  <div>• لو مقدم الطلب يعاني من أي أمراض مثل السيولة أو ضغط أو سكر فهو لم يفعل حجامة دموية وستكون حجامة جافة.</div>
                  <div>• مراجعة الأدوية، خصوصاً مميعات الدم.</div>
                  <div>• عدم اعتبار تسجيل الطلب موافقة تلقائية على إجراء الحجامة؛ لازم المختص يراجع الحالة أولاً.</div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs space-y-2.5">
                <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  <span>إجابات الأسئلة الطبية الإلزامية لسلامة الإجراء:</span>
                </h4>

                <div className="space-y-2">
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200/60">
                    <span className="text-[11px] text-slate-500 block font-semibold">1. هل يعاني المريض من أي أمراض مزمنة؟</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {selectedOrder.hasChronicDiseasesAnswer || selectedOrder.patient.chronicDiseases || 'لا يوجد'}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-amber-200/60">
                    <span className="text-[11px] text-slate-500 block font-semibold">2. ما هي الأدوية التي يتناولها المريض بانتظام حالياً؟ (الأدوية اللي ماشي عليها) *</span>
                    <span className="font-bold text-teal-900 block mt-0.5">
                      {selectedOrder.currentMedicationsAnswer || selectedOrder.patient.currentMedications || 'لا يتناول أدوية'}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-amber-200/60">
                    <span className="text-[11px] text-slate-500 block font-semibold">3. هل في أدوية معينة ممنوعة أو حساسية مفرطة؟ (مثل حساسية البنسلين ومشتقاته)</span>
                    <span className="font-bold text-rose-800 block mt-0.5">
                      {selectedOrder.allergiesOrForbiddenAnswer || selectedOrder.patient.forbiddenMedications || 'لا توجد'}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-amber-200/60">
                    <span className="text-[11px] text-slate-500 block font-semibold">4. هل أجرى المريض أي عمليات جراحية سابقة؟ (هل عامل عمليات قبل كدا ولا لا) *</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {selectedOrder.previousSurgeriesAnswer || selectedOrder.patient.previousSurgeries || 'لا توجد عمليات'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Prescription & Home Medication */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-600 block">الروشتة الطبية المرفقة:</span>
                <span className="font-mono font-bold text-teal-800 block">
                  {selectedOrder.prescriptionFileName || selectedOrder.patient.medicalReports?.[0] || 'لا توجد روشتة مرفقة'}
                </span>
                {selectedOrder.prescriptionUrl && (
                  <img
                    src={selectedOrder.prescriptionUrl}
                    alt="صورة الروشتة"
                    className="w-full max-h-36 object-contain rounded-lg border border-slate-200 mt-2"
                  />
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-600 block">حالة توفر الأدوية والمحاليل:</span>
                <span className="font-bold text-slate-900 block">
                  {selectedOrder.medicationAvailableAtHome
                    ? 'العلاج متاح بالمنزل (الأدوية والمحاليل متوفرة بحوزتي حالياً)'
                    : 'الممرض يحضر العلاج والمحاليل من الصيدلية'}
                </span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-semibold text-slate-600 block">وسيلة الدفع المعتمدة:</span>
                <span className="font-bold text-teal-900">
                  {formatPaymentMethodLabel(selectedOrder.payment.method)} — الرقم: <span className="font-mono" dir="ltr">{selectedOrder.payment.walletNumber || OFFICIAL_PAYMENT_NUMBER}</span>
                </span>
              </div>
              {selectedOrder.payment.transactionRef && (
                <span className="text-[11px] bg-white px-2.5 py-1 rounded-lg border border-teal-200 font-bold text-slate-800">
                  مرجع التحويل: {selectedOrder.payment.transactionRef}
                </span>
              )}
            </div>

            {/* Nurse assignment */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-semibold text-slate-600 block">الممرض المعين للطلب:</span>
                <span className="font-bold text-teal-800">{selectedOrder.caregiverName || 'لم يتم التعيين بعد'}</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  defaultValue={selectedOrder.caregiverId || caregivers[0]?.id}
                  onChange={(e) => handleStatusChange(selectedOrder.id, 'تم تعيين ممرض', e.target.value)}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                >
                  {caregivers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.city})</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedOrder.id, 'تم تعيين ممرض', selectedOrder.caregiverId || caregivers[0]?.id)}
                  className="px-3 py-1.5 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors"
                >
                  تعيين وتأكيد
                </button>
              </div>
            </div>

            {/* Close footer */}
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Application Inspection Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 text-right shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                تدقيق وثائق انضمام: {selectedApp.fullName}
              </h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>• صفة المتقدم: <strong className="text-teal-900">{
                  selectedApp.applicantRole === 'physiotherapist' ? 'طبيب / أخصائي علاج طبيعي' :
                  selectedApp.applicantRole === 'assistant_trainee' ? `مساعد ومتدرب (${selectedApp.trainingTrack === 'physiotherapy' ? 'علاج طبيعي' : selectedApp.trainingTrack === 'hijama' ? 'حجامة' : 'تمريض'})` :
                  selectedApp.applicantRole === 'cupping_specialist' ? 'ممارس حجامة طبية' : 'ممرض/ة معتمد'
                }</strong></div>
                <div>• الهاتف: <span className="font-mono font-bold text-slate-900">{selectedApp.phone}</span></div>
                <div>• واتساب: <span className="font-mono font-bold text-teal-800">{selectedApp.whatsappPhone || selectedApp.phone}</span></div>
                <div>• الرقم القومي: <span className="font-mono font-bold text-slate-900">{selectedApp.nationalIdNumber}</span> (سري للإدارة)</div>
                <div>• المحافظة والمدينة: <span className="font-bold text-slate-900">{selectedApp.governorate || selectedApp.city} - {selectedApp.district}</span></div>
                <div>• المؤهل / الكلية: <span className="font-bold text-teal-800">{selectedApp.institutionName} ({selectedApp.graduationYear})</span></div>
                <div>• ترخيص / قيد الكلية: <span className="font-mono font-bold text-slate-900">{selectedApp.licenseNumber || selectedApp.ptSyndicateNumber || 'ساري وموثق'}</span></div>
                <div>• سنوات الخبرة: <span className="font-bold text-slate-900">{selectedApp.experienceYears} سنوات</span></div>
                <div>• نظام العمل: <span className="font-bold text-slate-900">{selectedApp.workType === 'home' ? 'زيارات وجلسات منزلية' : selectedApp.workType === 'hospital' ? 'مستشفيات ومراكز' : 'منزلي ومستشفيات'}</span></div>
                <div>• الراتب المتوقع: <span className="font-bold text-teal-800">{selectedApp.expectedSalary || 'حسب الاتفاق المباشر'}</span></div>
              </div>

              {selectedApp.applicantRole === 'assistant_trainee' && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold text-amber-900 block mb-1">بيانات تدريب المساعد:</span>
                  <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-[11px] space-y-1">
                    <div>• المرحلة الدراسية: <strong className="text-slate-900">{selectedApp.traineeEducationLevel || 'طالب بكالوريوس'}</strong></div>
                    <div>• مسار التدريب: <strong className="text-teal-800">{selectedApp.trainingTrack === 'physiotherapy' ? 'علاج طبيعي وتأهيل' : selectedApp.trainingTrack === 'hijama' ? 'حجامة طبية' : 'تمريض'}</strong></div>
                    {selectedApp.trainingGoals && (
                      <div>• أهداف التدريب والتعلم: <span className="text-slate-700 italic">"{selectedApp.trainingGoals}"</span></div>
                    )}
                  </div>
                </div>
              )}

              {selectedApp.applicantRole === 'physiotherapist' && selectedApp.portableDevicesOwned && selectedApp.portableDevicesOwned.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold text-blue-900 block mb-1">الأجهزة الطبية المتنقلة بحوزته:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedApp.portableDevicesOwned.map((dev, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-medium">
                        ⚡ {dev}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedApp.departmentsWorked && selectedApp.departmentsWorked.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">الأقسام الطبية التي عمل بها:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedApp.departmentsWorked.map((dep, idx) => (
                      <span key={idx} className="bg-white px-2 py-0.5 rounded text-[10px] border border-slate-200 text-slate-700">
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedApp.skillsMastered && selectedApp.skillsMastered.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">المهارات الطبية التي يجيدها:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedApp.skillsMastered.map((sk, idx) => (
                      <span key={idx} className="bg-teal-50 px-2 py-0.5 rounded text-[10px] border border-teal-200 text-teal-800">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <h4 className="text-xs font-bold text-slate-900">الملفات والوثائق المرفقة:</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800">1. بطاقة الرقم القومي (إلزامي):</span>
                <span className="font-mono text-teal-800 underline">{selectedApp.documents.nationalIdName}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800">2. صورة المؤهل الدراسي (إلزامي):</span>
                <span className="font-mono text-teal-800 underline">{selectedApp.documents.degreeCertName}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800">3. كارنيه ترخيص مزاولة المهنة (إلزامي):</span>
                <span className="font-mono text-teal-800 underline">{selectedApp.documents.licenseCardName}</span>
              </div>
              {selectedApp.documents.experienceCertsName && (
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-600">4. شهادات الخبرة والدورات (اختياري):</span>
                  <span className="font-mono text-teal-800 underline">{selectedApp.documents.experienceCertsName}</span>
                </div>
              )}
              {selectedApp.documents.criminalRecordName && (
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-600">5. الفيش والتشبيه:</span>
                  <span className="font-mono text-slate-700">{selectedApp.documents.criminalRecordName}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedApp(null)}
                className="text-xs text-slate-500 font-semibold"
              >
                إغلاق
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onRejectApplication(selectedApp.id);
                    setSelectedApp(null);
                  }}
                  className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs rounded-xl"
                >
                  رفض الطلب
                </button>
                <button
                  onClick={() => {
                    onApproveApplication(selectedApp.id);
                    setSelectedApp(null);
                  }}
                  className="px-5 py-2 bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs rounded-xl shadow-xs"
                >
                  اعتماد وتفعيل الحساب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Pharmacy Invoice Viewer Modal */}
      {selectedInvoiceModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-right shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  فاتورة الصيدلية المعتمدة للطلب {selectedInvoiceModal.orderId}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoiceModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs bg-amber-50 p-3 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-950">
                  {selectedInvoiceModal.fileName}
                </span>
                {selectedInvoiceModal.cost !== undefined && (
                  <span className="font-mono font-black text-slate-900">
                    قيمة الأدوية: {selectedInvoiceModal.cost} ج.م
                  </span>
                )}
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center max-h-[60vh]">
                <img
                  src={selectedInvoiceModal.url}
                  alt="فاتورة الصيدلية"
                  className="w-full h-auto object-contain max-h-[60vh]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedInvoiceModal(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supervisor Evaluation Modal (تصنيف وتقييم المشرفين لجودة تنفيذ الطلبات المكتملة) */}
      {evaluatingNurse && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 text-right shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center border border-teal-200">
                  <Award className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    تقييم وتصنيف المشرفين: {evaluatingNurse.name}
                  </h3>
                  <span className="text-[11px] text-slate-500 block">
                    تصنيف الأداء الميداني بناءً على جودة تنفيذ الطلبات المكتملة ({evaluatingNurse.completedVisits} زيارة مكتملة)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEvaluatingNurse(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {evalSuccessMsg && (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl border border-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{evalSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveEvaluation} className="space-y-4 text-xs">
              {/* 1. تصنيف المشرفين (Tier) */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  1. تصنيف المشرفين المعتمد لجودة تنفيذ الطلبات:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'فئة أ (أداء استثنائي فائق الجودة)',
                    'فئة ب (ممتاز ومعتمد)',
                    'فئة ج (جيد جداً)',
                    'تحت المتابعة الميدانية'
                  ].map((tierOption) => (
                    <button
                      key={tierOption}
                      type="button"
                      onClick={() => setEvalTier(tierOption as SupervisorTier)}
                      className={`p-2.5 rounded-xl border text-right font-bold transition-all text-xs flex items-center justify-between ${
                        evalTier === tierOption
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{tierOption}</span>
                      {evalTier === tierOption && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. تقييم النجوم (1-5) ونسبة جودة تنفيذ الطلبات */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    2. تقييم المشرفين العام (النجوم):
                  </label>
                  <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEvalRating(star)}
                          className="p-1 hover:scale-125 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${
                            star <= evalRating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                          }`} />
                        </button>
                      ))}
                    </div>
                    <span className="font-bold text-slate-800 font-mono text-xs">
                      {evalRating}.0 / 5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    3. نسبة جودة تنفيذ الطلبات المكتملة (%):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="75"
                      max="100"
                      value={evalQualityScore}
                      onChange={(e) => setEvalQualityScore(Number(e.target.value))}
                      className="flex-1 accent-teal-600 cursor-pointer"
                    />
                    <span className="font-mono font-black text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                      %{evalQualityScore}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    محسوبة بناءً على دقة التمريض والتعقيم ورضا المرضى في الزيارات المنجزة.
                  </span>
                </div>
              </div>

              {/* 3. تقرير وملاحظات المشرف الميداني */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  4. تقرير وملاحظات المشرف الميداني حول جودة تنفيذ الطلبات:
                </label>
                <textarea
                  rows={3}
                  value={evalNotes}
                  onChange={(e) => setEvalNotes(e.target.value)}
                  placeholder="اكتب تقرير الجودة الطبية وملاحظات التفتيش على الزيارات المكتملة..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white leading-relaxed"
                />
              </div>

              {/* 4. اسم المشرف المسؤول */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  5. اسم المشرف المقيم والمسؤول الطبي:
                </label>
                <input
                  type="text"
                  value={evalEvaluatedBy}
                  onChange={(e) => setEvalEvaluatedBy(e.target.value)}
                  placeholder="مثال: د. سامح رضوان (مدير الإشراف والمتابعة الطبية)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEvaluatingNurse(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ واعتماد التقييم في ملف الممرض</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
