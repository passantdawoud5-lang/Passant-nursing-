/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Caregiver, 
  ServiceItem, 
  BookingOrder, 
  CaregiverApplication, 
  MedicationReminder, 
  ChatMessage, 
  BookingStatus, 
  VitalSignsRecord,
  UserProfile,
  Review,
  AdminOrderStatus,
  SupervisorEvaluation
} from './types';
import { 
  INITIAL_SERVICES, 
  INITIAL_CAREGIVERS, 
  INITIAL_BOOKINGS, 
  INITIAL_APPLICATIONS, 
  INITIAL_REMINDERS, 
  INITIAL_CHAT_MESSAGES,
  getStoredBookings,
  saveBookings,
  getStoredCaregivers,
  saveCaregivers,
  getStoredApplications,
  saveApplications,
  getStoredReminders,
  saveReminders,
  getStoredChat,
  saveChat,
  getStoredUserProfile,
  saveUserProfile,
  getStoredRegisteredUsers,
  saveRegisteredUsers
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { NursesDirectory } from './components/NursesDirectory';
import { NurseProfileModal } from './components/NurseProfileModal';
import { BookingModal } from './components/BookingModal';
import { CuppingBookingModal } from './components/CuppingBookingModal';
import { PhysiotherapyBookingModal } from './components/PhysiotherapyBookingModal';
import { LiveTrackingModal } from './components/LiveTrackingModal';
import { DirectChatModal } from './components/DirectChatModal';
import { NurseApplicationModal } from './components/NurseApplicationModal';
import { MedicationReminderModal } from './components/MedicationReminderModal';
import { MedicalHistoryModal } from './components/MedicalHistoryModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ClientLoginModal } from './components/ClientLoginModal';
import { ImmediateReviewModal } from './components/ImmediateReviewModal';
import { CaregiverPortal } from './components/CaregiverPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [userRole, setUserRole] = useState<'patient' | 'caregiver' | 'admin'>('patient');

  // Persistent Datasets
  const [services] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [caregivers, setCaregivers] = useState<Caregiver[]>(() => getStoredCaregivers());
  const [bookings, setBookings] = useState<BookingOrder[]>(() => getStoredBookings());
  const [applications, setApplications] = useState<CaregiverApplication[]>(() => getStoredApplications());
  const [reminders, setReminders] = useState<MedicationReminder[]>(() => getStoredReminders());
  
  // User Profile & Registration (اسم، سن، مرض مزمن، أدوية ماشي عليها، عمليات سابقة، واللوكيشن الإلزامي)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => getStoredUserProfile());
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => getStoredRegisteredUsers());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isClientLoginOpen, setIsClientLoginOpen] = useState(false);
  const [loginModalTab, setLoginModalTab] = useState<'patient_login' | 'patient_register' | 'nurse_login'>('patient_login');
  const [selectedCaregiverForPortal, setSelectedCaregiverForPortal] = useState<Caregiver>(caregivers[0] || INITIAL_CAREGIVERS[0]);

  // Modals & Active Selections
  const [selectedNurseForProfile, setSelectedNurseForProfile] = useState<Caregiver | null>(null);
  
  // Booking modals
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCuppingModalOpen, setIsCuppingModalOpen] = useState(false);
  const [isPhysiotherapyModalOpen, setIsPhysiotherapyModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);
  const [selectedPhysioServiceForBooking, setSelectedPhysioServiceForBooking] = useState<ServiceItem | null>(null);
  const [selectedNurseForBooking, setSelectedNurseForBooking] = useState<Caregiver | null>(null);

  // Live Tracking Modal
  const [activeTrackingBooking, setActiveTrackingBooking] = useState<BookingOrder | null>(null);

  // Chat Modal
  const [activeChatBooking, setActiveChatBooking] = useState<BookingOrder | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Other Modals
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [bookingForRating, setBookingForRating] = useState<BookingOrder | null>(null);

  // Sync to local storage
  useEffect(() => {
    saveBookings(bookings);
  }, [bookings]);

  useEffect(() => {
    saveCaregivers(caregivers);
  }, [caregivers]);

  useEffect(() => {
    saveApplications(applications);
  }, [applications]);

  useEffect(() => {
    saveReminders(reminders);
  }, [reminders]);

  useEffect(() => {
    saveUserProfile(currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveRegisteredUsers(registeredUsers);
  }, [registeredUsers]);

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setCurrentUser(updatedProfile);
    setRegisteredUsers(prev => {
      const exists = prev.some(u => u.id === updatedProfile.id);
      if (exists) {
        return prev.map(u => u.id === updatedProfile.id ? updatedProfile : u);
      }
      return [updatedProfile, ...prev];
    });
  };

  const handleSwitchUser = (user: UserProfile) => {
    setCurrentUser(user);
  };

  // Handle active chat messages loading
  useEffect(() => {
    if (activeChatBooking) {
      setChatMessages(getStoredChat(activeChatBooking.id));
    }
  }, [activeChatBooking]);

  // Open booking modal for a service
  const handleSelectService = (service: ServiceItem) => {
    if (service.category === 'physiotherapy') {
      setSelectedPhysioServiceForBooking(service);
      setIsPhysiotherapyModalOpen(true);
      return;
    }
    if (service.category === 'hijama') {
      setIsCuppingModalOpen(true);
      return;
    }
    setSelectedServiceForBooking(service);
    setSelectedNurseForBooking(null);
    setIsBookingModalOpen(true);
  };

  // Open booking modal directly with a specific nurse / doctor / assistant
  const handleSelectNurse = (nurse: Caregiver) => {
    if (nurse.role === 'physiotherapist') {
      const physioService = services.find(s => s.category === 'physiotherapy') || services[0];
      setSelectedPhysioServiceForBooking(physioService);
      setIsPhysiotherapyModalOpen(true);
      return;
    }
    if (nurse.role === 'cupping_specialist') {
      setIsCuppingModalOpen(true);
      return;
    }
    const defaultService = services[0];
    setSelectedServiceForBooking(defaultService);
    setSelectedNurseForBooking(nurse);
    setIsBookingModalOpen(true);
  };

  // Open dedicated standalone cupping booking modal directly
  const handleOpenCuppingBooking = () => {
    setIsCuppingModalOpen(true);
  };

  // Open dedicated standalone physiotherapy booking modal directly
  const handleOpenPhysiotherapyBooking = (service?: ServiceItem) => {
    const physioService = service || services.find(s => s.category === 'physiotherapy') || services[0];
    setSelectedPhysioServiceForBooking(physioService);
    setIsPhysiotherapyModalOpen(true);
  };

  // Confirm booking
  const handleConfirmBooking = (newBooking: BookingOrder) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    setIsBookingModalOpen(false);
    
    // Immediately open live tracking for the patient!
    setActiveTrackingBooking(newBooking);
  };

  // Status updates
  const handleUpdateStatus = (bookingId: string, newStatus: BookingStatus, newStage: number) => {
    let completedItem: BookingOrder | null = null;

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const updated: BookingOrder = {
          ...b,
          status: newStatus,
          liveTracking: {
            ...b.liveTracking,
            currentStage: newStage,
            estimatedArrivalMinutes: newStage >= 3 ? 0 : b.liveTracking?.estimatedArrivalMinutes || 5,
            lastUpdated: newStatus === 'completed' ? 'اكتملت الزيارة بنجاح' : 'منذ لحظات'
          }
        };

        if (newStatus === 'completed') {
          completedItem = updated;
        }

        return updated;
      }
      return b;
    }));

    if (activeTrackingBooking && activeTrackingBooking.id === bookingId) {
      setActiveTrackingBooking(prev => prev ? {
        ...prev,
        status: newStatus,
        liveTracking: {
          ...prev.liveTracking,
          currentStage: newStage,
          estimatedArrivalMinutes: newStage >= 3 ? 0 : 5,
          lastUpdated: newStatus === 'completed' ? 'اكتملت الزيارة بنجاح' : 'منذ لحظات'
        }
      } : null);
    }

    // Immediately trigger review popup if visit was closed/completed
    if (completedItem && !(completedItem as BookingOrder).review) {
      setBookingForRating(completedItem);
    }
  };

  // Admin status update handler (جديد / قيد المراجعة / تم تعيين ممرض / مكتمل / ملغي)
  const handleUpdateAdminStatus = (bookingId: string, newAdminStatus: AdminOrderStatus, nurseId?: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const matchingNurse = nurseId ? caregivers.find(c => c.id === nurseId) : undefined;
        let mappedStatus: BookingStatus = b.status;
        let mappedStage = b.liveTracking?.currentStage ?? 0;

        if (newAdminStatus === 'جديد') {
          mappedStatus = 'pending_acceptance';
          mappedStage = 0;
        } else if (newAdminStatus === 'قيد المراجعة') {
          mappedStatus = 'pending_acceptance';
          mappedStage = 0;
        } else if (newAdminStatus === 'تم تعيين ممرض') {
          mappedStatus = 'confirmed';
          mappedStage = 1;
        } else if (newAdminStatus === 'مكتمل') {
          mappedStatus = 'completed';
          mappedStage = 4;
        } else if (newAdminStatus === 'ملغي') {
          mappedStatus = 'cancelled';
          mappedStage = 0;
        }

        return {
          ...b,
          adminStatus: newAdminStatus,
          status: mappedStatus,
          caregiverId: matchingNurse ? matchingNurse.id : b.caregiverId,
          caregiverName: matchingNurse ? matchingNurse.name : b.caregiverName,
          caregiverAvatar: matchingNurse ? matchingNurse.avatar : b.caregiverAvatar,
          caregiverPhone: matchingNurse ? matchingNurse.phone : b.caregiverPhone,
          liveTracking: {
            ...b.liveTracking,
            currentStage: mappedStage,
            lastUpdated: `تم تحديث الحالة: ${newAdminStatus}`
          }
        };
      }
      return b;
    }));
  };

  // Update supervisor evaluation and classification for a caregiver
  const handleUpdateSupervisorEvaluation = (nurseId: string, evaluation: SupervisorEvaluation) => {
    setCaregivers(prev => prev.map(cg => {
      if (cg.id === nurseId) {
        return {
          ...cg,
          supervisorEvaluation: evaluation
        };
      }
      return cg;
    }));
  };

  // Submit vitals from caregiver portal
  const handleSubmitVitalSigns = (bookingId: string, vitals: VitalSignsRecord) => {
    let finishedBooking: BookingOrder | null = null;

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        finishedBooking = {
          ...b,
          vitalSigns: vitals,
          status: 'completed' as BookingStatus,
          liveTracking: {
            ...b.liveTracking,
            currentStage: 4,
            estimatedArrivalMinutes: 0,
            lastUpdated: 'اكتملت الزيارة'
          }
        };
        return finishedBooking;
      }
      return b;
    }));

    // Immediately trigger review modal for the patient
    if (finishedBooking) {
      setBookingForRating(finishedBooking);
    }
  };

  // Update medicine invoice & prices recorded by caregiver
  const handleUpdateMedicineInvoice = (
    bookingId: string,
    medicineCost: number,
    pharmacyInvoiceUrl: string,
    pharmacyInvoiceFileName?: string
  ) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const serviceFee = b.medicineRequest?.serviceFee ?? 30;
        const baseAmount = b.payment.baseAmount || 
          (b.payment.amount - (b.payment.transportationFee || 0) - (b.payment.urgentFee || 0) - (b.payment.medicationServiceFee || 0));
        const transportFee = b.payment.transportationFee || 0;
        const urgentFee = b.payment.urgentFee || 0;
        const newTotalAmount = baseAmount + transportFee + urgentFee + serviceFee + medicineCost;

        return {
          ...b,
          medicineRequest: {
            requested: true,
            details: b.medicineRequest?.details || 'إحضار أدوية من الصيدلية',
            serviceFee: serviceFee,
            medicineCost: medicineCost,
            pharmacyInvoiceUrl: pharmacyInvoiceUrl,
            pharmacyInvoiceFileName: pharmacyInvoiceFileName || 'فاتورة_صيدلية_معتمدة.jpg',
            invoiceRecordedAt: new Date().toISOString()
          },
          payment: {
            ...b.payment,
            baseAmount: baseAmount,
            medicationServiceFee: serviceFee,
            medicineCost: medicineCost,
            amount: newTotalAmount
          }
        };
      }
      return b;
    }));
  };

  // Submit immediate review for a completed visit
  const handleSubmitReview = (
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
  ) => {
    // 1. Update the booking's review record
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          review: {
            rating: reviewData.rating,
            professionalismRating: reviewData.professionalismRating,
            cleanlinessRating: reviewData.cleanlinessRating,
            punctualityRating: reviewData.punctualityRating,
            tags: reviewData.tags,
            wouldRecommend: reviewData.wouldRecommend,
            comment: reviewData.comment,
            submittedAt: new Date().toISOString()
          }
        };
      }
      return b;
    }));

    // 2. Update caregiver's cumulative score, reviews count, and reviews list
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (targetBooking) {
      setCaregivers(prev => prev.map(cg => {
        if (cg.id === targetBooking.caregiverId || cg.name === targetBooking.caregiverName) {
          const newReview: Review = {
            id: `rev-${Date.now()}`,
            patientName: targetBooking.patient.fullName,
            rating: reviewData.rating,
            professionalismRating: reviewData.professionalismRating,
            cleanlinessRating: reviewData.cleanlinessRating,
            punctualityRating: reviewData.punctualityRating,
            tags: reviewData.tags,
            wouldRecommend: reviewData.wouldRecommend,
            date: new Date().toISOString().split('T')[0],
            comment: reviewData.comment,
            serviceTitle: targetBooking.serviceTitle
          };

          const updatedReviews = [newReview, ...(cg.reviews || [])];
          const totalScore = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvgRating = Number((totalScore / updatedReviews.length).toFixed(2));
          const newPunctuality = reviewData.punctualityRating === 5
            ? Math.min(100, (cg.punctualityScore || 98) + 1)
            : cg.punctualityScore;

          return {
            ...cg,
            rating: newAvgRating,
            reviewsCount: updatedReviews.length,
            punctualityScore: newPunctuality,
            reviews: updatedReviews
          };
        }
        return cg;
      }));
    }
  };

  // Send chat message
  const handleSendMessage = (bookingId: string, text: string, isVoice?: boolean, attachmentName?: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      bookingId,
      senderRole: userRole === 'caregiver' ? 'nurse' : 'patient',
      senderName: userRole === 'caregiver' ? caregivers[0].name : 'المريض',
      text,
      timestamp: timeStr,
      isVoice,
      attachmentName
    };

    const updated = [...chatMessages, newMsg];
    setChatMessages(updated);
    saveChat(bookingId, updated);

    // Simulated quick reply if patient asked a question
    if (userRole === 'patient') {
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          bookingId,
          senderRole: 'nurse',
          senderName: 'سارة عبد الرحمن (الممرضة)',
          text: 'تم الاستلام وجاري التحضير بدقة، لا تقلق على الإطلاق.',
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => {
          const withReply = [...prev, replyMsg];
          saveChat(bookingId, withReply);
          return withReply;
        });
      }, 1500);
    }
  };

  // Caregiver application submit
  const handleSubmitApplication = (app: CaregiverApplication) => {
    setApplications(prev => [app, ...prev]);
  };

  // Admin approval of nurse
  const handleApproveApplication = (appId: string) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'approved' as const } : a));
    
    // Add approved applicant to available caregivers
    const app = applications.find(a => a.id === appId);
    if (app) {
      const newNurse: Caregiver = {
        id: `nurse-${Date.now()}`,
        name: app.fullName,
        age: app.age,
        gender: app.gender,
        avatar: app.gender === 'female' 
          ? '/src/assets/images/nurse_avatar_female_1793095933006.jpg' 
          : '/src/assets/images/nurse_avatar_male_1793095932397.jpg',
        phone: app.phone,
        qualification: app.qualification,
        institution: `${app.institutionName} (معتمد حديثاً)`,
        licenseNumber: `ترخيص ساري / ${app.graduationYear}`,
        experienceYears: app.experienceYears,
        rating: 5.0,
        reviewsCount: 1,
        specialties: app.specialties,
        city: app.city,
        district: app.district,
        hourlyRate: 170,
        visitRate: 210,
        bio: `أخصائي تمريض معتمد وموثق، خريج ${app.institutionName} بخبرة ${app.experienceYears} سنوات، مستوفٍ لكافة اختبارات الكفاءة والتعقيم الطبي.`,
        verificationDocs: {
          licenseCard: true,
          degreeCert: true,
          nationalId: true,
          criminalRecord: true,
          drugTest: true
        },
        isVerified: true,
        isAvailable: true,
        completedVisits: 0,
        acceptanceRate: 100,
        punctualityScore: 100,
        reviews: [
          {
            id: `rev-new-${Date.now()}`,
            patientName: 'إدارة باسانت للتمريض',
            rating: 5,
            date: '2026-10-27',
            comment: 'تم اعتماد الوثائق ومطابقة شهادة التخرج وتحليل المخدرات السلبي.',
            serviceTitle: 'اعتماد مقدم رعاية'
          }
        ]
      };
      setCaregivers(prev => [newNurse, ...prev]);
    }
  };

  const handleRejectApplication = (appId: string) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'rejected' as const } : a));
  };

  // Medication reminders
  const handleAddReminder = (reminder: MedicationReminder) => {
    setReminders(prev => [reminder, ...prev]);
  };

  const handleMarkReminderTaken = (remId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    setReminders(prev => prev.map(r => {
      if (r.id === remId) {
        return {
          ...r,
          history: [{ date: today, time: timeStr, taken: true }, ...r.history]
        };
      }
      return r;
    }));
  };

  const activeBookingsCount = bookings.filter(b => b.status === 'on_the_way' || b.status === 'arrived_in_progress' || b.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white" dir="rtl">
      
      {/* Top Navbar adhering to the strict contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenApplication={() => setIsApplicationModalOpen(true)}
        onOpenLogin={() => setIsClientLoginOpen(true)}
        onOpenReminders={() => setIsRemindersModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenCuppingBooking={handleOpenCuppingBooking}
        onOpenPhysiotherapyBooking={handleOpenPhysiotherapyBooking}
        onOpenBooking={() => {
          setSelectedServiceForBooking(services[0]);
          setSelectedNurseForBooking(null);
          setIsBookingModalOpen(true);
        }}
        currentUser={currentUser}
        activeBookingsCount={activeBookingsCount}
      />

      {/* Main Content Area based on User Role & Tab */}
      <main className="flex-1">
        {userRole === 'admin' ? (
          /* Admin / Supervisor Control Center */
          <AdminDashboard
            bookings={bookings}
            applications={applications}
            caregivers={caregivers}
            registeredUsers={registeredUsers}
            onApproveApplication={handleApproveApplication}
            onRejectApplication={handleRejectApplication}
            onUpdateOrderStatus={handleUpdateStatus}
            onUpdateAdminStatus={handleUpdateAdminStatus}
            onUpdateSupervisorEvaluation={handleUpdateSupervisorEvaluation}
          />
        ) : userRole === 'caregiver' ? (
          /* Caregiver Portal (for nurses) */
          <CaregiverPortal
            caregiver={selectedCaregiverForPortal || caregivers[0]}
            bookings={bookings}
            onUpdateStatus={handleUpdateStatus}
            onSubmitVitalSigns={handleSubmitVitalSigns}
            onOpenChat={(b) => setActiveChatBooking(b)}
            onOpenTracking={(b) => setActiveTrackingBooking(b)}
            onUpdateMedicineInvoice={handleUpdateMedicineInvoice}
          />
        ) : (
          /* Patient & General Client View */
          <div>
            {/* Hero Section */}
            {(activeTab === 'home' || activeTab === 'services') && (
              <HeroSection
                onBookNow={() => {
                  const defaultService = services[0];
                  handleSelectService(defaultService);
                }}
                onExploreNurses={() => {
                  setActiveTab('nurses');
                  const elem = document.getElementById('nurses');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                onOpenApplication={() => setIsApplicationModalOpen(true)}
                onOpenCuppingBooking={handleOpenCuppingBooking}
                onOpenPhysiotherapyBooking={handleOpenPhysiotherapyBooking}
              />
            )}

            {/* Services Section */}
            {(activeTab === 'home' || activeTab === 'services') && (
              <ServicesSection
                services={services}
                onSelectService={handleSelectService}
                onOpenCuppingBooking={handleOpenCuppingBooking}
                onOpenPhysiotherapyBooking={handleOpenPhysiotherapyBooking}
              />
            )}

            {/* Nurses Directory Section */}
            {(activeTab === 'home' || activeTab === 'nurses') && (
              <NursesDirectory
                caregivers={caregivers}
                onSelectNurse={handleSelectNurse}
                onViewProfile={(nurse) => setSelectedNurseForProfile(nurse)}
              />
            )}

            {/* Live Tracking View when tracking tab is selected */}
            {activeTab === 'tracking' && (
              <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 text-right">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">طلبات وزيارات التمريض الحية</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    تابع موقع الممرض بالـ GPS في الوقت الفعلي ومراحل الوصول المباشرة.
                  </p>
                </div>

                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map(bk => (
                      <div
                        key={bk.id}
                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-sm">{bk.serviceTitle}</h3>
                            <span className="text-[10px] bg-slate-100 font-mono px-2 py-0.5 rounded font-bold">
                              {bk.id}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              bk.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-teal-50 text-teal-700 border border-teal-200'
                            }`}>
                              {bk.status === 'completed' ? 'اكتملت الزيارة' : 'قيد التنفيذ'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            الممرض: <strong className="text-teal-800">{bk.caregiverName}</strong> ({bk.caregiverPhone})
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            المريض: {bk.patient.fullName} · {bk.patient.address}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {bk.status === 'completed' ? (
                            <>
                              {bk.review ? (
                                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                                  <span className="text-amber-500 text-xs">⭐</span>
                                  <span className="text-xs font-bold text-amber-900 font-mono">
                                    {bk.review.rating} / 5
                                  </span>
                                  <span className="text-[10px] text-amber-700">تم التقييم بنجاح</span>
                                  <button
                                    onClick={() => setBookingForRating(bk)}
                                    className="text-[10px] font-bold text-teal-700 hover:underline mr-1"
                                  >
                                    (تعديل)
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setBookingForRating(bk)}
                                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 animate-pulse"
                                >
                                  <span>⭐</span>
                                  <span>قيّم أداء الممرض الآن (فوري)</span>
                                </button>
                              )}
                              <button
                                onClick={() => setActiveTrackingBooking(bk)}
                                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                              >
                                تفاصيل الزيارة
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setActiveTrackingBooking(bk)}
                              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                            >
                              فتح خريطة التتبع المباشر (GPS)
                            </button>
                          )}
                          <button
                            onClick={() => setActiveChatBooking(bk)}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                          >
                            محادثة
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                    <p className="text-sm text-slate-500">لا توجد طلبات جارية حالياً.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {/* 1. Nurse Profile Modal */}
      <NurseProfileModal
        nurse={selectedNurseForProfile}
        onClose={() => setSelectedNurseForProfile(null)}
        currentUserRole={userRole}
        currentCaregiverId={selectedCaregiverForPortal?.id}
        onBookVisit={(nurse) => {
          setSelectedNurseForProfile(null);
          handleSelectNurse(nurse);
        }}
      />

      {/* 2. Comprehensive Pre-Booking Medical Form Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        service={selectedServiceForBooking}
        selectedNurse={selectedNurseForBooking}
        caregivers={caregivers}
        currentUser={currentUser}
        onConfirmBooking={handleConfirmBooking}
      />

      {/* 2b. Standalone Dedicated Cupping Booking Modal */}
      <CuppingBookingModal
        isOpen={isCuppingModalOpen}
        onClose={() => setIsCuppingModalOpen(false)}
        caregivers={caregivers}
        currentUser={currentUser}
        cuppingService={services.find(s => s.category === 'hijama')}
        onConfirmBooking={(newBooking) => {
          handleConfirmBooking(newBooking);
          setIsCuppingModalOpen(false);
        }}
      />

      {/* 2c. Standalone Dedicated Physiotherapy & Motor Rehabilitation Booking Modal */}
      <PhysiotherapyBookingModal
        isOpen={isPhysiotherapyModalOpen}
        onClose={() => setIsPhysiotherapyModalOpen(false)}
        caregivers={caregivers}
        currentUser={currentUser}
        service={selectedPhysioServiceForBooking || services.find(s => s.category === 'physiotherapy')}
        onConfirmBooking={(newBooking) => {
          handleConfirmBooking(newBooking);
          setIsPhysiotherapyModalOpen(false);
        }}
      />

      {/* 3. Live GPS Tracking Modal */}
      <LiveTrackingModal
        booking={activeTrackingBooking}
        onClose={() => setActiveTrackingBooking(null)}
        onOpenChat={(b) => setActiveChatBooking(b)}
        onUpdateStatus={handleUpdateStatus}
        onOpenReview={(b) => setBookingForRating(b)}
      />

      {/* 4. Instant Direct Chat Modal */}
      <DirectChatModal
        booking={activeChatBooking}
        messages={chatMessages}
        onClose={() => setActiveChatBooking(null)}
        onSendMessage={handleSendMessage}
      />

      {/* 5. Nurse Onboarding / Screening Application Modal */}
      <NurseApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        onSubmitApplication={handleSubmitApplication}
        applications={applications}
        onOpenNurseLogin={() => {
          setLoginModalTab('nurse_login');
          setIsClientLoginOpen(true);
        }}
      />

      {/* 6. Medication Reminders Modal */}
      <MedicationReminderModal
        isOpen={isRemindersModalOpen}
        onClose={() => setIsRemindersModalOpen(false)}
        reminders={reminders}
        onAddReminder={handleAddReminder}
        onMarkTaken={handleMarkReminderTaken}
      />

      {/* 7. Patient Medical History & Health Reports Modal */}
      <MedicalHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        bookings={bookings}
        patientProfile={currentUser}
      />

      {/* 8. Client Sign-in, Patient Registration (11 Fields) & Nurse Login Modal */}
      <ClientLoginModal
        isOpen={isClientLoginOpen}
        onClose={() => setIsClientLoginOpen(false)}
        currentUser={currentUser}
        registeredUsers={registeredUsers}
        caregivers={caregivers}
        initialTab={loginModalTab}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setUserRole('patient');
        }}
        onRegisterSuccess={(newUser) => {
          setCurrentUser(newUser);
          setRegisteredUsers(prev => [newUser, ...prev]);
          setUserRole('patient');
        }}
        onCaregiverLoginSuccess={(nurse) => {
          setSelectedCaregiverForPortal(nurse);
          setUserRole('caregiver');
          setActiveTab('caregiver');
        }}
        onLogout={() => {
          setCurrentUser({
            ...currentUser,
            id: `usr-guest-${Date.now()}`,
            fullName: '',
            phone: '',
            chronicDiseases: '',
            currentMedications: '',
            hasPreviousSurgeries: false,
            previousSurgeriesDetails: '',
            address: '',
            locationCoordinates: { lat: 0, lng: 0, addressName: '' }
          });
        }}
        onOpenBookingForPatient={() => {
          const defaultService = services[0];
          handleSelectService(defaultService);
        }}
        onOpenNurseApplication={() => {
          setIsClientLoginOpen(false);
          setIsApplicationModalOpen(true);
        }}
      />

      {/* 9. Patient Medical Profile & Mandatory Location Registration Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onSaveProfile={handleSaveProfile}
        registeredUsers={registeredUsers}
        onSwitchUser={handleSwitchUser}
      />

      {/* Immediate Post-Visit Review Modal */}
      <ImmediateReviewModal
        isOpen={!!bookingForRating}
        booking={bookingForRating}
        onClose={() => setBookingForRating(null)}
        onSubmitReview={handleSubmitReview}
      />

      {/* Domain-Appropriate Footer */}
      <Footer
        onOpenApplication={() => setIsApplicationModalOpen(true)}
        onOpenLogin={() => setIsClientLoginOpen(true)}
        onOpenReminders={() => setIsRemindersModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
      />

      <OfflineIndicator />

    </div>
  );
}
