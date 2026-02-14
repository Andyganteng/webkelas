import { motion } from 'framer-motion'
import { Instagram, Search } from 'lucide-react'
import { useState } from 'react'
import { useData } from '../context/DataContext'

// Animation Variants for Stagger Effect
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.2
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    }
}

const Members = () => {
    const { members } = useData()
    const [searchTerm, setSearchTerm] = useState('')

    const filteredMembers = members.filter(member => {
        const name = member.name || ''
        const search = searchTerm.trim().toLowerCase()
        return name.toLowerCase().includes(search)
    })

    return (
        <section id="anggota" className="py-24 bg-[#F5F5F7] relative overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(to right, #1d1d1f 1px, transparent 1px), linear-gradient(to bottom, #1d1d1f 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />
            {/* Gradient blurs */}
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/30 to-purple-100/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-gradient-to-tl from-cyan-100/20 to-blue-50/10 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="flex flex-col items-center mb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[#0071e3] font-bold text-xs uppercase tracking-[0.2em] mb-4 block">Student Profiles</span>
                        <h2 className="heading-lg mb-6 text-[#1d1d1f]">Meet the Students.</h2>
                        <p className="text-[#86868b] text-xl font-medium max-w-2xl mx-auto">
                            Eksplorasi potensi dari 39 individu berbakat XI RPL 02.
                        </p>
                    </motion.div>

                    {/* Search Bar - Apple Style */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative w-full max-w-md mt-12 group"
                    >
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#86868b] group-focus-within:text-[#0071e3] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-4 focus:ring-[#0071e3]/10 focus:border-[#0071e3]/30 transition-all shadow-sm font-medium text-[#1d1d1f]"
                        />
                    </motion.div>
                </div>

                <motion.div
                    key={searchTerm}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
                >
                    {filteredMembers.map((member, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="bento-card p-6 flex flex-col items-center text-center group transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#f2f2f7] mb-4 flex items-center justify-center text-2xl font-bold text-[#86868b] group-hover:bg-[#0071e3] group-hover:text-white transition-all duration-500 shadow-inner">
                                {member.name.charAt(0)}
                            </div>

                            <h3 className="text-sm font-bold text-[#1d1d1f] mb-3 leading-tight min-h-[2.5rem] flex items-center justify-center">
                                {member.name}
                            </h3>

                            {member.instagram && (
                                <motion.a
                                    href={member.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#86868b] hover:text-[#0071e3] hover:bg-white hover:shadow-md transition-all"
                                >
                                    <Instagram size={14} />
                                </motion.a>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {filteredMembers.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 text-[#86868b] font-medium"
                    >
                        <p className="text-lg">Tidak ada anggota yang ditemukan</p>
                        <p className="text-sm opacity-60 mt-2">Coba kata kunci lain untuk "{searchTerm}"</p>
                    </motion.div>
                )}
            </div>
        </section>
    )
}

export default Members
