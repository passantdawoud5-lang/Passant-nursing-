# دليل استخراج ملف APK لتطبيق Passant Healthcare

تم تجهيز المشروع بالملفات اللازمة لتحويل الموقع إلى تطبيق أندرويد (`.apk`) بطريقتين عمليتين:

---

## الطريقة 1: بناء ملف APK تلقائياً عبر GitHub Actions (بدون برامج على جهازك)
1. قومي برفع ملفات المشروع إلى مستودع (Repository) على **GitHub** (يمكن استخدام خيار Export / Push to GitHub من أعلى الصفحة).
2. تم إعداد ملف **`.github/workflows/build-apk.yml`** وملف **`capacitor.config.json`** مسبقاً في المشروع.
3. بمجرد الرفع على فرع `main` (أو تشغيل الـ Workflow يدوياً من تبويب **Actions**)، سيقوم GitHub تلقائياً ببناء التطبيق وإنشاء ملف APK.
4. ادخلي على تبويب **Actions** > آخر عملية مكتملة > **Artifacts** وحمّلي **`Passant-Healthcare-APK`** (يحتوي على ملف `app-debug.apk` المضغوط والجاهز للتثبيت).

---

## الطريقة 2: عبر PWABuilder (من رابط الموقع المنشور)
تم تجهيز التطبيق ليدعم **PWA** بالكامل (`vite-plugin-pwa`, أيقونات PNG، و `apple-touch-icon.png`):
1. انشري الموقع على استضافة مجانية مثل **Vercel** أو **Netlify** (أو استخدمي رابط النشر العام).
2. افتحي موقع **[pwabuilder.com](https://www.pwabuilder.com)** وضعي رابط الموقع.
3. اختاري **Package for Stores > Android** لتحميل ملف الـ **APK** (أو حزمة `.aab` لمتجر Google Play) مباشرة.

---

## الطريقة 3: البناء محلياً عبر Android Studio
```bash
npm install
npm run build
npm install --no-save @capacitor/core @capacitor/cli @capacitor/android
npx cap add android
npx cap sync android
npx cap open android
```
ثم من **Android Studio** اختاري: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
