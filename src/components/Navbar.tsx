import React from 'react';
import { 
  Heart, 
  UserCheck, 
  Bell, 
  MapPin, 
  Pill, 
  FileText, 
  User, 
  Activity,
  Menu,
  X,
  Flame,
  Sparkles,
  LogIn
} from 'lucide-react';

import { UserProfile } from '../types';
import { SocialLinks } from './SocialLinks';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'patient' | 'caregiver' | 'admin';
  setUserRole: (role: 'patient' | 'caregiver' | 'admin') => void;
  onOpenApplication: () => void;
  onOpenLogin: () => void;
  onOpenReminders: () => void;
  onOpenHistory: () => void;
  onOpenProfile: () => void;
  onOpenBooking?: () => void;
  onOpenCuppingBooking?: () => void;
  onOpenPhysiotherapyBooking?: () => void;
  currentUser?: UserProfile;
  activeBookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  onOpenApplication,
  onOpenLogin,
  onOpenReminders,
  onOpenHistory,
  onOpenProfile,
  onOpenBooking,
  onOpenCuppingBooking,
  onOpenPhysiotherapyBooking,
  currentUser,
  activeBookingsCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
      {/* Top emergency & trust bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-slate-300 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            Passant Nursing متاح 24ساعه
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Social media icons */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">تابعنا:</span>
            <SocialLinks variant="compact" />
          </div>
          <span className="text-slate-600">|</span>
          {/* Quick Role Switcher */}
          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-md text-[11px]">
            <button
              onClick={() => setUserRole('patient')}
              className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                userRole === 'patient' ? 'bg-teal-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              المريض
            </button>
            <button
              onClick={() => setUserRole('caregiver')}
              className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                userRole === 'caregiver' ? 'bg-teal-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              الممرض
            </button>
            <button
              onClick={() => setUserRole('admin')}
              className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                userRole === 'admin' ? 'bg-teal-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              الإدارة
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-right group focus:outline-none"
          >
            <div className="h-11 sm:h-12 flex items-center">
              <img
                src="/logo.jpg"
                alt="Passant Nursing - باسانت للتمريض المنزلي والحجامة"
                className="h-10 sm:h-11 w-auto object-contain rounded-lg shadow-2xs group-hover:opacity-95 transition-opacity"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                التمريض · العلاج الطبيعي · الحجامة
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeTab === 'home' ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : 'hover:text-slate-900'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeTab === 'services' ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : 'hover:text-slate-900'
            }`}
          >
            الخدمات والتخصصات
          </button>
          <button
            onClick={() => setActiveTab('nurses')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeTab === 'nurses' ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : 'hover:text-slate-900'
            }`}
          >
            طاقم التمريض والأطباء
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`relative transition-colors whitespace-nowrap py-1 flex items-center gap-1.5 ${
              activeTab === 'tracking' ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : 'hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>تتبع الزيارات الحية</span>
            {activeBookingsCount > 0 && (
              <span className="bg-teal-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {activeBookingsCount}
              </span>
            )}
          </button>
          <button
            onClick={onOpenReminders}
            className="transition-colors whitespace-nowrap py-1 flex items-center gap-1.5 hover:text-teal-700 text-slate-600"
          >
            <Pill className="w-4 h-4 text-amber-600" />
            <span>مواعيد الأدوية</span>
          </button>
          <button
            onClick={onOpenHistory}
            className="transition-colors whitespace-nowrap py-1 flex items-center gap-1.5 hover:text-teal-700 text-slate-600"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>السجل الطبي</span>
          </button>
        </nav>

        {/* Primary Action Zone */}
        <div className="flex items-center gap-2">

          {/* Registration & Login Stack */}
          <div className="hidden sm:flex flex-col items-stretch gap-1">
            <button
              onClick={onOpenApplication}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-300 rounded-md hover:bg-teal-100 transition-colors whitespace-nowrap shadow-2xs"
              title="انضم كطبيب علاج طبيعي، ممرض/ة، أو مساعد متدرب"
            >
              <UserCheck className="w-3 h-3 text-teal-600" />
              <span>انضم كأخصائي أو متدرب</span>
            </button>

            <button
              onClick={onOpenLogin}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-[10px] font-bold text-slate-800 bg-slate-100 border border-slate-300 rounded-md hover:bg-slate-200 transition-colors whitespace-nowrap"
              title="تسجيل دخول العميل لطلب مريض وحفظ بيانات الحالة الصحية واللوكيشن"
            >
              <LogIn className="w-3 h-3 text-teal-700" />
              <span>تسجيل دخول {currentUser && currentUser.fullName ? `(${currentUser.fullName.split(' ')[0]})` : ''}</span>
            </button>
          </div>

          {onOpenPhysiotherapyBooking && (
            <button
              onClick={onOpenPhysiotherapyBooking}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-blue-950 bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 rounded-xl shadow-2xs transition-all whitespace-nowrap border border-blue-300"
              title="طلب زيارة علاج طبيعي وتأهيل حركي"
            >
              <Activity className="w-3.5 h-3.5 text-blue-700" />
              <span>علاج طبيعي</span>
            </button>
          )}

          {onOpenCuppingBooking && (
            <button
              onClick={onOpenCuppingBooking}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-200 to-amber-300 rounded-xl hover:from-amber-300 hover:to-amber-400 shadow-2xs transition-all whitespace-nowrap border border-amber-300"
              title="طلب جلسة حجامة طبية متخصصة ومعقمة"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-900" />
              <span>حجامة</span>
            </button>
          )}

          <PWAInstallButton variant="navbar" />

          <button
            onClick={() => onOpenBooking ? onOpenBooking() : setActiveTab('services')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-teal-600 rounded-xl hover:bg-teal-700 shadow-xs transition-all whitespace-nowrap"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>طلب تمريض</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-right font-medium ${activeTab === 'home' ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => { setActiveTab('services'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-right font-medium ${activeTab === 'services' ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              الخدمات والحجامة
            </button>
            <button
              onClick={() => { setActiveTab('nurses'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-right font-medium ${activeTab === 'nurses' ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              طاقم التمريض
            </button>
            <button
              onClick={() => { setActiveTab('tracking'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-right font-medium flex items-center justify-between ${activeTab === 'tracking' ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              <span>تتبع الزيارة الحية</span>
              {activeBookingsCount > 0 && (
                <span className="bg-teal-600 text-white text-xs px-2 py-0.5 rounded-full">{activeBookingsCount}</span>
              )}
            </button>
            <button
              onClick={() => { onOpenReminders(); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-right font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <Pill className="w-4 h-4 text-amber-600" />
              <span>مواعيد الأدوية</span>
            </button>
            <button
              onClick={() => { onOpenHistory(); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-lg text-right font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>السجل الطبي</span>
            </button>
            <button
              onClick={() => {
                if (onOpenBooking) onOpenBooking();
                else setActiveTab('services');
                setMobileMenuOpen(false);
              }}
              className="col-span-2 p-2.5 rounded-lg text-right font-bold bg-teal-600 text-white flex items-center justify-between shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-white" />
                <span>طلب زيارة تمريض</span>
              </div>
              <span className="text-[10px] bg-teal-800 text-white px-2 py-0.5 rounded font-black">حجز فوري</span>
            </button>
            {onOpenPhysiotherapyBooking && (
              <button
                onClick={() => { onOpenPhysiotherapyBooking(); setMobileMenuOpen(false); }}
                className="col-span-2 p-2.5 rounded-lg text-right font-bold bg-blue-600 text-white flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-white" />
                  <span>طلب علاج طبيعي وتأهيل حركي</span>
                </div>
                <span className="text-[10px] bg-blue-900 text-white px-2 py-0.5 rounded font-black">جلسة منزلية</span>
              </button>
            )}
            {onOpenCuppingBooking && (
              <button
                onClick={() => { onOpenCuppingBooking(); setMobileMenuOpen(false); }}
                className="col-span-2 p-2.5 rounded-lg text-right font-bold bg-amber-500 text-slate-950 flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>طلب حجامة</span>
                </div>
                <span className="text-[10px] bg-slate-950 text-white px-2 py-0.5 rounded font-black">حجز فوري</span>
              </button>
            )}
            <button
              onClick={() => { onOpenProfile(); setMobileMenuOpen(false); }}
              className="col-span-2 p-2.5 rounded-lg text-right font-medium bg-slate-50 text-slate-800 border border-slate-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-teal-700" />
                <span>ملفي الطبي (الأمراض، الأدوية، العمليات)</span>
              </div>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <PWAInstallButton variant="mobile" />
            <button
              onClick={() => { onOpenApplication(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 text-center text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
            >
              تسجيل كممرض/ة
            </button>
            <button
              onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 text-center text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-teal-700" />
              <span>تسجيل دخول {currentUser && currentUser.fullName ? `(${currentUser.fullName.split(' ')[0]})` : ''}</span>
            </button>
          </div>

          {/* Social media links in mobile menu */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-500 mb-2 text-right">تابعنا وتواصل معنا:</p>
            <SocialLinks variant="mobile" />
          </div>
        </div>
      )}
    </header>
  );
};
