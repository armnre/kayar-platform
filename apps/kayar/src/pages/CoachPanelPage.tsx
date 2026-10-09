import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BadgeCheck, LayoutDashboard, UserCog, Package, CalendarClock, Inbox, Users, MessagesSquare, AlertTriangle } from 'lucide-react';
import { getCoachPanel } from 'zitejs/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@project/components/ui/tabs';
import { Button } from '@project/components/ui/button';
import { Badge } from '@project/components/ui/badge';
import { Skeleton } from '@project/components/ui/skeleton';
import { Empty } from '../components/ui-kit';
import { Panel, STATUS_INFO } from '../lib/coach';
import { fa } from '../lib/data';
import { useConversations } from '../lib/chat';
import PanelOverview from '../components/coach/PanelOverview';
import PanelProfile from '../components/coach/PanelProfile';
import PanelPlans from '../components/coach/PanelPlans';
import PanelSchedule from '../components/coach/PanelSchedule';
import PanelRequests from '../components/coach/PanelRequests';
import PanelClients from '../components/coach/PanelClients';

export const useCoachPanel = () => useQuery({ queryKey: ['coachPanel'], queryFn: async () => (await getCoachPanel({})) as Panel | { coach: null } });

export default function CoachPanelPage() {
  return <Inner />;
}

function Inner() {
  const { data, isLoading, isError, refetch } = useCoachPanel();
  const conv = useConversations();
  if (isLoading) return <Skeleton className="h-[28rem] rounded-3xl" />;
  if (isError || !data) return <Empty icon={AlertTriangle} title="بارگذاری پنل ناموفق بود" action={<Button variant="outline" onClick={() => refetch()}>تلاش دوباره</Button>} />;
  if (!data.coach) return <Empty icon={UserCog} title="هنوز مربی کایار نیستی" text="با ثبت درخواست و تأیید ادمین، پنل مربی برایت فعال می‌شود." action={<Button asChild className="rounded-full px-8"><Link to="/coach/apply">درخواست مربیگری</Link></Button>} />;
  const p = data as Panel;
  if (p.coach.status !== 'تایید شده') {
    const s = STATUS_INFO[p.coach.status] ?? STATUS_INFO['در انتظار تایید'];
    return (
      <div className="glass mx-auto max-w-xl rounded-3xl p-8 text-center">
        <BadgeCheck className="mx-auto h-12 w-12 text-primary" />
        <Badge className={`mt-4 rounded-full border-0 ${s.tone}`}>{s.label}</Badge>
        <p className="mt-3 text-muted-foreground">{s.text}</p>
        {p.coach.adminNotes && <div className="mt-4 rounded-2xl bg-secondary p-4 text-right text-sm"><b>توضیح ادمین:</b> {p.coach.adminNotes}</div>}
        {(p.coach.status === 'نیاز به اصلاح' || p.coach.status === 'رد شده') && <Button asChild className="mt-5 rounded-full px-8"><Link to="/coach/apply">ویرایش و ارسال مجدد</Link></Button>}
      </div>
    );
  }
  const unread = (conv.data?.conversations ?? []).filter((c) => c.role === 'coach').reduce((a, c) => a + c.unread, 0);
  const tabs = [
    { v: 'overview', l: 'نمای کلی', i: LayoutDashboard }, { v: 'requests', l: 'رزروها', i: Inbox, n: p.stats.pending },
    { v: 'clients', l: 'شاگردان', i: Users }, { v: 'plans', l: 'خدمات', i: Package },
    { v: 'schedule', l: 'زمان‌بندی', i: CalendarClock }, { v: 'profile', l: 'پروفایل', i: UserCog },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-black md:text-3xl">پنل مربی</h1><p className="text-sm text-muted-foreground">{p.coach.name} · {p.coach.category || p.coach.title}</p></div>
        <Button asChild variant="outline" className="rounded-full"><Link to="/messages"><MessagesSquare className="ml-2 h-4 w-4" />پیام‌ها{unread > 0 && <span className="mr-2 rounded-full bg-primary px-2 text-xs font-black text-primary-foreground">{fa(unread)}</span>}</Link></Button>
      </div>
      <Tabs defaultValue="overview" dir="rtl">
        <TabsList className="no-scrollbar flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl bg-secondary/60 p-1">
          {tabs.map((t) => (
            <TabsTrigger key={t.v} value={t.v} className="shrink-0 gap-2 rounded-xl px-4 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <t.i className="h-4 w-4" />{t.l}{!!t.n && <span className="rounded-full bg-accent px-1.5 text-[10px] text-accent-foreground">{fa(t.n)}</span>}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="overview" className="mt-5"><PanelOverview p={p} unread={unread} /></TabsContent>
        <TabsContent value="requests" className="mt-5"><PanelRequests requests={p.requests} coachId={p.coach.id} /></TabsContent>
        <TabsContent value="clients" className="mt-5"><PanelClients clients={p.clients} /></TabsContent>
        <TabsContent value="plans" className="mt-5"><PanelPlans plans={p.plans} /></TabsContent>
        <TabsContent value="schedule" className="mt-5"><PanelSchedule slots={p.availability} /></TabsContent>
        <TabsContent value="profile" className="mt-5"><PanelProfile c={p.coach} /></TabsContent>
      </Tabs>
    </div>
  );
}
