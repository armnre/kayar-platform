import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div dir="rtl" role="alert" className="grid min-h-[60vh] place-items-center p-6">
      <div className="w-full max-w-sm rounded-3xl border border-destructive/30 bg-card p-6 text-center">
        <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-destructive/15 text-destructive"><AlertTriangle className="h-6 w-6" /></span>
        <h2 className="text-lg font-black">این بخش با خطا روبه‌رو شد</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">لطفاً دوباره تلاش کنید. اگر تکرار شد، متن زیر را برای پشتیبانی بفرستید.</p>
        <pre dir="ltr" className="mt-3 max-h-24 overflow-auto rounded-xl bg-muted p-2 text-left text-[11px] text-muted-foreground">{(error as Error)?.message}</pre>
        <div className="mt-4 flex gap-2">
          <button onClick={resetErrorBoundary} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-primary-foreground"><RotateCcw className="h-4 w-4" />تلاش مجدد</button>
          <a href="/" className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 text-sm font-bold"><Home className="h-4 w-4" />صفحه اصلی</a>
        </div>
      </div>
    </div>
  );
}

/**
 * Shows a clear Persian message when a screen crashes and resets on navigation.
 * It does not swallow errors: they still reach the console and the error is logged.
 */
export default function RouteErrorBoundary({ children }: { children: ReactNode }) {
  const loc = useLocation();
  return (
    <ErrorBoundary FallbackComponent={Fallback} resetKeys={[loc.pathname]} onError={(e, info) => console.error('[KAYAR] screen crashed:', e, info.componentStack)}>
      {children}
    </ErrorBoundary>
  );
}
