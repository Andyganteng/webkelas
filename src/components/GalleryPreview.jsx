import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

export default function GalleryPreview() {
  const { gallery } = useData();
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Get the latest 8 images
  const previewImages = gallery
    .flatMap(album => album.images.map((img, i) => ({ 
      id: `${album.category}-${i}`,
      image: img, 
      title: album.title, 
      category: album.category,
      desc: album.description 
    })))
    .filter(img => img.image !== '/coming-soon')
    .slice(0, 8);

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : previewImages.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev < previewImages.length - 1 ? prev + 1 : 0));
  };

  const selectedImage = selectedIndex !== null ? previewImages[selectedIndex] : null;

  return (
    <section id="galeri" className="py-24 md:py-32 bg-[#F5F5F7] relative">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1d1d1f] mb-4">Gallery.</h2>
            <p className="text-[#86868b] text-xl font-medium tracking-tight max-w-xl">
              Beberapa momen terbaik yang terekam.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onClick={() => navigate('/gallery')}
            className="group flex items-center gap-2 bg-[#1d1d1f] text-white px-6 py-3 rounded-full font-bold hover:bg-black transition-all"
          >
            Lihat Semua <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {previewImages.length > 0 ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {previewImages.map((img, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="break-inside-avoid relative rounded-3xl overflow-hidden group cursor-pointer bg-gray-200 mb-4"
                onClick={() => setSelectedIndex(idx)}
              >
                <img 
                  src={img.image} 
                  alt={img.title} 
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                
                {/* Pinterest-like hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <p className="text-white font-bold text-base line-clamp-1">{img.title}</p>
                    <p className="text-white/90 font-medium text-xs mt-1 bg-white/20 w-fit px-2 py-1 rounded-md backdrop-blur-sm">{img.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#86868b] font-medium">
            <p className="text-lg">No photos found.</p>
          </div>
        )}
      </div>

      {/* Lightbox with Next/Prev Buttons */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedIndex(null)}
          >
            <button className="absolute top-6 right-6 p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-50 text-black">
              <X size={24} />
            </button>

            {/* Navigation Buttons */}
            {previewImages.length > 1 && (
              <>
                <button 
                  onClick={handlePrev}
                  className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:scale-110 transition-all z-50 shadow-lg text-black"
                >
                  <ChevronLeft size={32} />
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:scale-110 transition-all z-50 shadow-lg text-black"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            <div className="max-w-6xl w-full h-full flex flex-col items-center justify-center gap-6" onClick={e => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
                />
              </AnimatePresence>
              
              <motion.div
                key={`desc-${selectedImage.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center bg-white/50 backdrop-blur-md px-8 py-4 rounded-3xl"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">{selectedImage.category}</p>
                <h3 className="text-[#1d1d1f] text-2xl font-bold mb-2">{selectedImage.title}</h3>
                <p className="text-[#86868b] text-base max-w-lg mx-auto">{selectedImage.desc}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
