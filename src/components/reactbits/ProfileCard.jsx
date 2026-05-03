import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

export default function ProfileCard({ member }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative w-full aspect-[3/4] bg-white rounded-3xl overflow-hidden group border border-gray-100"
      style={{
        boxShadow: "0px 10px 30px rgba(0,0,0,0.05)" // No intense glow
      }}
    >
      <div className="absolute inset-0 bg-[#F5F5F7] z-0">
        {member.image ? (
            <img src={member.image} alt={member.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#d1d1d6]">
                <span className="text-6xl font-bold">{member.name.charAt(0)}</span>
            </div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

      <motion.div 
        className="absolute bottom-0 left-0 w-full p-4 md:p-6 z-20 flex flex-col justify-end translate-y-2 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
      >
        <h3 className="text-white text-base md:text-xl font-bold mb-1 tracking-tight">{member.name}</h3>
        {member.role && <p className="text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-3">{member.role}</p>}
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          {member.instagram ? (
            <a href={member.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full text-white text-[10px] md:text-sm font-medium hover:bg-white hover:text-black transition-colors">
              <Instagram size={12} className="md:size-4" /> @instagram
            </a>
          ) : (
            <span className="text-white/60 text-[10px] md:text-xs font-medium bg-black/40 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full backdrop-blur-md">No Social</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
