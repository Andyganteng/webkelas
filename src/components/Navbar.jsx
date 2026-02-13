import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { title: 'Home', href: '#' },
        { title: 'Structure', href: '#struktur' },
        { title: 'Members', href: '#anggota' },
        { title: 'Gallery', href: '#galeri' },
        { title: 'Guestbook', href: '#kontak' },
    ]

    return (
        <>
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
                    {/* Brand / Logo */}
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
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-dark hover:bg-black hover:text-white transition-all"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-24 left-4 right-4 z-40 bg-white/90 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 p-6 md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link, index) => (
                                <motion.a
                                    key={index}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.05 * index }}
                                    className="p-4 text-center text-lg font-bold text-dark hover:bg-gray-50 rounded-2xl transition-all"
                                >
                                    {link.title}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Navbar
