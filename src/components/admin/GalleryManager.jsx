import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Save, X, Image, PlusCircle, MinusCircle, Upload, Loader } from 'lucide-react'
import { useData } from '../../context/DataContext'

// Compress image to small base64 for storing in Realtime Database
const compressImage = (file, maxWidth = 600) => {
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
                resolve(canvas.toDataURL('image/jpeg', 0.5))
            }
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
    })
}

const GalleryManager = () => {
    const { gallery, updateGallery } = useData()
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [addForm, setAddForm] = useState({
        title: '', description: '', date: '', category: '', images: ['']
    })
    const [uploading, setUploading] = useState(false)

    const handleEdit = (album) => {
        setEditingId(album.id)
        setEditForm({ ...album, images: [...album.images] })
    }

    const handleSaveEdit = () => {
        const updated = gallery.map(a => a.id === editingId ? { ...editForm } : a)
        updateGallery(updated)
        setEditingId(null)
        setEditForm(null)
    }

    const handleDelete = (id) => {
        const album = gallery.find(a => a.id === id)
        if (window.confirm(`Hapus album "${album.title}"?`)) {
            updateGallery(gallery.filter(a => a.id !== id))
        }
    }

    const handleAdd = () => {
        if (!addForm.title.trim()) return
        const newId = Math.max(0, ...gallery.map(a => a.id)) + 1
        const cleaned = {
            ...addForm,
            id: newId,
            images: addForm.images.filter(img => img.trim() !== '')
        }
        if (cleaned.images.length === 0) cleaned.images = ['/coming-soon']
        updateGallery([...gallery, cleaned])
        setAddForm({ title: '', description: '', date: '', category: '', images: [''] })
        setShowAddForm(false)
    }

    const removeImageField = (form, setForm, idx) => {
        const imgs = form.images.filter((_, i) => i !== idx)
        setForm({ ...form, images: imgs.length ? imgs : [''] })
    }

    const updateImageField = (form, setForm, idx, value) => {
        const imgs = [...form.images]
        imgs[idx] = value
        setForm({ ...form, images: imgs })
    }

    const handleFileUpload = async (form, setForm, files) => {
        if (!files || files.length === 0) return
        setUploading(true)
        try {
            const newImages = []
            for (const file of files) {
                const dataUrl = await compressImage(file)
                newImages.push(dataUrl)
            }
            const existingImages = form.images.filter(img => img.trim() !== '')
            setForm({ ...form, images: [...existingImages, ...newImages] })
        } catch (err) {
            alert('Gagal upload gambar: ' + err.message)
        }
        setUploading(false)
    }

    const ImageFields = ({ form, setForm }) => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#86868b] uppercase tracking-wider">Gambar</label>
                <span className="text-xs text-[#86868b]">{form.images.filter(i => i.trim()).length} foto</span>
            </div>

            {/* Upload Button */}
            <label className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${uploading ? 'border-blue-300 bg-blue-50/50 pointer-events-none' : 'border-gray-200 hover:border-[#0071e3]/30 hover:bg-blue-50/30'}`}>
                {uploading ? (
                    <Loader size={16} className="text-[#0071e3] animate-spin" />
                ) : (
                    <Upload size={16} className="text-[#0071e3]" />
                )}
                <span className="text-sm font-medium text-[#0071e3]">
                    {uploading ? 'Mengupload...' : 'Upload Gambar'}
                </span>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => handleFileUpload(form, setForm, e.target.files)}
                />
            </label>

            {/* Image previews & URL inputs */}
            {form.images.map((img, idx) => (
                <div key={idx} className="flex items-center gap-2">
                    {img && (img.startsWith('data:') || img.startsWith('/') || img.startsWith('http')) && img !== '/coming-soon' && (
                        <img src={img} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-200" />
                    )}
                    <input
                        type="text"
                        value={img}
                        onChange={(e) => updateImageField(form, setForm, idx, e.target.value)}
                        placeholder="/gallery/nama-foto.jpg"
                        className="flex-1 px-4 py-2.5 bg-[#F5F5F7] rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:bg-white transition-all text-sm font-medium"
                    />
                    <button onClick={() => removeImageField(form, setForm, idx)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <MinusCircle size={18} />
                    </button>
                </div>
            ))}
            <button onClick={() => setForm({ ...form, images: [...form.images, ''] })} className="flex items-center gap-2 text-sm text-[#0071e3] font-medium hover:underline mt-1">
                <PlusCircle size={14} /> Tambah URL manual
            </button>
        </div>
    )

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-[#1d1d1f]">Kelola Galeri</h2>
                    <p className="text-sm text-[#86868b] font-medium">{gallery.length} album</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#0071e3] text-white text-sm font-bold rounded-xl hover:bg-[#0077ED] transition-all shadow-sm"
                >
                    <Plus size={16} /> Tambah Album
                </button>
            </div>

            {/* Add Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
                            <h3 className="font-bold text-[#1d1d1f]">Album Baru</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input type="text" placeholder="Judul album" value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                                    className="px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:bg-white transition-all text-sm font-medium" />
                                <input type="text" placeholder="Kategori (e.g. Kegiatan)" value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                                    className="px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:bg-white transition-all text-sm font-medium" />
                                <input type="text" placeholder="Tanggal (e.g. 2025)" value={addForm.date} onChange={(e) => setAddForm({ ...addForm, date: e.target.value })}
                                    className="px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:bg-white transition-all text-sm font-medium" />
                            </div>
                            <textarea placeholder="Deskripsi album" value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} rows={3}
                                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:bg-white transition-all text-sm font-medium resize-none" />
                            <ImageFields form={addForm} setForm={setAddForm} />
                            <div className="flex gap-2 pt-2">
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

            {/* Album Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gallery.map((album) => {
                    const isEditing = editingId === album.id
                    const cover = album.images[0] !== '/coming-soon' ? album.images[0] : null

                    return (
                        <motion.div key={album.id} layout className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                            {/* Cover Preview */}
                            <div className="h-40 bg-[#F5F5F7] relative overflow-hidden">
                                {cover ? (
                                    <img src={cover} alt={album.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#d1d1d6]">
                                        <Image size={40} />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-1.5">
                                    {!isEditing && (
                                        <>
                                            <button onClick={() => handleEdit(album)} className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-[#86868b] hover:text-[#0071e3] shadow-sm transition-all">
                                                <Pencil size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(album.id)} className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-[#86868b] hover:text-red-500 shadow-sm transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="absolute bottom-3 left-3">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-[#0071e3]">{album.category}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 space-y-3">
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Judul"
                                            className="w-full px-3 py-2 bg-[#F5F5F7] rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20" />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input type="text" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} placeholder="Kategori"
                                                className="px-3 py-2 bg-[#F5F5F7] rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20" />
                                            <input type="text" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} placeholder="Tanggal"
                                                className="px-3 py-2 bg-[#F5F5F7] rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20" />
                                        </div>
                                        <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={2} placeholder="Deskripsi"
                                            className="w-full px-3 py-2 bg-[#F5F5F7] rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 resize-none" />
                                        <ImageFields form={editForm} setForm={setEditForm} />
                                        <div className="flex gap-2 pt-1">
                                            <button onClick={handleSaveEdit} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0071e3] text-white text-xs font-bold rounded-lg hover:bg-[#0077ED] transition-all">
                                                <Save size={12} /> Simpan
                                            </button>
                                            <button onClick={() => { setEditingId(null); setEditForm(null) }} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-[#1d1d1f] text-xs font-bold rounded-lg hover:bg-gray-200 transition-all">
                                                <X size={12} /> Batal
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="font-bold text-[#1d1d1f]">{album.title}</h3>
                                        <p className="text-sm text-[#86868b] line-clamp-2">{album.description}</p>
                                        <div className="flex items-center gap-3 text-xs text-[#86868b] font-medium">
                                            <span>{album.date}</span>
                                            <span>•</span>
                                            <span>{album.images.filter(i => i !== '/coming-soon').length} foto</span>
                                        </div>
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

export default GalleryManager
