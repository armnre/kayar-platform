import { Zap, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@project/components/ui/tabs';
import { Skeleton } from '@project/components/ui/skeleton';
import { useMe } from '../lib/data';
import { PageHeader, RequireAuth } from '../components/ui-kit';
import BodyProfileForm from '../components/bodyyar/BodyProfileForm';
import Chat from '../components/bodyyar/Chat';
import Plans from '../components/bodyyar/Plans';
import Progress from '../components/bodyyar/Progress';

export default function BodyYarPage() {
  return (
    <div>
      <PageHeader title="بدن‌" accent="یار" sub="دستیار هوشمند تناسب اندام تو — برنامه شخصی، گفتگو و پیگیری پیشرفت." />
      <RequireAuth title="برای شروع با بدن‌یار وارد شو"><Inner /></RequireAuth>
    </div>
  );
}

function Inner() {
  const { data, isLoading } = useMe();
  if (isLoading || !data) return <Skeleton className="h-96 rounded-3xl" />;
  if (!data.profile.onboarded)
    return (
      <div className="mx-auto max-w-xl">
        <div className="glass mb-4 flex items-center gap-3 rounded-2xl p-4"><Zap className="h-6 w-6 text-primary" /><div className="text-sm">برای ساخت برنامه شخصی، اول پروفایل بدنی‌ات را کامل کن.</div></div>
        <BodyProfileForm profile={data.profile} wizard />
      </div>
    );
  return (
    <div>
      {!data.aiReady && (
        <div className="mb-4 flex gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-accent" />
          سرویس هوش مصنوعی هنوز متصل نشده است. ثبت فعالیت و پیگیری پیشرفت فعال است؛ گفتگو و تولید برنامه پس از اتصال فعال می‌شوند.
        </div>
      )}
      <Tabs defaultValue="chat" dir="rtl">
        <TabsList className="mb-5 grid h-12 w-full grid-cols-4 rounded-2xl">
          <TabsTrigger value="chat" className="rounded-xl">گفتگو</TabsTrigger>
          <TabsTrigger value="plans" className="rounded-xl">برنامه‌ها</TabsTrigger>
          <TabsTrigger value="progress" className="rounded-xl">پیشرفت</TabsTrigger>
          <TabsTrigger value="profile" className="rounded-xl">پروفایل بدنی</TabsTrigger>
        </TabsList>
        <TabsContent value="chat"><Chat messages={data.messages} aiReady={data.aiReady} /></TabsContent>
        <TabsContent value="plans"><Plans plans={data.plans} aiReady={data.aiReady} /></TabsContent>
        <TabsContent value="progress"><Progress activity={data.activity} /></TabsContent>
        <TabsContent value="profile"><div className="mx-auto max-w-xl"><BodyProfileForm profile={data.profile} /></div></TabsContent>
      </Tabs>
    </div>
  );
}
