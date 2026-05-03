import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useData } from '../context/DataContext';
import ProfileCard from './reactbits/ProfileCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Stagger effect for "1 persatu"
    }
  }
};

const glitchVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: [0, 1, 0, 1, 0.3, 1],
    transition: {
      duration: 0.4,
      ease: "linear",
      times: [0, 0.2, 0.4, 0.6, 0.8, 1]
    }
  }
};

export default function Members() {
  const { members } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(member => {
    const name = member.name || '';
    return name.toLowerCase().includes(searchTerm.trim().toLowerCase());
  });

  return (
    <section id="anggota" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col items-center mb-16 md:mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1d1d1f] mb-4">Anggota Kelas</h2>
            <p className="text-[#86868b] text-xl md:text-2xl font-medium max-w-2xl mx-auto tracking-tight">
              38 siswa xi rpl 2
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full max-w-md mt-12 group"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-[#F5F5F7] border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all text-[#1d1d1f] font-medium"
            />
          </motion.div>
        </div>

        {/* Glitch Staggered Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {filteredMembers.map((member, index) => (
            <motion.div key={index} variants={glitchVariants}>
              <ProfileCard member={member} />
            </motion.div>
          ))}
        </motion.div>

        {filteredMembers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-[#86868b] font-medium"
          >
            <p className="text-lg">No members found.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
