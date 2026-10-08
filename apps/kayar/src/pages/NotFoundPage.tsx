import { Link } from 'react-router-dom';
import { Button } from '@project/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <div className="text-8xl font-black text-primary glow-text">۴۰۴</div>
      <h1 className="mt-4 text-2xl font-bold">صفحه پیدا نشد!</h1>
      <p className="mt-2 text-muted-foreground">احتمالاً آدرس را اشتباه وارد کرده‌اید.</p>
      <Button asChild className="mt-6 rounded-full px-8"><Link to="/">بازگشت به خانه</Link></Button>
    </div>
  );
}
