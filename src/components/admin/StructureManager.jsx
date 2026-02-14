import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Save, X, Instagram, Upload, Loader } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { storage } from '../../firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

// Compress image before upload for speed
const compressImage = (file, maxWidth = 400) => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const img = new window.Image()
            img.onload = () => {
                const canvas = document.createElement('canvas')
                const ratio = Math.min(maxWidth / img.width, 1)
                canvas.width = img.width * ratio
                canvas.height = img.height * ratio
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.7)
            }
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
    })
}

const uploadImage = async (file, path) => {
    const compressed = await compressImage(file)
    const imgRef = storageRef(storage, path)
    await uploadBytes(imgRef, compressed)
    return await getDownloadURL(imgRef)
}

const StructureManager = () => {
    const { structure, updateStructure } = useData()
    const [editingIndex, setEditingIndex] = useState(null)
    const [editForm, setEditForm] = useState(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [addForm, setAddForm] = useState({ role: '', name: '', image: '', instagram: '' })
    const [uploading, setUploading] = useState(false)

    const handleEdit = (index) => {
        setEditingIndex(index)
        setEditForm({ ...structure[index] })
    }

    const handleSaveEdit = () => {
        const updated = [...structure]
        updated[editingIndex] = { ...editForm }
        updateStructure(updated)
        setEditingIndex(null)
        setEditForm(null)
    }

    const handleDelete = (index) => {
        if (window.confirm(`Hapus "${structure[index].name}" dari struktur?`)) {
            updateStructure(structure.filter((_, i) => i !== index))
        }
    }

    const handleAdd = () => {
        if (!addForm.name.trim() || !addForm.role.trim()) return
        updateStructure([...structure, { ...addForm }])
        setAddForm({ role: '', name: '', image: '', instagram: '' })
        setShowAddForm(false)
    }

    const handleImageUpload = async (file, form, setForm) => {
        if (!file) return
        setUploading(true)
        try {
            const path = `structure/${Date.now()}_${file.name}`
            const url = await uploadImage(file, path)
            setForm({ ...form, image: url })
        } catch (e) {
            alert('Gagal upload gambar: ' + e.message)
        }
        setUploading(false)
    }

    const ImageUpload = ({ form, setForm }) => (
        <div className="space-y-2">
            <label className="text-xs font-bold text-[#86868b] uppercase tracking-wider">Foto</label>
            {form.image && (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                    <img src={form.image} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setForm({ ...form, image: '' })} className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full">
                        <X size={12} />
                    </button>
                </div>
            )}
            <div className="flex gap-2">
                <label className={`flex items-center gap-2 px-3 py-2 border-2 border-dashed rounded-xl cursor-pointer transition-all flex-1 ${uploading ? 'border-blue-300 bg-blue-50/50 pointer-events-none' : 'border-gray-200 hover:border-[#0071e3]/30 hover:bg-blue-50/30'}`}>
                    {uploading ? (
                        <Loader size={14} className="text-[#0071e3] animate-spin" />
                    ) : (
                        <Upload size={14} className="text-[#0071e3]" />
                    )}
                    <span className="text-xs font-medium text-[#0071e3]">
                        {uploading ? 'Mengupload...' : 'Upload'}
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => handleImageUpload(e.target.files[0], form, setForm)}
                    />
                </label>
                <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="atau URL/path"
                    className="flex-1 px-3 py-2 bg-[#F5F5F7] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20" />
            </div>
        </div>
    )

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-[#1d1d1f]">Kelola Struktur</h2>
                    <p className="text-sm text-[#86868b] font-medium">{structure.length} posisi</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#0071e3] text-white text-sm font-bold rounded-xl hover:bg-[#0077ED] transition-all shadow-sm"
                >
                    <Plus size={16} /> Tambah
                </button>
            </div>

            {/* Add Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
                            <h3 className="font-bold text-[#1d1d1f]">Tambah Posisi Baru</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input type="text" placeholder="Jabatan (e.g. Ketua Kelas)" value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                                    className="px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:bg-white transition-all text-sm font-medium" />
                                <input type="text" placeholder="Nama lengkap" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                    className="px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:bg-white transition-all text-sm font-medium" />
                                <input type="url" placeholder="Link Instagram (opsional)" value={addForm.instagram} onChange={(e) => setAddForm({ ...addForm, instagram: e.target.value })}
                                    className="px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:bg-white transition-all text-sm font-medium" />
                            </div>
                            <ImageUpload form={addForm} setForm={setAddForm} />
                            <div className="flex gap-2">
                                <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-[#0071e3] text-white text-sm font-bold rounded-xl hover:bg-[#0077ED] transition-all">
                                    <Save size={14} /> Simpan
                                </button>
                                <button onClick={() => setShowAddForm(false)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-[#1d1d1f] text-sm font-bold rounded-xl hover:bg-gray-200 transition-all">
                                    <X size={14} /> Batal
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Structure Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {structure.map((member, index) => {
                    const isEditing = editingIndex === index
                    return (
                        <motion.div key={index} layout className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                            {/* Image */}
                            <div className="h-36 bg-[#F5F5F7] relative overflow-hidden">
                                {member.image ? (
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover"
                                        onError={(e) => { e.target.style.display = 'none' }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-[#d1d1d6]">
                                        {member.name.charAt(0)}
                                    </div>
                                )}
                                {!isEditing && (
                                    <div className="absolute top-3 right-3 flex gap-1.5">
                                        <button onClick={() => handleEdit(index)} className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-[#86868b] hover:text-[#0071e3] shadow-sm transition-all">
                                            <Pencil size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(index)} className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-[#86868b] hover:text-red-500 shadow-sm transition-all">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <input type="text" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} placeholder="Jabatan"
                                            className="w-full px-3 py-2 bg-[#F5F5F7] rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20" />
                                        <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Nama"
                                            className="w-full px-3 py-2 bg-[#F5F5F7] rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20" />
                                        <ImageUpload form={editForm} setForm={setEditForm} />
                                        <input type="url" value={editForm.instagram} onChange={(e) => setEditForm({ ...editForm, instagram: e.target.value })} placeholder="Link Instagram"
                                            className="w-full px-3 py-2 bg-[#F5F5F7] rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20" />
                                        <div className="flex gap-2 pt-1">
                                            <button onClick={handleSaveEdit} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0071e3] text-white text-xs font-bold rounded-lg hover:bg-[#0077ED] transition-all">
                                                <Save size={12} /> Simpan
                                            </button>
                                            <button onClick={() => { setEditingIndex(null); setEditForm(null) }} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-[#1d1d1f] text-xs font-bold rounded-lg hover:bg-gray-200 transition-all">
                                                <X size={12} /> Batal
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-[#0071e3] font-bold text-[9px] uppercase tracking-[0.2em] bg-blue-50/50 px-3 py-1 rounded-full">{member.role}</span>
                                        <h3 className="font-bold text-[#1d1d1f] mt-3 text-base">{member.name}</h3>
                                        {member.instagram && (
                                            <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-sm text-[#0071e3] hover:underline font-medium">
                                                <Instagram size={14} /> Instagram
                                            </a>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}

export default StructureManager
