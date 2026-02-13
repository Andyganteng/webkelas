import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const Guestbook = () => {
    return (
        <section id="kontak" className="py-32 px-4 bg-[#F5F5F7]">
            <div className="container mx-auto max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bento-card p-12 md:p-20 relative overflow-hidden bg-white"
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-[#0071e3] font-bold text-xs uppercase tracking-[0.3em] mb-6 block"
                    >
                        Anonymous Zone
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="heading-lg mb-8 text-[#1d1d1f]"
                    >
                        Punya uneg-uneg? <br />
                        Tulis di sini, aman kok.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="text-[#86868b] text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto font-medium"
                    >
                        Mau curhat, kasih kritik pedas, atau sekadar kirim pujian? Bebas!
                        Identitasmu dijamin 100% rahasia — no one will ever know. 🤫
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="flex justify-center relative z-10"
                    >
                        <a
                            href="https://secreto.site/id/a127z7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#1d1d1f] text-white px-10 py-5 rounded-full font-bold text-base hover:bg-[#333] transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-3"
                        >
                            Send Secret Message <ArrowRight size={18} />
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default Guestbook
