import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Eye, EyeOff, AlertCircle, ArrowLeft, Shield } from 'lucide-react'

const ADMIN_EMAIL = 'adminRPL2@gmail.com'
const ADMIN_PASSWORD = 'RPL2KECE@'

// iPhone tri-tone notification sound using Web Audio API
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
            gain.gain.setValueAtTime(0.15, ctx.currentTime + start)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
            osc.start(ctx.currentTime + start)
            osc.stop(ctx.currentTime + start + dur)
        }
        playTone(1175, 0, 0.12)
        playTone(1568, 0.13, 0.12)
        playTone(1975, 0.26, 0.15)
    } catch (e) { }
}

const AdminLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showNotif, setShowNotif] = useState(false)
    const [showBlocked, setShowBlocked] = useState(false)
    const [failCount, setFailCount] = useState(0)
    const navigate = useNavigate()
    const notifShown = useRef(false)

    // Show iOS notification after a brief delay
    useEffect(() => {
        if (notifShown.current) return
        notifShown.current = true
        const timer = setTimeout(() => {
            setShowNotif(true)
            playNotifSound()
        }, 800)
        return () => clearTimeout(timer)
    }, [])

    // Auto-dismiss notification
    useEffect(() => {
        if (showNotif) {
            const timer = setTimeout(() => setShowNotif(false), 5000)
            return () => clearTimeout(timer)
        }
    }, [showNotif])

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 800))
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            sessionStorage.setItem('admin_auth', 'true')
            navigate('/admin/dashboard')
        } else {
            const newCount = failCount + 1
            setFailCount(newCount)
            if (newCount >= 3) {
                setError('')
                setShowBlocked(true)
                playNotifSound()
            } else {
                setError(`Email atau password salah! (${newCount}/3)`)
            }
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f2f2f7] flex items-center justify-center px-4 relative">

            {/* Blocked Alert — After 3 failed attempts */}
            <AnimatePresence>
                {showBlocked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center px-6"
                        style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className="w-full max-w-[270px] bg-white/95 backdrop-blur-2xl rounded-[14px] overflow-hidden shadow-2xl"
                        >
                            <div className="px-4 pt-5 pb-4 text-center">
                                <h3 className="text-[17px] font-semibold text-[#1c1c1e] mb-1">Akses Ditolak</h3>
                                <p className="text-[13px] text-[#3a3a3c] leading-relaxed">
                                    Anda telah gagal login 3 kali. Silakan kembali ke beranda.
                                </p>
                            </div>
                            <div className="border-t border-[#e5e5ea]">
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="w-full py-[11px] text-[17px] text-[#007aff] font-semibold active:bg-gray-100 transition-colors"
                                >
                                    Kembali ke Beranda
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* iPhone-style Notification Banner */}
            <AnimatePresence>
                {showNotif && (
                    <motion.div
                        initial={{ y: -100, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -100, opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-4 left-4 right-4 z-[100] flex justify-center"
                        onClick={() => setShowNotif(false)}
                    >
                        <div className="w-full max-w-[380px] bg-white/95 backdrop-blur-2xl rounded-[1.4rem] shadow-2xl shadow-black/10 border border-white/50 px-4 py-3.5 cursor-pointer active:scale-[0.98] transition-transform">
                            <div className="flex items-start gap-3">
                                {/* App Icon */}
                                <div className="w-10 h-10 rounded-[0.65rem] bg-[#ff3b30] flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Shield className="text-white" size={20} />
                                </div>
                                {/* Content */}
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <span className="text-[13px] font-semibold text-[#1c1c1e]">Keamanan</span>
                                        <span className="text-[12px] text-[#8e8e93] font-medium">sekarang</span>
                                    </div>
                                    <p className="text-[14px] text-[#3a3a3c] leading-snug font-medium">
                                        ⚠️ Hanya admin yang diperbolehkan login. Akses tanpa izin akan ditolak.
                                    </p>
                                </div>
                            </div>
                            {/* Grab bar */}
                            <div className="flex justify-center mt-2">
                                <div className="w-9 h-[4px] bg-[#e5e5ea] rounded-full" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[360px]"
            >
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-5 rounded-[1.4rem] bg-white shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-2" />
                    </div>
                    <h1 className="text-[26px] font-bold text-[#1c1c1e] tracking-tight">Admin Panel</h1>
                    <p className="text-[#8e8e93] text-[14px] font-medium mt-1">Masuk untuk mengelola website</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-[1.2rem] overflow-hidden">
                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 px-4 py-3 bg-[#ff3b30]/8 text-[#ff3b30] text-[13px] font-medium border-b border-gray-100"
                        >
                            <AlertCircle size={15} />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin}>
                        {/* Email */}
                        <div className="flex items-center px-4 py-[14px] border-b border-[#e5e5ea]">
                            <label className="text-[15px] font-medium text-[#1c1c1e] w-20 flex-shrink-0">Email</label>
                            <input
                                type="email"
                                placeholder="xxxx@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 text-[15px] text-[#1c1c1e] placeholder:text-[#c7c7cc] focus:outline-none bg-transparent"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="flex items-center px-4 py-[14px]">
                            <label className="text-[15px] font-medium text-[#1c1c1e] w-20 flex-shrink-0">Sandi</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex-1 text-[15px] text-[#1c1c1e] placeholder:text-[#c7c7cc] focus:outline-none bg-transparent"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-[#007aff] ml-2 flex-shrink-0"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Login Button */}
                <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full mt-5 py-[14px] bg-[#007aff] hover:bg-[#0071e3] text-white text-[16px] font-semibold rounded-[0.9rem] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center active:scale-[0.98]"
                >
                    {isLoading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                    ) : 'Masuk'}
                </button>

                {/* Back */}
                <div className="text-center mt-5">
                    <a href="/" className="text-[14px] text-[#007aff] font-medium">
                        ← Kembali ke Website
                    </a>
                </div>
            </motion.div>
        </div>
    )
}

export default AdminLogin
