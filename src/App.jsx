import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Structure from './components/Structure'
import Members from './components/Members'
import GalleryPreview from './components/GalleryPreview'
import GalleryPage from './components/GalleryPage'
import Guestbook from './components/Guestbook'
import Footer from './components/Footer'
import Loading from './components/Loading'
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import { DataProvider } from './context/DataContext'
import { AnimatePresence } from 'framer-motion'

function MainSite() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 3500)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href.startsWith('/')) return;
                e.preventDefault()
                const target = document.querySelector(href)
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' })
                }
            })
        })
    }, [])

    return (
        <AnimatePresence mode="wait">
            {loading ? (
                <Loading key="loader" />
            ) : (
                <main className="relative bg-white min-h-screen text-[#1d1d1f] pb-24 md:pb-0">
                    <Navbar />
                    <Hero />
                    <Structure />
                    <Members />
                    <GalleryPreview />
                    <Guestbook />
                    <Footer />
                </main>
            )}
        </AnimatePresence>
    )
}

function App() {
    return (
        <DataProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<MainSite />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Routes>
            </Router>
        </DataProvider>
    )
}

export default App
