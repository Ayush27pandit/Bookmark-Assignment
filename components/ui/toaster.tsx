'use client'

import { useToast } from '@/hooks/use-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { useEffect } from 'react'

export function Toaster() {
    const { toasts, dismiss } = useToast()

    return (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 p-4 md:max-w-[420px] w-full">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    )
}

function ToastItem({ toast, onDismiss }: { toast: any, onDismiss: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 5000)
        return () => clearTimeout(timer)
    }, [onDismiss])

    const icons = {
        default: <Info className="w-5 h-5 text-blue-500" />,
        success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        destructive: <AlertCircle className="w-5 h-5 text-red-500" />,
    }

    const bgColors = {
        default: 'bg-white border-slate-200',
        success: 'bg-white border-green-100',
        destructive: 'bg-white border-red-100',
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative flex w-full items-start gap-3 rounded-xl border p-4 shadow-lg ${bgColors[toast.variant as keyof typeof bgColors]}`}
        >
            <div className="flex-shrink-0 mt-0.5">
                {icons[toast.variant as keyof typeof icons]}
            </div>
            <div className="flex-1 min-w-0">
                {toast.title && (
                    <h4 className="text-sm font-semibold text-slate-900 leading-none mb-1">
                        {toast.title}
                    </h4>
                )}
                {toast.description && (
                    <p className="text-xs text-slate-500 leading-relaxed">
                        {toast.description}
                    </p>
                )}
            </div>
            <button
                onClick={onDismiss}
                className="flex-shrink-0 ml-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    )
}
