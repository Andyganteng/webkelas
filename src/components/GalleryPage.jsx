import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function GalleryPage() {
  const { gallery } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allImages = gallery.flatMap(album =>
    album.images.map((img, i) => ({
      id: `${album.category}-${i}-${img.substring(img.lastIndexOf('/')+1, img.length)}`,
      image: img,
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

  // Lightbox Navigation Functions
  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredImages.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev < filteredImages.length - 1 ? prev + 1 : 0));
  };

  const selectedImage = selectedIndex !== null ? filteredImages[selectedIndex] : null;

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 container mx-auto max-w-[1600px]">
        
        {/* Header & Controls */}
        <div className="flex flex-col items-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter text-[#1d1d1f] mb-8"
          >
            Gallery
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-3xl flex flex-col gap-6 items-center"
          >
            {/* Search Bar - Improved UI */}
            <div className="relative w-full group shadow-sm rounded-full bg-[#F5F5F7] hover:bg-[#EAEAEA] transition-colors border border-gray-200 focus-within:bg-white focus-within:border-gray-300 focus-within:shadow-md">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#86868b] group-focus-within:text-black transition-colors" size={20} />
              <input
                type="text"
                placeholder="Cari momen, acara, atau kegiatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-transparent border-none rounded-full focus:outline-none focus:ring-0 text-[#1d1d1f] font-medium text-lg"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Category Pills (Poin-poin) - Improved UI */}
            <div className="flex flex-wrap justify-center gap-3 w-full px-4 mt-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-full font-bold text-sm md:text-base whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-[#1d1d1f] text-white shadow-lg scale-105'
                      : 'bg-white text-[#86868b] hover:bg-gray-100 hover:text-black border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Pinterest-style Pure CSS Masonry Grid */}
        {filteredImages.length > 0 ? (
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
            {filteredImages.map((img, idx) => (
              <motion.div 
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 15) * 0.05 }}
                className="break-inside-avoid relative rounded-3xl overflow-hidden group cursor-pointer bg-gray-100 mb-4"
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
          <div className="text-center py-32 text-[#86868b] font-medium">
            <p className="text-lg">No photos found.</p>
          </div>
        )}
      </main>

      <Footer />

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
            {filteredImages.length > 1 && (
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
    </div>
  );
}
