import React, { useState, useEffect } from 'react';
import { CaregiverApplication, QualificationType, CaregiverGender, CaregiverRoleType, TrainingTrack } from '../types';
import { 
  X, 
  ShieldCheck, 
  Upload, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  UserCheck, 
  FileText,
  User,
  GraduationCap,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Lock,
  Phone,
  Mail,
  Calendar,
  Building,
  Check,
  Search,
  RefreshCw,
  Camera,
  Info,
  Activity,
  Sparkles,
  Stethoscope,
  Users
} from 'lucide-react';

interface NurseApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (app: CaregiverApplication) => void;
  applications?: CaregiverApplication[];
  onOpenNurseLogin?: () => void;
}

const EGYPT_GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'القليوبية',
  'الدقهلية',
  'الشرقية',
  'المنوفية',
  'الغربية',
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

const POPULAR_DEPARTMENTS = [
  'العناية المركزة (ICU)',
  'طوارئ وحوادث (ER)',
  'أطفال وحضانات (NICU)',
  'جراحة وعمليات',
  'باطنة وقلب',
  'كلى وغسيل كلوي',
  'أورام',
  'قسطرة قلبية',
  'عظام وإصابات',
  'تمريض مسنين ومنزلي',
  'عيادات وسحب عينات'
];

const CLINICAL_SKILLS = [
  'تركيب كانيولا عادية وحرجة',
  'إعطاء الحقن (عضل/وريد/تحت الجلد)',
  'تركيب المحاليل والتغذية الوريدية',
  'اختبار الحساسية الدوائية',
  'تركيب وفك القسطرة البولية المعقمة',
  'غيار الجروح العادية والجراحية',
  'غيار جروح الفتيل وقرح الفراش المتقدمة',
  'فك السلك والدبابيس الجراحية',
  'فك الدرنقة الجراحية',
  'سحب عينات الدم والتحاليل المخبرية',
  'تركيب الرايل والتغذية الأنبوبية',
  'جلسات الاستنشاق (نيبولايزر)',
  'حقن الإنسولين وتنظيم جرعات السكر',
  'رعاية حالات التنفس الصناعي والشفاط',
  'حجامة دموية وجافة معقمة'
];

const PT_SPECIALTIES_LIST = [
  'تأهيل مخ وأعصاب وجلطات دماغية',
  'عظام وعمود فقري وانزلاق غضروفي',
  'تأهيل ما بعد الكسور والعمليات وتغيير المفاصل',
  'إصابات ملاعب وتأهيل رياضي',
  'علاج طبيعي للأطفال والشلل الدماغي',
  'تأهيل كبار السن وحالات الاتزان',
  'علاج طبيعي لشلل الوجه والعصب السابع'
];

const PT_SKILLS_LIST = [
  'تطبيق التنبيه الكهربائي TENS / EMS',
  'العلاج بالموجات فوق الصوتية Ultrasound',
  'الكمادات الحرارية والأشعة تحت الحمراء',
  'تمارين تحريك المفاصل وتقوية العضلات',
  'إعادة تأهيل المشي والتوازن الحركي',
  'أشرطة التثبيت الحركي Kinesio Tape',
  'تمارين التمدد والاستطالة العضلية',
  'التدليك العلاجي والتصريف الليمفاوي'
];

const PT_PORTABLE_DEVICES = [
  'جهاز تنبيه كهربائي ومسكن للألم (TENS / EMS)',
  'جهاز موجات فوق صوتية علاجية (Therapeutic Ultrasound)',
  'كمادات حرارية علاجية وأشعة تحت حمراء',
  'جهاز مساج اهتزازي عميق وتصريف ليمفاوي',
  'أشرطة التثبيت الحركي الطبية (Kinesiology Taping)',
  'أحزمة شد فقرات وأدوات تمارين المقاومة المتنقلة'
];

const DRAFT_STORAGE_KEY = 'passant_nurse_registration_draft_v2';

export const NurseApplicationModal: React.FC<NurseApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmitApplication,
  applications = [],
  onOpenNurseLogin
}) => {
  // Active top tab: 'register' (wizard) vs 'check_status' (lookup)
  const [activeTabMode, setActiveTabMode] = useState<'register' | 'check_status'>('register');

  // Role Selection (الدور أو المسار المطلوب)
  const [applicantRole, setApplicantRole] = useState<CaregiverRoleType>('nurse');
  const [trainingTrack, setTrainingTrack] = useState<TrainingTrack>('nursing');

  // Step 1: Personal Data
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nationalIdNumber, setNationalIdNumber] = useState('');
  const [birthDate, setBirthDate] = useState('1998-05-15');
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<CaregiverGender>('female');
  const [governorate, setGovernorate] = useState('القاهرة');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [personalPhoto, setPersonalPhoto] = useState<string>('');

  // Step 2: Qualifications & Experience
  const [qualification, setQualification] = useState<QualificationType>('college');
  const [qualificationTitle, setQualificationTitle] = useState('بكالوريوس علوم التمريض');
  const [institutionName, setInstitutionName] = useState('');
  const [graduationYear, setGraduationYear] = useState<number>(2021);
  const [nursingSpecialty, setNursingSpecialty] = useState('عناية مركزة وحالات حرجة');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(4);
  const [departmentsWorked, setDepartmentsWorked] = useState<string[]>(['العناية المركزة (ICU)']);
  const [skillsMastered, setSkillsMastered] = useState<string[]>([
    'تركيب كانيولا عادية وحرجة',
    'إعطاء الحقن (عضل/وريد/تحت الجلد)',
    'تركيب المحاليل والتغذية الوريدية'
  ]);
  const [previousWorkplaces, setPreviousWorkplaces] = useState('');
  const [trainingCourses, setTrainingCourses] = useState('');

  // Physiotherapy Specific state
  const [ptSyndicateNumber, setPtSyndicateNumber] = useState('');
  const [physiotherapySpecialty, setPhysiotherapySpecialty] = useState('تأهيل مخ وأعصاب وجلطات دماغية');
  const [portableDevicesOwned, setPortableDevicesOwned] = useState<string[]>([
    'جهاز تنبيه كهربائي ومسكن للألم (TENS / EMS)',
    'جهاز موجات فوق صوتية علاجية (Therapeutic Ultrasound)'
  ]);

  // Assistant / Trainee Specific state
  const [traineeEducationLevel, setTraineeEducationLevel] = useState('طالب بالفرقة الثالثة كلية التمريض');
  const [trainingGoals, setTrainingGoals] = useState('التدرب الميداني على مهارات الرعاية والتمريض ومصاحبة الأخصائيين المعتمدين');

  // Step 3: Work Details & Documents
  const [workType, setWorkType] = useState<'home' | 'hospital' | 'both'>('both');
  const [shiftSystem, setShiftSystem] = useState<'8' | '12' | '24' | 'visits'>('12');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [availableGovernorates, setAvailableGovernorates] = useState<string[]>(['القاهرة', 'الجيزة']);
  const [availableWorkingHours, setAvailableWorkingHours] = useState('شيفتات صباحية ومسائية، متفرغ 4 أيام أسبوعياً');
  const [canStayOvernight, setCanStayOvernight] = useState<boolean>(false);

  // Mandatory vs Optional Documents
  const [nationalIdFile, setNationalIdFile] = useState<string>('');
  const [degreeCertFile, setDegreeCertFile] = useState<string>('');
  const [licenseCardFile, setLicenseCardFile] = useState<string>('');
  const [experienceCertsFile, setExperienceCertsFile] = useState<string>('');

  // Agreements
  const [agreedToAccuracy, setAgreedToAccuracy] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  // Wizard state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedApp, setSubmittedApp] = useState<CaregiverApplication | null>(null);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  const [savedIndicator, setSavedIndicator] = useState(false);

  // Status Lookup state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<CaregiverApplication | null | 'not_found'>(null);

  // Auto calculate age from birthDate
  useEffect(() => {
    if (birthDate) {
      const birthYear = new Date(birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      if (!isNaN(birthYear) && birthYear > 1940 && birthYear <= currentYear) {
        setAge(currentYear - birthYear);
      }
    }
  }, [birthDate]);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.fullName) setFullName(draft.fullName);
        if (draft.phone) setPhone(draft.phone);
        if (draft.whatsappPhone) setWhatsappPhone(draft.whatsappPhone);
        if (draft.email) setEmail(draft.email);
        if (draft.nationalIdNumber) setNationalIdNumber(draft.nationalIdNumber);
        if (draft.birthDate) setBirthDate(draft.birthDate);
        if (draft.gender) setGender(draft.gender);
        if (draft.governorate) setGovernorate(draft.governorate);
        if (draft.city) setCity(draft.city);
        if (draft.district) setDistrict(draft.district);
        if (draft.personalPhoto) setPersonalPhoto(draft.personalPhoto);

        if (draft.qualification) setQualification(draft.qualification);
        if (draft.qualificationTitle) setQualificationTitle(draft.qualificationTitle);
        if (draft.institutionName) setInstitutionName(draft.institutionName);
        if (draft.graduationYear) setGraduationYear(draft.graduationYear);
        if (draft.nursingSpecialty) setNursingSpecialty(draft.nursingSpecialty);
        if (draft.licenseNumber) setLicenseNumber(draft.licenseNumber);
        if (draft.experienceYears) setExperienceYears(draft.experienceYears);
        if (draft.departmentsWorked) setDepartmentsWorked(draft.departmentsWorked);
        if (draft.skillsMastered) setSkillsMastered(draft.skillsMastered);
        if (draft.previousWorkplaces) setPreviousWorkplaces(draft.previousWorkplaces);
        if (draft.trainingCourses) setTrainingCourses(draft.trainingCourses);

        if (draft.workType) setWorkType(draft.workType);
        if (draft.shiftSystem) setShiftSystem(draft.shiftSystem);
        if (draft.expectedSalary) setExpectedSalary(draft.expectedSalary);
        if (draft.availableGovernorates) setAvailableGovernorates(draft.availableGovernorates);
        if (draft.availableWorkingHours) setAvailableWorkingHours(draft.availableWorkingHours);
        if (typeof draft.canStayOvernight === 'boolean') setCanStayOvernight(draft.canStayOvernight);

        if (draft.nationalIdFile) setNationalIdFile(draft.nationalIdFile);
        if (draft.degreeCertFile) setDegreeCertFile(draft.degreeCertFile);
        if (draft.licenseCardFile) setLicenseCardFile(draft.licenseCardFile);
        if (draft.experienceCertsFile) setExperienceCertsFile(draft.experienceCertsFile);

        if (draft.currentStep) setCurrentStep(draft.currentStep);
        setHasLoadedDraft(true);
      }
    } catch {
      // ignore
    }
  }, []);

  if (!isOpen) return null;

  // Save draft helper
  const saveDraft = (stepOverride?: 1 | 2 | 3) => {
    try {
      const draft = {
        fullName,
        phone,
        whatsappPhone,
        email,
        nationalIdNumber,
        birthDate,
        gender,
        governorate,
        city,
        district,
        personalPhoto,
        qualification,
        qualificationTitle,
        institutionName,
        graduationYear,
        nursingSpecialty,
        licenseNumber,
        experienceYears,
        departmentsWorked,
        skillsMastered,
        previousWorkplaces,
        trainingCourses,
        workType,
        shiftSystem,
        expectedSalary,
        availableGovernorates,
        availableWorkingHours,
        canStayOvernight,
        nationalIdFile,
        degreeCertFile,
        licenseCardFile,
        experienceCertsFile,
        currentStep: stepOverride || currentStep
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      setSavedIndicator(true);
      setTimeout(() => setSavedIndicator(false), 2000);
    } catch {
      // ignore
    }
  };

  // Calculate completion percentage
  const calculateProgress = () => {
    let score = 0;
    // Step 1 items (weight: 35)
    if (fullName.trim()) score += 7;
    if (phone.trim()) score += 7;
    if (nationalIdNumber.trim().length === 14) score += 7;
    if (governorate) score += 7;
    if (city.trim() || district.trim()) score += 7;

    // Step 2 items (weight: 35)
    if (institutionName.trim()) score += 9;
    if (licenseNumber.trim()) score += 9;
    if (departmentsWorked.length > 0) score += 9;
    if (skillsMastered.length > 0) score += 8;

    // Step 3 items (weight: 30)
    if (nationalIdFile) score += 8;
    if (degreeCertFile) score += 8;
    if (licenseCardFile) score += 8;
    if (agreedToAccuracy && agreedToPrivacy) score += 6;

    return Math.min(100, score);
  };

  const progressPercent = calculateProgress();

  // Validate Step 1
  const validateStep1 = () => {
    if (!fullName.trim() || fullName.trim().split(' ').length < 2) {
      setErrorMsg('يرجى إدخال الاسم بالكامل (ثلاثي أو رباعي كما في بطاقة الرقم القومي).');
      return false;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMsg('يرجى إدخال رقم هاتف صحيح للتواصل.');
      return false;
    }
    const cleanId = nationalIdNumber.trim().replace(/\D/g, '');
    if (cleanId.length !== 14) {
      setErrorMsg('يرجى إدخال الرقم القومي المكون من 14 رقماً بالكامل للتأكد من الهوية.');
      return false;
    }
    if (!governorate) {
      setErrorMsg('يرجى اختيار المحافظة.');
      return false;
    }
    if (!city.trim() && !district.trim()) {
      setErrorMsg('يرجى إدخال المدينة والحي أو تفاصيل العنوان.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  // Validate Step 2
  const validateStep2 = () => {
    if (!institutionName.trim()) {
      setErrorMsg(
        applicantRole === 'assistant_trainee' 
          ? 'يرجى إدخال اسم الكلية أو المعهد أو الجامعة المقيد بها حالياً.' 
          : 'يرجى إدخال اسم الجامعة أو المعهد المتخرج منه.'
      );
      return false;
    }
    if (applicantRole !== 'assistant_trainee' && !licenseNumber.trim() && !ptSyndicateNumber.trim()) {
      setErrorMsg(
        applicantRole === 'physiotherapist'
          ? 'يرجى إدخال رقم القيد بنقابة العلاج الطبيعي أو ترخيص مزاولة المهنة.'
          : 'يرجى إدخال رقم ترخيص مزاولة المهنة (أو رقم القيد بالنقابة).'
      );
      return false;
    }
    if (applicantRole !== 'assistant_trainee' && departmentsWorked.length === 0) {
      setErrorMsg('يرجى اختيار تخصص أو قسم طبي واحد على الأقل عملت به.');
      return false;
    }
    if (skillsMastered.length === 0) {
      setErrorMsg(
        applicantRole === 'assistant_trainee'
          ? 'يرجى تحديد المهارات التي ترغب في التدرب عليها واكتسابها.'
          : 'يرجى اختيار المهارات الطبية التي تجيدها.'
      );
      return false;
    }
    setErrorMsg('');
    return true;
  };

  // Validate Step 3 & Submit
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nationalIdFile) {
      setErrorMsg('رفع صورة بطاقة الرقم القومي إلزامي لاستكمال التسجيل.');
      return;
    }
    if (!degreeCertFile) {
      setErrorMsg(
        applicantRole === 'assistant_trainee'
          ? 'يرجى رفع صورة إثبات القيد أو كارنيه الكلية/المعهد.'
          : 'رفع صورة المؤهل الدراسي (شهادة التخرج) إلزامي.'
      );
      return;
    }
    if (!licenseCardFile && applicantRole !== 'assistant_trainee') {
      setErrorMsg(
        applicantRole === 'physiotherapist'
          ? 'رفع صورة كارنيه نقابة العلاج الطبيعي أو ترخيص مزاولة المهنة إلزامي.'
          : 'رفع صورة ترخيص مزاولة المهنة / كارنيه النقابة إلزامي.'
      );
      return;
    }
    if (!agreedToAccuracy) {
      setErrorMsg('يجب الإقرار بصحة ودقة كافة البيانات والمستندات المقدمة.');
      return;
    }
    if (!agreedToPrivacy) {
      setErrorMsg('يجب الموافقة على سياسة الخصوصية وسرية بيانات المرضى.');
      return;
    }

    const newApp: CaregiverApplication = {
      id: `APP-${applicantRole === 'assistant_trainee' ? 'TRN' : applicantRole === 'physiotherapist' ? 'PT' : 'NUR'}-${Math.floor(1000 + Math.random() * 9000)}`,
      applicantRole,
      trainingTrack: applicantRole === 'assistant_trainee' ? trainingTrack : undefined,
      fullName: fullName.trim(),
      phone: phone.trim(),
      whatsappPhone: whatsappPhone.trim() || phone.trim(),
      email: email.trim(),
      nationalIdNumber: nationalIdNumber.trim(),
      birthDate,
      age: Number(age) || 28,
      gender,
      governorate,
      city: city.trim() || governorate,
      district: district.trim() || city.trim(),
      detailedAddress: `${city} - ${district}`,
      personalPhoto: personalPhoto || (gender === 'female' 
        ? '/src/assets/images/nurse_avatar_female_1793095933006.jpg' 
        : '/src/assets/images/nurse_avatar_male_1793095932397.jpg'),
      qualification,
      qualificationTitle: qualificationTitle.trim(),
      institutionName: institutionName.trim(),
      graduationYear: Number(graduationYear) || 2021,
      nursingSpecialty: applicantRole === 'physiotherapist' ? physiotherapySpecialty : nursingSpecialty.trim(),
      licenseNumber: (applicantRole === 'physiotherapist' ? ptSyndicateNumber : licenseNumber).trim() || (applicantRole === 'assistant_trainee' ? 'متدرب - كارنيه الكلية' : ''),
      experienceYears: applicantRole === 'assistant_trainee' ? 0 : (Number(experienceYears) || 3),
      departmentsWorked,
      skillsMastered,
      previousWorkplaces: previousWorkplaces.trim(),
      trainingCourses: trainingCourses.trim(),
      specialties: skillsMastered.slice(0, 5),

      // Specialized fields
      ptSyndicateNumber: applicantRole === 'physiotherapist' ? ptSyndicateNumber.trim() : undefined,
      physiotherapySpecialty: applicantRole === 'physiotherapist' ? physiotherapySpecialty.trim() : undefined,
      portableDevicesOwned: applicantRole === 'physiotherapist' ? portableDevicesOwned : undefined,
      traineeEducationLevel: applicantRole === 'assistant_trainee' ? traineeEducationLevel.trim() : undefined,
      trainingGoals: applicantRole === 'assistant_trainee' ? trainingGoals.trim() : undefined,

      workType,
      shiftSystem,
      expectedSalary: expectedSalary.trim() || 'حسب تسعيرة المنصة المعتمدة',
      availableGovernorates,
      availableWorkingHours: availableWorkingHours.trim(),
      canStayOvernight,
      documents: {
        nationalIdName: nationalIdFile,
        degreeCertName: degreeCertFile,
        licenseCardName: licenseCardFile || (applicantRole === 'assistant_trainee' ? 'كارنيه_الكلية_للمتدرب.jpg' : ''),
        experienceCertsName: experienceCertsFile || undefined,
        criminalRecordName: 'فيش_وتشبيه_معتمد.pdf',
        drugTestName: 'تحليل_مخدرات_سلبي.pdf'
      },
      agreedToAccuracy,
      agreedToPrivacy,
      status: 'reviewing',
      submittedAt: new Date().toISOString()
    };

    onSubmitApplication(newApp);
    setSubmittedApp(newApp);

    // Clear saved draft on successful submission
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      saveDraft(2);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      saveDraft(3);
      setCurrentStep(3);
    }
  };

  const handlePrev = () => {
    if (currentStep === 2) {
      saveDraft(1);
      setCurrentStep(1);
    } else if (currentStep === 3) {
      saveDraft(2);
      setCurrentStep(2);
    }
  };

  // Helper to toggle multi-select item
  const toggleItem = (list: string[], setList: (vals: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
    saveDraft();
  };

  // Status lookup function
  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    const query = lookupQuery.trim().replace(/\D/g, '');
    if (!query) return;

    const found = applications.find(
      app => app.phone.includes(query) || (app.nationalIdNumber && app.nationalIdNumber.includes(query)) || app.id.toLowerCase().includes(lookupQuery.trim().toLowerCase())
    );

    if (found) {
      setLookupResult(found);
    } else {
      setLookupResult('not_found');
    }
  };

  // File upload simulator
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (name: string) => void,
    defaultFallback: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0].name);
    } else {
      setter(defaultFallback);
    }
    saveDraft();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 text-right shadow-2xl border border-slate-200 my-4 space-y-5">
        
        {/* Top Header & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse"></span>
              <span className="text-xs font-bold text-teal-700">بوابة انضمام الكوادر التمريضية المعتمدة</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              تسجيل كممرض/ة
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => { setActiveTabMode('register'); setLookupResult(null); }}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTabMode === 'register' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                نموذج التسجيل (3 خطوات)
              </button>
              <button
                type="button"
                onClick={() => setActiveTabMode('check_status')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTabMode === 'check_status' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-teal-600" />
                <span>الاستعلام عن طلبي</span>
              </button>
              {onOpenNurseLogin && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenNurseLogin();
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-teal-700 hover:bg-teal-50 transition-all flex items-center gap-1"
                  title="تسجيل دخول الممرض المعتمد بكلمة المرور"
                >
                  <Lock className="w-3 h-3 text-teal-600" />
                  <span>تسجيل الدخول</span>
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Mode 2: Check Application Status (حالة الحساب: قيد المراجعة / مقبول / مرفوض) */}
        {activeTabMode === 'check_status' && (
          <div className="py-4 space-y-6">
            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl text-xs text-teal-900 space-y-1">
              <strong className="block text-sm font-bold text-teal-950">متابعة حالة ملفك التمريضي:</strong>
              <p>
                يمكنك هنا الاستعلام الفوري عن حالة اعتماد طلبك (قيد المراجعة / مقبول / مرفوض) بإدخال رقم الهاتف أو الرقم القومي أو كود الطلب.
              </p>
            </div>

            <form onSubmit={handleCheckStatus} className="flex gap-2">
              <input
                type="text"
                placeholder="أدخل رقم الهاتف أو الرقم القومي أو كود الطلب..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Search className="w-4 h-4" />
                <span>بحث عن الحالة</span>
              </button>
            </form>

            {lookupResult && lookupResult !== 'not_found' && (
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{lookupResult.fullName}</h3>
                    <p className="text-xs text-slate-500 font-mono">كود الطلب: {lookupResult.id}</p>
                  </div>
                  <div>
                    {lookupResult.status === 'approved' && (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-black text-xs rounded-full border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>الحساب: مقبول ومعتمد ✓</span>
                      </span>
                    )}
                    {lookupResult.status === 'reviewing' && (
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 font-black text-xs rounded-full border border-amber-300 flex items-center gap-1.5">
                        <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />
                        <span>الحساب: قيد المراجعة والتدقيق</span>
                      </span>
                    )}
                    {lookupResult.status === 'rejected' && (
                      <span className="px-3 py-1 bg-rose-100 text-rose-800 font-black text-xs rounded-full border border-rose-200 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>الحساب: مرفوض أو يحتاج تعديل</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div>• المؤهل: <span className="font-bold text-slate-900">{lookupResult.institutionName}</span></div>
                  <div>• سنوات الخبرة: <span className="font-bold text-slate-900">{lookupResult.experienceYears} سنوات</span></div>
                  <div>• المحافظة: <span className="font-bold text-slate-900">{lookupResult.governorate || lookupResult.city}</span></div>
                  <div>• تاريخ الإرسال: <span className="font-mono text-slate-500">{new Date(lookupResult.submittedAt).toLocaleDateString('ar-EG')}</span></div>
                </div>

                {lookupResult.status === 'reviewing' && (
                  <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200 leading-relaxed">
                    ملفك حالياً قيد الفحص لدى الإدارة الطبية والتمريضية للتحقق من صحة صورة كارنيه مزاولة المهنة والمؤهل الدراسي، وسيصلك اتصال أو رسالة واتساب على هاتفك المسجل فور انتهاء المراجعة.
                  </p>
                )}

                {lookupResult.status === 'approved' && (
                  <p className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 leading-relaxed">
                    تهانينا! تم قبول طلبك وتفعيل ملفك ضمن طاقم التمريض الرسمي لمنصة باسانت. يمكنك الآن استقبال طلبات الزيارات المنزلية.
                  </p>
                )}

                {lookupResult.status === 'rejected' && (
                  <p className="text-xs text-rose-800 bg-rose-50 p-3 rounded-xl border border-rose-200 leading-relaxed">
                    {lookupResult.notes || 'نعتذر، لم يتم استيفاء شروط الاعتماد المطلوبة أو أن بعض المستندات المرفوعة غير واضحة. يرجى إعادة التقديم ببيانات ومستندات حديثة.'}
                  </p>
                )}
              </div>
            )}

            {lookupResult === 'not_found' && (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">لم يتم العثور على طلب مسجل بهذا الرقم.</p>
                <p className="text-[11px] text-slate-500">تأكد من كتابة رقم الهاتف أو الرقم القومي باللغة الإنجليزية وبدون مسافات، أو قم بتقديم طلب جديد.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab Mode 1: 3-Step Registration Form */}
        {activeTabMode === 'register' && (
          <>
            {submittedApp ? (
              /* Success Confirmation Screen */
              <div className="py-6 text-center space-y-5">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-black text-amber-700 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full inline-block">
                    حالة الحساب: قيد المراجعة والتدقيق الإداري
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    تم استلام طلب التسجيل ومستنداتك بنجاح!
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    كود الطلب المرجعي: <strong className="text-teal-700">{submittedApp.id}</strong>
                  </p>
                </div>

                {/* Privacy & Safe Storage badge */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 max-w-lg mx-auto text-right space-y-2">
                  <div className="flex items-center gap-2 text-teal-800 font-bold">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>تأكيد حماية وسرية البيانات والمستندات:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    تم حفظ بياناتك الشخصية وصور المستندات (البطاقة، المؤهل، وترخيص مزاولة المهنة) بتشفير آمن، ولن تُعرض للعامة أو للمرضى نهائياً. سيقوم الفريق الطبي بمطابقة بيانات الترخيص والتواصل معك على هاتف: <strong>{submittedApp.phone}</strong> خلال 24 ساعة.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedApp(null);
                      setCurrentStep(1);
                    }}
                    className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    تسجيل طلب آخر
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-700 shadow-xs transition-colors"
                  >
                    تم، إغلاق النافذة
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Stepper Progress Bar & Completion Indicator */}
                <div className="space-y-3 mb-6 bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">نسبة اكتمال التسجيل:</span>
                      <span className="font-black text-teal-700 font-mono bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {progressPercent}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      {savedIndicator && (
                        <span className="text-emerald-700 font-bold animate-pulse flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>تم الحفظ التلقائي</span>
                        </span>
                      )}
                      {!savedIndicator && hasLoadedDraft && (
                        <span className="text-slate-400">حفظ تلقائي مفعّل</span>
                      )}
                    </div>
                  </div>

                  {/* Visual Progress Track */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* 3 Step Buttons Header */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        if (currentStep === 2 || currentStep === 3) setCurrentStep(1);
                      }}
                      className={`p-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                        currentStep === 1
                          ? 'bg-teal-600 text-white font-black shadow-xs'
                          : currentStep > 1
                          ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                          : 'bg-white text-slate-500 border border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        <span className="text-[11px]">1. البيانات الشخصية</span>
                      </div>
                      <span className="text-[10px] opacity-80">معلومات الهوية والتواصل</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (currentStep === 1 && validateStep1()) {
                          saveDraft(2);
                          setCurrentStep(2);
                        } else if (currentStep === 3) {
                          setCurrentStep(2);
                        }
                      }}
                      className={`p-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                        currentStep === 2
                          ? 'bg-teal-600 text-white font-black shadow-xs'
                          : currentStep > 2
                          ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                          : 'bg-white text-slate-500 border border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span className="text-[11px]">2. المؤهلات والخبرات</span>
                      </div>
                      <span className="text-[10px] opacity-80">المؤهل، الترخيص، المهارات</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (currentStep === 1 && validateStep1()) {
                          setCurrentStep(2);
                        } else if (currentStep === 2 && validateStep2()) {
                          saveDraft(3);
                          setCurrentStep(3);
                        }
                      }}
                      className={`p-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                        currentStep === 3
                          ? 'bg-teal-600 text-white font-black shadow-xs'
                          : 'bg-white text-slate-500 border border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span className="text-[11px]">3. العمل والمستندات</span>
                      </div>
                      <span className="text-[10px] opacity-80">الشيفت ورفع الوثائق</span>
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 mb-4">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* ================= STEP 1: البيانات الشخصية ================= */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-teal-600" />
                        <span>الصفحة الأولى: البيانات الشخصية ومعلومات الاتصال</span>
                      </h3>
                      <span className="text-[11px] text-slate-400">الحقول بعلامة (*) إلزامية</span>
                    </div>

                    {/* Role & Track Selection Cards */}
                    <div className="p-3.5 bg-gradient-to-r from-teal-50/70 via-slate-50 to-blue-50/50 border border-teal-200 rounded-2xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-black text-slate-900">
                          اختر تخصصك أو مسار انضمامك لطاقم العمل:
                        </label>
                        <span className="text-[10px] text-teal-800 font-bold bg-white px-2 py-0.5 rounded border border-teal-200">
                          {applicantRole === 'assistant_trainee' ? 'مساعد / متدرب' : applicantRole === 'physiotherapist' ? 'طبيب علاج طبيعي' : applicantRole === 'cupping_specialist' ? 'ممارس حجامة' : 'ممرض/ة معتمد'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => { 
                            setApplicantRole('nurse'); 
                            setQualificationTitle('بكالوريوس علوم التمريض'); 
                            setNursingSpecialty('عناية مركزة وحالات حرجة');
                            saveDraft();
                          }}
                          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                            applicantRole === 'nurse' 
                              ? 'bg-teal-600 text-white border-teal-700 font-bold shadow-xs' 
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Stethoscope className="w-4 h-4" />
                          <span className="text-xs">ممرض / ممرضة</span>
                          <span className="text-[10px] opacity-80">تمريض منزلي وعناية</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => { 
                            setApplicantRole('physiotherapist'); 
                            setQualificationTitle('بكالوريوس / دكتوراه علاج طبيعي'); 
                            setNursingSpecialty('تأهيل مخ وأعصاب وجلطات دماغية');
                            saveDraft();
                          }}
                          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                            applicantRole === 'physiotherapist' 
                              ? 'bg-teal-600 text-white border-teal-700 font-bold shadow-xs' 
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Activity className="w-4 h-4" />
                          <span className="text-xs">طبيب علاج طبيعي</span>
                          <span className="text-[10px] opacity-80">تأهيل حركي وعصبي</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => { 
                            setApplicantRole('cupping_specialist'); 
                            setQualificationTitle('ممارس حجامة طبية معتمد'); 
                            setNursingSpecialty('حجامة دموية وجافة وعلاجية');
                            saveDraft();
                          }}
                          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                            applicantRole === 'cupping_specialist' 
                              ? 'bg-teal-600 text-white border-teal-700 font-bold shadow-xs' 
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                          <span className="text-xs">ممارس حجامة</span>
                          <span className="text-[10px] opacity-80">حجامة نبوية وطبية</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => { 
                            setApplicantRole('assistant_trainee'); 
                            setQualificationTitle('مساعد ومتدرب'); 
                            setNursingSpecialty('تدريب ميداني تحت الإشراف');
                            saveDraft();
                          }}
                          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                            applicantRole === 'assistant_trainee' 
                              ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-xs' 
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Users className="w-4 h-4" />
                          <span className="text-xs">مساعد / متدرب</span>
                          <span className="text-[10px] opacity-80">تدريب عملي على الشغل</span>
                        </button>
                      </div>

                      {/* If Assistant / Trainee is selected: show Track Picker */}
                      {applicantRole === 'assistant_trainee' && (
                        <div className="mt-2.5 p-3 bg-amber-50/90 rounded-xl border border-amber-200 space-y-2 animate-in fade-in duration-200">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                            <Users className="w-3.5 h-3.5 text-amber-700" />
                            <span>حدد مسار التدريب العملي الميداني الذي ترغب به:</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <label className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center gap-2 ${
                              trainingTrack === 'nursing' ? 'bg-white border-amber-500 text-amber-950 font-bold shadow-2xs' : 'bg-white/60 border-amber-200 text-slate-700'
                            }`}>
                              <input
                                type="radio"
                                name="trainingTrack"
                                checked={trainingTrack === 'nursing'}
                                onChange={() => { setTrainingTrack('nursing'); saveDraft(); }}
                                className="text-amber-600"
                              />
                              <span>مسار التمريض المنزلي</span>
                            </label>

                            <label className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center gap-2 ${
                              trainingTrack === 'hijama' ? 'bg-white border-amber-500 text-amber-950 font-bold shadow-2xs' : 'bg-white/60 border-amber-200 text-slate-700'
                            }`}>
                              <input
                                type="radio"
                                name="trainingTrack"
                                checked={trainingTrack === 'hijama'}
                                onChange={() => { setTrainingTrack('hijama'); saveDraft(); }}
                                className="text-amber-600"
                              />
                              <span>مسار الحجامة الطبية</span>
                            </label>

                            <label className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center gap-2 ${
                              trainingTrack === 'physiotherapy' ? 'bg-white border-amber-500 text-amber-950 font-bold shadow-2xs' : 'bg-white/60 border-amber-200 text-slate-700'
                            }`}>
                              <input
                                type="radio"
                                name="trainingTrack"
                                checked={trainingTrack === 'physiotherapy'}
                                onChange={() => { setTrainingTrack('physiotherapy'); saveDraft(); }}
                                className="text-amber-600"
                              />
                              <span>مسار العلاج الطبيعي</span>
                            </label>
                          </div>
                          <p className="text-[10px] text-amber-800 leading-relaxed">
                            💡 برنامج المساعدين والمتدربين يتيح للطلبة والخريجين مرافقة طاقم العمل المعتمد في الزيارات وتطبيق المهارات تحت إشراف طبي مباشر لاكتساب خبرات موثقة.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* 1. الاسم بالكامل */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          الاسم بالكامل (رباعي كما في بطاقة الرقم القومي) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: ياسمين أحمد محمود السيد"
                          value={fullName}
                          onChange={(e) => { setFullName(e.target.value); saveDraft(); }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      {/* 2. رقم الهاتف */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          رقم الهاتف الأساسي <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            placeholder="010XXXXXXXX"
                            value={phone}
                            onChange={(e) => { setPhone(e.target.value); saveDraft(); }}
                            className="w-full p-2.5 pr-8 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-teal-500"
                          />
                          <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
                        </div>
                      </div>

                      {/* 3. رقم واتساب */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700">
                            رقم واتساب <span className="text-rose-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => { setWhatsappPhone(phone); saveDraft(); }}
                            className="text-[10px] text-teal-700 hover:underline"
                          >
                            نسخ نفس رقم الهاتف
                          </button>
                        </div>
                        <input
                          type="tel"
                          placeholder="رقم الواتساب للمراسلة الطبية"
                          value={whatsappPhone}
                          onChange={(e) => { setWhatsappPhone(e.target.value); saveDraft(); }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      {/* 4. البريد الإلكتروني */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          البريد الإلكتروني <span className="text-slate-400 font-normal">(اختياري للإشعارات)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="nurse@example.com"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); saveDraft(); }}
                            className="w-full p-2.5 pr-8 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono text-left"
                            dir="ltr"
                          />
                          <Mail className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
                        </div>
                      </div>

                      {/* 5. الرقم القومي (14 رقم) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          الرقم القومي (14 رقماً) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={14}
                          placeholder="298XXXXXXXXXXX"
                          value={nationalIdNumber}
                          onChange={(e) => { setNationalIdNumber(e.target.value.replace(/\D/g, '')); saveDraft(); }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-teal-500"
                        />
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          مشفر تماماً ولا يُعرض للعامة أو للمرضى.
                        </span>
                      </div>

                      {/* 6. تاريخ الميلاد والسن */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          تاريخ الميلاد <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => { setBirthDate(e.target.value); saveDraft(); }}
                            className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                          />
                          <span className="px-3 py-2.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 whitespace-nowrap">
                            السن: {age} سنة
                          </span>
                        </div>
                      </div>

                      {/* 7. النوع (ذكر / أنثى) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          النوع <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => { setGender('female'); saveDraft(); }}
                            className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                              gender === 'female'
                                ? 'bg-teal-50 text-teal-800 border-teal-300 ring-2 ring-teal-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            أنثى (ممرضة)
                          </button>
                          <button
                            type="button"
                            onClick={() => { setGender('male'); saveDraft(); }}
                            className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                              gender === 'male'
                                ? 'bg-teal-50 text-teal-800 border-teal-300 ring-2 ring-teal-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            ذكر (ممرض)
                          </button>
                        </div>
                      </div>

                      {/* 8. المحافظة */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          المحافظة <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={governorate}
                          onChange={(e) => { setGovernorate(e.target.value); saveDraft(); }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                        >
                          {EGYPT_GOVERNORATES.map(gov => (
                            <option key={gov} value={gov}>{gov}</option>
                          ))}
                        </select>
                      </div>

                      {/* 9. المدينة والعنوان بالتفصيل */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          المدينة والحي بالتفصيل <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: المعادي - شارع النصر أو مدينة نصر"
                          value={city}
                          onChange={(e) => { setCity(e.target.value); setDistrict(e.target.value); saveDraft(); }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      {/* 10. صورة شخصية */}
                      <div className="sm:col-span-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          الصورة الشخصية الرسمية للبروفايل
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <img
                            src={personalPhoto || (gender === 'female' 
                              ? '/src/assets/images/nurse_avatar_female_1793095933006.jpg' 
                              : '/src/assets/images/nurse_avatar_male_1793095932397.jpg')}
                            alt="الصورة الشخصية"
                            className="w-12 h-12 rounded-xl object-cover border border-teal-300"
                          />
                          <div className="flex-1 space-y-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    if (reader.result) setPersonalPhoto(reader.result as string);
                                  };
                                  reader.readAsDataURL(e.target.files[0]);
                                }
                              }}
                              className="text-xs text-slate-500 file:mr-0 file:ml-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                            />
                            <p className="text-[10px] text-slate-400">
                              صورة واضحة بالزي التمريضي أو المظهر المهني تمنح ملفك تقييماً أعلى وتظهر فقط بعد الاعتماد.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STEP 2: المؤهلات والخبرات ================= */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-teal-600" />
                        <span>الصفحة الثانية: المؤهلات الأكاديمية والخبرات والمهارات</span>
                      </h3>
                      <span className="text-[11px] text-slate-400">البيانات تُطابق مع وثائقك</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* 1. المؤهل الدراسي */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {applicantRole === 'assistant_trainee' ? 'المستوى الدراسي الحالي' : 'المؤهل الدراسي'} <span className="text-rose-500">*</span>
                        </label>
                        {applicantRole === 'assistant_trainee' ? (
                          <select
                            value={traineeEducationLevel}
                            onChange={(e) => { setTraineeEducationLevel(e.target.value); saveDraft(); }}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                          >
                            <option value="طالب بالفرقة الثانية">طالب بالفرقة الثانية</option>
                            <option value="طالب بالفرقة الثالثة">طالب بالفرقة الثالثة</option>
                            <option value="طالب بالفرقة الرابعة">طالب بالفرقة الرابعة</option>
                            <option value="طالب بسنة الامتياز">طالب بسنة الامتياز</option>
                            <option value="خريج حديث (أقل من سنة)">خريج حديث (أقل من سنة)</option>
                            <option value="طالب معهد فني صحي">طالب معهد فني صحي</option>
                          </select>
                        ) : applicantRole === 'physiotherapist' ? (
                          <select
                            value={qualification}
                            onChange={(e) => {
                              const val = e.target.value as QualificationType;
                              setQualification(val);
                              if (val === 'college') setQualificationTitle('بكالوريوس علاج طبيعي');
                              else if (val === 'postgrad') setQualificationTitle('دكتوراه مهنية DPT / ماجستير');
                              saveDraft();
                            }}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                          >
                            <option value="college">بكالوريوس العلاج الطبيعي (B.Sc. PT)</option>
                            <option value="postgrad">دكتوراه مهنية في العلاج الطبيعي (DPT)</option>
                            <option value="postgrad">ماجستير في العلاج الطبيعي والتأهيل</option>
                            <option value="postgrad">دكتوراه أكاديمية (PhD)</option>
                          </select>
                        ) : (
                          <select
                            value={qualification}
                            onChange={(e) => {
                              const val = e.target.value as QualificationType;
                              setQualification(val);
                              if (val === 'college') setQualificationTitle('بكالوريوس علوم التمريض');
                              else if (val === 'institute') setQualificationTitle('دبلوم المعهد الفني الصحي');
                              else if (val === 'diploma') setQualificationTitle('دبلوم تمريض فني');
                              else if (val === 'postgrad') setQualificationTitle('ماجستير / دكتوراه تمريض');
                              else setQualificationTitle('أكاديمية معتمدة');
                              saveDraft();
                            }}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                          >
                            <option value="college">بكالوريوس علوم التمريض (جامعي)</option>
                            <option value="institute">دبلوم المعهد الفني الصحي (سنتان بعد الثانوية)</option>
                            <option value="diploma">دبلوم تمريض فني (3 أو 5 سنوات)</option>
                            <option value="postgrad">دراسات عليا (ماجستير / دكتوراه)</option>
                            <option value="academy">أكاديمية علوم صحية معتمدة</option>
                          </select>
                        )}
                      </div>

                      {/* 2. اسم الجامعة أو المعهد */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {applicantRole === 'assistant_trainee' ? 'اسم الكلية أو المعهد المقيد به حالياً' : 'اسم الجامعة أو الكلية'} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={
                            applicantRole === 'physiotherapist'
                              ? 'مثال: كلية العلاج الطبيعي - جامعة القاهرة'
                              : applicantRole === 'assistant_trainee'
                              ? 'مثال: كلية التمريض / العلاج الطبيعي - جامعة عين شمس'
                              : 'مثال: كلية التمريض - جامعة القاهرة'
                          }
                          value={institutionName}
                          onChange={(e) => { setInstitutionName(e.target.value); saveDraft(); }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      {/* 3. سنة التخرج / سنة الالتحاق */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {applicantRole === 'assistant_trainee' ? 'سنة التخرج المتوقعة' : 'سنة التخرج'} <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={graduationYear}
                          onChange={(e) => { setGraduationYear(Number(e.target.value)); saveDraft(); }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                        >
                          {Array.from({ length: 22 }, (_, i) => 2028 - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>

                      {/* 4. التخصص الطبي / مسار التدريب */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {applicantRole === 'physiotherapist' ? 'تخصص العلاج الطبيعي' : applicantRole === 'assistant_trainee' ? 'المسار التدريبي' : 'التخصص التمريضي'} <span className="text-rose-500">*</span>
                        </label>
                        {applicantRole === 'physiotherapist' ? (
                          <select
                            value={physiotherapySpecialty}
                            onChange={(e) => { setPhysiotherapySpecialty(e.target.value); saveDraft(); }}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                          >
                            {PT_SPECIALTIES_LIST.map(spec => (
                              <option key={spec} value={spec}>{spec}</option>
                            ))}
                          </select>
                        ) : applicantRole === 'assistant_trainee' ? (
                          <input
                            type="text"
                            disabled
                            value={`متدرب مسار: ${trainingTrack === 'nursing' ? 'التمريض المنزلي' : trainingTrack === 'hijama' ? 'الحجامة الطبية' : 'العلاج الطبيعي'}`}
                            className="w-full p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-bold"
                          />
                        ) : (
                          <input
                            type="text"
                            required
                            placeholder="مثال: عناية مركزة، طوارئ، أطفال، جراحة"
                            value={nursingSpecialty}
                            onChange={(e) => { setNursingSpecialty(e.target.value); saveDraft(); }}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                          />
                        )}
                      </div>

                      {/* 5. رقم الترخيص أو كارنيه القيد */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {applicantRole === 'physiotherapist' ? 'رقم القيد بنقابة العلاج الطبيعي' : applicantRole === 'assistant_trainee' ? 'رقم كارنيه الكلية / المعهد (أو إثبات القيد)' : 'رقم ترخيص مزاولة المهنة (أو القيد بالنقابة)'} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={
                            applicantRole === 'physiotherapist'
                              ? 'مثال: EGY-PT-2023-41092'
                              : applicantRole === 'assistant_trainee'
                              ? 'مثال: STU-2023-90812'
                              : 'مثال: EGY-NUR-2022-84190'
                          }
                          value={applicantRole === 'physiotherapist' ? ptSyndicateNumber : licenseNumber}
                          onChange={(e) => { 
                            if (applicantRole === 'physiotherapist') {
                              setPtSyndicateNumber(e.target.value);
                              setLicenseNumber(e.target.value);
                            } else {
                              setLicenseNumber(e.target.value);
                            }
                            saveDraft(); 
                          }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      {/* 6. سنوات الخبرة */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {applicantRole === 'assistant_trainee' ? 'ساعات التدريب العملي السابقة' : 'عدد سنوات الخبرة العملية'} <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={0}
                            max={applicantRole === 'assistant_trainee' ? 5 : 25}
                            value={experienceYears}
                            onChange={(e) => { setExperienceYears(Number(e.target.value)); saveDraft(); }}
                            className="flex-1 accent-teal-600"
                          />
                          <span className="font-bold text-xs bg-slate-100 px-3 py-1.5 rounded-lg font-mono text-teal-800">
                            {applicantRole === 'assistant_trainee' ? (experienceYears === 0 ? 'مبتدئ جديد' : `${experienceYears} سنوات تدريب`) : `${experienceYears} سنوات خبرة`}
                          </span>
                        </div>
                      </div>

                      {/* الأجهزة المحمولة (خاص بأخصائيي العلاج الطبيعي) */}
                      {applicantRole === 'physiotherapist' && (
                        <div className="sm:col-span-2 p-3.5 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-teal-950">
                              الأجهزة المحمولة المتوفرة بحوزتك للزيارات المنزلية:
                            </label>
                            <span className="text-[10px] text-teal-700 font-semibold">تزيد من فرص توجيه الحالات إليك</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {PT_PORTABLE_DEVICES.map(dev => {
                              const isChecked = portableDevicesOwned.includes(dev);
                              return (
                                <button
                                  key={dev}
                                  type="button"
                                  onClick={() => toggleItem(portableDevicesOwned, setPortableDevicesOwned, dev)}
                                  className={`p-2 rounded-xl border text-right text-xs transition-all flex items-center justify-between ${
                                    isChecked
                                      ? 'bg-teal-600 text-white font-bold shadow-2xs'
                                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  <span>{dev}</span>
                                  <span>{isChecked ? '✓' : '+'}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* أهداف التدريب (خاص بالمساعدين والمتدربين) */}
                      {applicantRole === 'assistant_trainee' && (
                        <div className="sm:col-span-2 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                          <label className="block text-xs font-bold text-amber-950">
                            المهارات والخبرات التي ترغب في اكتسابها من المشرف الميداني:
                          </label>
                          <textarea
                            rows={2}
                            value={trainingGoals}
                            onChange={(e) => { setTrainingGoals(e.target.value); saveDraft(); }}
                            placeholder="مثال: التدريب العملي الميداني على التعامل مع حالات الشلل النصفي والجلطات، أو رعاية الحالات الحرجة..."
                            className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                          />
                        </div>
                      )}

                      {/* المهارات الطبية أو التخصصية */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {applicantRole === 'assistant_trainee' ? 'المهارات المطلوب التدرب عليها' : applicantRole === 'physiotherapist' ? 'المهارات وتقنيات التأهيل التي تجيدها' : 'المهارات الطبية التي تجيدها باحتراف'} <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {(applicantRole === 'physiotherapist' || (applicantRole === 'assistant_trainee' && trainingTrack === 'physiotherapy')
                            ? PT_SKILLS_LIST 
                            : CLINICAL_SKILLS
                          ).map(skill => {
                            const selected = skillsMastered.includes(skill);
                            return (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => toggleItem(skillsMastered, setSkillsMastered, skill)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                  selected
                                    ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                {selected ? '✓ ' : '+ '} {skill}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 9. أماكن العمل السابقة */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          أماكن العمل السابقة (مستشفيات، مراكز طبية، عيادات)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="مثال: مستشفى قصر العيني (سنتان)، مستشفى دار الفؤاد (3 سنوات)، عيادات خارجية..."
                          value={previousWorkplaces}
                          onChange={(e) => { setPreviousWorkplaces(e.target.value); saveDraft(); }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      {/* 10. شهادات الخبرة والدورات التدريبية */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          الدورات التدريبية وشهادات الخبرة الحاصل عليها
                        </label>
                        <input
                          type="text"
                          placeholder="مثال: شهادة BLS، ACLS، دورة مكافحة العدوى، دورة الحجامة الطبية..."
                          value={trainingCourses}
                          onChange={(e) => { setTrainingCourses(e.target.value); saveDraft(); }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STEP 3: تفاصيل العمل والمستندات ================= */}
                {currentStep === 3 && (
                  <form onSubmit={handleFinalSubmit} className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-teal-600" />
                        <span>الصفحة الثالثة: تفاصيل العمل ورفع المستندات الرسمية</span>
                      </h3>
                      <span className="text-[11px] text-teal-700 font-bold">خطوة الإرسال النهائية</span>
                    </div>

                    {/* تفاصيل العمل */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* 1. نوع العمل */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          نوع العمل المفضل <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={workType}
                          onChange={(e) => { setWorkType(e.target.value as any); saveDraft(); }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                        >
                          <option value="both">كلاهما (تمريض منزلي ومستشفيات)</option>
                          <option value="home">تمريض منزلي وزيارات خاصة فقط</option>
                          <option value="hospital">العمل بمستشفيات ومراكز طبية</option>
                        </select>
                      </div>

                      {/* 2. نظام الشيفت */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          نظام الشيفت المتاح <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={shiftSystem}
                          onChange={(e) => { setShiftSystem(e.target.value as any); saveDraft(); }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                        >
                          <option value="12">شيفت 12 ساعة (صباحي / مسائي)</option>
                          <option value="8">شيفت 8 ساعات</option>
                          <option value="24">شيفت 24 ساعة (إقامة ومبيت)</option>
                          <option value="visits">زيارات منزلية حسب الطلب</option>
                        </select>
                      </div>

                      {/* 3. الراتب المتوقع */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          الراتب أو الأجر المتوقع <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: 8,000 ج شهرياً أو 250 ج لكل زيارة"
                          value={expectedSalary}
                          onChange={(e) => { setExpectedSalary(e.target.value); saveDraft(); }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      {/* 4. إمكانية المبيت مع الحالة */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          إمكانية المبيت مع الحالة (شيفت 24 ساعة) <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => { setCanStayOvernight(true); saveDraft(); }}
                            className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                              canStayOvernight
                                ? 'bg-teal-50 text-teal-800 border-teal-300 ring-2 ring-teal-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            نعم، متاح المبيت
                          </button>
                          <button
                            type="button"
                            onClick={() => { setCanStayOvernight(false); saveDraft(); }}
                            className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                              !canStayOvernight
                                ? 'bg-teal-50 text-teal-800 border-teal-300 ring-2 ring-teal-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            لا، زيارات وشيفتات فقط
                          </button>
                        </div>
                      </div>

                      {/* 5. المحافظات المتاح العمل بها */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          المحافظات المتاح العمل بها <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                          {EGYPT_GOVERNORATES.slice(0, 12).map(gov => {
                            const selected = availableGovernorates.includes(gov);
                            return (
                              <button
                                key={gov}
                                type="button"
                                onClick={() => toggleItem(availableGovernorates, setAvailableGovernorates, gov)}
                                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                                  selected
                                    ? 'bg-teal-700 text-white font-bold'
                                    : 'bg-white text-slate-700 border border-slate-200'
                                }`}
                              >
                                {selected ? '✓ ' : '+ '} {gov}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 6. مواعيد التفرغ */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          مواعيد وأيام التفرغ بالتفصيل <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: متفرغ طوال أيام الأسبوع، أو السبت والاثنين والأربعاء مسائي..."
                          value={availableWorkingHours}
                          onChange={(e) => { setAvailableWorkingHours(e.target.value); saveDraft(); }}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>

                    {/* المستندات الرسمية */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-teal-600" />
                          <span>المستندات المطلوبة (رفع البطاقة والترخيص والمؤهل إلزامي)</span>
                        </h4>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          تشفير وسرية تامة 🔒
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* 7. صورة البطاقة الشخصية (إلزامي) */}
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">
                              صورة البطاقة الشخصية (الوجهين) <span className="text-rose-500">*</span>
                            </span>
                            <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">إلزامي</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="flex-1 cursor-pointer">
                              <span className="block text-center py-2 px-3 bg-white border border-teal-300 text-teal-800 text-xs font-bold rounded-xl hover:bg-teal-50 transition-colors">
                                <Upload className="w-3.5 h-3.5 inline ml-1 text-teal-600" />
                                {nationalIdFile ? 'تغيير الملف' : 'اختر صورة البطاقة'}
                              </span>
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileUpload(e, setNationalIdFile, 'صورة_البطاقة_الشخصية_وجهين.jpg')}
                                className="hidden"
                              />
                            </label>
                            {!nationalIdFile && (
                              <button
                                type="button"
                                onClick={() => { setNationalIdFile('صورة_البطاقة_الشخصية_سارية.jpg'); saveDraft(); }}
                                className="text-[10px] text-teal-700 bg-teal-50 px-2 py-2 rounded-xl hover:bg-teal-100 whitespace-nowrap"
                              >
                                ملف تجريبي
                              </button>
                            )}
                          </div>
                          {nationalIdFile && (
                            <p className="text-[11px] font-mono text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{nationalIdFile}</span>
                            </p>
                          )}
                        </div>

                        {/* 8. صورة المؤهل الدراسي (إلزامي) */}
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">
                              {applicantRole === 'assistant_trainee' ? 'شهادة إثبات القيد بالكلية / المعهد' : 'صورة المؤهل الدراسي (الشهادة)'} <span className="text-rose-500">*</span>
                            </span>
                            <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">إلزامي</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="flex-1 cursor-pointer">
                              <span className="block text-center py-2 px-3 bg-white border border-teal-300 text-teal-800 text-xs font-bold rounded-xl hover:bg-teal-50 transition-colors">
                                <Upload className="w-3.5 h-3.5 inline ml-1 text-teal-600" />
                                {degreeCertFile ? 'تغيير الملف' : (applicantRole === 'assistant_trainee' ? 'اختر إثبات القيد' : 'اختر صورة المؤهل')}
                              </span>
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileUpload(e, setDegreeCertFile, applicantRole === 'assistant_trainee' ? 'شهادة_إثبات_قيد_جامعي.pdf' : 'شهادة_التخرج_المعتمدة.pdf')}
                                className="hidden"
                              />
                            </label>
                            {!degreeCertFile && (
                              <button
                                type="button"
                                onClick={() => { setDegreeCertFile(applicantRole === 'assistant_trainee' ? 'شهادة_إثبات_قيد_جامعي.pdf' : 'شهادة_التخرج_المعتمدة.pdf'); saveDraft(); }}
                                className="text-[10px] text-teal-700 bg-teal-50 px-2 py-2 rounded-xl hover:bg-teal-100 whitespace-nowrap"
                              >
                                ملف تجريبي
                              </button>
                            )}
                          </div>
                          {degreeCertFile && (
                            <p className="text-[11px] font-mono text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{degreeCertFile}</span>
                            </p>
                          )}
                        </div>

                        {/* 9. صورة ترخيص مزاولة المهنة / كارنيه النقابة أو الكلية */}
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">
                              {applicantRole === 'physiotherapist' ? 'كارنيه نقابة العلاج الطبيعي أو الترخيص' : applicantRole === 'assistant_trainee' ? 'صورة كارنيه الكلية أو المعهد' : 'ترخيص مزاولة المهنة / كارنيه النقابة'} <span className={applicantRole === 'assistant_trainee' ? 'text-amber-500' : 'text-rose-500'}>*</span>
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${applicantRole === 'assistant_trainee' ? 'text-amber-700 bg-amber-50' : 'text-rose-600 bg-rose-50'}`}>
                              {applicantRole === 'assistant_trainee' ? 'مطلوب للمتدرب' : 'إلزامي'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="flex-1 cursor-pointer">
                              <span className="block text-center py-2 px-3 bg-white border border-teal-300 text-teal-800 text-xs font-bold rounded-xl hover:bg-teal-50 transition-colors">
                                <Upload className="w-3.5 h-3.5 inline ml-1 text-teal-600" />
                                {licenseCardFile ? 'تغيير الملف' : (applicantRole === 'assistant_trainee' ? 'اختر صورة كارنيه الكلية' : 'اختر كارنيه الترخيص')}
                              </span>
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileUpload(e, setLicenseCardFile, applicantRole === 'assistant_trainee' ? 'كارنيه_الكلية_للمتدرب.jpg' : 'كارنيه_مزاولة_المهنة_ساري.pdf')}
                                className="hidden"
                              />
                            </label>
                            {!licenseCardFile && (
                              <button
                                type="button"
                                onClick={() => { setLicenseCardFile(applicantRole === 'assistant_trainee' ? 'كارنيه_الكلية_للمتدرب.jpg' : 'كارنيه_مزاولة_المهنة_ساري.pdf'); saveDraft(); }}
                                className="text-[10px] text-teal-700 bg-teal-50 px-2 py-2 rounded-xl hover:bg-teal-100 whitespace-nowrap"
                              >
                                ملف تجريبي
                              </button>
                            )}
                          </div>
                          {licenseCardFile && (
                            <p className="text-[11px] font-mono text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{licenseCardFile}</span>
                            </p>
                          )}
                        </div>

                        {/* 10. شهادات الخبرة والدورات (اختياري) */}
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">
                              شهادات الخبرة والدورات (إن وجدت)
                            </span>
                            <span className="text-[10px] text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">اختياري</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="flex-1 cursor-pointer">
                              <span className="block text-center py-2 px-3 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors">
                                <Upload className="w-3.5 h-3.5 inline ml-1 text-slate-500" />
                                {experienceCertsFile ? 'تغيير الملف' : 'رفع شهادات إضافية'}
                              </span>
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileUpload(e, setExperienceCertsFile, 'شهادات_خبرة_ودورات.pdf')}
                                className="hidden"
                              />
                            </label>
                            {!experienceCertsFile && (
                              <button
                                type="button"
                                onClick={() => { setExperienceCertsFile('شهادات_خبرة_ودورات.pdf'); saveDraft(); }}
                                className="text-[10px] text-slate-600 bg-slate-100 px-2 py-2 rounded-xl hover:bg-slate-200 whitespace-nowrap"
                              >
                                إضافة ملف
                              </button>
                            )}
                          </div>
                          {experienceCertsFile && (
                            <p className="text-[11px] font-mono text-slate-700 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                              <span className="truncate">{experienceCertsFile}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* تنبيه حماية الخصوصية الصارم للموقع */}
                    <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-950 leading-relaxed">
                      <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>ضمانة الخصوصية التامة:</strong> المستندات المرفوعة (البطاقة، المؤهل، الترخيص) والرقم القومي سرية ومحمية تماماً ولا تظهر لأي مريض أو زائر للعامة، وتُراجع فقط من قبل إدارة التدقيق الطبي للتأكد من السلامة القانونية والمهنية.
                      </div>
                    </div>

                    {/* إقرارات ما قبل الإرسال */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                      <label className="flex items-start gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={agreedToAccuracy}
                          onChange={(e) => { setAgreedToAccuracy(e.target.checked); saveDraft(); }}
                          className="mt-0.5 accent-teal-600 w-4 h-4 rounded"
                        />
                        <span className="text-slate-700 leading-tight">
                          أقر بأن جميع البيانات الشخصية والمؤهلات والخبرات المدخلة صحيحة تماماً والمستندات أصلية ومطابقة لواقعي المهني. <span className="text-rose-500">*</span>
                        </span>
                      </label>

                      <label className="flex items-start gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={agreedToPrivacy}
                          onChange={(e) => { setAgreedToPrivacy(e.target.checked); saveDraft(); }}
                          className="mt-0.5 accent-teal-600 w-4 h-4 rounded"
                        />
                        <span className="text-slate-700 leading-tight">
                          أوافق على سياسة الخصوصية وسرية بيانات المرضى والالتزام بمعايير مكافحة العدوى والنزاهة الطبية لمنصة باسانت. <span className="text-rose-500">*</span>
                        </span>
                      </label>
                    </div>

                    {/* Form Step 3 Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                        <span>السابق: المؤهلات والخبرات</span>
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>تأكيد وإرسال طلب التسجيل</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Navigation Buttons for Steps 1 & 2 */}
                {currentStep < 3 && (
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                        <span>السابق</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            localStorage.removeItem(DRAFT_STORAGE_KEY);
                            setFullName('');
                            setPhone('');
                            setWhatsappPhone('');
                            setEmail('');
                            setNationalIdNumber('');
                            setCity('');
                            setDistrict('');
                            setInstitutionName('');
                            setLicenseNumber('');
                            setHasLoadedDraft(false);
                          } catch {
                            // ignore
                          }
                        }}
                        className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        مسح المسودة والبدء من جديد
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <span>التالي: {currentStep === 1 ? 'المؤهلات والخبرات' : 'تفاصيل العمل والمستندات'}</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
