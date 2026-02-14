import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'

const quotes = [
    "Membangun masa depan, satu baris kode di satu waktu.",
    "Dari kelas ke dunia digital — we code, we create.",
    "Bukan sekadar menulis kode, tapi merancang solusi.",
    "Debug today, deploy tomorrow. That's how we roll.",
    "39 developer masa depan, satu visi tanpa batas.",
    "Think. Code. Innovate. Repeat.",
]

// ========== Animated Canvas Background ==========
const ParticleBackground = () => {
    const canvasRef = useRef(null)
    const animationRef = useRef(null)
    const mouseRef = useRef({ x: 0, y: 0 })
    const particlesRef = useRef([])

    const initParticles = useCallback((width, height) => {
        const count = Math.floor((width * height) / 12000)
        const particles = []
        for (let i = 0; i < Math.min(count, 80); i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.3 + 0.05,
            })
        }
        return particles
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio
            canvas.height = canvas.offsetHeight * window.devicePixelRatio
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
            particlesRef.current = initParticles(canvas.offsetWidth, canvas.offsetHeight)
        }

        const handleMouse = (e) => {
            const rect = canvas.getBoundingClientRect()
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
        }

        const draw = () => {
            const w = canvas.offsetWidth
            const h = canvas.offsetHeight
            ctx.clearRect(0, 0, w, h)

            const particles = particlesRef.current
            const mouse = mouseRef.current

            // Update & draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i]
                p.x += p.vx
                p.y += p.vy

                // Bounce off edges
                if (p.x < 0 || p.x > w) p.vx *= -1
                if (p.y < 0 || p.y > h) p.vy *= -1

                // Draw particle
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(0, 113, 227, ${p.opacity})`
                ctx.fill()

                // Connect nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j]
                    const dx = p.x - p2.x
                    const dy = p.y - p2.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 120) {
                        ctx.beginPath()
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(p2.x, p2.y)
                        ctx.strokeStyle = `rgba(0, 113, 227, ${0.06 * (1 - dist / 120)})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                }

                // Mouse interaction — connect to mouse
                if (mouse.x && mouse.y) {
                    const dx = p.x - mouse.x
                    const dy = p.y - mouse.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 150) {
                        ctx.beginPath()
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(mouse.x, mouse.y)
                        ctx.strokeStyle = `rgba(0, 113, 227, ${0.12 * (1 - dist / 150)})`
                        ctx.lineWidth = 0.8
                        ctx.stroke()
                    }
                }
            }

            animationRef.current = requestAnimationFrame(draw)
        }

        resize()
        window.addEventListener('resize', resize)
        canvas.addEventListener('mousemove', handleMouse)
        draw()

        return () => {
            window.removeEventListener('resize', resize)
            canvas.removeEventListener('mousemove', handleMouse)
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
        }
    }, [initParticles])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-auto"
            style={{ zIndex: 0 }}
        />
    )
}

// ========== Hero Component ==========
const Hero = () => {
    const { scrollY } = useScroll()
    const [quoteIndex, setQuoteIndex] = useState(0)
    const [currentDate, setCurrentDate] = useState('')

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex(prev => (prev + 1) % quotes.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const updateDate = () => {
            const now = new Date()
            const options = { day: 'numeric', month: 'short', year: 'numeric' }
            setCurrentDate(now.toLocaleDateString('id-ID', options))
        }
        updateDate()
        const interval = setInterval(updateDate, 60000)
        return () => clearInterval(interval)
    }, [])

    const yText = useTransform(scrollY, [0, 300], [0, -50])
    const opacityText = useTransform(scrollY, [0, 300], [1, 0])
    const yLogo = useTransform(scrollY, [0, 400], [0, -100])
    const scaleLogo = useTransform(scrollY, [0, 400], [1, 0.9])
    const opacityLogo = useTransform(scrollY, [0, 400], [1, 0.5])

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20 bg-[#F5F5F7]">

            {/* Animated Particle Canvas Background */}
            <ParticleBackground />

            {/* Gradient overlays for depth */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#F5F5F7] to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#F5F5F7] to-transparent" />
            </div>

            {/* Grid lines pattern (garis kotak) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #1d1d1f 1px, transparent 1px),
                        linear-gradient(to bottom, #1d1d1f 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    zIndex: 1
                }}
            />

            <div className="container mx-auto px-6 relative" style={{ zIndex: 10 }}>
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        style={{ y: yText, opacity: opacityText }}
                        className="flex flex-col items-center"
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[#0071e3] font-bold text-xs uppercase tracking-[0.3em] mb-6 block"
                        >
                            Class of 2026
                        </motion.span>

                        {/* Animated Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-8 md:mb-12 text-[#1d1d1f]"
                        >
                            {/* Line 1: "Welcome to Web" */}
                            <span className="block text-4xl md:text-8xl font-bold leading-tight" style={{ fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif", letterSpacing: '-0.04em' }}>
                                {"Welcome to Web".split("").map((char, i) => (
                                    <motion.span
                                        key={`line1-${i}`}
                                        initial={{ opacity: 0, y: -60, rotateX: 90 }}
                                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                        transition={{
                                            delay: 0.3 + i * 0.06,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 12
                                        }}
                                        className="inline-block"
                                        style={{ display: char === " " ? "inline" : "inline-block" }}
                                    >
                                        {char === " " ? "\u00A0" : char}
                                    </motion.span>
                                ))}
                            </span>

                            {/* Line 2: "XI RPL 02." with gradient */}
                            <span className="block text-4xl md:text-7xl font-bold mt-2" style={{ fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif", letterSpacing: '-0.03em' }}>
                                {"XI RPL 02.".split("").map((char, i) => (
                                    <motion.span
                                        key={`line2-${i}`}
                                        initial={{ opacity: 0, y: 40, scale: 0.5 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{
                                            delay: 0.8 + i * 0.05,
                                            type: "spring",
                                            stiffness: 120,
                                            damping: 10
                                        }}
                                        whileHover={{
                                            y: -8,
                                            scale: 1.15,
                                            transition: { duration: 0.2 }
                                        }}
                                        className="inline-block cursor-default"
                                        style={{
                                            display: char === " " ? "inline" : "inline-block",
                                            background: 'linear-gradient(90deg, #86868b, #0071e3, #86868b, #0071e3)',
                                            backgroundSize: '300% 100%',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                            animation: 'gradient-shift 5s linear infinite',
                                        }}
                                    >
                                        {char === " " ? "\u00A0" : char}
                                    </motion.span>
                                ))}
                            </span>
                        </motion.h1>

                        {/* Logo + Rotating Quotes Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="max-w-4xl mx-auto mb-16 px-4 relative"
                        >
                            <div className="p-4 md:p-8">
                                {/* Logo */}
                                <motion.div
                                    initial={{ scale: 0.3, opacity: 0, filter: 'blur(15px)' }}
                                    animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                                    transition={{ duration: 1.2, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
                                    className="flex justify-center mb-8"
                                >
                                    <motion.div
                                        animate={{ y: [0, -6, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="relative"
                                    >
                                        <img
                                            src="/logo.png"
                                            alt="Logo XI RPL 02"
                                            className="w-48 h-48 md:w-72 md:h-72 object-contain"
                                        />
                                    </motion.div>
                                </motion.div>

                                {/* Rotating Quote */}
                                <div className="relative h-[60px] md:h-[80px] flex items-center justify-center mb-6 overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        <motion.p
                                            key={quoteIndex}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -30 }}
                                            transition={{ duration: 0.6, ease: "easeInOut" }}
                                            className="text-lg md:text-3xl text-[#1d1d1f] font-bold tracking-tight leading-[1.15] absolute text-center px-4"
                                            style={{ fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif" }}
                                        >
                                            {quotes[quoteIndex]}
                                        </motion.p>
                                    </AnimatePresence>
                                </div>

                                {/* Stats */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-base md:text-lg text-[#86868b] font-medium"
                                >
                                    <span>39 Siswa.</span>
                                    <span>Moral – Intellectual – Integrity</span>
                                    <span>SMK PGRI 01 Sukorejo.</span>
                                </motion.div>
                            </div>

                            {/* Floating Metadata Badges */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1.8 }}
                                className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-20 bg-white/80 backdrop-blur-md p-4 md:p-5 rounded-2xl shadow-xl border border-white/50 text-left hidden md:block"
                            >
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Students</p>
                                <p className="text-3xl font-bold text-[#1d1d1f]">39</p>
                            </motion.div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 2.0 }}
                                className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-24 bg-white/80 backdrop-blur-md p-4 md:p-5 rounded-2xl shadow-xl border border-white/50 text-left hidden md:block"
                            >
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Today</p>
                                <p className="text-xl font-bold text-[#1d1d1f]">{currentDate}</p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Hero
