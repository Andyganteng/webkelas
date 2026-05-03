import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Image as ImageIcon, Network, LogOut, ChevronLeft, CalendarClock } from 'lucide-react'
import MembersManager from './MembersManager'
import GalleryManager from './GalleryManager'
import StructureManager from './StructureManager'
import EventManager from './EventManager'

const tabs = [
    { id: 'members', label: 'Anggota', icon: Users },
    { id: 'gallery', label: 'Galeri', icon: ImageIcon },
    { id: 'structure', label: 'Struktur', icon: Network },
    { id: 'event', label: 'Event', icon: CalendarClock },
]

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('members')
    const navigate = useNavigate()

    const handleLogout = () => {
        sessionStorage.removeItem('admin_auth')
        navigate('/admin')
    }

    const isAuth = sessionStorage.getItem('admin_auth') === 'true'
    if (!isAuth) {
        navigate('/admin')
        return null
    }

    return (
        <div className="min-h-screen bg-[#f2f2f7]">
            {/* iOS-style Navigation Bar */}
            <div className="sticky top-0 z-50 bg-[#f2f2f7]/80 backdrop-blur-xl border-b border-[#c6c6c8]/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-5">
                    {/* Top row */}
                    <div className="flex items-center justify-between py-3">
                        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-[#007aff] text-[15px] font-medium hover:opacity-80 transition-opacity">
                            <ChevronLeft size={20} strokeWidth={2.5} />
                            <span className="hidden sm:inline">Website</span>
                        </button>

                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 bg-white shadow-sm p-0.5 border border-gray-100">
                                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-[16px] font-semibold text-[#1c1c1e] tracking-tight">Admin Dashboard</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={handleLogout} className="text-[#ff3b30] text-[14px] font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>

                    {/* iOS Segmented Control */}
                    <div className="pb-4">
                        <div className="bg-[#e9e9eb] rounded-[9px] p-[2px] flex relative max-w-2xl mx-auto">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="flex-1 relative z-10 flex items-center justify-center gap-1.5 py-[7px] text-[13px] font-semibold transition-colors duration-200"
                                    style={{ color: activeTab === tab.id ? '#1c1c1e' : '#8e8e93' }}
                                >
                                    <tab.icon size={14} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                            {/* Sliding indicator */}
                            <motion.div
                                className="absolute top-[2px] bottom-[2px] rounded-[7px] bg-white shadow-sm border border-black/5"
                                style={{ width: `${100 / tabs.length}%` }}
                                animate={{ left: `${tabs.findIndex(t => t.id === activeTab) * (100 / tabs.length)}%` }}
                                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-5 py-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        {activeTab === 'members' && <MembersManager />}
                        {activeTab === 'gallery' && <GalleryManager />}
                        {activeTab === 'structure' && <StructureManager />}
                        {activeTab === 'event' && <EventManager />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default AdminDashboard
