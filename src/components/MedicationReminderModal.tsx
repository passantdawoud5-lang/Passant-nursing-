import React, { useState } from 'react';
import { MedicationReminder } from '../types';
import { 
  X, 
  Pill, 
  Clock, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Calendar,
  Utensils
} from 'lucide-react';

interface MedicationReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: MedicationReminder[];
  onAddReminder: (reminder: MedicationReminder) => void;
  onMarkTaken: (id: string) => void;
}

export const MedicationReminderModal: React.FC<MedicationReminderModalProps> = ({
  isOpen,
  onClose,
  reminders,
  onAddReminder,
  onMarkTaken
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [patientName, setPatientName] = useState('فاطمة محمود إبراهيم');
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('09:00 ص');
  const [withFood, setWithFood] = useState(true);
  const [notes, setNotes] = useState('');
  const [soundAlertTriggered, setSoundAlertTriggered] = useState(false);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicationName.trim() || !dosage.trim()) return;

    const newRem: MedicationReminder = {
      id: `rem-${Date.now()}`,
      patientName: patientName.trim(),
      medicationName: medicationName.trim(),
      dosage: dosage.trim(),
      scheduleTimes: [time],
      withFood,
      notes: notes.trim() || 'يرجى الالتزام بالموعد المحدد',
      active: true,
      history: []
    };

    onAddReminder(newRem);
    setShowAddForm(false);
    setMedicationName('');
    setDosage('');
  };

  const handleTestChime = () => {
    setSoundAlertTriggered(true);
    setTimeout(() => {
      setSoundAlertTriggered(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-right shadow-2xl border border-slate-200 my-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-amber-700 block flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span>نظام التنبيهات الدورية لمواعيد الأدوية</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              جدول ومواعيد علاج المريض
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Test Alert Simulator Notification */}
        {soundAlertTriggered && (
          <div className="p-4 bg-amber-500 text-white rounded-2xl shadow-lg flex items-center justify-between animate-bounce">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 animate-spin" />
              <div>
                <h4 className="text-sm font-bold">تنبيه فوري: حان موعد تناول جرعة الدواء!</h4>
                <p className="text-xs text-amber-100">كونكور 5 مجم (قرص واحد بعد الإفطار) - لا تنسَ قياس ضغط الدم.</p>
              </div>
            </div>
            <button
              onClick={() => setSoundAlertTriggered(false)}
              className="px-3 py-1 bg-white text-amber-950 rounded-lg text-xs font-bold"
            >
              تم التناول
            </button>
          </div>
        )}

        {/* Action strip */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'إخفاء نموذج الإضافة' : 'إضافة دواء وجرعة جديدة'}</span>
          </button>

          <button
            onClick={handleTestChime}
            className="px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span>تجربة صوت التنبيه الدوري</span>
          </button>
        </div>

        {/* Add Reminder Form */}
        {showAddForm && (
          <form onSubmit={handleCreate} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-800">بيانات التنبيه الدوائي الجديد:</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  اسم الدواء أو الحقنة
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: جلوكوفاج 1000 مجم"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  الجرعة وطريقة الاستخدام
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: قرص واحد مرتين يومياً"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  موعد التنبيه
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                >
                  <option value="08:00 ص">08:00 ص (الصباح)</option>
                  <option value="09:00 ص">09:00 ص (بعد الإفطار)</option>
                  <option value="02:00 م">02:00 م (الظهيرة)</option>
                  <option value="04:00 م">04:00 م (بعد الغداء)</option>
                  <option value="09:00 م">09:00 م (المساء)</option>
                  <option value="11:00 م">11:00 م (قبل النوم)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  تعليمات الطعام
                </label>
                <select
                  value={withFood ? 'yes' : 'no'}
                  onChange={(e) => setWithFood(e.target.value === 'yes')}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                >
                  <option value="yes">بعد الأكل مباشرة</option>
                  <option value="no">على معدة فارغة / قبل الأكل</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ملاحظات إضافية
                </label>
                <input
                  type="text"
                  placeholder="مثال: شرب كوب ماء كامل"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-700"
              >
                حفظ التنبيه وتفعيله
              </button>
            </div>
          </form>
        )}

        {/* Reminders List */}
        <div className="space-y-3">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-teal-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{rem.medicationName}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{rem.dosage}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-mono font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {rem.scheduleTimes.join(' · ')}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5 text-slate-400" />
                      {rem.withFood ? 'بعد الأكل' : 'قبل الأكل'}
                    </span>
                    {rem.notes && (
                      <>
                        <span>·</span>
                        <span className="text-teal-800">{rem.notes}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Mark as taken action */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onMarkTaken(rem.id)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم أخذ الجرعة الآن</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 text-center text-xs text-slate-400">
          تطبيق باسانت يرسل إشعارات دورية متزامنة مع ساعات تناول الدواء لضمان انتظام الجرعات.
        </div>

      </div>
    </div>
  );
};
