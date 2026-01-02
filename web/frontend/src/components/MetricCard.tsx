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
                "bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition-colors",
                className
            )}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-zinc-400 text-sm font-medium mb-1">{label}</p>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
                    {subValue && <p className="text-zinc-500 text-xs mt-1">{subValue}</p>}
                </div>
                {Icon && <Icon className="w-5 h-5 text-zinc-500" />}
            </div>
        </motion.div>
    );
}
