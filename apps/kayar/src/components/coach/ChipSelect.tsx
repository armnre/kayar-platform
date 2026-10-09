import { cn } from '@project/components/lib/utils';

export default function ChipSelect({ options, value, onChange, multi = true }: { options: string[]; value: string[]; onChange: (v: string[]) => void; multi?: boolean }) {
  const toggle = (o: string) => onChange(multi ? (value.includes(o) ? value.filter((x) => x !== o) : [...value, o]) : [o]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button type="button" key={o} onClick={() => toggle(o)} aria-pressed={value.includes(o)}
          className={cn('min-h-10 rounded-full border px-4 text-sm transition', value.includes(o) ? 'border-primary bg-primary/15 font-bold text-primary' : 'border-border text-muted-foreground hover:text-foreground')}>{o}</button>
      ))}
    </div>
  );
}
