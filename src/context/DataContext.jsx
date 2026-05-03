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
    const [eventData, setEventData] = useState({
        isActive: false,
        title: 'Ramadhan 1447 H',
        description: 'Counting Down To',
        targetDate: new Date().toISOString(),
        backgroundImage: null
    })
    const [loading, setLoading] = useState(true)

    // Listen to Firebase Realtime Database
    useEffect(() => {
        const membersRef = ref(db, 'members')
        const galleryRef = ref(db, 'gallery')
        const structureRef = ref(db, 'structure')
        const eventRef = ref(db, 'ramadan') // Keeping the old DB key to not lose data

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

        const unsub4 = onValue(eventRef, (snapshot) => {
            const data = snapshot.val()
            if (data) setEventData({
                ...eventData,
                ...data
            })
        }, (err) => console.warn('Firebase event error:', err))

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

    const updateEventData = async (newEventData) => {
        setEventData(newEventData)
        try { await set(ref(db, 'ramadan'), newEventData) }
        catch (e) { console.warn('Failed to save event settings:', e) }
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
            eventData, updateEventData,
            resetToDefault,
            loading
        }}>
            {children}
        </DataContext.Provider>
    )
}
