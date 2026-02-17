'use client'

import { addBookmark } from '@/app/actions'
import { useRef, useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export default function AddBookmarkForm() {
    const formRef = useRef<HTMLFormElement>(null)
    const [isExpanded, setIsExpanded] = useState(false)
    const [loading, setLoading] = useState(false)

    async function clientAction(formData: FormData) {
        setLoading(true)
        const res = await addBookmark(formData)
        setLoading(false)
        if (res?.success) {
            formRef.current?.reset()
            setIsExpanded(false)
        } else {
            alert('Failed to add bookmark: ' + res?.error)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            {!isExpanded ? (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-all font-medium"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Bookmark
                </button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                >
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add Bookmark</h2>
                    <form ref={formRef} action={clientAction} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                placeholder="e.g. My Favorite Blog"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                URL
                            </label>
                            <input
                                type="url"
                                name="url"
                                required
                                placeholder="https://example.com"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsExpanded(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
                            >
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Bookmark
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}
        </div>
    )
}
