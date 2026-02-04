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
            <label className="text-sm font-medium text-black dark:text-zinc-300">{label}</label>
            <input
                className={cn(
                    "flex h-10 w-full rounded-md border border-black/30 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-black dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm dark:shadow-none focus:border-black",
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
