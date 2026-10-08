import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Screen, Lime, Field, Chip, inputCls } from '../kit';
import { setSession, useSession } from '../store';
import JalaliPicker from '../components/JalaliPicker';
import WelcomeModal from '../components/WelcomeModal';
import Avatar from '../components/Avatar';

const GOALS = ['کاهش وزن', 'افزایش عضله', 'آمادگی جسمانی', 'سلامت و انرژی'];

export default function CompleteProfile() {
  const s = useSession();
  const nav = useNavigate();
  const editing = !!s.name;
  const [name, setName] = useState(s.name ?? '');
  const [gender, setGender] = useState(s.gender);
  const [birth, setBirth] = useState(s.birth);
  const [goals, setGoals] = useState<string[]>(s.goals ?? []);
  const [touched, setTouched] = useState(false);
  const [welcome, setWelcome] = useState(false);
  if (!s.verified) return <Navigate to="/app/login" replace />;

  const errors = {
    name: name.trim().length < 3 ? 'نام و نام خانوادگی را کامل وارد کنید' : '',
    gender: !gender ? 'جنسیت را انتخاب کنید' : '',
    goals: !goals.length ? 'حداقل یک هدف انتخاب کنید' : '',
  };
  const ok = !errors.name && !errors.gender && !errors.goals;
  const toggle = (g: string) => setGoals((x) => (x.includes(g) ? x.filter((y) => y !== g) : [...x, g]));
  const save = () => {
    setTouched(true);
    if (!ok) return;
    if (editing) { setSession({ name: name.trim(), gender, birth, goals }); nav('/app/profile', { replace: true }); return; }
    setWelcome(true);
  };
  const finish = () => { setSession({ name: name.trim(), gender, birth, goals }); nav('/app/home', { replace: true }); };

  return (
    <Screen title={editing ? 'ویرایش پروفایل' : 'تکمیل پروفایل اولیه'} back={editing ? '/app/profile' : undefined}>
      <div className="mb-6 flex items-center gap-4 rounded-3xl border border-primary/20 bg-primary/[0.05] p-4">
        <Avatar gender={gender} className="h-16 w-16 border-2 border-primary/60" />
        <div className="text-sm"><div className="font-black">{name.trim() || 'ورزشکار کایار'}</div><div className="text-xs text-muted-foreground">چند قدم تا شروع ماجراجویی‌ات</div></div>
      </div>
      <div className="space-y-6">
        <Field label="نام و نام خانوادگی" error={touched ? errors.name : ''}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً علی محمدی" className={inputCls} />
        </Field>
        <Field label="جنسیت" error={touched ? errors.gender : ''}>
          <div className="grid grid-cols-2 gap-3">
            <Chip active={gender === 'male'} onClick={() => setGender('male')}>مرد</Chip>
            <Chip active={gender === 'female'} onClick={() => setGender('female')}>زن</Chip>
          </div>
        </Field>
        <Field label="تاریخ تولد (اختیاری)"><JalaliPicker value={birth} onChange={setBirth} /></Field>
        <Field label="هدف اصلی شما" error={touched ? errors.goals : ''}>
          <div className="grid grid-cols-2 gap-3">{GOALS.map((g) => <Chip key={g} active={goals.includes(g)} onClick={() => toggle(g)}>{g}</Chip>)}</div>
        </Field>
      </div>
      <div className="mt-auto pt-8"><Lime onClick={save} disabled={touched && !ok}>{editing ? 'ذخیره تغییرات' : 'ثبت و ادامه'}</Lime></div>
      <WelcomeModal open={welcome} name={name} gender={gender} onClose={finish} />
    </Screen>
  );
}
