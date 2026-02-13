import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const Loading = () => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer)
                    return 100
                }
                return prev + 1
            })
        }, 15)
        return () => clearInterval(timer)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-white flex items-center justify-center text-[#1d1d1f]"
        >
            <div className="w-full max-w-sm px-8">
                <div className="flex justify-between items-end mb-4 font-semibold text-xs tracking-widest uppercase opacity-40">
                    <span>Loading Experience</span>
                    <span>{progress}%</span>
                </div>

                <div className="h-[2px] w-full bg-gray-100 relative overflow-hidden rounded-full">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-[#0071e3]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                    />
                </div>

                <div className="mt-12 text-center overflow-hidden">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className="text-4xl font-bold tracking-tight"
                    >
                        XI RPL 02.
                    </motion.h1>
                </div>
            </div>
        </motion.div>
    )
}

export default Loading
