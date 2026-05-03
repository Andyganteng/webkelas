import { Instagram, ArrowUpRight } from 'lucide-react';
import LogoSequence from './reactbits/LogoSequence';

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F7] text-[#1d1d1f] py-24 px-6 border-t border-gray-200">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          
          <div className="md:col-span-4 flex flex-col items-center md:items-start">
            <LogoSequence className="h-20 md:h-24 object-contain mb-4" />
            <p className="text-[#86868b] text-sm font-medium leading-relaxed mb-6 max-w-sm text-center md:text-left">
              Mengukir masa depan melalui barisan kode. The next generation of software engineers.
            </p>
          </div>

          <div className="md:col-span-5">
            {/* Timeline removed per user request */}
          </div>

          <div className="md:col-span-3 grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <span className="font-bold text-[#1d1d1f] uppercase tracking-widest text-xs">Socials</span>
              <a href="https://instagram.com/twowebsite_skagris" className="text-[#86868b] hover:text-[#0071e3] transition-colors text-sm font-medium">Instagram</a>
              <a href="https://tiktok.com/@xi_rpl2.web_skagr" className="text-[#86868b] hover:text-[#0071e3] transition-colors text-sm font-medium">TikTok</a>
              <a href="https://linktr.ee/xiRPL02" className="text-[#86868b] hover:text-[#0071e3] transition-colors text-sm font-medium">Linktree</a>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-bold text-[#1d1d1f] uppercase tracking-widest text-xs">School</span>
              <a href="https://instagram.com/skagris_official" className="text-[#86868b] hover:text-[#0071e3] transition-colors text-sm font-medium">SKAGRIS</a>
              <a href="https://spmb.smkpgri01sukorejo.sch.id" className="text-[#86868b] hover:text-[#0071e3] transition-colors text-sm font-medium">SPMB</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[#86868b] font-medium">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xs">© {new Date().getFullYear()} XI RPL 02. All rights reserved.</p>
            <p className="text-[10px] opacity-60 italic">
              Mohon maaf jika ada kesalahan dalam penulisan nama atau jabatan.
            </p>
          </div>

          <a
            href="https://github.com/Andyganteng"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 text-xs bg-white px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-all text-[#1d1d1f] shadow-sm"
          >
            <span className="font-bold">Developed by Andy My</span>
            <ArrowUpRight size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform text-[#0071e3]" />
          </a>
        </div>
      </div>
    </footer>
  );
}
