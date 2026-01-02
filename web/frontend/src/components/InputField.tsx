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
            <label className="text-sm font-medium text-zinc-300">{label}</label>
            <input
                className={cn(
                    "flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all",
                    error && "border-red-500 focus:ring-red-500",
                    className
                )}
                value={safeValue}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}
