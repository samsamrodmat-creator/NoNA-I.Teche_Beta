import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function InputField({ label, error, className, value, ...props }: InputProps) {
    // Sanitize NaN to empty string to avoid React warnings
    const safeValue = (typeof value === 'number' && isNaN(value)) ? "" : value;

    return (
        <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{label}</label>
            <input
                className={cn(
                    "flex h-10 w-full rounded-xl border border-white/60 bg-white/40 px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-white/60 backdrop-blur-sm",
                    error && "border-red-500 focus:ring-red-500",
                    className
                )}
                value={safeValue}
                {...props}
            />
            {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
        </div>
    );
}
