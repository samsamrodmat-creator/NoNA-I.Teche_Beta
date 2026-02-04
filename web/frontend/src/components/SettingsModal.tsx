
import { useState, useEffect } from "react";
import { Parameter, ParameterUpdate, getParameters, updateParameters } from "@/lib/api";
import { X, Save, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
}

export function SettingsModal({ isOpen, onClose, onSaveSuccess }: SettingsModalProps) {
    const [params, setParams] = useState<Parameter[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [edits, setEdits] = useState<Record<string, number>>({});

    useEffect(() => {
        if (isOpen) {
            loadParams();
        }
    }, [isOpen]);

    const loadParams = async () => {
        setLoading(true);
        try {
            const data = await getParameters();
            setParams(data);
            setEdits({});
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key: string, val: string) => {
        const num = parseFloat(val);
        if (!isNaN(num)) {
            setEdits(prev => ({ ...prev, [key]: num }));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updates: ParameterUpdate[] = Object.entries(edits).map(([key, value]) => ({ key, value }));
            if (updates.length > 0) {
                await updateParameters(updates);
                loadParams(); // Refresh to clean edits
                onSaveSuccess();
                onClose();
            } else {
                onClose();
            }
        } catch (e) {
            console.error(e);
            alert("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    // Grouping
    const groups = params.reduce((acc, p) => {
        if (!acc[p.group]) acc[p.group] = [];
        acc[p.group].push(p);
        return acc;
    }, {} as Record<string, Parameter[]>);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-zinc-100 dark:bg-zinc-900 border border-black dark:border-zinc-800 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-black dark:border-zinc-800">
                            <div>
                                <h2 className="text-xl font-bold text-black dark:text-white">Global Configuration</h2>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">Edit system constants and factors</p>
                            </div>
                            <button onClick={onClose} className="text-zinc-500 hover:text-black dark:text-zinc-500 dark:hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-zinc-400 dark:scrollbar-thumb-zinc-700">
                            {loading ? (
                                <div className="text-center py-10 text-zinc-500">Loading parameters...</div>
                            ) : (
                                Object.entries(groups).map(([groupName, groupParams]) => (
                                    <div key={groupName}>
                                        <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3 sticky top-0 bg-zinc-100 dark:bg-zinc-900 py-2">
                                            {groupName}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {groupParams.map(p => (
                                                <div key={p.key} className="bg-white dark:bg-zinc-950/50 p-3 rounded-lg border border-black/20 dark:border-zinc-800/50 hover:border-black dark:hover:border-zinc-700 transition-colors">
                                                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1 block">
                                                        {p.description || p.key}
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-black/30 dark:border-zinc-700 rounded px-2 py-1.5 text-sm text-black dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                                                            value={edits[p.key] ?? p.value}
                                                            onChange={e => handleChange(p.key, e.target.value)}
                                                        />
                                                        {edits[p.key] !== undefined && edits[p.key] !== p.value && (
                                                            <div className="absolute right-2 top-1.5 w-2 h-2 bg-yellow-500 rounded-full" title="Modified" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-black dark:border-zinc-800 flex justify-end gap-3 bg-zinc-200 dark:bg-zinc-900 rounded-b-xl">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-lg shadow-indigo-900/20"
                            >
                                {saving ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

