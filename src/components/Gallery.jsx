import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import Masonry from './reactbits/Masonry';
import TiltedCard from './reactbits/TiltedCard';

export default function Gallery() {
  const { gallery } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const allImages = gallery.flatMap(album =>
    album.images.map((img, i) => ({
      id: `${album.category}-${i}-${img.substring(img.lastIndexOf('/')+1, img.length)}`,
      image: img,
      height: 200 + Math.random() * 200, // Random height for masonry effect
      category: album.category,
      title: album.title,
      desc: album.description,
      date: album.date
    }))
  ).filter(img => img.image !== '/coming-soon');

  const filteredImages = allImages.filter(img => {
    const search = searchTerm.trim().toLowerCase();
    const matchesCategory = selectedCategory === 'All' || img.category === selectedCategory;
    const matchesSearch = img.title.toLowerCase().includes(search) || img.category.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', ...new Set(allImages.map(img => img.category))];

  return (
    <section id="galeri" className="py-24 md:py-32 bg-[#F5F5F7] relative">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1d1d1f] mb-4">Gallery.</h2>
            <p className="text-[#86868b] text-xl font-medium tracking-tight">
              Momen terbaik XI RPL 02.
            </p>
          </motion.div>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col items-center gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative w-full max-w-md group"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search moments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-[#1d1d1f] font-medium shadow-sm"
            />
          </motion.div>

          <div className="flex gap-2 overflow-x-auto pb-4 w-full px-4 md:px-0 scrollbar-hide snap-x justify-start md:justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-[#1d1d1f] text-white shadow-md'
                    : 'bg-white text-[#86868b] hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Content */}
        {filteredImages.length > 0 ? (
          <div onClick={(e) => {
              // Hack to find clicked image from masonry
              const target = e.target.closest('[style*="background-image"]');
              if(target) {
                  const urlMatch = target.style.backgroundImage.match(/url\("?(.+?)"?\)/);
                  if(urlMatch) {
                      const img = filteredImages.find(i => i.image === urlMatch[1]);
                      if(img) setSelectedImage(img);
                  }
              }
          }}>
            {!isMobile ? (
              <Masonry data={filteredImages} maxColumns={4} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredImages.map((img) => (
                  <TiltedCard key={img.id} className="w-full h-64">
                    <div 
                        className="w-full h-full rounded-2xl bg-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative cursor-pointer"
                        style={{
                            backgroundImage: `url(${img.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                        onClick={() => setSelectedImage(img)}
                    />
                  </TiltedCard>
                ))}
              </div>
            )}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-[#86868b] font-medium">
            <p className="text-lg">No photos found.</p>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-white/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-6 right-6 p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-50">
              <X size={24} />
            </button>
            <div className="max-w-5xl w-full flex flex-col items-center gap-6" onClick={e => e.stopPropagation()}>
              <motion.img
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full max-h-[70vh] object-contain rounded-3xl shadow-2xl"
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center bg-white/50 backdrop-blur-md px-8 py-4 rounded-3xl"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">{selectedImage.category}</p>
                <h3 className="text-[#1d1d1f] text-xl font-bold mb-1">{selectedImage.title}</h3>
                <p className="text-[#86868b] text-sm">{selectedImage.desc}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
