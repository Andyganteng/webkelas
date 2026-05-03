import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Grid, Users, Image as ImageIcon, BookOpen, LogIn, Shield } from 'lucide-react';
import GooeyNav from './reactbits/GooeyNav';
import Dock from './reactbits/Dock';

const playNotifSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const playTone = (freq, start, dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.18, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    };
    playTone(987, 0, 0.15);
    playTone(740, 0.18, 0.15);
    playTone(987, 0.5, 0.15);
    playTone(740, 0.68, 0.15);
  } catch (e) {}
};

const links = [
  { id: 'home', label: 'Home', icon: Home, href: '/' },
  { id: 'struktur', label: 'Struktur', icon: Grid, href: '/#struktur' },
  { id: 'anggota', label: 'Anggota', icon: Users, href: '/#anggota' },
  { id: 'galeri', label: 'Galeri', icon: ImageIcon, href: '/gallery' },
  { id: 'kontak', label: 'Guestbook', icon: BookOpen, href: '/#kontak' },
];

const mobileLinks = [...links, { id: 'login', label: 'Login', icon: LogIn, href: '/admin' }];

export default function Navbar() {
  const [activeId, setActiveId] = useState('home');
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/gallery') {
      setActiveId('galeri');
      return;
    }

    const handleScroll = () => {
      const sections = ['struktur', 'anggota', 'kontak'];
      let current = 'home';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 150) {
          current = section;
        }
      }
      setActiveId(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleSelect = (link) => {
    if (link.id === 'login') {
      handleLoginClick();
      return;
    }
    
    setActiveId(link.id);

    if (link.href === '/gallery') {
      navigate('/gallery');
      return;
    }

    if (location.pathname !== '/') {
      navigate(link.href);
      return;
    }

    // Smooth scroll if on home page
    const targetId = link.href.split('#')[1];
    if (targetId) {
        const target = document.getElementById(targetId);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoginClick = () => {
    setShowNotif(true);
    playNotifSound();
  };

  const confirmLogin = () => {
    setShowNotif(false);
    navigate('/admin');
  };

  return (
    <>
      <AnimatePresence>
        {showNotif && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-white/90 backdrop-blur-2xl rounded-2xl max-w-xs w-full overflow-hidden shadow-2xl border border-white/50"
            >
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                  <Shield size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Login Admin</h3>
                <p className="text-sm text-gray-600">Anda akan diarahkan ke halaman login admin. Lanjutkan?</p>
              </div>
              <div className="flex border-t border-gray-200">
                <button onClick={() => setShowNotif(false)} className="flex-1 py-3 text-sm font-semibold text-gray-600 border-r border-gray-200 hover:bg-gray-50 active:bg-gray-100">Batal</button>
                <button onClick={confirmLogin} className="flex-1 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 active:bg-blue-100">Lanjutkan</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 left-0 right-0 z-50 hidden md:flex justify-center"
      >
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center justify-center hover:scale-105 transition-transform">
            {/* Logo made larger */}
            <img src="/logo.png" alt="Logo" className="h-16 md:h-20 object-contain" />
          </a>
          
          <GooeyNav 
            links={links} 
            activeId={activeId} 
            onSelect={handleSelect} 
          />

          <button
            onClick={handleLoginClick}
            className="w-12 h-12 bg-[#1d1d1f] rounded-full flex items-center justify-center text-white shadow-md hover:bg-black hover:scale-105 transition-transform"
          >
            <LogIn size={20} />
          </button>
        </div>
      </motion.nav>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="fixed bottom-6 left-0 right-0 z-50 md:hidden flex justify-center pointer-events-none"
      >
        <div className="pointer-events-auto">
          <Dock 
            items={mobileLinks}
            activeId={activeId}
            onSelect={handleSelect}
          />
        </div>
      </motion.div>
    </>
  );
}
