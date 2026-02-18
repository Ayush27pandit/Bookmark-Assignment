import { useState, useCallback, useEffect } from 'react'

export type ToastVariant = 'default' | 'destructive' | 'success'

interface Toast {
    id: string
    title?: string
    description?: string
    variant?: ToastVariant
}

let subscribers: ((toasts: Toast[]) => void)[] = []
let globalToasts: Toast[] = []

function notifySubscribers() {
    subscribers.forEach((sub) => sub([...globalToasts]))
}

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>(globalToasts)

    useEffect(() => {
        subscribers.push(setToasts)
        return () => {
            subscribers = subscribers.filter((sub) => sub !== setToasts)
        }
    }, [])

    const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9)
        globalToasts = [...globalToasts, { id, title, description, variant }]
        notifySubscribers()
    }, [])

    const dismiss = useCallback((id: string) => {
        globalToasts = globalToasts.filter((t) => t.id !== id)
        notifySubscribers()
    }, [])

    return { toasts, toast, dismiss }
}
