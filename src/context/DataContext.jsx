import { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../firebase'
import { ref, onValue, set } from 'firebase/database'
import defaultMembers from '../data/members'
import defaultGallery from '../data/gallery'
import defaultStructure from '../data/structure'

const DataContext = createContext()

export const useData = () => useContext(DataContext)

export const DataProvider = ({ children }) => {
    const [members, setMembers] = useState(defaultMembers)
    const [gallery, setGallery] = useState(defaultGallery)
    const [structure, setStructure] = useState(defaultStructure)
    const [ramadan, setRamadan] = useState({
        isActive: false,
        targetDate: new Date().toISOString(),
        backgroundImage: null
    })
    const [loading, setLoading] = useState(true)

    // Listen to Firebase Realtime Database
    useEffect(() => {
        const membersRef = ref(db, 'members')
        const galleryRef = ref(db, 'gallery')
        const structureRef = ref(db, 'structure')
        const ramadanRef = ref(db, 'ramadan')

        const unsub1 = onValue(membersRef, (snapshot) => {
            const data = snapshot.val()
            if (data && Array.isArray(data)) setMembers(data)
        }, (err) => console.warn('Firebase members error:', err))

        const unsub2 = onValue(galleryRef, (snapshot) => {
            const data = snapshot.val()
            if (data && Array.isArray(data)) setGallery(data)
        }, (err) => console.warn('Firebase gallery error:', err))

        const unsub3 = onValue(structureRef, (snapshot) => {
            const data = snapshot.val()
            if (data && Array.isArray(data)) setStructure(data)
        }, (err) => console.warn('Firebase structure error:', err))

        const unsub4 = onValue(ramadanRef, (snapshot) => {
            const data = snapshot.val()
            if (data) setRamadan(data)
        }, (err) => console.warn('Firebase ramadan error:', err))

        setLoading(false)

        return () => {
            unsub1()
            unsub2()
            unsub3()
            unsub4()
        }
    }, [])

    // Save functions → write to Firebase
    const updateMembers = async (newMembers) => {
        setMembers(newMembers)
        try { await set(ref(db, 'members'), newMembers) }
        catch (e) { console.warn('Failed to save members:', e) }
    }

    const updateGallery = async (newGallery) => {
        setGallery(newGallery)
        try { await set(ref(db, 'gallery'), newGallery) }
        catch (e) { console.warn('Failed to save gallery:', e) }
    }

    const updateStructure = async (newStructure) => {
        setStructure(newStructure)
        try { await set(ref(db, 'structure'), newStructure) }
        catch (e) { console.warn('Failed to save structure:', e) }
    }

    const updateRamadan = async (newRamadan) => {
        setRamadan(newRamadan)
        try { await set(ref(db, 'ramadan'), newRamadan) }
        catch (e) { console.warn('Failed to save ramadan settings:', e) }
    }

    const resetToDefault = async () => {
        setMembers(defaultMembers)
        setGallery(defaultGallery)
        setStructure(defaultStructure)
        try {
            await set(ref(db, 'members'), defaultMembers)
            await set(ref(db, 'gallery'), defaultGallery)
            await set(ref(db, 'structure'), defaultStructure)
        } catch (e) { console.warn('Failed to reset:', e) }
    }

    return (
        <DataContext.Provider value={{
            members, updateMembers,
            gallery, updateGallery,
            structure, updateStructure,
            ramadan, updateRamadan,
            resetToDefault,
            loading
        }}>
            {children}
        </DataContext.Provider>
    )
}
