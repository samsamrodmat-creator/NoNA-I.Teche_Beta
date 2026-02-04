import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
    message: string;
    type: ToastType;
    isVisible: boolean;
    onClose: () => void;
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed bottom-6 right-6 z-[100]"
                >
                    <div className={`
            flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl border backdrop-blur-md
            ${type === "success" ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-100" : ""}
            ${type === "error" ? "bg-red-950/80 border-red-500/30 text-red-100" : ""}
            ${type === "info" ? "bg-zinc-900/80 border-zinc-700/50 text-zinc-100" : ""}
          `}>
                        {type === "success" && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                        {type === "error" && <AlertCircle className="w-5 h-5 text-red-400" />}

                        <span className="text-sm font-medium">{message}</span>

                        <button onClick={onClose} className="ml-2 hover:bg-white/10 p-1 rounded-full transition-colors">
                            <X className="w-4 h-4 opacity-70" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
