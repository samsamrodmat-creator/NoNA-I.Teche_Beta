import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetricCardProps {
    label: string;
    value: string;
    subValue?: string;
    icon?: React.ElementType;
    className?: string;
    delay?: number;
}

export function MetricCard({ label, value, subValue, icon: Icon, className, delay = 0 }: MetricCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className={cn(
                "relative bg-white/60 backdrop-blur-md border border-white/40 p-4 xl:p-5 rounded-2xl transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 group",
                className
            )}
        >
            <div className="flex flex-col justify-between h-full relative z-10 w-full">
                <div className="w-full">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-start justify-between gap-1 w-full leading-snug">
                        <span className="flex-1 break-words pr-2">{label}</span>
                        {Icon && <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-500 transition-transform duration-300 group-hover:scale-110" />}
                    </p>
                    <h3 className="text-lg xl:text-xl font-bold text-slate-900 tracking-tighter whitespace-nowrap">{value}</h3>
                    {subValue && <p className="text-slate-400 text-[10px] font-medium tracking-wider uppercase mt-1">{subValue}</p>}
                </div>
            </div>
        </motion.div>
    );
}
