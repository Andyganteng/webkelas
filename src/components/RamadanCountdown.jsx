import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useData } from '../context/DataContext'

const RamadanCountdown = () => {
    const { ramadan } = useData()
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

    function calculateTimeLeft() {
        if (!ramadan?.targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

        const difference = +new Date(ramadan.targetDate) - +new Date()

        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            }
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)
        return () => clearInterval(timer)
    }, [ramadan])

    const handleExplore = () => {
        const memberSection = document.getElementById('anggota')
        if (memberSection) {
            memberSection.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const containerVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 } // Simplified exit animation
    }

    // Default background if none provided
    const bgImage = ramadan?.backgroundImage || "https://images.unsplash.com/photo-1533200922676-46c5357876a4?q=80&w=2070&auto=format&fit=crop"

    return (
        // AnimatePresence removed
        <motion.div
            key="ramadan-countdown"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-screen flex flex-col items-center justify-between py-24 text-white overflow-hidden" // Updated CSS
        >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-[-1]">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "easeOut" }}
                    src={bgImage}
                    alt="Background"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-8 text-center"
            >
                <p className="text-sm font-medium tracking-[0.2em] uppercase text-white/80 mb-2">Counting Down To</p>
                <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Ramadhan 1447 H</h1>
            </motion.div>

            {/* Timer */}
            <div className="w-full max-w-4xl px-6">
                <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
                    {Object.entries(timeLeft).map(([unit, value], index) => (
                        <motion.div
                            key={unit}
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 + (index * 0.1), type: "spring", stiffness: 100 }}
                            className="flex flex-col items-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl"
                        >
                            <span className="text-4xl sm:text-6xl md:text-7xl font-thin tabular-nums tracking-tighter">
                                {String(value).padStart(2, '0')}
                            </span>
                            <span className="text-xs sm:text-sm font-medium uppercase tracking-widest text-white/70 mt-2">
                                {unit}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Footer / CTA */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mb-8"
            >
                <button
                    onClick={handleExplore} // Updated onClick handler
                    className="group flex items-center gap-3 px-8 py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                    <span className="text-sm font-medium tracking-wide">Explore Class</span> {/* Updated button text */}
                    <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center transition-transform group-hover:translate-x-1">
                        <ChevronRight size={14} strokeWidth={3} />
                    </div>
                </button>
            </motion.div>
        </motion.div>
    )
}

export default RamadanCountdown
