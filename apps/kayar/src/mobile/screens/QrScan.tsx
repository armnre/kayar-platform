import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { BarcodeDetector } from 'barcode-detector/pure';
import { motion } from 'framer-motion';
import { Flashlight, HelpCircle, CameraOff } from 'lucide-react';
import { toast } from 'sonner';
import { Screen, Lime } from '../kit';
import { setSession } from '../store';

export default function QrScan() {
  const nav = useNavigate();
  const cam = useRef<Webcam>(null);
  const [denied, setDenied] = useState(false);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    const det = new BarcodeDetector({ formats: ['qr_code'] });
    let stop = false;
    const tick = async () => {
      const v = cam.current?.video;
      if (v && v.readyState >= 2) {
        try {
          const r = await det.detect(v);
          if (r[0]?.rawValue) { stop = true; activate(r[0].rawValue); return; }
        } catch { /* keep scanning */ }
      }
      if (!stop) setTimeout(tick, 250);
    };
    tick();
    return () => { stop = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const activate = (_code: string) => {
    navigator.vibrate?.(80);
    setSession({ bodyyarActive: true });
    toast.success('لباس شناسایی شد؛ بدن‌یار فعال شد ⚡');
    nav('/app/bodyyar/profile', { replace: true });
  };

  return (
    <Screen title="کد QR را اسکن کنید" back="/app/bodyyar">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-black">
        {denied ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-sm text-muted-foreground"><CameraOff className="h-10 w-10" />دسترسی به دوربین داده نشد. از «وارد کردن کد» استفاده کنید.</div>
        ) : (
          <Webcam ref={cam} audio={false} onUserMediaError={() => setDenied(true)} videoConstraints={{ facingMode: 'environment' }} className="h-full w-full object-cover" />
        )}
        <div className="pointer-events-none absolute inset-10">
          {['top-0 right-0 border-t-4 border-r-4 rounded-tr-3xl', 'top-0 left-0 border-t-4 border-l-4 rounded-tl-3xl', 'bottom-0 right-0 border-b-4 border-r-4 rounded-br-3xl', 'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-3xl'].map((c) => (
            <span key={c} className={`absolute h-12 w-12 border-primary drop-shadow-[0_0_8px_hsl(var(--primary))] ${c}`} />
          ))}
          {!denied && <motion.span animate={{ top: ['5%', '95%', '5%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-x-4 h-0.5 bg-primary shadow-[0_0_16px_4px_hsl(var(--primary)/0.6)]" />}
        </div>
      </div>
      <p className="mt-5 text-center text-sm text-muted-foreground">کد روی برچسب کایوش را در قاب قرار دهید.</p>
      {help && <p className="mt-3 rounded-2xl bg-white/5 p-3 text-center text-xs leading-6 text-muted-foreground">برچسب QR داخل یقه یا درز کناری لباس کایوش قرار دارد. نور کافی داشته باشید و گوشی را ثابت نگه دارید.</p>}
      <div className="mt-6 flex justify-center gap-6">
        <button onClick={() => setHelp(!help)} className="flex flex-col items-center gap-1 text-xs text-muted-foreground"><span className="grid h-12 w-12 place-items-center rounded-full border border-white/10"><HelpCircle className="h-5 w-5 text-primary" /></span>راهنما</button>
        <button onClick={() => toast('چراغ‌قوه در مرورگر شما پشتیبانی نمی‌شود.')} className="flex flex-col items-center gap-1 text-xs text-muted-foreground"><span className="grid h-12 w-12 place-items-center rounded-full border border-white/10"><Flashlight className="h-5 w-5 text-primary" /></span>چراغ</button>
      </div>
      <div className="mt-auto pt-6"><Lime className="bg-white/5 text-foreground shadow-none" onClick={() => nav('/app/bodyyar/activate')}>وارد کردن دستی کد</Lime></div>
    </Screen>
  );
}
