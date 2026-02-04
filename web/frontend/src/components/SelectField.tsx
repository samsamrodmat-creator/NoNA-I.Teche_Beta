import { LucideIcon } from "lucide-react";

interface Option {
    label: string;
    value: string | number;
}

interface SelectFieldProps {
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Option[];
    icon?: LucideIcon;
    disabled?: boolean;
}

export function SelectField({ label, value, onChange, options, icon: Icon, disabled }: SelectFieldProps) {
    return (
        <div className="group">
            <label className="text-xs text-zinc-500 font-medium mb-1.5 block group-hover:text-zinc-400 transition-colors">
                {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className="w-full bg-white dark:bg-zinc-900 border border-black/30 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-black dark:text-zinc-100 
          focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm dark:shadow-none
          disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
