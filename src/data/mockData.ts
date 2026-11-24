import { Caregiver, ServiceItem, BookingOrder, CaregiverApplication, MedicationReminder, ChatMessage, UserProfile } from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  // --- خدمات المحاليل والحقن ---
  {
    id: 'srv-saline-iv',
    title: 'المحلول العادي (تركيب ومتابعة وريدية)',
    category: 'nursing',
    shortDesc: 'تركيب ومتابعة المحلول الوريدي الملحي أو الجلوكوز أو الرينجر تحت إشراف تمريضي دقيق (١٥ دقيقة).',
    fullDesc: 'خدمة احترافية لتركيب المحلول العادي وضبط معدل التنقيط ومتابعة العلامات الحيوية ومنع أي ارتشاح أو تورم. وقت الخدمة: ١٥ دقيقة.',
    price: 200,
    durationMinutes: 15,
    includedSupplies: ['كانيولا معقمة مقاس مناسب', 'جهاز وريد معقم', 'كحول طبي وشاش ولواصق طبية'],
    preparationNotes: 'يرجى تجهيز زجاجة المحلول أو طلب شرائها مع الممرض.',
    iconName: 'Syringe',
    isPopular: true
  },
  {
    id: 'srv-iron-iv',
    title: 'المحلول الحديد (Iron Infusion)',
    category: 'nursing',
    shortDesc: 'إعطاء محاليل الحديد الوريدي بحذر واحترافية فائقة ومراقبة علامات الحساسية والتسريب (٢٠ دقيقة).',
    fullDesc: 'بروتوكول تمريضي عالي الأمان لإعطاء محاليل الحديد (مثل الفيروجلوبين أو الفيريك) مع اختبار الحساسية والتحكم في سرعة التسريب ومراقبة العلامات الحيوية لحظياً. وقت الخدمة: ٢٠ دقيقة.',
    price: 300,
    durationMinutes: 20,
    includedSupplies: ['كانيولا وريدية دقيقة', 'جهاز وريد ميكرو', 'شاش وكحول ومستلزمات تعقيم'],
    preparationNotes: 'تأكد من توفير أمبولات الحديد والروشتة الطبية بجرعة الطبيب المحددة.',
    iconName: 'Activity',
    isPopular: true
  },
  {
    id: 'srv-injection-single',
    title: 'إعطاء الحقنة (عضل / وريد / تحت الجلد)',
    category: 'nursing',
    shortDesc: 'إعطاء الحقن العضلية والوريدية وتحت الجلد بأعلى درجات التعقيم وبدون ألم (٧ دقائق).',
    fullDesc: 'حقن عضل (IM)، حقن وريد مباشر (IV)، وحقن تحت الجلد بأدوات وسرنجات معقمة جديدة تُفتح أمام المريض. وقت الخدمة: ٧ دقائق.',
    price: 100,
    durationMinutes: 7,
    includedSupplies: ['سرنجات معقمة متعددة المقاسات', 'مسحات كحولية 70%', 'قطن وشاش طبي'],
    preparationNotes: 'يرجى تحضير أمبول العلاج، مع العلم أن اختبار الحساسية مع الحقن يُحسب بـ 50 ج فقط.',
    iconName: 'Syringe',
    isPopular: true
  },
  {
    id: 'srv-allergy-test',
    title: 'اختبار الحساسية (Allergy Test)',
    category: 'nursing',
    shortDesc: 'اختبار حساسية دقيق للمضادات الحيوية (١٥ دقيقة - 100 ج منفرداً / 50 ج مع الحقن).',
    fullDesc: 'حقن ميكرو تحت الجلد واختبار تفاعل المضادات الحيوية ومراقبة أي احمرار أو تحسس لمدة ١٥ دقيقة قبل إعطاء الجرعة.',
    price: 100,
    durationMinutes: 15,
    includedSupplies: ['سرنجة أنسولين معقمة دقيقة', 'مسحات كحولية', 'قلم طبي لتحديد دائرة الاختبار'],
    preparationNotes: 'في حال طلب اختبار الحساسية بالتزامن مع إعطاء الحقنة، يُحسب بـ 50 ج فقط.',
    iconName: 'Activity'
  },
  {
    id: 'srv-cannula-only',
    title: 'تركيب كانيولا فقط',
    category: 'nursing',
    shortDesc: 'تركيب كانيولا وريدية معقمة بمقاس مناسب للأوردة الدقيقة والصعبة (١٠ دقائق).',
    fullDesc: 'تحديد أفضل وريد مناسب وتركيب الكانيولا وتثبيتها ببلاستر طبي معقم واختبار سريانها بالمحلول الملحي. وقت الخدمة: ١٠ دقائق.',
    price: 150,
    durationMinutes: 10,
    includedSupplies: ['كانيولا معقمة مقاسات مختلفة', 'بلاستر كانيولا معقم شفاف', 'سرنجة اختبار'],
    preparationNotes: 'مناسب لمن يحتاج كانيولا جاهزة قبل التحاليل أو جلسات العلاج.',
    iconName: 'Syringe'
  },
  {
    id: 'srv-portacath',
    title: 'بروتكاث (Port-a-Cath Care)',
    category: 'nursing',
    shortDesc: 'التعامل مع القسطرة الوريدية المركزية (البروتكاث) وغسيلها بهيبارين معقم (١٠ دقائق).',
    fullDesc: 'رعاية فائقة للمرضى ذوي القسطرة المركزية البروتكاث، إبرة هابر خاصة، فلاش محلول ملحي وهيبارين لمنع الانسداد والتجلط بأعلى درجات مكافحة العدوى. وقت الخدمة: ١٠ دقائق.',
    price: 300,
    durationMinutes: 10,
    includedSupplies: ['إبرة هابر معقمة خاصة بالبروتكاث', 'محلول ملحي وهيبارين فلاش', 'جوانتيات جراحية معقمة'],
    preparationNotes: 'يرجى توفير إبرة البروتكاث المخصصة للمريض في حال كانت متوفرة لديه.',
    iconName: 'HeartPulse'
  },
  {
    id: 'srv-blood-draw',
    title: 'سحب عينات دم (Blood Sampling)',
    category: 'nursing',
    shortDesc: 'سحب عينات الدم للتحاليل المخبرية بدقة وبدون ألم أو كدمات.',
    fullDesc: 'سحب عينات الدم من الأوردة الطرفية باحترافية وتفريغها في أنابيب التحليل المعقمة وإحكام إغلاقها.',
    price: 100,
    durationMinutes: 10,
    includedSupplies: ['سرنجات سحب وأنابيب حفظ العينات', 'رباط ضاغط تورنيكيه طبي', 'مسحات كحولية وبلاستر'],
    preparationNotes: 'يرجى الالتزام بساعات الصيام إن كانت التحاليل تتطلب ذلك.',
    iconName: 'Activity'
  },

  // --- خدمات القساطر والدرنقة ---
  {
    id: 'srv-catheter-insert',
    title: 'تركيب قسطرة بولية (Catheter Insertion)',
    category: 'nursing',
    shortDesc: 'تركيب قسطرة بولية معقمة (فولي) وتوصيل كيس جمع البول (١٥ دقيقة).',
    fullDesc: 'تركيب القسطرة البولية لاتكس أو سيليكون بتقنية جراحية معقمة وتثبيت البالون بمحلول معقم ومسكن موضعي لمنع أي ألم أو التهابات. وقت الخدمة: ١٥ دقيقة.',
    price: 250,
    durationMinutes: 15,
    includedSupplies: ['قسطرة بولية معقمة', 'كيس جمع بول مدرج معقم', 'جل زيلوكين مخدر ومطهر معقم'],
    preparationNotes: 'يرجى إبلاغ الممرض بأي حساسية أو تضخم بالبروستاتا مسبقاً.',
    iconName: 'Stethoscope',
    isPopular: true
  },
  {
    id: 'srv-catheter-remove',
    title: 'فك قسطرة بولية (Catheter Removal)',
    category: 'nursing',
    shortDesc: 'سحب وتفريغ بالون القسطرة البولية وإزالتها بأمان ولطف (٧ دقائق).',
    fullDesc: 'تفريغ كامل للسائل داخل بالون القسطرة وإزالتها بلطف مع تطهير مجرى البول ومتابعة التبول الطبيعي للمريض. وقت الخدمة: ٧ دقائق.',
    price: 200,
    durationMinutes: 7,
    includedSupplies: ['سرنجة تفريغ معقمة', 'مطهر بيتادين طبي', 'شاش وفوط معقمة'],
    preparationNotes: 'يفضل شرب سوائل كافية بعد فك القسطرة لتسهيل التبول الطبيعي.',
    iconName: 'Stethoscope'
  },
  {
    id: 'srv-drain-remove',
    title: 'فك الدرنقة الجراحية (Drain Removal)',
    category: 'nursing',
    shortDesc: 'إزالة وفك الدرنقة بعد العمليات الجراحية وتعقيم موضعها (١٠ دقائق).',
    fullDesc: 'قص غرزة تثبيت الدرنقة وسحب أنبوب الدرنقة الجراحية بحذر شديد وغيار معقم وضغط موضعي لمنع أي نزف. وقت الخدمة: ١٠ دقائق.',
    price: 250,
    durationMinutes: 10,
    includedSupplies: ['مقص غرز جراحي معقم', 'شاش معقم وضمادة ضاغطة', 'مطهر جراحي'],
    preparationNotes: 'يجب التأكد من قرار الطبيب الجراح بإمكانية فك الدرنقة.',
    iconName: 'HeartPulse'
  },

  // --- خدمات فك السلك والدبابيس ---
  {
    id: 'srv-stitch-removal',
    title: 'فك سلك جراحي (Stitch Removal)',
    category: 'nursing',
    shortDesc: 'فك الغرز والخيوط الجراحية بعد التئام الجروح والعمليات (١٠ دقائق).',
    fullDesc: 'إزالة الغرز الجراحية بأدوات ميكرو معقمة مع تطهير الجرح ووضع ضمادة معقمة للتأكد من تمام الالتئام. وقت الخدمة: ١٠ دقائق.',
    price: 150,
    durationMinutes: 10,
    includedSupplies: ['مقص غرز معقم Stitch Cutter', 'ملقط جراحي معقم', 'مطهر وضمادة طبية'],
    preparationNotes: 'تأكد من مرور الفترة الموصى بها من الجراح لفك الغرز.',
    iconName: 'Activity'
  },
  {
    id: 'srv-staple-removal',
    title: 'فك سلك الدبابيس الجراحية (Staple Removal)',
    category: 'nursing',
    shortDesc: 'فك وإزالة دبابيس الجراحة بجهاز خاص بدون ألم (١٥ دقيقة).',
    fullDesc: 'استخدام أداة Staple Extractor المخصصة لنزع دبابيس الجلد الجراحية بعد الولادة القيصرية أو العمليات بدقة وتعقيم فائق. وقت الخدمة: ١٥ دقيقة.',
    price: 200,
    durationMinutes: 15,
    includedSupplies: ['أداة نزع الدبابيس المعقمة Staple Remover', 'شاش ومطهر جراحي Betadine'],
    preparationNotes: 'يرجى إرفاق تقرير الجراح الموصي بفك الدبابيس.',
    iconName: 'Activity'
  },

  // --- خدمات الجروح وقرح الفراش ---
  {
    id: 'srv-wound-regular',
    title: 'تغيير جروح عادية (Wound Dressing)',
    category: 'nursing',
    shortDesc: 'غيار طبي معقم على الجروح السطحية والجراحية النظيفة (١٠ دقائق).',
    fullDesc: 'تطهير الجروح بمحلول ملحي معقم ومطهر بيتادين وتغطيتها بغيارات وشاش طبي معقم للحماية من التلوث. وقت الخدمة: ١٠ دقائق.',
    price: 150,
    durationMinutes: 10,
    includedSupplies: ['باكت غيار جراحي معقم', 'محلول ملحي معقم Betadine', 'شاش طبي وبلاستر ضد الماء'],
    preparationNotes: 'يرجى تهوية الغرفة وتوفير إضاءة مناسبة لمكان الجرح.',
    iconName: 'HeartPulse',
    isPopular: true
  },
  {
    id: 'srv-wound-packing',
    title: 'تغيير جروح فتيل (Wound Packing)',
    category: 'nursing',
    shortDesc: 'غيار الجروح العميقة والناسور والخراريج التي تحتاج فتيل معقم (١٥ دقيقة).',
    fullDesc: 'تنظيف الجرح العميق وتصريف الإفرازات ووضع شاش فازلين أو فتيل مطهر بعناية لمنع انغلاق الجلد قبل التئام القاع. وقت الخدمة: ١٥ دقيقة.',
    price: 200,
    durationMinutes: 15,
    includedSupplies: ['شاش فتيل معقم بأحجام مختلفة', 'ملقط جراحي معقم', 'مطهرات جراحية متخصصة'],
    preparationNotes: 'يرجى تحضير المراهم أو الفتائل الموصوفة من الجراح.',
    iconName: 'HeartPulse'
  },
  {
    id: 'srv-bedsores',
    title: 'تغيير قرح الفراش (Bedsore Care)',
    category: 'nursing',
    shortDesc: 'عناية متقدمة بقرح الفراش والقدم السكري بضمادات متطورة (٣٠ دقيقة).',
    fullDesc: 'تنظيف وتطهير قرح الفراش من مختلف الدرجات باستخدام محاليل هيدروجيل متطورة تساند تجديد الأنسجة ومنع انتشار العدوى. وقت الخدمة: ٣٠ دقيقة.',
    price: 400,
    durationMinutes: 30,
    includedSupplies: ['ضمادات هيدروجيل متقدمة', 'محاليل تنظيف قرح متخصصة', 'شاش فازلين وجوانتيات جراحية'],
    preparationNotes: 'ينصح بتوفير مرتبة هوائية وتعديل وضعية نوم المريض بانتظام.',
    iconName: 'HeartPulse',
    isPopular: true
  },

  // --- الحقن المتخصصة والشرجية ---
  {
    id: 'srv-insulin-injection',
    title: 'حقن الإنسولين ومتابعة السكر',
    category: 'nursing',
    shortDesc: 'إعطاء جرعات الإنسولين الدقيقة وقياس مستوى السكر في الدم (٥ دقائق).',
    fullDesc: 'ضبط وتحديد أماكن حقن الأنسولين (البطن / الفخذ / الذراع) بالتناوب لمنع التليف، مع فحص السكر بجهاز رقمي. وقت الخدمة: ٥ دقائق.',
    price: 100,
    durationMinutes: 5,
    includedSupplies: ['سرنجات أنسولين دقيقة', 'شرائط اختبار السكر وجهاز القياس', 'مسحات كحولية'],
    preparationNotes: 'تأكد من وجود قلم أو أمبول الأنسولين الموصوف.',
    iconName: 'Activity'
  },
  {
    id: 'srv-ivf-injections',
    title: 'حقن الحقن المجهري والسيولة',
    category: 'nursing',
    shortDesc: 'إعطاء حقن التنشيط والحقن المجهري والتثبيت وحقن السيولة تحت الجلد.',
    fullDesc: 'إعطاء بروتوكول أدوية الخصوبة والحقن المجهري (تنشيط، تفجير، تثبيت) في المواعيد المحددة بالساعة والدقيقة بدقة واحترافية عالية.',
    price: 150,
    durationMinutes: 15,
    includedSupplies: ['سرنجات معقمة ميكرو', 'مسحات كحولية معقمة', 'لاصقات طبية'],
    preparationNotes: 'يرجى حفظ أدوية الحقن المجهري بالثلاجة طبقاً لتعليمات الصيدلية.',
    iconName: 'Sparkles',
    isPopular: true
  },
  {
    id: 'srv-enema',
    title: 'حقنة شرجية (Enema Administration)',
    category: 'nursing',
    shortDesc: 'إعطاء الحقنة الشرجية لعلاج الإمساك الحاد وتجهيز العمليات.',
    fullDesc: 'تطبيق الحقنة الشرجية الطبية بحرص ومراعاة كاملة لخصوصية وراحة المريض وتعقيم الأدوات.',
    price: 350,
    durationMinutes: 30,
    includedSupplies: ['مجموعة حقنة شرجية معقمة', 'جل ملين موضعي معقم', 'مفارش امتصاص للاستخدام الواحد'],
    preparationNotes: 'تأكد من إمكانية وصول المريض لدورة المياه بسهولة بعد الإجراء.',
    iconName: 'HeartPulse'
  },

  // --- خدمات الانتظار ---
  {
    id: 'srv-wait-half-hour',
    title: 'الانتظار نصف ساعة (متابعة إضافية)',
    category: 'nursing',
    shortDesc: 'انتظار ومرافقة تمريضية نصف ساعة إضافية لمراقبة حالة المريض (٣٠ دقيقة).',
    fullDesc: 'مرافقة المريض لقياس العلامات الحيوية ومراقبة رد الفعل الدوائي أو انتظار انتهاء إجراء طبي محدد. وقت الخدمة: ٣٠ دقيقة.',
    price: 50,
    durationMinutes: 30,
    includedSupplies: ['أجهزة قياس الضغط والسكر والحرارة'],
    preparationNotes: 'تُضاف عند رغبة العائلة في بقاء الممرض نصف ساعة إضافية للمتابعة.',
    iconName: 'Clock'
  },
  {
    id: 'srv-wait-saline-iv',
    title: 'انتظار المحلول العادي (١ ساعة)',
    category: 'nursing',
    shortDesc: 'انتظار ومتابعة سريان زجاجة المحلول العادي كاملة حتى النهاية (١ ساعة كاملة).',
    fullDesc: 'بقاء الممرض بجانب المريض طوال فترة تنقيط المحلول العادي لضبط السرعة ورفع الكانيولا فور الانتهاء. وقت الخدمة: ٦٠ دقيقة (١ ساعة).',
    price: 70,
    durationMinutes: 60,
    includedSupplies: ['مستلزمات نزع الكانيولا والتعقيم النهائي'],
    preparationNotes: 'تضمن للمريض إشرافاً متواصلاً حتى آخر قطرة بالمحلول.',
    iconName: 'Clock'
  },
  {
    id: 'srv-wait-iron-iv',
    title: 'انتظار المحلول الحديد (من 4 إلى 7 ساعات)',
    category: 'nursing',
    shortDesc: 'انتظار ومرافقة تمريضية متواصلة لمحلول الحديد البطيء من 4 إلى 7 ساعات مع فحص مستمر للعلامات الحيوية.',
    fullDesc: 'مرافقة دقيقة ومتواصلة طوال فترة ضخ محلول الحديد البطيء (تستغرق من 4 إلى 7 ساعات كاملة حسب تعليمات الطبيب وتدفق المحلول)، مع فحص دوري دقيق للضغط والنبض والأكسجين وملاحظة أي علامات تحسس دوائي أو ارتشاح وريدي حتى انتهاء المحلول تماماً.',
    price: 350,
    durationMinutes: 360,
    includedSupplies: ['مراقبة دقيقة للأكسجين والنبض والضغط كل 30 دقيقة', 'مستلزمات نزع الكانيولا والتعقيم النهائي'],
    preparationNotes: 'تستغرق الجلسة من 4 إلى 7 ساعات متواصلة لضمان تنقيط المحلول بأمان تام بدون أي مضاعفات.',
    iconName: 'Clock',
    isPopular: true
  },

  // --- خدمات الحجامة الرسمية مع تفصيل الكاسات والمواصلات والمدة المحددة ---
  {
    id: 'srv-hijama-cosmetic-wet',
    title: 'حجامة تجميلية دماوية (للوجه والبشرة)',
    category: 'hijama',
    shortDesc: 'حجامة تجميلية دماوية للبشرة (٣٠ دقيقة) - 250 ج + سعر 2 كاسة بـ 100 ج + المواصلات.',
    fullDesc: 'جلسة حجامة تجميلية دقيقة للوجه والرقبة بمشارط ميكرو دقيقة لتحفيز الكولاجين ونضارة البشرة. المدة الزمنية: ٣٠ دقيقة. السعر: 250 ج للجلسة + 100 ج للكاسات المعقمة + المواصلات.',
    price: 350,
    durationMinutes: 30,
    includedSupplies: ['2 كؤوس حجامة تجميلية خاصة بالوجه (100 ج)', 'مشارط ميكرو معقمة', 'سيروم كولاجين وزيوت طبيعية'],
    preparationNotes: 'غسيل الوجه جيداً قبل الجلسة وتجنب وضع أي مستحضرات تجميل.',
    iconName: 'Sparkles',
    isPopular: true
  },
  {
    id: 'srv-hijama-cosmetic-dry',
    title: 'حجامة جافة تجميلية (Dry Facial Hijama)',
    category: 'hijama',
    shortDesc: 'حجامة جافة للبشرة (١٥ دقيقة) - 200 ج + سعر 2 كاسة بـ 100 ج + المواصلات.',
    fullDesc: 'مساج هوائي وكؤوس شفط جافة لتنشيط الدورة الدموية بالوجه وشد البشرة وتصريف اللمف بدون أي تشريط. المدة الزمنية: ١٥ دقيقة. السعر: 200 ج للجلسة + 100 ج للكاسات + المواصلات.',
    price: 300,
    durationMinutes: 15,
    includedSupplies: ['2 كؤوس شفط هوائية تجميلية معقمة (100 ج)', 'زيت الأرجان وزيت الورد'],
    preparationNotes: 'جلسة لطيفة ومريحة خالية من أي جروح أو علامات حمراء مستمرة.',
    iconName: 'Sparkles'
  },
  {
    id: 'srv-hijama-wet-complaint',
    title: 'حجامة دماوية (أين كان أي المشكلة)',
    category: 'hijama',
    shortDesc: 'حجامة دماوية رطبة معقمة لموضع الألم والشكوى (ساعة كاملة - 500 ج + المواصلات).',
    fullDesc: 'تطبيق الحجامة الدماوية النبوية والطبية المعقمة لعلاج آلام الظهر، الرقبة، الصداع، المفاصل، أو أي مشكلة مرضية محددة. المدة الزمنية: ٦٠ دقيقة (ساعة كاملة). السعر: 500 ج + المواصلات.',
    price: 500,
    durationMinutes: 60,
    includedSupplies: ['طقم كؤوس حجامة معقمة جديدة تُفتح أمامك', 'مشارط جراحية ميكرو معقمة', 'تعقيم بزيت حبة البركة ومطهر طبي'],
    preparationNotes: 'يشترط الصيام أو الامتناع عن الوجبات الدسمة لمدة 3 ساعات قبل الجلسة.',
    iconName: 'Flame',
    isPopular: true
  },
  {
    id: 'srv-hijama-dry-complaint',
    title: 'حجامة جافة (أين كان أي المشكلة)',
    category: 'hijama',
    shortDesc: 'حجامة جافة نارية وهوائية موضعية للشكوى والألم (٣٠ دقيقة - 300 ج + المواصلات).',
    fullDesc: 'كؤوس شفط جافة ومساج انزلاقي لعلاج الشد العضلي وآلام الفقرات وتنشيط الدورة الدموية بدون تشريط. المدة الزمنية: ٣٠ دقيقة. السعر الثابت: 300 ج + المواصلات.',
    price: 300,
    durationMinutes: 30,
    includedSupplies: ['طقم كؤوس شفط جافة معقمة', 'زيوت مساج دافئة ومطهر موضعي'],
    preparationNotes: 'مناسبة جداً لمرضى سيولة الدم أو من يفضلون عدم التشريط.',
    iconName: 'ShieldPlus'
  },
  {
    id: 'srv-hijama-dry-fullbody',
    title: 'حجامة جافة الجسم كامل (Full Body Dry)',
    category: 'hijama',
    shortDesc: 'حجامة جافة للجسم كامل ومساج انزلاقي هوائي (ساعة كاملة - 500 ج + المواصلات).',
    fullDesc: 'تغطية شاملة لمسارات الطاقة ونقاط الظهر والرقبة والكتفين والأطراف بكؤوس الشفط الجافة والمساج التنشيطي لراحة وإرخاء الجسم كاملاً. المدة الزمنية: ٦٠ دقيقة (ساعة كاملة). السعر: 500 ج + المواصلات.',
    price: 500,
    durationMinutes: 60,
    includedSupplies: ['طقم كؤوس متعددة الأحجام للجسم كامل', 'زيوت طبيعية دافئة للاسترخاء العضلي'],
    preparationNotes: 'مثالية لتخفيف التوتر والإجهاد العضلي العام وتنشيط الدورة الدموية.',
    iconName: 'ShieldPlus'
  },
  {
    id: 'srv-hijama-wet-fullbody',
    title: 'حجامة دماوية الجسم كامل (Full Body Wet)',
    category: 'hijama',
    shortDesc: 'حجامة دماوية شاملة لكامل الجسم ومسارات السنة النبوية (ساعتين - 800 ج + المواصلات).',
    fullDesc: 'بروتوكول حجامة نبوية وطبية كاملة تغطي مواضع السنة النبوية الرئيسية وفقرات الظهر والأكتاف ومسارات التروية الدموية بأعلى درجات التعقيم. المدة الزمنية: ١٢٠ دقيقة (ساعتان كاملتان). السعر: 800 ج + المواصلات.',
    price: 800,
    durationMinutes: 120,
    includedSupplies: ['طقم كؤوس كامل معقم فردي كبير', 'مشارط ميكرو جراحية متعددة معقمة', 'تعقيم ثلاثي ومطهرات جراحية'],
    preparationNotes: 'صيام خفيف قبل الجلسة وراحة تامة بعدها مع شرب سوائل دافئة.',
    iconName: 'Flame',
    isPopular: true
  },

  // --- خدمات العلاج الطبيعي والتأهيل الحركي المنزلي (بالاتفاق المباشر العادل) ---
  {
    id: 'srv-pt-stroke-neuro',
    title: 'تأهيل جلطات ومخ وأعصاب (Stroke & Neuro Rehab)',
    category: 'physiotherapy',
    shortDesc: 'جلسة تأهيل عصبي وحركي منزلي لمرضى الجلطات والشلل النصفي وإصابات الدماغ (٦٠ دقيقة).',
    fullDesc: 'بروتوكول تأهيلي متقدم لإعادة تدريب المسارات العصبية وتحفيز الأطراف المشلولة واستعادة التوازن والقدرة على المشي باستخدام التنبيه الكهربائي العصبي وتمارين التيسير العصبي العضلي PNF.',
    price: 0,
    durationMinutes: 60,
    includedSupplies: ['جهاز تنبيه كهربائي TENS/EMS', 'أدوات تمارين التوازن والمقاومة', 'كمادات حرارية علاجية'],
    preparationNotes: 'تحديد أسعار الجلسات والكورسات بالاتفاق المباشر العادل بين الدكتور والمريض بعد التقييم.',
    iconName: 'Activity',
    isPopular: true
  },
  {
    id: 'srv-pt-spine-disc',
    title: 'علاج طبيعي للغضاريف والفقرات (Spine & Disc Rehab)',
    category: 'physiotherapy',
    shortDesc: 'تسكين آلام الانزلاق الغضروفي والفقرات القطنية والعنقية وعرق النسا بدون جراحة (٥٠ دقيقة).',
    fullDesc: 'جلسة متكاملة لعلاج تقلصات عضلات الظهر والرقبة وتخفيف الضغط على الأعصاب عبر الموجات فوق الصوتية العلاجية، الكمادات الحرارية، وتقنيات التحريك اليدوي للفقرات وتمارين ماكنزي.',
    price: 0,
    durationMinutes: 50,
    includedSupplies: ['جهاز موجات فوق صوتية علاجية Ultrasound', 'كمادات أشعة تحت حمراء', 'أشرطة Kinesio Taping'],
    preparationNotes: 'يفضل توفير أشعة الرنين المغناطيسي MRI إن وجدت لاطلاع الدكتور عليها.',
    iconName: 'HeartPulse',
    isPopular: true
  },
  {
    id: 'srv-pt-post-fracture-joint',
    title: 'تأهيل ما بعد الكسور وتغيير المفاصل (Post-Op & Fractures)',
    category: 'physiotherapy',
    shortDesc: 'إعادة تأهيل مفصل الركبة والحوض بعد تغيير المفاصل أو فك الجبس والشرائح (٦٠ دقيقة).',
    fullDesc: 'استعادة المدى الحركي للمفصل وتقوية العضلات المحيطة به وتخفيف التورم والتيبس بعد الجراحات العظمية وتركيب المفاصل الصناعية وفق أحدث بروتوكولات التأهيل الجراحي.',
    price: 0,
    durationMinutes: 60,
    includedSupplies: ['أجهزة مساج وتصريف ليمفاوي', 'أدوات تمارين المدى الحركي ROM', 'كمادات ثلجية وجهاز تنبيه عضلات'],
    preparationNotes: 'تأكيد موافقة جراح العظام على بدء العلاج الطبيعي الحركي.',
    iconName: 'Activity',
    isPopular: true
  },
  {
    id: 'srv-pt-facial-palsy',
    title: 'علاج طبيعي لشلل العصب السابع (Bell\'s Palsy)',
    category: 'physiotherapy',
    shortDesc: 'تنبيه كهربائي ميكرو لعضلات الوجه وتدليك علاجي وتمارين تعبيرية (٤٥ دقيقة).',
    fullDesc: 'بروتوكول دقيق لحالات شلل الوجه والتهاب العصب السابع لتحفيز حركة عضلات الوجه ومنع التشنجات العضلية باستخدام نبضات كهربائية ميكرو وتمارين إعادة التأهيل الحركي الدقيق.',
    price: 0,
    durationMinutes: 45,
    includedSupplies: ['أقطاب وجه ميكرو دقيقة', 'جهاز تنبيه عضلي نبضي', 'زيوت مساج وجه طبية'],
    preparationNotes: 'جلسات آمنة تماماً يُفضل البدء فيها مبكراً لسرعة التعافي.',
    iconName: 'Zap'
  },
  {
    id: 'srv-pt-geriatric-balance',
    title: 'تأهيل كبار السن واستعادة الاتزان (Geriatric Balance)',
    category: 'physiotherapy',
    shortDesc: 'برنامج حركي لكبار السن للوقاية من السقوط وتقوية الساقين وتدريب المشي الآمن (٤٥ دقيقة).',
    fullDesc: 'تمارين خاصة لكبار السن لتحسين مرونة المفاصل والاتزان الحركي وتدريب المريض على استخدام المشاية أو العكاز بأمان، مع إمكانية مرافقة مساعد متدرب لمعاونة الدكتور في التدريب.',
    price: 0,
    durationMinutes: 45,
    includedSupplies: ['أحزمة أمان وتثبيت حركي', 'أدوات اتزان متنقلة', 'أدوات تمارين تنفسية وحركية'],
    preparationNotes: 'مرافقة أحد أفراد الأسرة مستحبة خلال الجلسة الأولى.',
    iconName: 'UserCheck'
  }
];

export const INITIAL_CAREGIVERS: Caregiver[] = [
  {
    id: 'nurse-1',
    name: 'سارة عبد الرحمن فؤاد',
    age: 28,
    gender: 'female',
    avatar: '/src/assets/images/nurse_avatar_female_1793095933006.jpg',
    phone: '01012345678',
    qualification: 'college',
    institution: 'بكالوريوس علوم التمريض - جامعة القاهرة',
    licenseNumber: 'EGY-NUR-2020-84920',
    experienceYears: 6,
    rating: 4.95,
    reviewsCount: 168,
    specialties: ['رعاية مركزة وباطنة', 'تركيب كانيولا ومحاليل صعبة', 'غيار قرح الفراش المتقدم', 'متابعة حديثي الولادة'],
    city: 'القاهرة',
    district: 'المعادي وحلوان والتجمع الخامس',
    hourlyRate: 180,
    visitRate: 220,
    bio: 'أخصائية تمريض حاصلة على امتياز مع مرتبة الشرف، عملت بمستشفيات القصر العيني ومستشفى السلام الدولي. متخصصة في العناية بالمرضى ذوي الحالات الحرجة وكبار السن مع التزام صارم بالتعقيم ومكافحة العدوى.',
    verificationDocs: {
      licenseCard: true,
      degreeCert: true,
      nationalId: true,
      criminalRecord: true,
      drugTest: true
    },
    isVerified: true,
    isAvailable: true,
    completedVisits: 342,
    acceptanceRate: 98,
    punctualityScore: 99,
    reviews: [
      {
        id: 'rev-1',
        patientName: 'أ. داليا الشريف',
        rating: 5,
        date: '2026-10-18',
        comment: 'أشطر وأرقى ممرضة اتعاملت معاها، والدتي أوردتها صعبة جداً وسارة ركبت الكانيولا من أول شكة بدون أي وجع وتابعت المحلول للأخر.',
        serviceTitle: 'تركيب محاليل وكانيولا وريدية'
      },
      {
        id: 'rev-2',
        patientName: 'م. أحمد توفيق',
        rating: 5,
        date: '2026-10-10',
        comment: 'التزام تام بالميعاد بالدقيقة وتعقيم كامل لكل الأدوات قبل ما تبدأ، قمة في الأمانة والإخلاص.',
        serviceTitle: 'غيار معقم على الجروح وقرح الفراش'
      }
    ],
    supervisorEvaluation: {
      rating: 5.0,
      tier: 'فئة أ (أداء استثنائي فائق الجودة)',
      executionQualityScore: 99,
      punctualityScore: 99,
      hygieneAndSterilizationScore: 100,
      supervisorNotes: 'أداء طبي فائق الاحترافية، مهارة استثنائية في تركيب الكانيولا الوريدية والمحاليل في الحالات الحرجة مع التزام تام بالتعقيم.',
      evaluatedBy: 'د. سامح رضوان (مدير الإشراف والمتابعة الطبية)',
      evaluatedAt: '2026-10-25'
    }
  },
  {
    id: 'nurse-2',
    name: 'أحمد محمود الفياض',
    age: 31,
    gender: 'male',
    avatar: '/src/assets/images/nurse_avatar_male_1793095932397.jpg',
    phone: '01198765432',
    qualification: 'college',
    institution: 'بكالوريوس تمريض - جامعة عين شمس، دبلومة الحجامة الطبية',
    licenseNumber: 'EGY-NUR-2018-76512',
    experienceYears: 8,
    rating: 4.92,
    reviewsCount: 215,
    specialties: ['الحجامة النبوية والطبية المعقمة', 'رعاية ما بعد جراحات العظام', 'تركيب القساطر والرايل', 'علاج آلام الظهر والمفاصل'],
    city: 'الجيزة',
    district: 'الدقي والمهندسين وأكتوبر والشيخ زايد',
    hourlyRate: 200,
    visitRate: 260,
    bio: 'أخصائي تمريض وممارس حجامة علاجية مرخص. عملت بقسم جراحة القلب والصدر بمستشفى عين شمس التخصصي. أستخدم أحدث تقنيات التشريط الميكرو المعقم والمشرط أحادي الاستخدام مع مراعاة كاملة للضوابط الطبية.',
    verificationDocs: {
      licenseCard: true,
      degreeCert: true,
      nationalId: true,
      criminalRecord: true,
      drugTest: true
    },
    isVerified: true,
    isAvailable: true,
    completedVisits: 489,
    acceptanceRate: 96,
    punctualityScore: 97,
    reviews: [
      {
        id: 'rev-3',
        patientName: 'الحاج عبد المنعم السعدني',
        rating: 5,
        date: '2026-10-22',
        comment: 'عملت مع كابتن أحمد جلسة حجامة لفقرات الظهر، ماشاء الله إيده خفيفة جداً ومحستش بأي ألم وفتح الأدوات المعقمة قدامي. خفيت بفضل الله.',
        serviceTitle: 'جلسة حجامة طبية علاجية ووقائية شاملة'
      },
      {
        id: 'rev-4',
        patientName: 'طارق عبد الباسط',
        rating: 5,
        date: '2026-10-14',
        comment: 'ممرض ممتاز ومحترم، قام بتركيب القسطرة لوالدي بعد العملية باحترافية كبيرة وبدون أي مضاعفات.',
        serviceTitle: 'تركيب وتغيير القسطرة البولية ورايل التغذية'
      }
    ],
    supervisorEvaluation: {
      rating: 4.9,
      tier: 'فئة أ (أداء استثنائي فائق الجودة)',
      executionQualityScore: 98,
      punctualityScore: 97,
      hygieneAndSterilizationScore: 99,
      supervisorNotes: 'إتقان تام لمعايير الحجامة الطبية والتشريط الميكرو المعقم، تقارير العلامات الحيوية مسجلة بدقة فائقة بعد كل زيارة.',
      evaluatedBy: 'د. منى عبد الباسط (استشاري الجودة ومكافحة العدوى)',
      evaluatedAt: '2026-10-24'
    }
  },
  {
    id: 'nurse-3',
    name: 'مريم عادل القاضي',
    age: 26,
    gender: 'female',
    avatar: 'https://images.unsplash.com/photo-1594824813591-11883b567d1a?auto=format&fit=crop&w=400&q=80',
    phone: '01234567890',
    qualification: 'institute',
    institution: 'المعهد الفني الصحي بإمبابة - شعبة تمريض عام ورعاية حرجة',
    licenseNumber: 'EGY-NUR-2022-91402',
    experienceYears: 4,
    rating: 4.88,
    reviewsCount: 94,
    specialties: ['رعاية كبار السن وحالات الزهايمر', 'إعطاء حقن العضل والوريد', 'متابعة أدوية السكر وجرعات الإنسولين', 'جلسات التنفس'],
    city: 'القاهرة',
    district: 'مدينة نصر ومصر الجديدة وشيراتون',
    hourlyRate: 150,
    visitRate: 190,
    bio: 'مممرضة متخصصة في رعاية كبار السن والمتابعة الدورية للأمراض المزمنة. صبورة وهادئة ومتقنة لكل مهارات الإسعاف الأولي وضبط جرعات العلاج اليومي.',
    verificationDocs: {
      licenseCard: true,
      degreeCert: true,
      nationalId: true,
      criminalRecord: true,
      drugTest: true
    },
    isVerified: true,
    isAvailable: true,
    completedVisits: 175,
    acceptanceRate: 99,
    punctualityScore: 98,
    reviews: [
      {
        id: 'rev-5',
        patientName: 'مدام نيفين كمال',
        rating: 5,
        date: '2026-10-19',
        comment: 'مريم ملاك رحمة حقيقي، اتعاملت مع جدتي بكل حنية وطيبة وسجلت السكر والضغط بدقة عالية.',
        serviceTitle: 'رعاية تمريضية شاملة لكبار السن'
      }
    ],
    supervisorEvaluation: {
      rating: 4.8,
      tier: 'فئة ب (ممتاز ومعتمد)',
      executionQualityScore: 97,
      punctualityScore: 98,
      hygieneAndSterilizationScore: 98,
      supervisorNotes: 'أداء متميز وهدوء ورعاية إنسانية فائقة لكبار السن، انتظام ودقة في قياسات السكر ومواعيد الأدوية.',
      evaluatedBy: 'د. سامح رضوان (مدير الإشراف والمتابعة الطبية)',
      evaluatedAt: '2026-10-20'
    }
  },
  {
    id: 'nurse-4',
    name: 'يوسف كمال رضوان',
    age: 33,
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    phone: '01065432198',
    qualification: 'academy',
    institution: 'أكاديمية العلوم الصحية التخصصية المعتمدة - زمالة رعاية الحالات الحرجة والحجامة',
    licenseNumber: 'EGY-NUR-2017-61839',
    experienceYears: 9,
    rating: 4.97,
    reviewsCount: 280,
    specialties: ['حجامة نارية ومدممة متقدمة', 'علاج الشد العضلي والأبهر', 'عناية بعد جراحات القلب المفتوح', 'محاليل المناعة'],
    city: 'القاهرة',
    district: 'التجمع الأول والخامس والرحاب ومدينتي',
    hourlyRate: 220,
    visitRate: 280,
    bio: 'كبير أخصائيي تمريض وحجامة رياضية وعلاجية، خبرة 9 سنوات مع كبار الأطباء والرياضيين. التزام صارم ببروتوكولات الأمان والتعقيم ومتابعة المؤشرات الحيوية قبل وبعد أي تدخل.',
    verificationDocs: {
      licenseCard: true,
      degreeCert: true,
      nationalId: true,
      criminalRecord: true,
      drugTest: true
    },
    isVerified: true,
    isAvailable: true,
    completedVisits: 620,
    acceptanceRate: 97,
    punctualityScore: 100,
    reviews: [
      {
        id: 'rev-6',
        patientName: 'د. هشام الفقي',
        rating: 5,
        date: '2026-10-23',
        comment: 'أداء احترافي جداً في الحجامة، علم واسع بنقاط التشريح وتطهير طبيعي وأدوات مغلفة بالكامل.',
        serviceTitle: 'حجامة متخصصة للصداع النصفي وآلام الرقبة'
      }
    ],
    supervisorEvaluation: {
      rating: 5.0,
      tier: 'فئة أ (أداء استثنائي فائق الجودة)',
      executionQualityScore: 100,
      punctualityScore: 100,
      hygieneAndSterilizationScore: 100,
      supervisorNotes: 'انضباط كامل بالوقت بنسبة 100%، خبرة واسعة في جراحات القلب والتأهيل الطبي، تقييمات العملاء والمشرفين ممتازة دائماً.',
      evaluatedBy: 'د. منى عبد الباسط (استشاري الجودة ومكافحة العدوى)',
      evaluatedAt: '2026-10-26'
    },
    role: 'cupping_specialist'
  },
  {
    id: 'cg-pt-1',
    name: 'د. ماجد سامي رضوان',
    age: 36,
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    phone: '01099887766',
    qualification: 'postgrad',
    institution: 'دكتوراه مهنية في العلاج الطبيعي والتأهيل (DPT) - جامعة القاهرة',
    licenseNumber: 'EGY-PT-2016-52194',
    ptSyndicateNumber: 'PT-SYND-11984',
    experienceYears: 10,
    rating: 4.98,
    reviewsCount: 312,
    specialties: ['تأهيل جلطات ومخ وأعصاب', 'علاج طبيعي للغضاريف والعمود الفقري', 'تأهيل تغيير المفاصل والكسور', 'تنبيه كهربائي TENS/EMS'],
    city: 'القاهرة',
    district: 'المعادي، التجمع، والدقي والمهندسين',
    hourlyRate: 350,
    visitRate: 400,
    bio: 'استشاري العلاج الطبيعي والتأهيل الحركي المنزلي، دكتوراه مهنية DPT من جامعة القاهرة وعضو الجمعية المصرية للأعصاب. مجهز بأحدث أجهزة التنبيه الكهربائي والموجات فوق الصوتية المتنقلة لعلاج الجلطات والانزلاق الغضروفي.',
    verificationDocs: {
      licenseCard: true,
      degreeCert: true,
      nationalId: true,
      criminalRecord: true,
      drugTest: true
    },
    isVerified: true,
    isAvailable: true,
    completedVisits: 540,
    acceptanceRate: 98,
    punctualityScore: 99,
    role: 'physiotherapist',
    portableDevices: [
      'جهاز تنبيه كهربائي ومسكن للألم (TENS / EMS)',
      'جهاز موجات فوق صوتية علاجية (Therapeutic Ultrasound)',
      'كمادات حرارية علاجية وأشعة تحت حمراء',
      'أشرطة التثبيت الحركي الطبية (Kinesiology Taping)'
    ],
    reviews: [
      {
        id: 'rev-pt-1',
        patientName: 'أ. طارق عبد الحميد',
        rating: 5,
        date: '2026-10-24',
        comment: 'دكتور ماجد قمة في الأخلاق والاحتراف، ساعد والدي بعد جلطة المخ في استعادة المشي والوقوف بمفرده في وقت قياسي وبأحدث الأجهزة.',
        serviceTitle: 'تأهيل جلطات ومخ وأعصاب'
      }
    ],
    supervisorEvaluation: {
      rating: 5.0,
      tier: 'فئة أ (أداء استثنائي فائق الجودة)',
      executionQualityScore: 99,
      punctualityScore: 99,
      hygieneAndSterilizationScore: 100,
      supervisorNotes: 'أداء علاجي استثنائي وبروتوكولات تأهيلية دقيقة، نتائج علاجية مبهرة في حالات الشلل النصفي وإشادة كاملة من المرضى.',
      evaluatedBy: 'د. سامح رضوان (مدير الإشراف والمتابعة الطبية)',
      evaluatedAt: '2026-10-27'
    }
  },
  {
    id: 'cg-pt-2',
    name: 'د. نورهان خالد المنشاوي',
    age: 31,
    gender: 'female',
    avatar: 'https://images.unsplash.com/photo-1594824813576-9c441b07ec01?auto=format&fit=crop&w=400&q=80',
    phone: '01233445566',
    qualification: 'college',
    institution: 'بكالوريوس العلاج الطبيعي - جامعة عين شمس، دبلومة التأهيل العصبي والحركي',
    licenseNumber: 'EGY-PT-2020-74102',
    ptSyndicateNumber: 'PT-SYND-19402',
    experienceYears: 6,
    rating: 4.94,
    reviewsCount: 145,
    specialties: ['علاج طبيعي لشلل العصب السابع', 'تأهيل كبار السن واستعادة الاتزان', 'خشونة الركبة والفقرات', 'تمارين التقوية الحركية'],
    city: 'الجيزة',
    district: 'الدقي، المهندسين، فيصل، والشيخ زايد',
    hourlyRate: 300,
    visitRate: 350,
    bio: 'أخصائية علاج طبيعي معتمدة، متخصصة في تأهيل كبار السن وحالات شلل العصب السابع وإعادة تدريب عضلات الوجه والأطراف. صبورة ومهتمة بالراحة النفسية والجسدية للمريض.',
    verificationDocs: {
      licenseCard: true,
      degreeCert: true,
      nationalId: true,
      criminalRecord: true,
      drugTest: true
    },
    isVerified: true,
    isAvailable: true,
    completedVisits: 290,
    acceptanceRate: 99,
    punctualityScore: 98,
    role: 'physiotherapist',
    portableDevices: [
      'جهاز تنبيه كهربائي ميكرو للوجه والأعصاب',
      'كمادات حرارية علاجية وأشعة تحت حمراء',
      'أحزمة تثبيت وتمارين اتزان لكبار السن'
    ],
    reviews: [
      {
        id: 'rev-pt-2',
        patientName: 'أ. رانيا فهمي',
        rating: 5,
        date: '2026-10-25',
        comment: 'دكتورة نورهان ممتازة جداً في علاج العصب السابع، وجهي تحسن بأكثر من 90% بعد 8 جلسات فقط مع التنبيه الكهربائي والمساج الطبي.',
        serviceTitle: 'علاج طبيعي لشلل العصب السابع'
      }
    ],
    supervisorEvaluation: {
      rating: 4.9,
      tier: 'فئة أ (أداء استثنائي فائق الجودة)',
      executionQualityScore: 98,
      punctualityScore: 98,
      hygieneAndSterilizationScore: 100,
      supervisorNotes: 'التزام كامل ومهارات تواصل راقية جداً مع كبار السن، تطبيق مثالي لبروتوكولات الأمان والتعقيم.',
      evaluatedBy: 'د. منى عبد الباسط (استشاري الجودة ومكافحة العدوى)',
      evaluatedAt: '2026-10-26'
    }
  },
  {
    id: 'cg-trn-1',
    name: 'أحمد تامر الجندي',
    age: 23,
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    phone: '01511223344',
    qualification: 'college',
    institution: 'طالب بسنة الامتياز - كلية العلاج الطبيعي جامعة القاهرة',
    licenseNumber: 'STU-PT-2024-9102',
    experienceYears: 1,
    rating: 4.90,
    reviewsCount: 42,
    specialties: ['مساعد د. العلاج الطبيعي', 'معاونة المريض على الوقوف والمشي', 'تطبيق أجهزة التنبيه TENS', 'تمارين المدى الحركي'],
    city: 'القاهرة',
    district: 'المعادي، مدينة نصر، ومصر الجديدة',
    hourlyRate: 100,
    visitRate: 120,
    bio: 'مساعد ومتدرب معتمد بكلية العلاج الطبيعي جامعة القاهرة، يرافق دكتور العلاج الطبيعي لمعاونته في رفع وتقليب وتأمين حركة المريض أثناء الجلسات بأعلى درجات الحرص والأمان.',
    verificationDocs: {
      licenseCard: true, // كارنيه الكلية
      degreeCert: true, // إثبات القيد
      nationalId: true,
      criminalRecord: true,
      drugTest: true
    },
    isVerified: true,
    isAvailable: true,
    completedVisits: 65,
    acceptanceRate: 100,
    punctualityScore: 99,
    role: 'assistant_trainee',
    trainingTrack: 'physiotherapy',
    reviews: [
      {
        id: 'rev-trn-1',
        patientName: 'الحاج محمود جودة',
        rating: 5,
        date: '2026-10-22',
        comment: 'شاب مهذب جداً وقوي، ساعد الدكتور بشكل رائع في سندي ونقلي من الفراش إلى المشاية بدون أي تعب.',
        serviceTitle: 'مساعد مرافق لجلسة العلاج الطبيعي'
      }
    ],
    supervisorEvaluation: {
      rating: 4.9,
      tier: 'فئة ب (ممتاز ومعتمد)',
      executionQualityScore: 98,
      punctualityScore: 99,
      hygieneAndSterilizationScore: 100,
      supervisorNotes: 'متدرب واعد، التزام فائق بالتعليمات الطبية للمشرف وحرص شديد على سلامة المريض أثناء النقل والحركة.',
      evaluatedBy: 'د. ماجد سامي (استشاري العلاج الطبيعي والمشرف الميداني)',
      evaluatedAt: '2026-10-25'
    }
  },
  {
    id: 'cg-trn-2',
    name: 'مريم عصام الشافعي',
    age: 22,
    gender: 'female',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    phone: '01055667788',
    qualification: 'college',
    institution: 'طالبة بالفرقة الرابعة - كلية التمريض جامعة القاهرة',
    licenseNumber: 'STU-NUR-2024-8841',
    experienceYears: 1,
    rating: 4.92,
    reviewsCount: 38,
    specialties: ['مساعدة تمريضية متدربة', 'متابعة وقياس العلامات الحيوية', 'تنظيم مواعيد الأدوية', 'معاونة كبار السن'],
    city: 'الجيزة',
    district: 'الدقي، العجوزة، الهرم، والشيخ زايد',
    hourlyRate: 100,
    visitRate: 120,
    bio: 'مساعدة ومتدربة تمريضية بكلية التمريض جامعة القاهرة، تتدرب تحت إشراف طاقم المنصة على رعاية الحالات المنزلية وكبار السن وقياس السكر والضغط بدقة وسرعة بديهة.',
    verificationDocs: {
      licenseCard: true,
      degreeCert: true,
      nationalId: true,
      criminalRecord: true,
      drugTest: true
    },
    isVerified: true,
    isAvailable: true,
    completedVisits: 52,
    acceptanceRate: 100,
    punctualityScore: 98,
    role: 'assistant_trainee',
    trainingTrack: 'nursing',
    reviews: [
      {
        id: 'rev-trn-2',
        patientName: 'أ. سحر رضوان',
        rating: 5,
        date: '2026-10-26',
        comment: 'مريم متعاونة وبشوشة ودقيقة جداً في مواعيد السكر والضغط، مساعدة ممتازة بجانب الممرضة المسؤولة.',
        serviceTitle: 'مساعدة تمريضية مرافقة'
      }
    ],
    supervisorEvaluation: {
      rating: 4.8,
      tier: 'فئة ب (ممتاز ومعتمد)',
      executionQualityScore: 97,
      punctualityScore: 98,
      hygieneAndSterilizationScore: 100,
      supervisorNotes: 'أداء متميز في قياس المؤشرات الحيوية وحسن تصرف مع المرضى ومتابعة دقيقة لكل توجيهات الممرض المشرف.',
      evaluatedBy: 'د. سامح رضوان (مدير الإشراف والمتابعة الطبية)',
      evaluatedAt: '2026-10-27'
    }
  }
];

export const INITIAL_BOOKINGS: BookingOrder[] = [
  {
    id: 'PT-8821',
    orderNumber: 'PT-2026-8821',
    createdAt: '2026-11-03T10:15:00.000Z',
    serviceId: 'srv-pt-stroke-neuro',
    serviceTitle: 'جلسة علاج طبيعي وتأهيل حركي - تأهيل جلطات ومخ وأعصاب',
    category: 'physiotherapy',
    orderType: 'standard',
    isUrgent: false,
    caregiverId: 'cg-pt-1',
    caregiverName: 'د. ماجد سامي رضوان',
    caregiverAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    caregiverPhone: '01099887766',
    visitDate: '2026-11-04',
    timingChoice: 'تحديد معاد',
    preferredTime: '11:00 ص - 01:00 م',
    scheduledDate: '2026-11-04',
    scheduledTime: '11:00 ص',
    governorate: 'القاهرة',
    detailedAddress: 'المعادي، شارع دمشق متفرع من دجلة، عمارة 8 الدور الرابع',
    medicationAvailableAtHome: true,
    isPhysiotherapyOrder: true,
    physiotherapyDetails: {
      conditionCategory: 'تأهيل جلطات ومخ وأعصاب (Stroke & Neuro Rehab)',
      mobilityStatus: 'يتحرك بمساعدة مشاية أو عكاز أو مرافق',
      affectedBodyParts: ['الجانب الأيمن كاملاً (شلل نصفي بعد جلطة)'],
      sessionGoal: 'استعادة التوازن والمشي وتنبيه العضلات الضامرة',
      portableDevicesNeeded: [
        'جهاز تنبيه كهربائي ومسكن للألم (TENS / EMS)',
        'جهاز موجات فوق صوتية علاجية (Therapeutic Ultrasound)'
      ],
      hasHeartPacemakerOrMetalImplants: false,
      postFractureOrSurgeryNotes: 'جلطة دماغية منذ شهرين، استقرار كامل بالعلامات الحيوية بتوصية استشاري المخ والأعصاب'
    },
    assistantRequested: {
      requested: true,
      track: 'physiotherapy',
      note: 'مطلوب مساعد متدرب لمعاونة دكتور العلاج الطبيعي في رفع وسند المريض أثناء التدريب على المشاية'
    },
    adminStatus: 'جديد',
    patient: {
      fullName: 'الحاج عبد المنعم عبد السلام',
      phone: '01223344556',
      age: 64,
      address: 'القاهرة - المعادي، دجلة، شارع 8',
      governorate: 'القاهرة',
      locationCoordinates: {
        lat: 29.9602,
        lng: 31.2568,
        addressName: 'المعادي، القاهرة'
      },
      chronicDiseases: 'جلطة سابقة وضغط دم مرتفع',
      forbiddenMedications: 'لا يوجد',
      previousSurgeries: 'لا يوجد',
      medicationAvailable: true,
      medicalReports: ['تقرير الرنين المغناطيسي وتوصية دكتور الأعصاب'],
      preferredCaregiverGender: 'male'
    },
    status: 'pending_acceptance',
    payment: {
      method: 'instapay',
      walletNumber: '01034562904',
      status: 'pending',
      amount: 0, // بالاتفاق المباشر
      baseAmount: 0,
      invoiceNumber: 'INV-PT-8821'
    },
    googleMapsUrl: 'https://www.google.com/maps?q=29.9602,31.2568',
    liveTracking: {
      nurseLocation: {
        lat: 29.9602,
        lng: 31.2568,
        addressName: 'المعادي'
      },
      estimatedArrivalMinutes: 20,
      currentStage: 0,
      lastUpdated: 'تم إرسال طلب العلاج الطبيعي بنجاح، جاري مراجعة المشرف الطبي',
      isLiveLocationActive: false,
      riskProtectionEnabled: true,
      patientCoordinates: {
        lat: 29.9602,
        lng: 31.2568,
        addressName: 'المعادي، القاهرة'
      }
    }
  },
  {
    id: 'HJ-9102',
    orderNumber: 'HJ-2026-9102',
    createdAt: '2026-11-01T08:30:00.000Z',
    serviceId: 'srv-hijama-cosmetic-dry',
    serviceTitle: 'طلب حجامة: حجامة جافة (كؤوس هواء) (المنزل)',
    category: 'hijama',
    orderType: 'standard',
    isUrgent: false,
    urgentFee: 0,
    caregiverId: 'nurse-2',
    caregiverName: 'أحمد محمود الفياض',
    caregiverAvatar: '/src/assets/images/nurse_avatar_male_1793095932397.jpg',
    caregiverPhone: '01198765432',
    visitDate: '2026-11-01',
    timingChoice: 'تحديد معاد',
    preferredTime: '05:00 م',
    scheduledDate: '2026-11-01',
    scheduledTime: '05:00 م',
    governorate: 'القاهرة',
    detailedAddress: 'مدينة نصر، الحي السابع، شارع الطيران، عمارة 15',
    isCuppingOrder: true,
    cuppingDetails: {
      hasHypertensionOrDiabetes: true,
      hasBleedingTendency: true,
      hasOtherDiseases: false,
      hasSkinDiseasesOrWounds: false,
      lastCuppingAndComplications: 'أول مرة، لا توجد حجامة سابقة',
      locationType: 'المنزل',
      cuppingType: 'حجامة جافة (كؤوس هواء)',
      gender: 'ذكر',
      isRestrictedToDryCupping: true
    },
    hasChronicDiseasesAnswer: 'يعاني من سكر وضغط (تم تحويل الحجامة إلى جافة)',
    currentMedicationsAnswer: 'أسبوسيد أطفال (سيولة) وجانوفيا',
    allergiesOrForbiddenAnswer: 'لا توجد أمراض جلدية أو جروح',
    previousSurgeriesAnswer: 'أول مرة حجامة - لا توجد مضاعفات سابقة',
    hasPreviousSurgeries: false,
    medicationAvailableAtHome: true,
    adminStatus: 'جديد',
    patient: {
      fullName: 'عمرو عبد العزيز سليمان',
      phone: '01099887766',
      age: 49,
      address: 'القاهرة - مدينة نصر، الحي السابع، شارع الطيران، عمارة 15',
      governorate: 'القاهرة',
      locationCoordinates: {
        lat: 30.0550,
        lng: 31.3350,
        addressName: 'مدينة نصر، القاهرة'
      },
      chronicDiseases: 'سكر وضغط',
      forbiddenMedications: 'لا يوجد',
      previousSurgeries: 'لا يوجد',
      medicationAvailable: true,
      medicalReports: [],
      preferredCaregiverGender: 'male'
    },
    status: 'pending_acceptance',
    payment: {
      method: 'instapay',
      walletNumber: '01034562904',
      status: 'pending',
      amount: 250,
      baseAmount: 250,
      invoiceNumber: 'INV-HJ-9102'
    },
    liveTracking: {
      nurseLocation: {
        lat: 30.0550,
        lng: 31.3350,
        addressName: 'تم استلام طلب الحجامة، قيد مراجعة الأخصائي'
      },
      estimatedArrivalMinutes: 30,
      currentStage: 0,
      lastUpdated: 'تم إرسال طلب الحجامة، سيراجع الأخصائي الحالة أولاً'
    }
  },
  {
    id: 'BK-8941',
    orderNumber: 'ORD-2026-8941',
    createdAt: '2026-10-27T08:15:00.000Z',
    serviceId: 'srv-cannula-iv',
    serviceTitle: 'تركيب محاليل وكانيولا وريدية (IV Infusion)',
    category: 'nursing',
    orderType: 'urgent',
    isUrgent: true,
    urgentFee: 150,
    caregiverId: 'nurse-1',
    caregiverName: 'سارة عبد الرحمن فؤاد',
    caregiverAvatar: '/src/assets/images/nurse_avatar_female_1793095933006.jpg',
    caregiverPhone: '01012345678',
    visitDate: '2026-10-27',
    timingChoice: 'فوري',
    preferredTime: 'فوري الآن',
    scheduledDate: '2026-10-27',
    scheduledTime: '11:30 ص (فوري)',
    governorate: 'القاهرة',
    detailedAddress: 'شارع 9 المعادي، برج الياسمين، الدور الرابع، شقة 8',
    prescriptionFileName: 'روشتة_د_حازم_استشاري_الباطنة.pdf',
    hasChronicDiseasesAnswer: 'ارتفاع ضغط الدم والسكري من النوع الثاني',
    currentMedicationsAnswer: 'كونكور 5 مجم صباحاً، جانوفيا 100 مجم بعد الغداء، أسبوسيد أطفال',
    allergiesOrForbiddenAnswer: 'حساسية من مركبات البنسلين ومشتقات السلفا',
    previousSurgeriesAnswer: 'عملية قسطرة قلبية وتركيب دعامة عام 2023',
    hasPreviousSurgeries: true,
    medicationAvailableAtHome: false,
    adminStatus: 'تم تعيين ممرض',
    medicineRequest: {
      requested: true,
      details: 'أمبولات سيفوتاكس 1 جم، 2 كيس محلول ملحي 500 مل، كانيولا وريدية مقاس 20 زرقاء، وجهاز وريد',
      serviceFee: 30,
      medicineCost: 145,
      pharmacyInvoiceUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
      pharmacyInvoiceFileName: 'فاتورة_صيدلية_العزبي_المعادي.jpg',
      invoiceRecordedAt: '2026-10-27T08:50:00.000Z'
    },
    patient: {
      fullName: 'فاطمة محمود إبراهيم',
      phone: '01045678912',
      age: 64,
      address: 'شارع 9 المعادي، برج الياسمين، الدور الرابع، شقة 8',
      governorate: 'القاهرة',
      locationCoordinates: {
        lat: 29.9585,
        lng: 31.2612,
        addressName: 'المعادي، القاهرة'
      },
      chronicDiseases: 'ارتفاع ضغط الدم والسكري من النوع الثاني',
      currentMedications: 'كونكور 5 مجم صباحاً، جانوفيا 100 مجم، أسبوسيد أطفال',
      forbiddenMedications: 'حساسية من مركبات البنسلين ومشتقات السلفا',
      hasPreviousSurgeries: true,
      previousSurgeries: 'عملية قسطرة قلبية وتركيب دعامة عام 2023',
      medicationAvailable: false, // يحضر الممرض العلاج
      medicalReports: ['روشتة_د_حازم_استشاري_الباطنة.pdf', 'تحليل_سكر_تراكمي_أكتوبر.jpg'],
      preferredCaregiverGender: 'female'
    },
    status: 'on_the_way',
    payment: {
      method: 'vodafone_cash',
      status: 'paid',
      amount: 395,
      baseAmount: 220,
      medicationServiceFee: 30,
      medicineCost: 145,
      invoiceNumber: 'INV-2026-1094',
      transactionRef: 'VDF-9812401'
    },
    liveTracking: {
      nurseLocation: {
        lat: 29.9620,
        lng: 31.2650,
        addressName: 'على بعد 1.2 كم، طريق النصر متجهة لشارع 9'
      },
      estimatedArrivalMinutes: 8,
      currentStage: 2, // 2 = في الطريق
      lastUpdated: 'منذ دقيقة واحدة'
    },
    vitalSigns: {
      bloodPressure: '125/82 mmHg',
      bloodSugar: '142 mg/dL (بعد الإفطار)',
      heartRate: '76 bpm',
      oxygenSaturation: '98%',
      temperature: '36.7 °C',
      clinicalNotes: 'المريضة مستقرة، تم عمل اختبار الحساسية والنتيجة سلبية، الكانيولا الوريدية تعمل بكفاءة تامة وتدفق المحلول منتظم.',
      recordedAt: '2026-10-27T09:40:00Z',
      nurseName: 'سارة عبد الرحمن'
    }
  },
  {
    id: 'BK-8955',
    orderNumber: 'ORD-2026-8955',
    createdAt: '2026-10-28T10:00:00.000Z',
    serviceId: 'srv-catheter-insert',
    serviceTitle: 'تركيب قسطرة بولية (Catheter Insertion)',
    category: 'nursing',
    orderType: 'standard',
    isUrgent: false,
    urgentFee: 0,
    caregiverId: 'nurse-2',
    caregiverName: 'أحمد محمود الفياض',
    caregiverAvatar: '/src/assets/images/nurse_avatar_male_1793095932397.jpg',
    caregiverPhone: '01198765432',
    visitDate: '2026-10-28',
    timingChoice: 'تحديد معاد',
    preferredTime: '03:00 عصراً',
    scheduledDate: '2026-10-28',
    scheduledTime: '03:00 عصراً',
    governorate: 'الجيزة',
    detailedAddress: 'شارع الهرم، محطة العريش، عمارة النصر، الدور السادس، شقة 14',
    prescriptionFileName: 'تقرير_استشاري_المسالك_البولية.pdf',
    hasChronicDiseasesAnswer: 'تضخم حميد بالبروستاتا مع ارتفاع ضغط الدم',
    currentMedicationsAnswer: 'تامسولين 0.4 مجم يومياً، كاردورا 2 مجم',
    allergiesOrForbiddenAnswer: 'لا توجد حساسية دوائية معروفة',
    previousSurgeriesAnswer: 'لا توجد عمليات جراحية سابقة',
    hasPreviousSurgeries: false,
    medicationAvailableAtHome: true,
    adminStatus: 'جديد',
    patient: {
      fullName: 'عصام عبد المجيد الشربيني',
      phone: '01224567891',
      age: 71,
      address: 'شارع الهرم، محطة العريش، عمارة النصر، الدور السادس، شقة 14',
      governorate: 'الجيزة',
      locationCoordinates: {
        lat: 29.9985,
        lng: 31.1852,
        addressName: 'الهرم، الجيزة'
      },
      chronicDiseases: 'تضخم بالبروستاتا وضغط دم',
      currentMedications: 'تامسولين 0.4 مجم، كاردورا',
      forbiddenMedications: 'لا يوجد',
      hasPreviousSurgeries: false,
      previousSurgeries: 'لا توجد عمليات',
      medicationAvailable: true,
      medicalReports: ['تقرير_استشاري_المسالك_البولية.pdf'],
      preferredCaregiverGender: 'male'
    },
    status: 'pending_acceptance',
    payment: {
      method: 'instapay',
      walletNumber: '01034562904',
      status: 'pending',
      amount: 300,
      invoiceNumber: 'INV-2026-1099'
    },
    liveTracking: {
      estimatedArrivalMinutes: 45,
      currentStage: 0,
      lastUpdated: 'طلب جديد تم إرساله للتو'
    }
  },
  {
    id: 'BK-8930',
    orderNumber: 'ORD-2026-8930',
    createdAt: '2026-10-26T14:30:00.000Z',
    serviceId: 'srv-hijama-therapeutic',
    serviceTitle: 'جلسة حجامة طبية علاجية ووقائية شاملة',
    category: 'hijama',
    orderType: 'standard',
    isUrgent: false,
    urgentFee: 0,
    caregiverId: 'nurse-2',
    caregiverName: 'أحمد محمود الفياض',
    caregiverAvatar: '/src/assets/images/nurse_avatar_male_1793095932397.jpg',
    caregiverPhone: '01198765432',
    visitDate: '2026-10-26',
    timingChoice: 'تحديد معاد',
    preferredTime: '06:00 م',
    scheduledDate: '2026-10-26',
    scheduledTime: '06:00 م',
    governorate: 'الجيزة',
    detailedAddress: 'شارع مصدق، الدقي، عمارة الأطباء، الدور الثاني',
    prescriptionFileName: 'أشعة_رنين_مغناطيسي_فقرات_قطنية.jpg',
    hasChronicDiseasesAnswer: 'لا يوجد أمراض مزمنة',
    currentMedicationsAnswer: 'لا يتناول أدوية حالياً',
    allergiesOrForbiddenAnswer: 'لا توجد حساسية دوائية',
    previousSurgeriesAnswer: 'منظار غضروف قطني عام 2021',
    hasPreviousSurgeries: true,
    medicationAvailableAtHome: true,
    adminStatus: 'مكتمل',
    patient: {
      fullName: 'خالد مصطفى العوضي',
      phone: '01123498765',
      age: 42,
      address: 'شارع مصدق، الدقي، عمارة الأطباء، الدور الثاني',
      governorate: 'الجيزة',
      locationCoordinates: {
        lat: 30.0382,
        lng: 31.2057,
        addressName: 'الدقي، الجيزة'
      },
      chronicDiseases: 'لا يوجد أمراض مزمنة',
      forbiddenMedications: 'لا يوجد',
      previousSurgeries: 'منظار غضروف قطني عام 2021',
      medicationAvailable: true,
      medicalReports: ['أشعة_رنين_مغناطيسي_فقرات_قطنية.jpg'],
      preferredCaregiverGender: 'male'
    },
    status: 'completed',
    payment: {
      method: 'instapay',
      status: 'paid',
      amount: 350,
      invoiceNumber: 'INV-2026-1088',
      transactionRef: 'INSTA-884190'
    },
    liveTracking: {
      estimatedArrivalMinutes: 0,
      currentStage: 4,
      lastUpdated: 'اكتملت الزيارة بنجاح'
    },
    vitalSigns: {
      bloodPressure: '120/78 mmHg',
      bloodSugar: '98 mg/dL',
      heartRate: '72 bpm',
      oxygenSaturation: '99%',
      temperature: '36.6 °C',
      clinicalNotes: 'تم عمل حجامة دقيقة على الكاهل ولوحي الكتف والفقرات القطنية. تم التعقيم بزيت الحبة السوداء ومحلول طبي، والمريض يشعر بارتياح ملحوظ.',
      recordedAt: '2026-10-26T18:45:00Z',
      nurseName: 'أحمد محمود الفياض'
    },
    review: {
      rating: 5,
      comment: 'خدمة فوق الممتازة ودقة وتعقيم عالي جداً. شكراً جزيلاً لأحمد.',
      submittedAt: '2026-10-26T20:00:00Z'
    }
  },
  {
    id: 'BK-8924',
    orderNumber: 'ORD-2026-8924',
    createdAt: '2026-10-22T09:00:00.000Z',
    serviceId: 'srv-elderly-daily',
    serviceTitle: 'رعاية تمريضية شاملة ومتابعة علامات حيوية',
    category: 'elderly',
    orderType: 'standard',
    isUrgent: false,
    urgentFee: 0,
    caregiverId: 'nurse-3',
    caregiverName: 'مريم عادل القاضي',
    caregiverAvatar: 'https://images.unsplash.com/photo-1594824813591-11883b567d1a?auto=format&fit=crop&w=400&q=80',
    caregiverPhone: '01234567890',
    visitDate: '2026-10-22',
    timingChoice: 'تحديد معاد',
    preferredTime: '10:00 ص',
    scheduledDate: '2026-10-22',
    scheduledTime: '10:00 ص',
    governorate: 'القاهرة',
    detailedAddress: 'شارع 9 المعادي، برج الياسمين، شقة 8',
    prescriptionFileName: 'تقرير_متابعة_دورية_الضغط_والسكر.pdf',
    hasChronicDiseasesAnswer: 'ارتفاع ضغط الدم والسكري من النوع الثاني',
    currentMedicationsAnswer: 'كونكور 5 مجم، لانتوس إنسولين',
    allergiesOrForbiddenAnswer: 'حساسية من البنسلين',
    previousSurgeriesAnswer: 'قسطرة قلبية 2023',
    hasPreviousSurgeries: true,
    medicationAvailableAtHome: true,
    adminStatus: 'مكتمل',
    patient: {
      fullName: 'فاطمة محمود إبراهيم',
      phone: '01045678912',
      age: 64,
      address: 'شارع 9 المعادي، برج الياسمين',
      governorate: 'القاهرة',
      locationCoordinates: {
        lat: 29.9585,
        lng: 31.2612,
        addressName: 'المعادي، القاهرة'
      },
      chronicDiseases: 'ارتفاع ضغط الدم والسكري من النوع الثاني',
      currentMedications: 'كونكور 5 مجم، لانتوس إنسولين',
      forbiddenMedications: 'حساسية من البنسلين',
      hasPreviousSurgeries: true,
      previousSurgeries: 'قسطرة قلبية 2023',
      medicationAvailable: true,
      medicalReports: ['تقرير_متابعة_دورية_الضغط_والسكر.pdf'],
      preferredCaregiverGender: 'female'
    },
    status: 'completed',
    payment: {
      method: 'vodafone_cash',
      walletNumber: '01034562904',
      status: 'paid',
      amount: 190,
      invoiceNumber: 'INV-2026-1072',
      transactionRef: 'CARD-772189'
    },
    liveTracking: {
      estimatedArrivalMinutes: 0,
      currentStage: 4,
      lastUpdated: 'اكتملت الزيارة'
    },
    vitalSigns: {
      bloodPressure: '124/80 mmHg',
      bloodSugar: '128 mg/dL',
      heartRate: '75 bpm',
      oxygenSaturation: '98%',
      temperature: '36.6 °C',
      clinicalNotes: 'مستوى السكر منضبط بعد تعديل جرعة الإنسولين، الضغط في النطاق المثالي، ونشاط عام ممتاز.',
      recordedAt: '2026-10-22T10:45:00Z',
      nurseName: 'مريم عادل القاضي'
    }
  },
  {
    id: 'BK-8918',
    orderNumber: 'ORD-2026-8918',
    createdAt: '2026-10-18T10:30:00.000Z',
    serviceId: 'srv-wound-care',
    serviceTitle: 'غيار معقم ومتابعة استشفاء جروح',
    category: 'nursing',
    orderType: 'urgent',
    isUrgent: true,
    urgentFee: 150,
    caregiverId: 'nurse-1',
    caregiverName: 'سارة عبد الرحمن فؤاد',
    caregiverAvatar: '/src/assets/images/nurse_avatar_female_1793095933006.jpg',
    caregiverPhone: '01012345678',
    visitDate: '2026-10-18',
    timingChoice: 'مستعجل',
    preferredTime: '12:00 م (مستعجل)',
    scheduledDate: '2026-10-18',
    scheduledTime: '12:00 م',
    governorate: 'القاهرة',
    detailedAddress: 'شارع النصر، المعادي الجديدة، عمارة 15',
    prescriptionFileName: 'روشتة_غيار_جراحي_معقم.pdf',
    hasChronicDiseasesAnswer: 'ارتفاع ضغط الدم والسكري من النوع الثاني',
    currentMedicationsAnswer: 'مضاد حيوي أوجمنتين، أسبوسيد',
    allergiesOrForbiddenAnswer: 'لا توجد',
    previousSurgeriesAnswer: 'قسطرة قلبية 2023',
    hasPreviousSurgeries: true,
    medicationAvailableAtHome: true,
    adminStatus: 'قيد المراجعة',
    patient: {
      fullName: 'فاطمة محمود إبراهيم',
      phone: '01045678912',
      age: 64,
      address: 'شارع 9 المعادي، برج الياسمين',
      governorate: 'القاهرة',
      locationCoordinates: {
        lat: 29.9585,
        lng: 31.2612,
        addressName: 'المعادي، القاهرة'
      },
      chronicDiseases: 'ارتفاع ضغط الدم والسكري من النوع الثاني',
      currentMedications: 'مضاد حيوي أوجمنتين، أسبوسيد',
      forbiddenMedications: 'حساسية من البنسلين',
      hasPreviousSurgeries: true,
      previousSurgeries: 'قسطرة قلبية 2023',
      medicationAvailable: true,
      medicalReports: ['تقرير_متابعة_دورية_الضغط_والسكر.pdf'],
      preferredCaregiverGender: 'female'
    },
    status: 'completed',
    payment: {
      method: 'vodafone_cash',
      status: 'paid',
      amount: 220,
      invoiceNumber: 'INV-2026-1055',
      transactionRef: 'VDF-6619023'
    },
    liveTracking: {
      estimatedArrivalMinutes: 0,
      currentStage: 4,
      lastUpdated: 'اكتملت الزيارة'
    },
    vitalSigns: {
      bloodPressure: '130/84 mmHg',
      bloodSugar: '146 mg/dL',
      heartRate: '78 bpm',
      oxygenSaturation: '97%',
      temperature: '36.8 °C',
      clinicalNotes: 'التئام الجرح متقدم بدون أي علامات التهاب. تم قياس السكر والضغط وإعطاء جرعات الصباح.',
      recordedAt: '2026-10-18T12:50:00Z',
      nurseName: 'سارة عبد الرحمن'
    }
  },
  {
    id: 'BK-8902',
    orderNumber: 'ORD-2026-8902',
    createdAt: '2026-10-15T16:00:00.000Z',
    serviceId: 'srv-blood-draw',
    serviceTitle: 'سحب عينات دم (Blood Sampling)',
    category: 'nursing',
    orderType: 'standard',
    isUrgent: false,
    urgentFee: 0,
    caregiverId: 'nurse-3',
    caregiverName: 'مريم عادل القاضي',
    caregiverAvatar: 'https://images.unsplash.com/photo-1594824813591-11883b567d1a?auto=format&fit=crop&w=400&q=80',
    caregiverPhone: '01234567890',
    visitDate: '2026-10-15',
    timingChoice: 'تحديد معاد',
    preferredTime: '09:00 ص',
    scheduledDate: '2026-10-15',
    scheduledTime: '09:00 ص',
    governorate: 'القليوبية',
    detailedAddress: 'بنها، شارع فريد ندا، برج الأطباء',
    prescriptionFileName: 'تحاليل_شاملة_معمل_البرج.pdf',
    hasChronicDiseasesAnswer: 'لا يوجد أمراض مزمنة',
    currentMedicationsAnswer: 'لا يتناول أدوية',
    allergiesOrForbiddenAnswer: 'لا توجد',
    previousSurgeriesAnswer: 'لا توجد',
    hasPreviousSurgeries: false,
    medicationAvailableAtHome: true,
    adminStatus: 'ملغي',
    patient: {
      fullName: 'سمير عبد العظيم غانم',
      phone: '01099887766',
      age: 38,
      address: 'بنها، شارع فريد ندا، برج الأطباء',
      governorate: 'القليوبية',
      locationCoordinates: {
        lat: 30.4659,
        lng: 31.1853,
        addressName: 'بنها، القليوبية'
      },
      chronicDiseases: 'لا يوجد أمراض مزمنة',
      forbiddenMedications: 'لا يوجد',
      hasPreviousSurgeries: false,
      previousSurgeries: 'لا توجد عمليات',
      medicationAvailable: true,
      medicalReports: ['تحاليل_شاملة_معمل_البرج.pdf'],
      preferredCaregiverGender: 'any'
    },
    status: 'cancelled',
    payment: {
      method: 'instapay',
      walletNumber: '01034562904',
      status: 'pending',
      amount: 150,
      invoiceNumber: 'INV-2026-1040'
    },
    liveTracking: {
      estimatedArrivalMinutes: 0,
      currentStage: 0,
      lastUpdated: 'تم إلغاء الطلب بناءً على رغبة العميل'
    }
  },
  {
    id: 'BK-8910',
    orderNumber: 'ORD-2026-8910',
    createdAt: '2026-10-14T08:00:00.000Z',
    serviceId: 'srv-injections-iv',
    serviceTitle: 'إعطاء حقن عضل ووريد ومحاليل مقوية',
    category: 'nursing',
    orderType: 'standard',
    isUrgent: false,
    urgentFee: 0,
    caregiverId: 'nurse-3',
    caregiverName: 'مريم عادل القاضي',
    caregiverAvatar: 'https://images.unsplash.com/photo-1594824813591-11883b567d1a?auto=format&fit=crop&w=400&q=80',
    caregiverPhone: '01234567890',
    visitDate: '2026-10-14',
    timingChoice: 'تحديد معاد',
    preferredTime: '09:30 ص',
    scheduledDate: '2026-10-14',
    scheduledTime: '09:30 ص',
    governorate: 'القاهرة',
    detailedAddress: 'شارع 9 المعادي، برج الياسمين، شقة 8',
    prescriptionFileName: 'روشتة_حقن_فيتامينات.pdf',
    hasChronicDiseasesAnswer: 'ارتفاع ضغط الدم والسكري',
    currentMedicationsAnswer: 'فيتامين ب المركب، كونكور',
    allergiesOrForbiddenAnswer: 'حساسية من البنسلين',
    previousSurgeriesAnswer: 'قسطرة قلبية 2023',
    hasPreviousSurgeries: true,
    medicationAvailableAtHome: true,
    adminStatus: 'مكتمل',
    patient: {
      fullName: 'فاطمة محمود إبراهيم',
      phone: '01045678912',
      age: 64,
      address: 'شارع 9 المعادي، برج الياسمين',
      governorate: 'القاهرة',
      locationCoordinates: {
        lat: 29.9585,
        lng: 31.2612,
        addressName: 'المعادي، القاهرة'
      },
      chronicDiseases: 'ارتفاع ضغط الدم والسكري من النوع الثاني',
      forbiddenMedications: 'حساسية من البنسلين',
      previousSurgeries: 'قسطرة قلبية 2023',
      medicationAvailable: true,
      medicalReports: ['تقرير_متابعة_دورية_الضغط_والسكر.pdf'],
      preferredCaregiverGender: 'female'
    },
    status: 'completed',
    payment: {
      method: 'instapay',
      status: 'paid',
      amount: 190,
      invoiceNumber: 'INV-2026-1038',
      transactionRef: 'INSTA-443192'
    },
    liveTracking: {
      estimatedArrivalMinutes: 0,
      currentStage: 4,
      lastUpdated: 'اكتملت الزيارة'
    },
    vitalSigns: {
      bloodPressure: '136/86 mmHg',
      bloodSugar: '158 mg/dL',
      heartRate: '80 bpm',
      oxygenSaturation: '97%',
      temperature: '36.7 °C',
      clinicalNotes: 'تم إعطاء حقنة فيتامين ب المركب، مع التنبيه بتقليل الأملاح والسكريات لملاحظة ارتفاع طفيف في الضغط والسكر.',
      recordedAt: '2026-10-14T10:15:00Z',
      nurseName: 'مريم عادل القاضي'
    }
  },
  {
    id: 'BK-8901',
    orderNumber: 'ORD-2026-8901',
    createdAt: '2026-10-10T11:00:00.000Z',
    serviceId: 'srv-elderly-daily',
    serviceTitle: 'فحص دوري ومتابعة العلامات الحيوية الأولية',
    category: 'elderly',
    orderType: 'standard',
    isUrgent: false,
    urgentFee: 0,
    caregiverId: 'nurse-1',
    caregiverName: 'سارة عبد الرحمن فؤاد',
    caregiverAvatar: '/src/assets/images/nurse_avatar_female_1793095933006.jpg',
    caregiverPhone: '01012345678',
    visitDate: '2026-10-10',
    timingChoice: 'تحديد معاد',
    preferredTime: '11:00 ص',
    scheduledDate: '2026-10-10',
    scheduledTime: '11:00 ص',
    governorate: 'القاهرة',
    detailedAddress: 'شارع 9 المعادي، برج الياسمين',
    prescriptionFileName: 'تقرير_متابعة_دورية_الضغط_والسكر.pdf',
    hasChronicDiseasesAnswer: 'ارتفاع ضغط الدم والسكري',
    currentMedicationsAnswer: 'كونكور 5 مجم، لانتوس',
    allergiesOrForbiddenAnswer: 'حساسية من البنسلين',
    previousSurgeriesAnswer: 'قسطرة قلبية 2023',
    hasPreviousSurgeries: true,
    medicationAvailableAtHome: true,
    adminStatus: 'مكتمل',
    patient: {
      fullName: 'فاطمة محمود إبراهيم',
      phone: '01045678912',
      age: 64,
      address: 'شارع 9 المعادي، برج الياسمين',
      governorate: 'القاهرة',
      locationCoordinates: {
        lat: 29.9585,
        lng: 31.2612,
        addressName: 'المعادي، القاهرة'
      },
      chronicDiseases: 'ارتفاع ضغط الدم والسكري من النوع الثاني',
      forbiddenMedications: 'حساسية من البنسلين',
      previousSurgeries: 'قسطرة قلبية 2023',
      medicationAvailable: true,
      medicalReports: ['تقرير_متابعة_دورية_الضغط_والسكر.pdf'],
      preferredCaregiverGender: 'female'
    },
    status: 'completed',
    payment: {
      method: 'instapay',
      walletNumber: '01034562904',
      status: 'paid',
      amount: 220,
      invoiceNumber: 'INV-2026-1011',
      transactionRef: 'CASH-REC-1011'
    },
    liveTracking: {
      estimatedArrivalMinutes: 0,
      currentStage: 4,
      lastUpdated: 'اكتملت الزيارة'
    },
    vitalSigns: {
      bloodPressure: '142/90 mmHg',
      bloodSugar: '174 mg/dL',
      heartRate: '84 bpm',
      oxygenSaturation: '96%',
      temperature: '36.9 °C',
      clinicalNotes: 'بداية برنامج المتابعة المنزلية؛ كان هناك ارتفاع في الضغط والسكر وتم التنسيق مع الطبيب المعالج لتنظيم الجرعات الدوائية.',
      recordedAt: '2026-10-10T11:45:00Z',
      nurseName: 'سارة عبد الرحمن'
    }
  }
];

export const INITIAL_APPLICATIONS: CaregiverApplication[] = [
  {
    id: 'APP-PT-201',
    applicantRole: 'physiotherapist',
    fullName: 'د. هيثم محمود العزازي',
    phone: '01011998877',
    whatsappPhone: '01011998877',
    email: 'dr.haitham.pt@example.com',
    age: 32,
    gender: 'male',
    nationalIdNumber: '29304120102914',
    birthDate: '1993-04-12',
    governorate: 'القاهرة',
    city: 'القاهرة',
    district: 'مدينة نصر، مصر الجديدة، التجمع',
    detailedAddress: 'مدينة نصر، مكرم عبيد، عمارة 24',
    personalPhoto: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    qualification: 'postgrad',
    qualificationTitle: 'دكتوراه مهنية في العلاج الطبيعي DPT',
    institutionName: 'كلية العلاج الطبيعي - جامعة القاهرة',
    graduationYear: 2017,
    nursingSpecialty: 'تأهيل جلطات ومخ وأعصاب وإصابات ملاعب',
    licenseNumber: 'EGY-PT-2017-91024',
    ptSyndicateNumber: 'PT-SYND-22819',
    physiotherapySpecialty: 'تأهيل مخ وأعصاب وجلطات دماغية',
    portableDevicesOwned: [
      'جهاز تنبيه كهربائي ومسكن للألم (TENS / EMS)',
      'جهاز موجات فوق صوتية علاجية (Therapeutic Ultrasound)',
      'كمادات حرارية علاجية وأشعة تحت حمراء',
      'أشرطة التثبيت الحركي الطبية (Kinesiology Taping)'
    ],
    experienceYears: 7,
    departmentsWorked: ['قسم التأهيل العصبي', 'عظام ومفاصل', 'إصابات ملاعب'],
    skillsMastered: ['تطبيق التنبيه الكهربائي TENS / EMS', 'العلاج بالموجات فوق الصوتية Ultrasound', 'إعادة تأهيل المشي والتوازن الحركي', 'تمارين تحريك المفاصل'],
    specialties: ['تأهيل جلطات', 'تأهيل عمود فقري', 'تأهيل ما بعد الكسور'],
    previousWorkplaces: 'مستشفى القصر العيني التعليمي، المركز التخصصي للعلاج الطبيعي',
    trainingCourses: 'دورة التأهيل العصبي المتقدم PNF، زمالة الإصابات الرياضية',
    workType: 'home',
    shiftSystem: 'visits',
    expectedSalary: 'بالاتفاق المباشر العادل للزيارة',
    availableGovernorates: ['القاهرة', 'الجيزة'],
    availableWorkingHours: 'متفرغ للزيارات المنزلية 5 أيام أسبوعياً',
    canStayOvernight: false,
    documents: {
      licenseCardName: 'كارنيه_نقابة_العلاج_الطبيعي_ساري_2026.pdf',
      degreeCertName: 'شهادة_دكتوراه_DPT_جامعة_القاهرة.pdf',
      nationalIdName: 'بطاقة_الرقم_القومي_وجهين.jpg',
      experienceCertsName: 'شهادات_تأهيل_PNF_المعتمدة.pdf',
      criminalRecordName: 'فيش_وتشبيه_حديث.pdf',
      drugTestName: 'تحليل_مخدرات_سلبي_معتمد.pdf'
    },
    agreedToAccuracy: true,
    agreedToPrivacy: true,
    status: 'reviewing',
    notes: 'الملف قيد تدقيق رقم قيد نقابة العلاج الطبيعي وشهادة الـ DPT.',
    submittedAt: '2026-11-03T11:00:00Z'
  },
  {
    id: 'APP-TRN-302',
    applicantRole: 'assistant_trainee',
    trainingTrack: 'physiotherapy',
    fullName: 'يحيى طارق عبد الرحمن',
    phone: '01122334499',
    whatsappPhone: '01122334499',
    email: 'yahia.trainee@example.com',
    age: 22,
    gender: 'male',
    nationalIdNumber: '30208150101923',
    birthDate: '2002-08-15',
    governorate: 'الجيزة',
    city: 'الجيزة',
    district: 'الدقي، المهندسين، فيصل',
    detailedAddress: 'شارع التحرير، الدقي',
    personalPhoto: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    qualification: 'college',
    qualificationTitle: 'مساعد ومتدرب',
    institutionName: 'طالب بالفرقة الرابعة - كلية العلاج الطبيعي جامعة القاهرة',
    graduationYear: 2026,
    traineeEducationLevel: 'طالب بالفرقة الرابعة',
    trainingGoals: 'التدرب الميداني العملي على مرافقة أطباء العلاج الطبيعي في الزيارات المنزلية، وتعلم كيفية رفع المريض وسنده وتطبيق أجهزة التنبيه الكهربائي بأمان.',
    licenseNumber: 'STU-PT-CAIRO-2024-81',
    experienceYears: 0,
    departmentsWorked: ['تدريب عملي بمستشفيات الجامعة'],
    skillsMastered: ['معاونة المريض على الوقوف والمشي', 'تطبيق التنبيه الكهربائي TENS / EMS', 'تمارين المدى الحركي ROM'],
    specialties: ['مساعد دكتور علاج طبيعي', 'معاونة حركية آمنة'],
    workType: 'home',
    shiftSystem: 'visits',
    expectedSalary: 'مكافأة تدريب ميداني',
    availableGovernorates: ['الجيزة', 'القاهرة'],
    availableWorkingHours: 'متفرغ 3 أيام أسبوعياً (السبت، الإثنين، الأربعاء)',
    canStayOvernight: false,
    documents: {
      licenseCardName: 'كارنيه_الكلية_ساري_2026.jpg',
      degreeCertName: 'شهادة_إثبات_قيد_كلية_العلاج_الطبيعي.pdf',
      nationalIdName: 'بطاقة_الرقم_القومي.jpg',
      criminalRecordName: 'فيش_وتشبيه_حديث.pdf'
    },
    agreedToAccuracy: true,
    agreedToPrivacy: true,
    status: 'reviewing',
    notes: 'طالب متميز بالفرقة الرابعة، يرغب في تدريب عملي بمصاحبة د. ماجد سامي.',
    submittedAt: '2026-11-03T14:30:00Z'
  },
  {
    id: 'APP-104',
    applicantRole: 'nurse',
    fullName: 'نورهان إبراهيم الجندي',
    phone: '01099887766',
    whatsappPhone: '01099887766',
    email: 'nourhan.elgindy@example.com',
    age: 27,
    gender: 'female',
    nationalIdNumber: '29810140103482',
    birthDate: '1998-10-14',
    governorate: 'القاهرة',
    city: 'القاهرة',
    district: 'المعادي، التجمع الخامس',
    detailedAddress: 'المعادي الجديدة، شارع النصر، عمارة 14',
    personalPhoto: '/src/assets/images/nurse_avatar_female_1793095933006.jpg',
    qualification: 'college',
    qualificationTitle: 'بكالوريوس علوم التمريض',
    institutionName: 'كلية التمريض - جامعة الإسكندرية',
    graduationYear: 2020,
    nursingSpecialty: 'عناية مركزة وحالات حرجة',
    licenseNumber: 'EGY-NUR-2020-84920',
    experienceYears: 5,
    departmentsWorked: ['العناية المركزة (ICU)', 'قسم الطوارئ', 'جراحة اليوم الواحد'],
    skillsMastered: ['تركيب كانيولا صعبة', 'محاليل وريدية وتغذية وريدية', 'قسطرة بولية معقمة', 'غيار جروح وقرح فراش', 'سحب عينات دم'],
    specialties: ['عناية مركزة أطفال', 'تركيب كانيولا ومحاليل', 'غيار جروح متقدم'],
    previousWorkplaces: 'مستشفى السلام الدولي، مستشفى المعادي للقوات المسلحة',
    trainingCourses: 'شهادة BLS معتمدة من AHA، دورة مكافحة العدوى المتقدمة',
    workType: 'both',
    shiftSystem: '12',
    expectedSalary: '8500 - 10000 ج.م',
    availableGovernorates: ['القاهرة', 'الجيزة'],
    availableWorkingHours: 'شيفتات صباحية ومسائية، متفرغة 4 أيام أسبوعياً',
    canStayOvernight: false,
    documents: {
      licenseCardName: 'كارنيه_مزاولة_المهنة_ساري_2026.pdf',
      degreeCertName: 'شهادة_تخرج_كلية_التمريض_جامعة_الإسكندرية.pdf',
      nationalIdName: 'بطاقة_الرقم_القومي_وجهين.jpg',
      experienceCertsName: 'شهادات_BLS_ودورات_مكافحة_العدوى.pdf',
      criminalRecordName: 'فيش_وتشبيه_حديث_خال_من_السوابق.pdf',
      drugTestName: 'تحليل_مخدرات_معتمد_مستشفى_حكومي_سلبي.pdf'
    },
    agreedToAccuracy: true,
    agreedToPrivacy: true,
    status: 'reviewing',
    submittedAt: '2026-10-26T16:20:00Z'
  },
  {
    id: 'APP-105',
    fullName: 'بلال مصطفى النجار',
    phone: '01155443322',
    whatsappPhone: '01155443322',
    email: 'belal.elnaggar@example.com',
    age: 30,
    gender: 'male',
    nationalIdNumber: '29506180104871',
    birthDate: '1995-06-18',
    governorate: 'الجيزة',
    city: 'الجيزة',
    district: 'فيصل، الهرم، الدقي',
    detailedAddress: 'شارع الملك فيصل الرئيسي، محطة العشرين',
    personalPhoto: '/src/assets/images/nurse_avatar_male_1793095932397.jpg',
    qualification: 'institute',
    qualificationTitle: 'دبلوم المعهد الفني الصحي - شعبة رعاية وطوارئ',
    institutionName: 'المعهد الفني الصحي ببنها - شعبة رعاية وطوارئ',
    graduationYear: 2017,
    nursingSpecialty: 'طوارئ وجروح وحجامة طبية',
    licenseNumber: 'EGY-NUR-2017-31092',
    experienceYears: 7,
    departmentsWorked: ['طوارئ وحوادث', 'عناية باطنة', 'عيادات الحجامة والطب التكميلي'],
    skillsMastered: ['حجامة دموية وجافة معقمة', 'تركيب كانولا ومحاليل', 'فك سلك ودبابيس جراحية', 'حقن عضل ووريد وتحت الجلد'],
    specialties: ['حجامة وقائية وعلاجية', 'طوارئ وجروح جراحية', 'رعاية كبار سن'],
    previousWorkplaces: 'مستشفى 6 أكتوبر للتأمين الصحي، مركز النور الطبي التخصصي',
    trainingCourses: 'دبلومة الحجامة الطبية المعتمدة، دورة الإنعاش القلبي الرئوي CPR',
    workType: 'home',
    shiftSystem: 'visits',
    expectedSalary: 'حسب الزيارات (200 - 350 ج للزيارة)',
    availableGovernorates: ['الجيزة', 'القاهرة'],
    availableWorkingHours: 'جميع أيام الأسبوع من 12 ظهراً حتى 10 مساءً',
    canStayOvernight: true,
    documents: {
      licenseCardName: 'كارنيه_النقابة_ساري_وزارة_الصحة.pdf',
      degreeCertName: 'شهادة_معهد_فني_صحي.pdf',
      nationalIdName: 'صورة_البطاقة_الشخصية.jpg',
      experienceCertsName: 'دبلومة_الحجامة_الطبية_المعتمدة.pdf',
      criminalRecordName: 'صحيفة_الحالة_الجنائية_حديثة.pdf',
      drugTestName: 'شهادة_تحليل_سموم_ومخدرات_معتمدة.pdf'
    },
    agreedToAccuracy: true,
    agreedToPrivacy: true,
    status: 'approved',
    notes: 'تم فحص جميع الأصول والتحقق من صحة ترخيص مزاولة المهنة والتحليل المخبري السلبي.',
    submittedAt: '2026-10-25T11:00:00Z'
  }
];

export const INITIAL_REMINDERS: MedicationReminder[] = [
  {
    id: 'rem-1',
    patientName: 'فاطمة محمود إبراهيم',
    medicationName: 'كونكور 5 مجم (Concor 5mg)',
    dosage: 'قرص واحد صباحاً لضبط ضغط الدم',
    scheduleTimes: ['09:00 ص'],
    withFood: true,
    notes: 'يؤخذ بعد الإفطار مع قياس الضغط',
    active: true,
    history: [
      { date: '2026-10-27', time: '09:05 ص', taken: true },
      { date: '2026-10-26', time: '09:00 ص', taken: true }
    ]
  },
  {
    id: 'rem-2',
    patientName: 'فاطمة محمود إبراهيم',
    medicationName: 'جانوفيا 100 مجم (Januvia 100mg)',
    dosage: 'قرص واحد بعد الغداء للسكر',
    scheduleTimes: ['03:30 م'],
    withFood: true,
    notes: 'يمنع مضاعفة الجرعة في حال النسيان',
    active: true,
    history: [
      { date: '2026-10-26', time: '03:40 م', taken: true }
    ]
  },
  {
    id: 'rem-3',
    patientName: 'الحاج عبد المنعم',
    medicationName: 'أسبوسيد أطفال 75 مجم (Aspocid)',
    dosage: 'قرص مضغ يومياً مساءً للسيولة',
    scheduleTimes: ['09:00 م'],
    withFood: false,
    notes: 'شرب كوب ماء وفير بعده',
    active: true,
    history: [
      { date: '2026-10-26', time: '09:10 م', taken: true }
    ]
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    bookingId: 'BK-8941',
    senderRole: 'system',
    senderName: 'نظام باسانت للتمريض',
    text: 'تم قبول طلبك بنجاح من الممرضة سارة عبد الرحمن، وهي الآن في الطريق إلى موقعك المحدد.',
    timestamp: '11:15 ص'
  },
  {
    id: 'msg-2',
    bookingId: 'BK-8941',
    senderRole: 'nurse',
    senderName: 'سارة عبد الرحمن (الممرضة)',
    text: 'أهلاً بحضرتك يا فندم، أنا تحركت وفي طريقي إليكم في شارع 9 المعادي، متبقي تقريباً 8 دقائق. هل المحلول متوفر ولا أحضر معي عبوات جديدة من الصيدلية؟',
    timestamp: '11:18 ص'
  },
  {
    id: 'msg-3',
    bookingId: 'BK-8941',
    senderRole: 'patient',
    senderName: 'فاطمة محمود (المريض)',
    text: 'أهلاً بيكي يا أستاذة سارة، يا ريت تجيبي معاكي أمبولات الفيتامين ومحلول رينجر لأني مسجل في الفورم إن العلاج مش متاح.',
    timestamp: '11:20 ص'
  },
  {
    id: 'msg-4',
    bookingId: 'BK-8941',
    senderRole: 'nurse',
    senderName: 'سارة عبد الرحمن (الممرضة)',
    text: 'تمام جداً يا فندم، اشتريت المحلول وأمبولات الفيتامين معقمة من صيدلية العزبي والفاتورة معايا، وأنا في الشارع الآن.',
    timestamp: '11:22 ص'
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-101',
  fullName: 'فاطمة محمود إبراهيم',
  age: 64,
  phone: '01045678912',
  email: 'fatma.mahmoud@gmail.com',
  gender: 'female',
  birthDate: '1960-05-14',
  governorate: 'القاهرة',
  city: 'المعادي',
  password: 'Password@123',
  avatar: '',
  chronicDiseases: 'ارتفاع ضغط الدم والسكري من النوع الثاني',
  currentMedications: 'كونكور 5 مجم (صباحاً) · جانوفيا 100 مجم (بعد الغداء) · جلوكوفاج 1000 مجم',
  hasPreviousSurgeries: true,
  previousSurgeriesDetails: 'عملية قسطرة قلبية وتركيب دعامة شريانية عام 2023',
  address: 'شارع 9 المعادي، برج الياسمين، الدور الرابع، شقة 8',
  locationCoordinates: {
    lat: 29.9585,
    lng: 31.2612,
    addressName: 'المعادي، القاهرة - موقع GPS محدد بدقة (29.9585, 31.2612)'
  },
  registeredAt: '2026-10-01T10:00:00Z'
};

export const INITIAL_REGISTERED_USERS: UserProfile[] = [
  INITIAL_USER_PROFILE,
  {
    id: 'usr-102',
    fullName: 'خالد مصطفى العوضي',
    age: 42,
    phone: '01123498765',
    email: 'khaled.elawady@yahoo.com',
    gender: 'male',
    birthDate: '1982-11-20',
    governorate: 'الجيزة',
    city: 'الدقي',
    password: 'Password@123',
    avatar: '',
    chronicDiseases: 'لا يوجد أمراض مزمنة',
    currentMedications: 'فيتامين ب مركب · كبسولات أوميجا 3',
    hasPreviousSurgeries: true,
    previousSurgeriesDetails: 'منظار غضروف قطني عام 2021',
    address: 'شارع مصدق، الدقي، عمارة الأطباء، الدور الثاني',
    locationCoordinates: {
      lat: 30.0382,
      lng: 31.2057,
      addressName: 'الدقي، الجيزة - موقع GPS معتمد (30.0382, 31.2057)'
    },
    registeredAt: '2026-10-12T14:30:00Z'
  },
  {
    id: 'usr-103',
    fullName: 'عبد المنعم السعدني',
    age: 71,
    phone: '01244556677',
    email: 'abdelmonem.saadany@outlook.com',
    gender: 'male',
    birthDate: '1953-08-04',
    governorate: 'القاهرة',
    city: 'مصر الجديدة',
    password: 'Password@123',
    avatar: '',
    chronicDiseases: 'خشونة متقدمة بالفقرات وضغط دم مرتفع',
    currentMedications: 'أسبوسيد أطفال 75 مجم · كابوتين 25 مجم',
    hasPreviousSurgeries: false,
    previousSurgeriesDetails: 'لا توجد جراحات سابقة',
    address: 'شارع الثورة، مصر الجديدة، عمارة 15',
    locationCoordinates: {
      lat: 30.0890,
      lng: 31.3280,
      addressName: 'مصر الجديدة، القاهرة - إحداثيات GPS مباشرة (30.0890, 31.3280)'
    },
    registeredAt: '2026-10-15T09:15:00Z'
  }
];

// Local storage management helpers
const STORAGE_KEYS = {
  BOOKINGS: 'passant_nursing_bookings',
  CAREGIVERS: 'passant_nursing_caregivers',
  APPLICATIONS: 'passant_nursing_applications',
  REMINDERS: 'passant_nursing_reminders',
  CHAT: 'passant_nursing_chat',
  USER_PROFILE: 'passant_nursing_current_user',
  REGISTERED_USERS: 'passant_nursing_registered_users'
};

export function getStoredBookings(): BookingOrder[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!data) return INITIAL_BOOKINGS;
    const parsed: BookingOrder[] = JSON.parse(data);
    return parsed.map(b => ({
      ...b,
      orderNumber: b.orderNumber || b.id.replace('BK-', 'ORD-2026-'),
      adminStatus: b.adminStatus || (b.status === 'completed' ? 'مكتمل' : b.status === 'on_the_way' ? 'تم تعيين ممرض' : 'جديد'),
      timingChoice: b.timingChoice || (b.isUrgent ? 'مستعجل' : 'تحديد معاد'),
      visitDate: b.visitDate || b.scheduledDate || '2026-10-27',
      governorate: b.governorate || b.patient?.governorate || 'القاهرة',
      detailedAddress: b.detailedAddress || b.patient?.address || '',
      hasChronicDiseasesAnswer: b.hasChronicDiseasesAnswer || b.patient?.chronicDiseases || 'لا يوجد',
      currentMedicationsAnswer: b.currentMedicationsAnswer || b.patient?.currentMedications || 'لا يتناول أدوية',
      allergiesOrForbiddenAnswer: b.allergiesOrForbiddenAnswer || b.patient?.forbiddenMedications || 'لا يوجد',
      isCuppingOrder: b.isCuppingOrder ?? (b.category === 'hijama'),
      cuppingDetails: b.cuppingDetails,
      medicationAvailableAtHome: b.medicationAvailableAtHome ?? b.patient?.medicationAvailable ?? true,
      caregiverId: b.caregiverId || 'nurse-1',
      caregiverName: b.caregiverName || 'سارة عبد الرحمن فؤاد',
      caregiverAvatar: b.caregiverAvatar || '/src/assets/images/nurse_avatar_female_1793095933006.jpg',
      caregiverPhone: b.caregiverPhone || '01012345678'
    }));
  } catch {
    return INITIAL_BOOKINGS;
  }
}

export function saveBookings(bookings: BookingOrder[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredCaregivers(): Caregiver[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CAREGIVERS);
    const list: Caregiver[] = data ? JSON.parse(data) : INITIAL_CAREGIVERS;
    return list.map(c => {
      const initialMatch = INITIAL_CAREGIVERS.find(ic => ic.id === c.id);
      return {
        ...c,
        institution: c.institution.replace(/\s*\(دفعة\s*\d+\)/g, ''),
        licenseNumber: c.licenseNumber ? c.licenseNumber.replace(/^ترخيص مزاولة مهنة رقم:\s*/, 'EGY-NUR-') : '',
        supervisorEvaluation: c.supervisorEvaluation || initialMatch?.supervisorEvaluation || {
          rating: 4.9,
          tier: 'فئة أ (أداء استثنائي فائق الجودة)' as const,
          executionQualityScore: 98,
          punctualityScore: c.punctualityScore || 98,
          hygieneAndSterilizationScore: 99,
          supervisorNotes: 'أداء ممتاز والتزام تام بمعايير السلامة ومكافحة العدوى وجودة تنفيذ الزيارات المكتملة.',
          evaluatedBy: 'الإشراف الطبي المركزي',
          evaluatedAt: '2026-10-25'
        }
      };
    });
  } catch {
    return INITIAL_CAREGIVERS;
  }
}

export function saveCaregivers(caregivers: Caregiver[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CAREGIVERS, JSON.stringify(caregivers));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredApplications(): CaregiverApplication[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return data ? JSON.parse(data) : INITIAL_APPLICATIONS;
  } catch {
    return INITIAL_APPLICATIONS;
  }
}

export function saveApplications(apps: CaregiverApplication[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredReminders(): MedicationReminder[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    return data ? JSON.parse(data) : INITIAL_REMINDERS;
  } catch {
    return INITIAL_REMINDERS;
  }
}

export function saveReminders(reminders: MedicationReminder[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredChat(bookingId: string): ChatMessage[] {
  try {
    const data = localStorage.getItem(`${STORAGE_KEYS.CHAT}_${bookingId}`);
    return data ? JSON.parse(data) : INITIAL_CHAT_MESSAGES.filter(m => m.bookingId === bookingId);
  } catch {
    return INITIAL_CHAT_MESSAGES.filter(m => m.bookingId === bookingId);
  }
}

export function saveChat(bookingId: string, messages: ChatMessage[]) {
  try {
    localStorage.setItem(`${STORAGE_KEYS.CHAT}_${bookingId}`, JSON.stringify(messages));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredUserProfile(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : INITIAL_USER_PROFILE;
  } catch {
    return INITIAL_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredRegisteredUsers(): UserProfile[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    return data ? JSON.parse(data) : INITIAL_REGISTERED_USERS;
  } catch {
    return INITIAL_REGISTERED_USERS;
  }
}

export function saveRegisteredUsers(users: UserProfile[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
  } catch (e) {
    console.error(e);
  }
}

