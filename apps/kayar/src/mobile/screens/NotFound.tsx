import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lime } from '../kit';

export default function NotFound() {
  const nav = useNavigate();
  return (
    <div className="flex min-h-[80svh] flex-col items-center justify-center px-6 text-center">
      <motion.img animate={{ y: [0, -16, 0], rotate: [-4, 2, -4] }} transition={{ duration: 4, repeat: Infinity }}
        src="https://images.fillout.com/886713/3qilvz8bzw/generated-images/4s2GruatwoF8vZpsF5jskK/img_aimctWPDZQFZvcMJ.jpg" alt="" className="w-64 rounded-3xl mix-blend-lighten" />
      <div className="mt-2 text-7xl font-black text-primary/20">۴۰۴</div>
      <h1 className="-mt-4 text-2xl font-black">صفحه پیدا نشد!</h1>
      <p className="mt-3 max-w-xs text-sm leading-7 text-muted-foreground">احتمالاً آدرس را اشتباه وارد کرده‌اید، یا صفحه مورد نظر دیگر وجود ندارد.</p>
      <Lime onClick={() => nav('/app')} className="mt-8 max-w-xs">بازگشت به صفحه اصلی</Lime>
    </div>
  );
}
