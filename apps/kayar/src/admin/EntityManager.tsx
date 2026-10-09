import { adminToken } from './session';
import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Search, Trash2, Loader2, Inbox } from 'lucide-react';
import { adminList, adminSave } from 'zitejs/api';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
import { Badge } from '@project/components/ui/badge';
import { Skeleton } from '@project/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@project/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@project/components/ui/alert-dialog';
import { CONFIG, EntityKey } from './config';
import FieldInput from './FieldInput';

type Row = Record<string, unknown> & { id: string };
const err = (e: unknown) => (e as { userFacingMessage?: string })?.userFacingMessage || 'خطایی رخ داد';
export const useEntity = (entity: EntityKey) => useQuery({ queryKey: ['entity', entity], queryFn: async () => (await adminList({ token: adminToken(), entity })).records as Row[] });

export default function EntityManager({ entity }: { entity: EntityKey }) {
  const cfg = CONFIG[entity];
  const { data, isLoading } = useEntity(entity);
  const camps = useEntity('campaigns');
  const links = (camps.data ?? []).map((c) => ({ id: c.id, title: String(c.title ?? '') }));
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState<Partial<Row> | null>(null);
  const list = useMemo(() => (data ?? []).filter((r) => String(r.title ?? '').includes(q.trim())), [data, q]);
  const thumb = (r: Row) => String(r.coverUrl ?? r.sponsorLogoUrl ?? '');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1"><Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`جست‌وجو در ${cfg.title}`} className="h-11 rounded-xl pr-9" /></div>
        <Button onClick={() => setEdit({})} className="h-11 rounded-xl"><Plus className="ml-1 h-4 w-4" />{cfg.single} جدید</Button>
      </div>
      {isLoading ? <div className="space-y-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>
        : list.length === 0 ? <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground"><Inbox className="mx-auto mb-2 h-8 w-8 text-primary" />موردی ثبت نشده است.</div>
        : <div className="space-y-2">{list.map((r) => (
          <button key={r.id} onClick={() => setEdit(r)} className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-right transition hover:border-primary/50">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-secondary">{thumb(r) && <img src={thumb(r)} alt="" className="h-full w-full object-cover" />}</div>
            <div className="min-w-0 flex-1"><div className="truncate font-bold">{String(r.title || 'بدون عنوان')}</div>
              <div className="truncate text-xs text-muted-foreground">{String(r.brand ?? r.category ?? r.author ?? r.description ?? '')}</div></div>
            {cfg.badge && cfg.badge(r) && <Badge variant="secondary" className="shrink-0 rounded-full">{cfg.badge(r)}</Badge>}
          </button>
        ))}</div>}
      {edit && <Editor entity={entity} row={edit} links={links} onClose={() => setEdit(null)} />}
    </div>
  );
}

function Editor({ entity, row, links, onClose }: { entity: EntityKey; row: Partial<Row>; links: { id: string; title: string }[]; onClose: () => void }) {
  const cfg = CONFIG[entity];
  const qc = useQueryClient();
  const [f, setF] = useState<Record<string, unknown>>(row);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const missing = cfg.fields.filter((x) => x.required && !f[x.key]);
  const save = async (remove = false) => {
    setBusy(true);
    try {
      const { id: _id, ...record } = f;
      await adminSave({ token: adminToken(), entity, id: row.id, record: remove ? undefined : record, remove });
      toast.success(remove ? 'حذف شد' : 'ذخیره شد');
      qc.invalidateQueries({ queryKey: ['entity'] }); qc.invalidateQueries({ queryKey: ['stats'] });
      onClose();
    } catch (e) { toast.error(err(e)); } finally { setBusy(false); }
  };
  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="left" dir="rtl" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader><SheetTitle>{row.id ? `ویرایش ${cfg.single}` : `${cfg.single} جدید`}</SheetTitle></SheetHeader>
        <div className="mt-6 space-y-5">
          {cfg.fields.map((x) => (
            <div key={x.key} className={x.type === 'bool' ? 'flex items-center justify-between' : 'space-y-2'}>
              <Label>{x.label}{x.required && <span className="text-destructive"> *</span>}</Label>
              <FieldInput f={x} value={f[x.key]} links={links} onChange={(v) => setF((p) => ({ ...p, [x.key]: v }))} onDuration={(s) => setF((p) => ({ ...p, durationSeconds: s }))} />
              {x.hint && <p className="text-[11px] text-muted-foreground">{x.hint}</p>}
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <Button className="flex-1" disabled={busy || missing.length > 0} onClick={() => save()}>{busy && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}ذخیره</Button>
            {row.id && <Button variant="outline" disabled={busy} onClick={() => setConfirm(true)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>}
          </div>
        </div>
        <AlertDialog open={confirm} onOpenChange={setConfirm}>
          <AlertDialogContent dir="rtl"><AlertDialogHeader><AlertDialogTitle>حذف {cfg.single}؟</AlertDialogTitle><AlertDialogDescription>این کار قابل بازگشت نیست.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>انصراف</AlertDialogCancel><AlertDialogAction onClick={() => save(true)}>حذف</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
        </AlertDialog>
      </SheetContent>
    </Sheet>
  );
}
