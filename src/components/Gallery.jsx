import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Search, ArrowDown, Clock } from 'lucide-react'
import { useData } from '../context/DataContext'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 20 }
    }
}

const Gallery = () => {
    const { gallery } = useData()
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [selectedImage, setSelectedImage] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [visibleCount, setVisibleCount] = useState(8)

    const allImages = gallery.flatMap(album =>
        album.images.map(img => ({
            src: img,
            category: album.category,
            title: album.title,
            desc: album.description,
            date: album.date
        }))
    )

    const filteredImages = allImages.filter(img => {
        const search = searchTerm.trim().toLowerCase()
        const matchesCategory = selectedCategory === "All" || img.category === selectedCategory
        const matchesSearch = img.title.toLowerCase().includes(search) ||
            img.category.toLowerCase().includes(search)
        return matchesCategory && matchesSearch
    })

    const displayImages = filteredImages.slice(0, visibleCount)
    const hasMore = visibleCount < filteredImages.length
    const categories = ["All", ...new Set(allImages.map(img => img.category))]

    const handleLoadMore = () => setVisibleCount(prev => prev + 8)

    const handleNext = () => {
        const currentIndex = filteredImages.findIndex(img => img.src === selectedImage.src)
        setSelectedImage(filteredImages[(currentIndex + 1) % filteredImages.length])
    }

    const handlePrev = () => {
        const currentIndex = filteredImages.findIndex(img => img.src === selectedImage.src)
        setSelectedImage(filteredImages[(currentIndex - 1 + filteredImages.length) % filteredImages.length])
    }

    return (
        <section id="galeri" className="py-32 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[#0071e3] font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Gallery</span>
                        <h2 className="heading-lg mb-4 text-[#1d1d1f]">Galeri Kelas.</h2>
                        <p className="text-[#86868b] text-xl font-medium max-w-xl mx-auto">
                            Koleksi momen terbaik XI RPL 02.
                        </p>
                    </motion.div>
                </div>

                {/* Filter & Search */}
                <div className="flex flex-col items-center gap-6 mb-16">
                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="relative w-full max-w-md group"
                    >
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#86868b] group-focus-within:text-[#0071e3] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Cari foto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-[#F5F5F7] border border-transparent rounded-full focus:outline-none focus:ring-4 focus:ring-[#0071e3]/10 focus:border-[#0071e3]/30 focus:bg-white transition-all font-medium text-[#1d1d1f]"
                        />
                    </motion.div>

                    {/* Category Pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                    >
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { setSelectedCategory(cat); setVisibleCount(8); }}
                                className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300 ${selectedCategory === cat
                                    ? 'bg-[#1d1d1f] text-white shadow-lg'
                                    : 'bg-[#F5F5F7] text-[#86868b] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* Grid */}
                <motion.div
                    key={selectedCategory + searchTerm}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                    <AnimatePresence mode='popLayout'>
                        {displayImages.map((img, idx) => {
                            if (img.src === "/coming-soon") {
                                return (
                                    <motion.div
                                        layout
                                        key={`coming-soon-${img.category}-${idx}`}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bento-card flex flex-col items-center justify-center p-8 text-center min-h-[300px] group"
                                    >
                                        <div className="w-16 h-16 bg-[#F5F5F7] rounded-full flex items-center justify-center mb-6 text-[#86868b] group-hover:text-[#0071e3] group-hover:scale-110 transition-all duration-300">
                                            <Clock size={28} />
                                        </div>
                                        <h3 className="font-bold text-[#1d1d1f] text-base mb-3">{img.category}</h3>
                                        <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                                            Coming Soon
                                        </span>
                                        <p className="text-[#86868b] text-sm mt-4 max-w-xs mx-auto font-medium">
                                            Dokumentasi kegiatan ini akan segera tersedia.
                                        </p>
                                    </motion.div>
                                )
                            }

                            return (
                                <motion.div
                                    layout
                                    key={img.id || `${img.src}-${idx}`}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    whileHover={{ y: -5 }}
                                    className="bento-card relative overflow-hidden group cursor-pointer"
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F5F7]">
                                        <img
                                            src={img.src}
                                            alt={img.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                                            <span className="bg-white/90 backdrop-blur-sm text-[#1d1d1f] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                                                View
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#0071e3]">
                                                {img.category}
                                            </span>
                                            <span className="text-[10px] text-[#86868b] font-medium">
                                                {img.date || '2025'}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-[#1d1d1f] text-sm leading-tight line-clamp-1">
                                            {img.title}
                                        </h3>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </motion.div>

                {/* Load More */}
                {hasMore && (
                    <div className="flex justify-center mt-16">
                        <button
                            onClick={handleLoadMore}
                            className="bg-[#F5F5F7] text-[#1d1d1f] px-8 py-4 rounded-full font-bold text-sm hover:bg-[#e8e8ed] transition-all flex items-center gap-2 group"
                        >
                            Muat Lebih Banyak
                            <ArrowDown size={16} className="group-hover:translate-y-1 transition-transform" />
                        </button>
                    </div>
                )}

                {filteredImages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 text-[#86868b] font-medium"
                    >
                        <p className="text-lg">Tidak ada foto ditemukan.</p>
                        <p className="text-sm opacity-60 mt-2">Coba kata kunci lain.</p>
                    </motion.div>
                )}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2.5 rounded-full z-50"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={20} />
                        </button>
                        <button
                            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-50"
                            onClick={(e) => { e.stopPropagation(); handlePrev() }}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-50"
                            onClick={(e) => { e.stopPropagation(); handleNext() }}
                        >
                            <ChevronRight size={24} />
                        </button>
                        <div
                            className="w-full max-w-6xl max-h-screen p-6 flex flex-col items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.img
                                key={selectedImage.src}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={selectedImage.src}
                                alt={selectedImage.title}
                                className="max-w-full max-h-[80vh] object-contain rounded-2xl"
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mt-6 text-center max-w-2xl"
                            >
                                <h3 className="text-white text-xl font-bold mb-2">{selectedImage.title}</h3>
                                <p className="text-white/60 text-sm font-medium">{selectedImage.desc}</p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default Gallery
