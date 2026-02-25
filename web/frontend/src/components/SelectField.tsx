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
        <div className="group space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block transition-colors group-hover:text-blue-500">
                {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className="w-full flex h-10 rounded-xl border border-white/60 bg-white/40 px-3 py-2 text-sm font-medium text-slate-900 
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]
          disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer hover:bg-white/60 backdrop-blur-sm"
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
