import { createContext, useContext, useState, useEffect } from 'react'
import defaultMembers from '../data/members'
import defaultGallery from '../data/gallery'
import defaultStructure from '../data/structure'

const DataContext = createContext()

export const useData = () => useContext(DataContext)

const safeLoad = (key, fallback) => {
    try {
        const saved = localStorage.getItem(key)
        if (saved) {
            const parsed = JSON.parse(saved)
            if (Array.isArray(parsed)) return parsed
        }
    } catch (e) {
        console.warn(`Failed to load ${key} from localStorage:`, e)
        localStorage.removeItem(key)
    }
    return fallback
}

export const DataProvider = ({ children }) => {
    const [members, setMembers] = useState(() => safeLoad('admin_members', defaultMembers))
    const [gallery, setGallery] = useState(() => safeLoad('admin_gallery', defaultGallery))
    const [structure, setStructure] = useState(() => safeLoad('admin_structure', defaultStructure))

    useEffect(() => {
        localStorage.setItem('admin_members', JSON.stringify(members))
    }, [members])

    useEffect(() => {
        localStorage.setItem('admin_gallery', JSON.stringify(gallery))
    }, [gallery])

    useEffect(() => {
        localStorage.setItem('admin_structure', JSON.stringify(structure))
    }, [structure])

    const updateMembers = (newMembers) => setMembers(newMembers)
    const updateGallery = (newGallery) => setGallery(newGallery)
    const updateStructure = (newStructure) => setStructure(newStructure)

    const resetToDefault = () => {
        setMembers(defaultMembers)
        setGallery(defaultGallery)
        setStructure(defaultStructure)
        localStorage.removeItem('admin_members')
        localStorage.removeItem('admin_gallery')
        localStorage.removeItem('admin_structure')
    }

    return (
        <DataContext.Provider value={{
            members, updateMembers,
            gallery, updateGallery,
            structure, updateStructure,
            resetToDefault
        }}>
            {children}
        </DataContext.Provider>
    )
}
