import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PixelBlast from './reactbits/PixelBlast';

export default function Guestbook() {
  return (
    <section id="kontak" className="py-32 bg-white text-[#1d1d1f] relative overflow-hidden">
      
      {/* Interactive PixelBlast Background */}
      <div className="absolute inset-0 z-0">
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#dbeafe" // Sangat soft light blue untuk tema putih
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.6}
          edgeFade={0.25}
          transparent
        />
      </div>

      <div className="container mx-auto max-w-4xl px-6 relative z-10 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center pointer-events-auto"
        >
          <span className="text-blue-500 font-bold text-xs uppercase tracking-[0.3em] mb-6 block">
            Guestbook
          </span>

          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight">
            Punya pesan? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Kirim diam-diam.
            </span>
          </h2>

          <p className="text-[#86868b] text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12">
            Identitasmu dijamin 100% rahasia. Mau kasih kritik, saran, atau pujian? Semuanya bebas di sini. No one will ever know.
          </p>

          <a
            href="https://secreto.site/id/a127z7"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 bg-[#1d1d1f] text-white px-8 py-4 rounded-full font-bold text-lg overflow-hidden transition-transform hover:scale-105 shadow-xl"
          >
            <span className="relative z-10">Kirim Pesan Rahasia</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
