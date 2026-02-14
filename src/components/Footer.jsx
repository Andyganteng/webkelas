import { Instagram, Globe, ArrowUpRight } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-[#F5F5F7] text-[#1d1d1f] py-20 px-4 border-t border-gray-200">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="md:col-span-2">
                        <h2 className="text-3xl font-bold tracking-tight mb-6">XI RPL 02.</h2>
                        <p className="text-[#86868b] max-w-xs font-medium">
                            The next generation of software engineers. SMK PGRI 01 Sukorejo.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 text-sm">
                        <span className="font-bold text-[#1d1d1f]">Socials</span>
                        <div className="flex flex-col gap-3 text-[#86868b] font-medium">
                            <a href="https://instagram.com/twowebsite_skagris" className="hover:text-[#0071e3] transition-colors">Instagram</a>
                            <a href="https://tiktok.com/@xi_rpl2.web_skagr" className="hover:text-[#0071e3] transition-colors">TikTok</a>
                            <a href="https://linktr.ee/xiRPL02" className="hover:text-[#0071e3] transition-colors">Linktree</a>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 text-sm">
                        <span className="font-bold text-[#1d1d1f]">School</span>
                        <div className="flex flex-col gap-3 text-[#86868b] font-medium">
                            <a href="https://instagram.com/skagris_official" className="hover:text-[#0071e3] transition-colors">SKAGRIS</a>
                            <a href="https://spmb.smkpgri01sukorejo.sch.id" className="hover:text-[#0071e3] transition-colors">SPMB</a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-300 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[#86868b] font-medium">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <p className="text-xs">
                            © {new Date().getFullYear()} XI RPL 02. All rights reserved. Est. {new Date().getFullYear()}
                        </p>
                        <p className="text-[10px] opacity-60 italic">
                            Mohon maaf jika ada kesalahan dalam penulisan nama atau jabatan.
                        </p>
                    </div>

                    <a
                        href="https://andymy.wuaze.com"
                        target="_blank"
                        className="group flex items-center gap-2 text-xs hover:text-[#1d1d1f] transition-colors"
                    >
                        Developed by Andy My
                        <ArrowUpRight size={12} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
