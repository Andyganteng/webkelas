import { motion } from 'framer-motion'
import { useData } from '../context/DataContext'
import { Instagram } from 'lucide-react'

const StructureCard = ({ member, role, size = "md", delay = 0 }) => {
    if (!member) return null;

    const isLarge = size === "lg";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
            className="bento-card p-6 flex flex-col items-center text-center relative z-10 w-full max-w-[260px] mx-auto bg-white/80 backdrop-blur-sm shadow-xl shadow-gray-200/50"
        >
            <div className={`${isLarge ? 'w-24 h-24' : 'w-20 h-20'} rounded-full overflow-hidden mb-4 shadow-inner bg-gray-50 relative group border-2 border-white`}>
                <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextElementSibling) {
                            e.target.nextElementSibling.style.display = 'flex';
                        }
                    }}
                />
                <div className="absolute inset-0 hidden items-center justify-center text-2xl font-bold text-[#d1d1d6] bg-[#f2f2f7] uppercase">
                    {member.name.charAt(0)}
                </div>
            </div>

            <h3 className={`${isLarge ? 'text-lg' : 'text-base'} font-bold text-[#1d1d1f] mb-1 tracking-tight leading-tight`}>{member.name}</h3>
            <p className="text-[#0071e3] font-bold text-[9px] uppercase tracking-[0.2em] bg-blue-50/50 px-3 py-1 rounded-full mb-4">{role}</p>

            {member.instagram && (
                <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#f2f2f7] flex items-center justify-center text-[#86868b] hover:text-[#0071e3] hover:bg-white hover:shadow-md transition-all duration-300"
                >
                    <Instagram size={16} />
                </a>
            )}
        </motion.div>
    );
}

const Structure = () => {
    const { structure } = useData()
    const getMember = (role) => structure.find(m => m.role === role)

    const wali = getMember('Wali Kelas')
    const ketua = getMember('Ketua Kelas')
    const wakil = getMember('Wakil Ketua')
    const sek1 = getMember('Sekretaris 1')
    const sek2 = getMember('Sekretaris 2')
    const ben1 = getMember('Bendahara 1')
    const ben2 = getMember('Bendahara 2')

    const pathVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 1.2, ease: "easeInOut" }
        }
    }

    return (
        <section id="struktur" className="py-32 px-4 bg-[#F5F5F7] overflow-hidden relative">
            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(to right, #1d1d1f 1px, transparent 1px), linear-gradient(to bottom, #1d1d1f 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />
            {/* Gradient blurs */}
            <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-bl from-blue-100/30 to-indigo-100/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-100/20 to-purple-50/10 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-28">
                    <span className="text-[#0071e3] font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Organization</span>
                    <h2 className="heading-lg mb-4 text-[#1d1d1f]">Class Structure.</h2>
                    <p className="text-[#86868b] text-xl font-medium max-w-xl mx-auto">Sinergi kepemimpinan yang mendorong inovasi di setiap langkah.</p>
                </div>

                <div className="relative flex flex-col items-center">

                    {/* Hierarchy Nodes */}
                    <div className="flex flex-col gap-24 w-full relative z-10">
                        {/* Level 1: Wali Kelas */}
                        <StructureCard member={wali} role="Wali Kelas" size="lg" delay={0.1} />

                        {/* Level 2: Ketua */}
                        <StructureCard member={ketua} role="Ketua Kelas" size="lg" delay={0.2} />

                        {/* Level 3: Wakil */}
                        <StructureCard member={wakil} role="Wakil Ketua" size="lg" delay={0.3} />

                        {/* Level 4: Branches */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-x-12 w-full max-w-5xl mx-auto">
                            {/* Sekretaris Side */}
                            <div className="space-y-12">
                                <div className="text-center">
                                    <span className="bg-white/80 px-4 py-1.5 rounded-full border border-white text-[#86868b] text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm">Sekretaris</span>
                                </div>
                                <div className="space-y-12">
                                    <StructureCard member={sek1} role="Sekretaris 1" delay={0.4} />
                                    <StructureCard member={sek2} role="Sekretaris 2" delay={0.5} />
                                </div>
                            </div>

                            {/* Bendahara Side */}
                            <div className="space-y-12">
                                <div className="text-center">
                                    <span className="bg-white/80 px-4 py-1.5 rounded-full border border-white text-[#86868b] text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm">Bendahara</span>
                                </div>
                                <div className="space-y-12">
                                    <StructureCard member={ben1} role="Bendahara 1" delay={0.4} />
                                    <StructureCard member={ben2} role="Bendahara 2" delay={0.5} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Structure
