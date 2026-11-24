import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  X, 
  User, 
  MapPin, 
  Pill, 
  HeartPulse, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Navigation, 
  ShieldCheck, 
  Clock, 
  FileText,
  Save,
  Phone
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
  registeredUsers: UserProfile[];
  onSwitchUser: (user: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
  registeredUsers,
  onSwitchUser
}) => {
  // Form states based on user request:
  // 1. اسمه (Name)
  // 2. سنه (Age)
  // 3. المرض المزمن (Chronic disease)
  // 4. الادويه اللي ماشي عليها (Current medications)
  // 5. هل هو عامل عمليات قبل كدا ولا لا (Previous surgeries: Yes / No)
  // 6. لازم يضيف اللوكيشن (Mandatory Location)
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [age, setAge] = useState<number | ''>(currentUser.age ?? 45);
  const [phone, setPhone] = useState(currentUser.phone);
  const [chronicDiseases, setChronicDiseases] = useState(currentUser.chronicDiseases || '');
  const [currentMedications, setCurrentMedications] = useState(currentUser.currentMedications || '');
  const [hasPreviousSurgeries, setHasPreviousSurgeries] = useState<boolean>(currentUser.hasPreviousSurgeries ?? false);
  const [previousSurgeriesDetails, setPreviousSurgeriesDetails] = useState(currentUser.previousSurgeriesDetails || '');
  const [address, setAddress] = useState(currentUser.address || '');
  
  // Location coordinates (Strictly required)
  const [locationCoordinates, setLocationCoordinates] = useState(currentUser.locationCoordinates || {
    lat: 0,
    lng: 0,
    addressName: ''
  });
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [hasPinnedLocation, setHasPinnedLocation] = useState(Boolean(currentUser.locationCoordinates?.lat && currentUser.locationCoordinates?.lat !== 0));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successNotice, setSuccessNotice] = useState(false);

  useEffect(() => {
    setFullName(currentUser.fullName);
    setAge(currentUser.age ?? 45);
    setPhone(currentUser.phone);
    setChronicDiseases(currentUser.chronicDiseases || '');
    setCurrentMedications(currentUser.currentMedications || '');
    setHasPreviousSurgeries(currentUser.hasPreviousSurgeries ?? false);
    setPreviousSurgeriesDetails(currentUser.previousSurgeriesDetails || '');
    setAddress(currentUser.address || '');
    setLocationCoordinates(currentUser.locationCoordinates);
    setHasPinnedLocation(Boolean(currentUser.locationCoordinates?.lat && currentUser.locationCoordinates?.lat !== 0));
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSimulateGPS = () => {
    setIsDetectingGPS(true);
    setTimeout(() => {
      const lat = 29.9585 + (Math.random() * 0.04 - 0.02);
      const lng = 31.2612 + (Math.random() * 0.04 - 0.02);
      const newLoc = {
        lat: Number(lat.toFixed(5)),
        lng: Number(lng.toFixed(5)),
        addressName: `الموقع الجغرافي المباشر GPS (${lat.toFixed(4)}, ${lng.toFixed(4)}) - تم التحقق الفوري`
      };
      setLocationCoordinates(newLoc);
      setHasPinnedLocation(true);
      setIsDetectingGPS(false);
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.location;
        return copy;
      });
    }, 700);
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().split(' ').length < 2) {
      errs.fullName = 'يرجى إدخال اسم المريض ثنائياً أو ثلاثياً على الأقل';
    }
    if (!age || Number(age) <= 0 || Number(age) > 120) {
      errs.age = 'يرجى إدخال عمر صحيح بالسنوات';
    }
    if (!phone.trim() || phone.trim().length < 10) {
      errs.phone = 'يرجى إدخال رقم هاتف محمول صحيح';
    }
    if (!chronicDiseases.trim()) {
      errs.chronicDiseases = 'يرجى تحديد الأمراض المزمنة أو كتابة (لا يوجد)';
    }
    if (!currentMedications.trim()) {
      errs.currentMedications = 'يرجى ذكر الأدوية التي يتناولها المريض بانتظام أو كتابة (لا يتناول أدوية حالياً)';
    }
    if (hasPreviousSurgeries && !previousSurgeriesDetails.trim()) {
      errs.surgeries = 'يرجى ذكر تفاصيل أو نوع العمليات السابقة وتاريخها التقديري';
    }
    if (!address.trim()) {
      errs.address = 'يرجى كتابة العنوان التفصيلي (الشارع والمنطقة)';
    }

    // MANDATORY LOCATION CHECK ("و لما يدخل بيانات لازم يضيف اللوكيشن")
    if (!hasPinnedLocation || !locationCoordinates || locationCoordinates.lat === 0) {
      errs.location = 'إلزامـي: يجب إضافة وتحديد اللوكيشن الجغرافي (GPS) لضمان دقة وصول ممرض الرعاية.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updated: UserProfile = {
      ...currentUser,
      fullName: fullName.trim(),
      age: Number(age),
      phone: phone.trim(),
      chronicDiseases: chronicDiseases.trim(),
      currentMedications: currentMedications.trim(),
      hasPreviousSurgeries,
      previousSurgeriesDetails: hasPreviousSurgeries ? previousSurgeriesDetails.trim() : 'لا توجد عمليات جراحية سابقة',
      address: address.trim(),
      locationCoordinates,
      registeredAt: currentUser.registeredAt || new Date().toISOString()
    };

    onSaveProfile(updated);
    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-right shadow-2xl border border-slate-200 my-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-teal-700 block">
                الملف الطبي التعريفي للمستخدم المسجل
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                بيانات التسجيل والحالة الصحية
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

        {/* Success Notice */}
        {successNotice && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>تم حفظ بيانات الملف الطبي واللوكيشن بنجاح! سيتم تطبيقها تلقائياً عند طلب أي خدمة تمريض أو حجامة.</span>
          </div>
        )}

        {/* Existing Accounts Quick Switcher (If multiple registered patients) */}
        {registeredUsers.length > 1 && (
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <span className="text-[11px] font-bold text-slate-600 block mb-2">
              المرضى المسجلون بهذا الجهاز (تبديل سريع للملف):
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {registeredUsers.map(u => (
                <button
                  key={u.id}
                  onClick={() => onSwitchUser(u)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold transition-all ${
                    u.id === currentUser.id
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {u.fullName} ({u.age} سنة)
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSave} className="space-y-5">
          
          {/* Medical Rule Alert */}
          <div className="bg-teal-50 border border-teal-200/80 rounded-2xl p-3.5 text-xs text-teal-900 leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <strong>ملف المريض الإلزامي:</strong> يتم حفظ بيانات الاسم، السن، المرض المزمن، الأدوية المعتادة، العمليات السابقة، وموقعك الجغرافي بدقة لسرعة توجيه الممرضين ولضمان أمان الجرعات والحقن والحجامة.
            </div>
          </div>

          {/* 1. Name & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                الاسم بالكامل <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="مثال: فاطمة محمود إبراهيم"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
              {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                السن (بالسنوات) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="120"
                placeholder="64"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white font-mono"
              />
              {errors.age && <p className="text-[11px] text-rose-500 mt-1">{errors.age}</p>}
            </div>
          </div>

          {/* 2. Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              رقم التواصل المحمول (الموبايل) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="010XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white font-mono"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
          </div>

          {/* 3. Chronic Disease (المرض المزمن) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <span>المرض المزمن (Chronic Diseases) <span className="text-rose-500">*</span></span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">ضغط، سكر، قلب، سيولة، كلى...</span>
            </label>
            <input
              type="text"
              placeholder="مثال: ارتفاع ضغط الدم والسكري من النوع الثاني (أو اكتب: لا يوجد)"
              value={chronicDiseases}
              onChange={(e) => setChronicDiseases(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
            />
            {errors.chronicDiseases && <p className="text-[11px] text-rose-500 mt-1">{errors.chronicDiseases}</p>}
          </div>

          {/* 4. Current Medications (الادويه اللي ماشي عليها) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-teal-600" />
                <span>الأدوية التي يتناولها المريض حالياً (الأدوية اللي ماشي عليها) <span className="text-rose-500">*</span></span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">بالجرعات وأوقات اليوم إن أمكن</span>
            </label>
            <textarea
              rows={2}
              placeholder="مثال: كونكور 5 مجم صباحاً، جانوفيا 100 مجم بعد الغداء، أسبوسيد أطفال مساءً (أو اكتب: لا يتناول أدوية)"
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
            ></textarea>
            {errors.currentMedications && <p className="text-[11px] text-rose-500 mt-1">{errors.currentMedications}</p>}
          </div>

          {/* 5. Previous Surgeries (هل هو عامل عمليات قبل كدا ولا لا) */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              هل أجرى المريض أي عمليات جراحية سابقة؟ <span className="text-rose-500">*</span>
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setHasPreviousSurgeries(true)}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 border ${
                  hasPreviousSurgeries
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>نعم، خضع لعمليات سابقة</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHasPreviousSurgeries(false);
                  setPreviousSurgeriesDetails('لا توجد عمليات جراحية سابقة');
                }}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 border ${
                  !hasPreviousSurgeries
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>لا، لم يخضع لعمليات سابقة</span>
              </button>
            </div>

            {hasPreviousSurgeries && (
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  اذكر نوع العمليات وتاريخها التقديري:
                </label>
                <input
                  type="text"
                  placeholder="مثال: عملية قسطرة قلبية وتركيب دعامة عام 2023 / استئصال مرارة"
                  value={previousSurgeriesDetails}
                  onChange={(e) => setPreviousSurgeriesDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                />
                {errors.surgeries && <p className="text-[11px] text-rose-500 mt-1">{errors.surgeries}</p>}
              </div>
            )}
          </div>

          {/* 6. Mandatory Location Upload & Pinpoint (و لما يدخل بيانات لازم يضيف اللوكيشن) */}
          <div className="p-4 bg-amber-50/60 rounded-2xl border-2 border-amber-300/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>إضافة وتحديد اللوكيشن الجغرافي (إلزامـي) <span className="text-rose-600">*</span></span>
              </label>

              <button
                type="button"
                onClick={handleSimulateGPS}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{isDetectingGPS ? 'جاري التقاط الإحداثيات...' : 'رفع اللوكيشن GPS الآن'}</span>
              </button>
            </div>

            <div>
              <input
                type="text"
                placeholder="العنوان التفصيلي: الشارع، رقم العمارة، رقم الشقة أو علامة مميزة"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-amber-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500"
              />
              {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
            </div>

            {/* GPS Pin Status */}
            {hasPinnedLocation && locationCoordinates.lat !== 0 ? (
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{locationCoordinates.addressName}</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {locationCoordinates.lat}, {locationCoordinates.lng}
                </span>
              </div>
            ) : (
              <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>لم يتم تحديد اللوكيشن بعد. اضغط على "رفع اللوكيشن GPS الآن" لتسجيل الموقع الجغرافي.</span>
              </div>
            )}
            {errors.location && <p className="text-[11px] font-bold text-rose-600">{errors.location}</p>}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
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
              <Save className="w-4 h-4" />
              <span>حفظ الملف الطبي واللوكيشن</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
