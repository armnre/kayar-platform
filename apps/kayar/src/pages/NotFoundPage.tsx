import { Link } from 'react-router-dom';
import { Button } from '@project/components/ui/button';

export default function NotFoundPage() {
  return (
    <div dir="rtl" className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="text-8xl font-black text-primary glow-text">۴۰۴</div>
      <h1 className="mt-4 text-2xl font-bold">صفحه پیدا نشد!</h1>
      <p className="mt-2 text-muted-foreground">احتمالاً آدرس را اشتباه وارد کرده‌اید.</p>
      <div className="mt-6 flex gap-3">
        <Button asChild className="rounded-full px-8"><Link to="/app">ورود به اپ</Link></Button>
        <Button asChild variant="outline" className="rounded-full px-8"><Link to="/">صفحه اصلی</Link></Button>
      </div>
    </div>
  );
}
