import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogIn, Shield } from 'lucide-react'

const playNotifSound = () => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const playTone = (freq, start, dur) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.type = 'sine'
            osc.frequency.value = freq
            gain.gain.setValueAtTime(0.18, ctx.currentTime + start)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
            osc.start(ctx.currentTime + start)
            osc.stop(ctx.currentTime + start + dur)
        }
        // iPhone low battery warning: two descending tones
        playTone(987, 0, 0.15)
        playTone(740, 0.18, 0.15)
        playTone(987, 0.5, 0.15)
        playTone(740, 0.68, 0.15)
    } catch (e) { }
}

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [showNotif, setShowNotif] = useState(false)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    // Redirect only when user confirms
    const handleConfirm = () => {
        setShowNotif(false)
        window.location.href = '/admin'
    }

    const handleLoginClick = (e) => {
        e.preventDefault()
        setIsOpen(false)
        setShowNotif(true)
        playNotifSound()
    }

    const navLinks = [
        { title: 'Home', href: '#' },
        { title: 'Structure', href: '#struktur' },
        { title: 'Members', href: '#anggota' },
        { title: 'Gallery', href: '#galeri' },
        { title: 'Guestbook', href: '#kontak' },
    ]

    return (
        <>
            {/* iPhone Alert Dialog — Centered */}
            <AnimatePresence>
                {showNotif && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-6"
                        style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className="w-full max-w-[270px] bg-white/95 backdrop-blur-2xl rounded-[14px] overflow-hidden shadow-2xl"
                        >
                            {/* Content */}
                            <div className="px-4 pt-5 pb-4 text-center">
                                <h3 className="text-[17px] font-semibold text-[#1c1c1e] mb-1">Peringatan</h3>
                                <p className="text-[13px] text-[#3a3a3c] leading-relaxed">
                                    Hanya admin yang diperbolehkan login. Akses tanpa izin akan ditolak.
                                </p>
                            </div>
                            {/* Buttons */}
                            <div className="border-t border-[#e5e5ea]">
                                <div className="flex">
                                    <button
                                        onClick={() => setShowNotif(false)}
                                        className="flex-1 py-[11px] text-[17px] text-[#007aff] font-normal border-r border-[#e5e5ea] active:bg-gray-100 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        className="flex-1 py-[11px] text-[17px] text-[#007aff] font-semibold active:bg-gray-100 transition-colors"
                                    >
                                        Lanjutkan
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
            >
                <div className={`
                    relative flex items-center justify-between transition-all duration-500 ease-in-out
                    ${isScrolled || isOpen
                        ? 'w-full max-w-5xl bg-white/70 backdrop-blur-xl shadow-sm border border-white/20'
                        : 'w-full max-w-4xl bg-white/50 backdrop-blur-md shadow-sm border border-white/10'
                    }
                    rounded-full px-6 py-3
                `}>
                    <a href="#" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-bold text-dark text-lg tracking-tight">XI RPL 02</span>
                        </div>
                    </a>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-white hover:bg-black rounded-full transition-all duration-300"
                            >
                                {link.title}
                            </a>
                        ))}
                        <button
                            onClick={handleLoginClick}
                            className="ml-2 px-5 py-2 text-sm font-bold text-white bg-[#E8491D] hover:bg-[#D63E14] rounded-full transition-all duration-300 flex items-center gap-2 shadow-sm"
                        >
                            <LogIn size={14} />
                            Login
                        </button>
                    </div>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-dark hover:bg-black hover:text-white transition-all z-50"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu - Fullscreen */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-white/95 backdrop-blur-3xl md:hidden flex flex-col items-center justify-center"
                    >
                        <div className="flex flex-col items-center gap-3 w-full px-8">
                            {navLinks.map((link, index) => (
                                <motion.a
                                    key={index}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 20, opacity: 0 }}
                                    transition={{ delay: 0.05 * index, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    className="text-3xl font-bold text-[#1d1d1f] hover:text-[#0071e3] transition-colors py-3"
                                >
                                    {link.title}
                                </motion.a>
                            ))}
                            <motion.button
                                onClick={handleLoginClick}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                transition={{ delay: 0.05 * navLinks.length, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="mt-6 px-10 py-4 bg-[#E8491D] hover:bg-[#D63E14] text-white text-lg font-bold rounded-full transition-all flex items-center gap-3 shadow-lg"
                            >
                                <LogIn size={20} />
                                Login Admin
                            </motion.button>
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="absolute bottom-10 text-[#86868b] text-sm font-medium"
                        >
                            XI RPL 02 — SMK PGRI 01 Sukorejo
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Navbar
