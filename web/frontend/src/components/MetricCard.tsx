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
                "bg-zinc-100 dark:bg-zinc-900 border border-black dark:border-zinc-800 p-6 rounded-xl hover:bg-zinc-200 dark:hover:border-zinc-700 transition-colors shadow-sm dark:shadow-none",
                className
            )}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-black dark:text-zinc-400 text-sm font-medium mb-1">{label}</p>
                    <h3 className="text-2xl font-bold text-black dark:text-white tracking-tight">{value}</h3>
                    {subValue && <p className="text-black/80 dark:text-zinc-500 text-xs mt-1">{subValue}</p>}
                </div>
                {Icon && <Icon className="w-5 h-5 text-black dark:text-zinc-500" />}
            </div>
        </motion.div>
    );
}
