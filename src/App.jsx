import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Structure from './components/Structure'
import Members from './components/Members'
import Gallery from './components/Gallery'
import Guestbook from './components/Guestbook'
import Footer from './components/Footer'
import Loading from './components/Loading'
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import { DataProvider } from './context/DataContext'
import { AnimatePresence } from 'framer-motion'
// import RamadanCountdown from './components/RamadanCountdown' // Removed for Hero integration

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
                e.preventDefault()
                const target = document.querySelector(this.getAttribute('href'))
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' })
                }
            })
        })
    }, [])

    // Determine what to show
    // 1. If loading is true -> Show Loading
    // 2. Else -> Show Main Site

    return (
        <AnimatePresence mode="wait">
            {loading ? (
                <Loading key="loader" />
            ) : (
                <main className="relative">
                    <Navbar />
                    <Hero />
                    <Structure />
                    <Members />
                    <Gallery />
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
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Routes>
            </Router>
        </DataProvider>
    )
}

export default App
