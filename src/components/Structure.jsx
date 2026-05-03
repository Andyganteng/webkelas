import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { useData } from '../context/DataContext';
import TiltedCard from './reactbits/TiltedCard';

const StructureCard = ({ member, role, isLarge = false, delay = 0 }) => {
  if (!member) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: window.innerWidth < 768 ? 0 : delay }}
      className="w-full max-w-[260px] md:max-w-[320px] mx-auto z-10 scale-90 md:scale-100"
    >
      <TiltedCard className="w-full">
        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-md flex flex-col items-center text-center w-full">
          {/* Full Image instead of circle */}
          <div className="w-full aspect-square rounded-2xl overflow-hidden mb-5 bg-[#F5F5F7]">
            {member.image ? (
              <img src={member.image} alt={member.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-[#d1d1d6] uppercase">
                {member.name.charAt(0)}
              </div>
            )}
          </div>

          <h3 className={`${isLarge ? 'text-2xl' : 'text-xl'} font-bold text-[#1d1d1f] mb-2 leading-tight`}>{member.name}</h3>
          <p className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-5 bg-blue-50 px-4 py-1.5 rounded-full">{role}</p>

          {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#86868b] hover:text-black hover:bg-gray-200 transition-colors"
            >
              <Instagram size={20} />
            </a>
          )}
        </div>
      </TiltedCard>
    </motion.div>
  );
};

export default function Structure() {
  const { structure } = useData();
  const getMember = (role) => structure.find(m => m.role === role);

  const wali = getMember('Wali Kelas');
  const ketua = getMember('Ketua Kelas');
  const wakil = getMember('Wakil Ketua');
  const sek1 = getMember('Sekretaris 1');
  const sek2 = getMember('Sekretaris 2');
  const ben1 = getMember('Bendahara 1');
  const ben2 = getMember('Bendahara 2');

  return (
    <section id="struktur" className="py-24 md:py-32 bg-[#F5F5F7] relative">
      <div className="container mx-auto max-w-6xl px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1d1d1f] mb-4">Structure</h2>
            <p className="text-[#86868b] text-xl font-medium tracking-tight">
              Sinergi kepemimpinan yang mendorong inovasi.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col gap-12 w-full">
          <StructureCard member={wali} role="Wali Kelas" isLarge delay={0.1} />
          <StructureCard member={ketua} role="Ketua Kelas" isLarge delay={0.2} />
          <StructureCard member={wakil} role="Wakil Ketua" isLarge delay={0.3} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 w-full max-w-4xl mx-auto mt-8">
            <div className="space-y-12">
              <div className="text-center">
                <span className="text-[#86868b] text-xs font-bold uppercase tracking-widest">Sekretaris</span>
              </div>
              <StructureCard member={sek1} role="Sekretaris 1" delay={0.4} />
              <StructureCard member={sek2} role="Sekretaris 2" delay={0.5} />
            </div>

            <div className="space-y-12">
              <div className="text-center">
                <span className="text-[#86868b] text-xs font-bold uppercase tracking-widest">Bendahara</span>
              </div>
              <StructureCard member={ben1} role="Bendahara 1" delay={0.4} />
              <StructureCard member={ben2} role="Bendahara 2" delay={0.5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
