import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Structure from './components/Structure'
import Members from './components/Members'
import Gallery from './components/Gallery'
import Guestbook from './components/Guestbook'
import Footer from './components/Footer'
import Loading from './components/Loading'
import { AnimatePresence } from 'framer-motion'

function App() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 3500)
        return () => clearTimeout(timer)
    }, [])

    // Smooth scroll for anchor links
    useEffect(() => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault()
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                })
            })
        })
    }, [])

    return (
        <>
            {/* Background Handled in CSS Body */}

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
        </>
    )
}

export default App
