import { useRef } from 'react';
import { toast } from 'sonner';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { useUpload } from 'zitejs/upload';

export type Doc = { url: string; filename: string };

export default function UploadField({ value, onChange, multiple, accept, label }: { value: Doc[]; onChange: (v: Doc[]) => void; multiple?: boolean; accept?: string; label: string }) {
  const { upload, isUploading } = useUpload();
  const ref = useRef<HTMLInputElement>(null);
  const pick = async (files: FileList | null) => {
    if (!files?.length) return;
    try {
      const done: Doc[] = [];
      for (const f of Array.from(files)) done.push({ url: (await upload(f)).url, filename: f.name });
      onChange(multiple ? [...value, ...done].slice(0, 10) : done.slice(0, 1));
    } catch { toast.error('آپلود فایل ناموفق بود'); }
    if (ref.current) ref.current.value = '';
  };
  return (
    <div className="space-y-2">
      <button type="button" disabled={isUploading} onClick={() => ref.current?.click()}
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-secondary/30 px-4 text-sm text-muted-foreground transition hover:border-primary/60 hover:text-foreground">
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}{isUploading ? 'در حال آپلود…' : label}
      </button>
      <input ref={ref} type="file" hidden multiple={multiple} accept={accept} onChange={(e) => pick(e.target.files)} />
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((d) => (
            <span key={d.url} className="flex max-w-full items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-xs">
              {accept?.startsWith('image') ? <img src={d.url} alt="" className="h-8 w-8 rounded-lg object-cover" /> : <FileText className="h-4 w-4 text-primary" />}
              <span className="truncate" dir="ltr">{d.filename}</span>
              <button type="button" onClick={() => onChange(value.filter((x) => x.url !== d.url))} aria-label="حذف"><X className="h-3.5 w-3.5" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
