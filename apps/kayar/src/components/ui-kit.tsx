import { ReactNode } from 'react';
import { LucideIcon, LogIn } from 'lucide-react';
import { useAuth, loginWithRedirect } from 'zitejs/auth';
import { Button } from '@project/components/ui/button';
import { Skeleton } from '@project/components/ui/skeleton';

export function SectionTitle({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-extrabold md:text-2xl">{title}</h2>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Empty({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="glass flex flex-col items-center rounded-2xl px-6 py-10 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-7 w-7" /></div>
      <div className="font-bold">{title}</div>
      {text && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function CardsSkeleton({ n = 4 }: { n?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {Array.from({ length: n }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
    </div>
  );
}

export function RequireAuth({ children, title }: { children: ReactNode; title: string }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <CardsSkeleton />;
  if (!user)
    return (
      <Empty icon={LogIn} title={title} text="برای استفاده از این بخش وارد حساب کایار شوید. ورود و ثبت‌نام فقط با ایمیل انجام می‌شود."
        action={<Button className="rounded-full px-8 font-bold" onClick={() => loginWithRedirect()}>ورود / ثبت‌نام</Button>} />
    );
  return <>{children}</>;
}

export function PageHeader({ title, accent, sub }: { title: string; accent?: string; sub?: string }) {
  return (
    <div className="mb-6 pt-2">
      <h1 className="text-3xl font-black md:text-4xl">{title} {accent && <span className="text-primary glow-text">{accent}</span>}</h1>
      {sub && <p className="mt-2 text-muted-foreground">{sub}</p>}
    </div>
  );
}
