export type CaregiverGender = 'male' | 'female';
export type PreferredGender = 'male' | 'female' | 'any';

export type QualificationType = 'college' | 'institute' | 'academy' | 'diploma' | 'postgrad';

export interface Review {
  id: string;
  patientName: string;
  rating: number;
  professionalismRating?: number; // الاحترافية
  cleanlinessRating?: number; // النظافة والتعقيم
  punctualityRating?: number; // الالتزام بالوقت
  tags?: string[];
  wouldRecommend?: boolean;
  date: string;
  comment: string;
  serviceTitle: string;
}

export interface VerificationDocs {
  licenseCard: boolean; // كارنيه مزاولة المهنة ساري
  degreeCert: boolean; // شهادة التخرج
  nationalId: boolean; // بطاقة الرقم القومي سارية
  criminalRecord: boolean; // فيش وتشبيه حديث
  drugTest: boolean; // تحليل مخدرات معتمد
}

export type SupervisorTier = 
  | 'فئة أ (أداء استثنائي فائق الجودة)'
  | 'فئة ب (ممتاز ومعتمد)'
  | 'فئة ج (جيد جداً)'
  | 'تحت المتابعة الميدانية';

export interface SupervisorEvaluation {
  rating: number; // 1 to 5 stars
  tier: SupervisorTier; // تصنيف المشرفين
  executionQualityScore: number; // e.g. 98% جودة تنفيذ الطلبات المكتملة
  punctualityScore?: number;
  hygieneAndSterilizationScore?: number;
  supervisorNotes: string; // ملاحظات المشرف الميداني
  evaluatedBy: string; // اسم المشرف المسؤول
  evaluatedAt: string; // تاريخ التقييم
}

export type CaregiverRoleType = 
  | 'nurse' 
  | 'physiotherapist' 
  | 'cupping_specialist' 
  | 'assistant_trainee';

export type TrainingTrack = 'nursing' | 'hijama' | 'physiotherapy';

export interface Caregiver {
  id: string;
  name: string;
  age: number;
  gender: CaregiverGender;
  avatar: string;
  phone: string;
  qualification: QualificationType;
  institution: string; // اسم الكلية / المعهد / الأكاديمية
  licenseNumber: string; // رقم تصريح مزاولة المهنة / كارنيه النقابة
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  specialties: string[];
  city: string;
  district: string;
  hourlyRate: number; // EGP
  visitRate: number; // EGP
  bio: string;
  verificationDocs: VerificationDocs;
  isVerified: boolean;
  isAvailable: boolean;
  completedVisits: number;
  acceptanceRate: number; // %
  punctualityScore: number; // %
  reviews: Review[];
  supervisorEvaluation?: SupervisorEvaluation;
  role?: CaregiverRoleType;
  trainingTrack?: TrainingTrack; // للمساعدين والمتدربين
  portableDevices?: string[]; // لأخصائيي العلاج الطبيعي
  ptSyndicateNumber?: string; // قيد نقابة العلاج الطبيعي
}

export interface ServiceItem {
  id: string;
  title: string;
  category: 'nursing' | 'hijama' | 'elderly' | 'emergency' | 'physiotherapy';
  shortDesc: string;
  fullDesc: string;
  price: number;
  durationMinutes: number;
  includedSupplies: string[];
  preparationNotes: string;
  iconName: string;
  isPopular?: boolean;
}

export type BookingStatus =
  | 'pending_acceptance'
  | 'confirmed'
  | 'on_the_way'
  | 'arrived_in_progress'
  | 'completed'
  | 'cancelled';

export type AdminOrderStatus = 'جديد' | 'قيد المراجعة' | 'تم تعيين ممرض' | 'مكتمل' | 'ملغي';
export type TimingChoice = 'تحديد معاد' | 'فوري' | 'مستعجل';

export type PaymentMethod = 'cash' | 'vodafone_cash' | 'instapay' | 'card';
export type PaymentStatus = 'paid' | 'pending' | 'cash_on_delivery';

export interface VitalSignsRecord {
  bloodPressure: string;
  bloodSugar: string;
  heartRate: string;
  oxygenSaturation: string;
  temperature: string;
  respiratoryRate?: string;
  clinicalNotes: string;
  recordedAt: string;
  nurseName: string;
}

export interface PhysiotherapyBookingDetails {
  conditionCategory: 
    | 'تأهيل جلطات ومخ وأعصاب (Stroke & Neuro Rehab)'
    | 'غضاريف وعمود فقري وآلام الظهر والرقبة (Disc & Spine)'
    | 'تأهيل ما بعد الكسور والعمليات وتغيير المفاصل (Post-Op & Fractures)'
    | 'علاج طبيعي لشلل العصب السابع والوجه (Bell\'s Palsy)'
    | 'تأهيل كبار السن وحالات الاتزان والمشية (Geriatric Balance)'
    | 'إصابات ملاعب وتمزق أربطة وغضاريف الركبة (Sports Injuries)'
    | 'علاج طبيعي للأطفال وحالات الشلل الدماغي (Pediatric Rehab)'
    | string;
  mobilityStatus: 
    | 'طريح الفراش بالكامل (غير قادر على الحركة)'
    | 'يتحرك بمساعدة مشاية أو عكاز أو مرافق'
    | 'يتحرك ذاتياً مع وجود ألم شديد وتيبس بالحركة'
    | string;
  affectedBodyParts: string | string[]; // الطرف المصاب / موضع الإصابة
  sessionGoal?: string; // الهدف من الجلسة
  requiredDevices?: string[]; // الأجهزة المحمولة المطلوبة
  portableDevicesNeeded?: string[]; // الأجهزة الطبية المتنقلة المطلوبة
  sessionFrequency?: 'جلسة تقييم وتأهيل فردية' | 'كورس مكثف (3 جلسات أسبوعياً)' | 'متابعة أسبوعية مستمرة' | string;
  medicalDiagnosisNotes?: string; // التشخيص الطبي وتاريخ الإصابة
  postFractureOrSurgeryNotes?: string; // تفاصيل وتاريخ الكسر أو الجراحة
  hasTraumaticFractureOrPins?: boolean; // هل يوجد شرائح ومسامير أو كسور حديثة؟
  hasHeartPacemakerOrMetalImplants?: boolean; // شرائح ومسامير أو منظم ضربات قلب
  accompanyingAssistantRequested?: boolean; // هل تطلب ممرض/مساعد متدرب مصاحب للأخصائي؟
  assistantNote?: string;
  radiologyReports?: string[];
  preferredTherapistGender?: 'male' | 'female' | 'any';
  directPricingAgreed?: boolean; // الاتفاق المالي يتم مباشرة بين الطبيب والمريض
}

export interface BookingOrder {
  id: string; // e.g. ORD-2026-8941
  orderNumber?: string; // رقم الطلب المخصص للعرض
  createdAt: string;
  serviceId: string;
  serviceTitle: string;
  category: 'nursing' | 'hijama' | 'elderly' | 'emergency' | 'physiotherapy';
  orderType: 'standard' | 'urgent'; // طلب عادي أو طلب عاجل
  isUrgent: boolean; // هل الطلب عاجل
  urgentFee?: number; // رسوم الطلب العاجل
  caregiverId: string;
  caregiverName: string;
  caregiverAvatar: string;
  caregiverPhone: string;

  // Visit date & timing selection (تاريخ الزيارة واختيار الوقت المناسب)
  visitDate: string; // تاريخ الزيارة
  timingChoice: TimingChoice; // اختيار الوقت المناسب: تحديد معاد / فوري / مستعجل
  preferredTime?: string; // في حال اختيار تحديد معاد
  scheduledDate: string;
  scheduledTime: string;

  // Visit location (عنوان الزيارة)
  governorate: string; // المحافظة
  detailedAddress: string; // المنطقة والعنوان بالتفصيل

  // Prescription (اضافه الروشتة)
  prescriptionUrl?: string;
  prescriptionFileName?: string;

  // Medical questionnaire answers (الأسئلة الطبية الإلزامية لسلامة الإجراء)
  hasChronicDiseasesAnswer?: string; // 1. هل يعاني المريض من أي أمراض مزمنة؟
  currentMedicationsAnswer?: string; // 2. ما هي الأدوية التي يتناولها المريض بانتظام حالياً؟ (الأدوية اللي ماشي عليها) *
  allergiesOrForbiddenAnswer?: string; // 3. هل في أدوية معينة ممنوعة أو حساسية مفرطة؟
  previousSurgeriesAnswer?: string; // 4. هل أجرى المريض أي عمليات جراحية سابقة؟ (هل عامل عمليات قبل كدا ولا لا) *
  hasPreviousSurgeries?: boolean;

  // Home medicine availability (4. حالة توفر الأدوية والمحاليل في المنزل)
  medicationAvailableAtHome: boolean; // العلاج متاح بالمنزل والأدوية والمحاليل متوفرة بحوزتي حالياً

  // خانة إحضار أدوية (طلب أدوية من الممرض + 30 جنيه خدمة + تسجيل الأسعار والفاتورة عند الوصول)
  medicineRequest?: {
    requested: boolean; // هل العميل طلب إحضار أدوية من الصيدلية؟
    details: string; // أسماء الأدوية والمستلزمات المطلوبة
    serviceFee: number; // سعر الخدمة 30 جنيه
    medicineCost?: number; // سعر الأدوية الفعلي الذي يكتبه الممرض عند الوصول
    pharmacyInvoiceUrl?: string; // صورة فاتورة الأدوية
    pharmacyInvoiceFileName?: string;
    invoiceRecordedAt?: string;
  };

  // Cupping Specific Details (حجز الحجامة)
  isCuppingOrder?: boolean;
  cuppingDetails?: {
    hasHypertensionOrDiabetes: boolean; // هل تعاني من اي ضغط او سكر؟!
    hasBleedingTendency: boolean; // هل تعاني سيولة؟!
    hasOtherDiseases: boolean; // هل لديك اي أمراض تعاني منها؟!
    otherDiseasesDetails?: string;
    hasSkinDiseasesOrWounds: boolean; // هل تعاني من امراض جلدية او جروح في جسمك؟؟
    skinDiseasesDetails?: string;
    lastCuppingAndComplications: string; // متي اخر حجامه سابقة و اي مضاعفات حصلت؟!
    locationType: 'المركز' | 'المنزل'; // مكان الزيارة؟!
    cuppingType: string; // نوع الحجامة المطلوبة؟!
    gender: 'ذكر' | 'أنثى'; // النوع
    isRestrictedToDryCupping: boolean; // قيد الحجامة الجافة في حال وجود سيولة أو ضغط أو سكر
  };

  // Physiotherapy Specific Details (حجز جلسة علاج طبيعي وتأهيل حركي)
  isPhysiotherapyOrder?: boolean;
  physiotherapyDetails?: PhysiotherapyBookingDetails;

  // Accompaniment by a clinical trainee/assistant (طلب مساعد أو متدرب)
  assistantRequested?: {
    requested: boolean;
    track: TrainingTrack;
    note?: string;
    companionGender?: PreferredGender;
  };

  // Admin order status (حالة الطلب اللي هتظهر للإدارة)
  adminStatus: AdminOrderStatus; // جديد / قيد المراجعة / تم تعيين ممرض / مكتمل / ملغي

  patient: {
    fullName: string; // اسم المريض ثلاثي
    phone: string; // رقم التواصل
    age: number; // عمر البيشنت
    address: string; // العنوان بالتفصيل
    governorate?: string; // المحافظة
    locationCoordinates?: {
      lat: number;
      lng: number;
      addressName: string;
    };
    chronicDiseases: string; // أمراض مزمنة
    currentMedications?: string; // الأدوية اللي ماشي عليها المريض
    forbiddenMedications: string; // أدوية معينة ممنوعة أو حساسية
    hasPreviousSurgeries?: boolean; // هل عامل عمليات سابقة
    previousSurgeries: string; // تفاصيل العمليات السابقة
    medicationAvailable: boolean; // هل العلاج متاح ولا الممرض يجيبو وهو جاي
    medicalReports: string[]; // إرفاق التقارير والروشتات
    preferredCaregiverGender: PreferredGender; // اختيار جنس مقدم الرعاية
  };
  status: BookingStatus;
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
    amount: number;
    baseAmount?: number;
    medicationFee?: number;
    medicationServiceFee?: number; // سعر الخدمة 30 جنيه
    medicineCost?: number; // سعر الأدوية الفعلي من فاتورة الصيدلية
    urgentFee?: number;
    transportationFee?: number;
    invoiceNumber: string;
    transactionRef?: string;
    walletNumber?: string;
  };
  googleMapsUrl?: string;
  liveTracking: {
    nurseLocation?: { lat: number; lng: number; description?: string; addressName?: string };
    estimatedArrivalMinutes: number;
    currentStage: number; // 0: تم الحجز, 1: تم القبول, 2: في الطريق, 3: وصل, 4: اكتمل
    lastUpdated: string;
    isLiveLocationActive?: boolean; // بث مباشر نشط بين الممرض والعميل لحماية الطرفين
    riskProtectionEnabled?: boolean; // درع الحماية من المخاطر ومتابعة الإجراء
    sessionStartedAt?: string;
    sessionEndedAt?: string;
    distanceMeters?: number;
    patientCoordinates?: { lat: number; lng: number; addressName?: string };
  };
  vitalSigns?: VitalSignsRecord;
  review?: {
    rating: number;
    professionalismRating?: number; // تقييم الاحترافية
    cleanlinessRating?: number; // تقييم النظافة والتعقيم
    punctualityRating?: number; // تقييم الالتزام بالوقت
    tags?: string[];
    wouldRecommend?: boolean;
    comment: string;
    submittedAt: string;
  };
}

export interface CaregiverApplication {
  id: string;
  // Role & Track Selection (دور مقدم الطلب ومسار التدريب)
  applicantRole?: CaregiverRoleType; // ممرض / أخصائي علاج طبيعي / ممارس حجامة / مساعد ومتدرب
  trainingTrack?: TrainingTrack; // لمسار المساعد والمتدرب (تمريض / حجامة / علاج طبيعي)

  // Step 1: Personal Data (الصفحة الأولى: البيانات الشخصية)
  fullName: string;
  phone: string;
  whatsappPhone?: string;
  email?: string;
  nationalIdNumber: string;
  birthDate?: string;
  age: number;
  gender: CaregiverGender;
  governorate?: string;
  city: string;
  district: string;
  detailedAddress?: string;
  personalPhoto?: string;

  // Step 2: Qualifications & Experience (الصفحة الثانية: المؤهلات والخبرات)
  qualification: QualificationType;
  qualificationTitle?: string;
  institutionName: string;
  graduationYear: number;
  nursingSpecialty?: string;
  licenseNumber?: string;
  experienceYears: number;
  departmentsWorked?: string[];
  skillsMastered?: string[];
  previousWorkplaces?: string;
  trainingCourses?: string;
  specialties: string[];

  // Fields specific to Physiotherapists (أخصائي / طبيب العلاج الطبيعي)
  ptSyndicateNumber?: string; // رقم القيد بنقابة العلاج الطبيعي
  physiotherapySpecialty?: string; // تخصص العلاج الطبيعي (مخ وأعصاب / عظام / إصابات ملاعب / أطفال)
  portableDevicesOwned?: string[]; // الأجهزة المحمولة المتوفرة بحوزته

  // Fields specific to Assistants / Trainees (المساعدين والمتدربين)
  traineeEducationLevel?: string; // المستوى الدراسي (طالب بالفرقة... / خريج حديث / معهد فني)
  trainingGoals?: string; // المهارات والخبرات التي يرغب في تعلمها
  preferredTrainingAreas?: string[]; // المناطق المفضلة للتدريب الميداني
  traineeSupervisingMentor?: string; // المشرف المطلوب التدرب معه

  // Step 3: Work Details & Documents (الصفحة الثالثة: تفاصيل العمل والمستندات)
  workType?: 'home' | 'hospital' | 'both';
  shiftSystem?: '8' | '12' | '24' | 'visits';
  expectedSalary?: string;
  availableGovernorates?: string[];
  availableWorkingHours?: string;
  canStayOvernight?: boolean;

  documents: {
    nationalIdName: string; // إلزامي: صورة البطاقة الشخصية
    degreeCertName: string; // إلزامي: صورة المؤهل الدراسي أو كارنيه الكلية للمتدرب
    licenseCardName: string; // إلزامي: صورة ترخيص مزاولة المهنة / كارنيه النقابة (أو كارنيه الكلية للمتدربين)
    experienceCertsName?: string; // اختياري: شهادات الخبرة والدورات
    criminalRecordName?: string;
    drugTestName?: string;
  };

  agreedToAccuracy?: boolean;
  agreedToPrivacy?: boolean;

  status: 'reviewing' | 'approved' | 'rejected' | 'needs_update';
  notes?: string;
  submittedAt: string;
}

export interface MedicationReminder {
  id: string;
  patientName: string;
  medicationName: string;
  dosage: string;
  scheduleTimes: string[]; // e.g. ["09:00", "21:00"]
  withFood: boolean;
  notes: string;
  active: boolean;
  history: {
    date: string;
    time: string;
    taken: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderRole: 'patient' | 'nurse' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  attachmentName?: string;
  isVoice?: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string; // الاسم بالكامل
  phone: string; // رقم الهاتف
  email?: string; // البريد الإلكتروني
  gender?: 'male' | 'female'; // النوع (ذكر / أنثى)
  birthDate?: string; // تاريخ الميلاد
  age?: number; // السن (محسوب من تاريخ الميلاد أو اختياري)
  governorate?: string; // المحافظة
  city?: string; // المدينة
  address: string; // العنوان بالتفصيل
  locationCoordinates: {
    lat: number;
    lng: number;
    addressName: string;
  }; // اللوكيشن GPS
  password?: string; // كلمة المرور
  avatar?: string; // صورة شخصية
  relationshipToPatient?: string; // صلة القرابة (نفسي / والدي / والدتي / إلخ)
  patientName?: string; // اسم المريض المطلوب له الرعاية
  chronicDiseases?: string; // المرض المزمن
  currentMedications?: string; // الأدوية اللي ماشي عليها
  hasPreviousSurgeries?: boolean; // هل عامل عمليات قبل كدا
  previousSurgeriesDetails?: string; // تفاصيل العمليات
  registeredAt: string;
}

