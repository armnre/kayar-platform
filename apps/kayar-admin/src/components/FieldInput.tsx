import { useRef } from 'react';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';
import { useUpload } from 'zitejs/upload';
import { Input } from '@project/components/ui/input';
import { Textarea } from '@project/components/ui/textarea';
import { Switch } from '@project/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import { cn } from '@project/components/lib/utils';
import { Field } from '../lib/config';

type Props = { f: Field; value: unknown; onChange: (v: unknown) => void; links: { id: string; title: string }[]; onDuration?: (s: number) => void };

export default function FieldInput({ f, value, onChange, links, onDuration }: Props) {
  const { upload, isUploading } = useUpload();
  const inp = useRef<HTMLInputElement>(null);
  const s = (value as string) ?? '';
  switch (f.type) {
    case 'textarea': return <Textarea rows={4} value={s} onChange={(e) => onChange(e.target.value)} />;
    case 'number': return <Input type="number" value={value === null || value === undefined ? '' : String(value)} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} />;
    case 'date': return <Input type="date" dir="ltr" value={s.slice(0, 10)} onChange={(e) => onChange(e.target.value)} />;
    case 'bool': return <Switch checked={!!value} onCheckedChange={onChange} />;
    case 'select': return (
      <Select value={s || undefined} onValueChange={onChange}><SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
        <SelectContent>{f.options!.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
    );
    case 'link': return (
      <Select value={s || 'none'} onValueChange={(v) => onChange(v === 'none' ? '' : v)}><SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="none">— بدون کمپین —</SelectItem>{links.map((l) => <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>)}</SelectContent></Select>
    );
    case 'multi': {
      const arr = (value as string[]) ?? [];
      return <div className="flex flex-wrap gap-2">{f.options!.map((o) => (
        <button type="button" key={o} onClick={() => onChange(arr.includes(o) ? arr.filter((x) => x !== o) : [...arr, o])}
          className={cn('rounded-full border px-3 py-1 text-sm', arr.includes(o) ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground')}>{o}</button>
      ))}</div>;
    }
    case 'image': case 'audio': {
      const pick = async (file?: File) => {
        if (!file) return;
        try {
          const { url } = await upload(file);
          onChange(url);
          if (f.type === 'audio' && onDuration) { const a = new Audio(url); a.onloadedmetadata = () => Number.isFinite(a.duration) && onDuration(Math.round(a.duration)); }
        } catch { toast.error('بارگذاری فایل ناموفق بود'); }
      };
      return (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input dir="ltr" value={s} onChange={(e) => onChange(e.target.value)} placeholder="https://…" />
            <button type="button" disabled={isUploading} onClick={() => inp.current?.click()} className="flex shrink-0 items-center gap-1 rounded-md border border-border px-3 text-sm">
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}بارگذاری
            </button>
            <input ref={inp} type="file" hidden accept={f.type === 'audio' ? 'audio/*' : 'image/*'} onChange={(e) => pick(e.target.files?.[0])} />
          </div>
          {s && (f.type === 'image' ? <img src={s} alt="" className="h-20 rounded-lg object-cover" /> : <audio src={s} controls className="w-full" />)}
        </div>
      );
    }
    default: return <Input dir={f.type === 'url' ? 'ltr' : undefined} value={s} onChange={(e) => onChange(e.target.value)} />;
  }
}
