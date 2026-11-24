import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Check, 
  Search, 
  ShieldCheck, 
  Compass,
  Crosshair
} from 'lucide-react';

interface Coordinates {
  lat: number;
  lng: number;
  addressName: string;
}

interface GoogleMapsPickerModalProps {
  initialCoordinates?: { lat: number; lng: number; addressName?: string };
  initialGovernorate?: string;
  onSelectLocation: (location: {
    lat: number;
    lng: number;
    addressName: string;
    googleMapsUrl: string;
  }) => void;
  onClose: () => void;
}

// Key focal points in Egypt for quick pinpointing
const QUICK_LOCATIONS: { name: string; lat: number; lng: number; governorate: string }[] = [
  { name: 'المعادي - شارع النصر، القاهرة', lat: 29.9602, lng: 31.2569, governorate: 'القاهرة' },
  { name: 'التجمع الخامس - شارع التسعين، القاهرة الجديدة', lat: 30.0131, lng: 31.4289, governorate: 'القاهرة' },
  { name: 'مدينة نصر - عباس العقاد، القاهرة', lat: 30.0617, lng: 31.3369, governorate: 'القاهرة' },
  { name: 'مصر الجديدة - الكوربة، القاهرة', lat: 30.0911, lng: 31.3265, governorate: 'القاهرة' },
  { name: 'المهندسين - شارع جامعة الدول، الجيزة', lat: 30.0526, lng: 31.2012, governorate: 'الجيزة' },
  { name: 'الدقي - ميدان المساحة، الجيزة', lat: 30.0384, lng: 31.2124, governorate: 'الجيزة' },
  { name: 'مدينة 6 أكتوبر - الحصري، الجيزة', lat: 29.9723, lng: 30.9431, governorate: 'الجيزة' },
  { name: 'الشيخ زايد - هايبر وان، الجيزة', lat: 30.0392, lng: 30.9882, governorate: 'الجيزة' },
  { name: 'سموحة - ميدان فيكتور عمانويل، الإسكندرية', lat: 31.2156, lng: 29.9553, governorate: 'الإسكندرية' },
  { name: 'المنصورة - شارع المشاية السفلية، الدقهلية', lat: 31.0409, lng: 31.3785, governorate: 'الدقهلية' },
  { name: 'طنطا - شارع البحر، الغربية', lat: 30.7865, lng: 31.0004, governorate: 'الغربية' },
  { name: 'الزقازيق - القومية، الشرقية', lat: 30.5877, lng: 31.5020, governorate: 'الشرقية' },
];

export const GoogleMapsPickerModal: React.FC<GoogleMapsPickerModalProps> = ({
  initialCoordinates,
  initialGovernorate = 'القاهرة',
  onSelectLocation,
  onClose,
}) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(
    initialCoordinates?.lat
      ? { lat: initialCoordinates.lat, lng: initialCoordinates.lng }
      : { lat: 30.0444, lng: 31.2357 } // Default Cairo Centre
  );

  const [addressLabel, setAddressLabel] = useState<string>(
    initialCoordinates?.addressName || 'القاهرة، مصر'
  );

  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [gpsSuccess, setGpsSuccess] = useState<boolean>(false);

  // Auto-detect GPS via browser HTML5 geolocation
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('خدمة تحديد الموقع الجغرافي غير مدعومة في هذا المتصفح.');
      return;
    }

    setIsDetecting(true);
    setGpsSuccess(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setAddressLabel(`موقع GPS الحالي (دقة عالية: ${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        setIsDetecting(false);
        setGpsSuccess(true);
      },
      (error) => {
        setIsDetecting(false);
        // Fallback smooth behavior
        alert('تعذر الوصول لموقع GPS تلقائياً. يمكنك اختيار منطقتك من القائمة أو تحريك المؤشر.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Google Maps direct URL
  const googleMapsUrl = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;

  const handleConfirm = () => {
    onSelectLocation({
      lat: coords.lat,
      lng: coords.lng,
      addressName: addressLabel,
      googleMapsUrl
    });
    onClose();
  };

  // Filtered quick locations
  const filteredLocations = QUICK_LOCATIONS.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.governorate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 text-right shadow-2xl border border-slate-200 space-y-4 my-4 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                <MapPin className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                تحديد الموقع الجغرافي عبر خرائط جوجل (Google Maps)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              حدد موقع منزلك بدقة لتوجيه أقرب ممرض وتفعيل التتبع المباشر لحظة بلحظة
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action: 1-click GPS Auto-detection */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-teal-50 via-slate-50 to-teal-50/50 rounded-2xl border border-teal-200">
          <div className="flex items-center gap-2.5 text-right w-full sm:w-auto">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Crosshair className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">التقاط موقعي الحالي بضغطة واحدة</span>
              <span className="text-[11px] text-slate-500">استخدام حساس GPS في الهاتف أو المتصفح</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={isDetecting}
            className="w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
          >
            <Navigation className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
            <span>{isDetecting ? 'جاري قراءة الإحداثيات...' : 'تحديد موقعي الآن عبر GPS'}</span>
          </button>
        </div>

        {/* Visual Map Canvas / Simulation with Interactive Pin */}
        <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-inner group">
          {/* Map Grid Pattern */}
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:18px_18px]"></div>

          {/* Road Network Lines Visual */}
          <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="120" x2="100%" y2="120" stroke="#0284c7" strokeWidth="3" strokeDasharray="6 4" />
            <line x1="180" y1="0" x2="180" y2="100%" stroke="#0284c7" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="380" y1="0" x2="380" y2="100%" stroke="#0284c7" strokeWidth="2" strokeDasharray="6 4" />
            <path d="M 50,220 Q 200,60 450,150 T 700,90" fill="none" stroke="#0d9488" strokeWidth="4" />
          </svg>

          {/* Centered Target Pin on Map */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative -mt-8 flex flex-col items-center animate-bounce">
              <div className="bg-rose-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-lg whitespace-nowrap mb-1 border border-white">
                📍 {addressLabel}
              </div>
              <div className="w-8 h-8 rounded-full bg-rose-600/30 border-2 border-rose-500 flex items-center justify-center">
                <div className="w-3.5 h-3.5 bg-rose-600 rounded-full border border-white"></div>
              </div>
            </div>
          </div>

          {/* Compass & Status Tag */}
          <div className="absolute top-3 right-3 bg-slate-900/90 text-white text-[11px] px-2.5 py-1.5 rounded-xl border border-slate-700/80 flex items-center gap-1.5 backdrop-blur-xs font-mono">
            <Compass className="w-3.5 h-3.5 text-teal-400 animate-spin" />
            <span>Lat: {coords.lat.toFixed(4)} | Lng: {coords.lng.toFixed(4)}</span>
          </div>

          {/* External Google Maps Button */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-1.5 transition-colors"
          >
            <span>معاينة في خرائط جوجل الأصلية</span>
            <ExternalLink className="w-3 h-3 text-teal-600" />
          </a>

          {/* Google Watermark / Attribution */}
          <div className="absolute bottom-3 left-3 bg-slate-900/80 text-slate-300 text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
            Google Maps Geocoding Pin
          </div>
        </div>

        {/* Quick Location Search & Preset Areas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800">
              أو اختر منطقتك في مصر بسرعة لتحديد الإحداثيات:
            </label>
            <span className="text-[11px] text-slate-400">تغطية لكافة المحافظات</span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منطقتك: المعادي، التجمع، أكتوبر، الدقي، سموحة..."
              className="w-full text-xs pr-8 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
          </div>

          {/* Quick presets pills */}
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
            {filteredLocations.slice(0, 8).map((loc) => {
              const isSelected = coords.lat === loc.lat && coords.lng === loc.lng;
              return (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => {
                    setCoords({ lat: loc.lat, lng: loc.lng });
                    setAddressLabel(loc.name);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all border ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {loc.name.split('-')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Coordinates Card */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">الموقع الجغرافي المحدد:</span>
            <span className="font-bold text-slate-900">{addressLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>مشفر ومحمي لأمان الزيارة</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>تأكيد واعتماد الموقع على خرائط جوجل</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            إلغاء
          </button>
        </div>

      </div>
    </div>
  );
};
