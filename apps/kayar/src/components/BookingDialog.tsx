import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useAuth, loginWithRedirect } from 'zitejs/auth';
import { createCoachingRequest } from 'zitejs/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@project/components/ui/dialog';
import { Button } from '@project/components/ui/button';
import { Textarea } from '@project/components/ui/textarea';
import { Label } from '@project/components/ui/label';
import { DateTimePicker } from '@project/components/ui/date-picker';
import { Coach, toman, errMsg, useRefresh } from '../lib/data';

type Props = { open: boolean; onOpenChange: (o: boolean) => void; coachId: string; coachName: string; plan: Coach['plans'][number] };

export default function BookingDialog({ open, onOpenChange, coachId, coachName, plan }: Props) {
  const { user } = useAuth();
  const nav = useNavigate();
  const refresh = useRefresh();
  const [date, setDate] = useState<Date>();
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const future = !!date && date.getTime() > Date.now();

  const submit = async () => {
    if (!user) return loginWithRedirect();
    setBusy(true);
    try {
      const r = await createCoachingRequest({ coachId, planId: plan.id, sessionAt: date!.toISOString(), message: msg });
      toast.success('درخواست شما ثبت شد', { description: r.gatewayConnected ? undefined : `کد پیگیری ${r.reference} — پرداخت پس از اتصال درگاه فعال می‌شود.` });
      refresh();
      onOpenChange(false);
      nav('/profile');
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-md rounded-3xl">
        <DialogHeader className="text-right">
          <DialogTitle>رزرو جلسه با {coachName}</DialogTitle>
          <DialogDescription>{plan.name} · {toman(plan.price)}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>زمان اولین جلسه</Label><DateTimePicker value={date} onChange={setDate} />
            {date && !future && <p className="text-xs text-destructive">زمان باید در آینده باشد.</p>}</div>
          <div className="space-y-2"><Label>پیام برای مربی (اختیاری)</Label>
            <Textarea value={msg} maxLength={1000} onChange={(e) => setMsg(e.target.value)} placeholder="هدف و شرایط خود را بنویسید…" /></div>
          <div className="flex gap-2 rounded-xl border border-accent/30 bg-accent/10 p-3 text-xs leading-6">
            <ShieldAlert className="h-4 w-4 shrink-0 text-accent" />
            درگاه پرداخت هنوز متصل نیست؛ درخواست با وضعیت «در انتظار درگاه» ثبت می‌شود و هیچ مبلغی کسر نمی‌شود.
          </div>
          <Button disabled={!future || busy} onClick={submit} className="h-12 w-full rounded-xl font-bold">
            {busy && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}{user ? 'ثبت درخواست' : 'ورود و ثبت درخواست'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
