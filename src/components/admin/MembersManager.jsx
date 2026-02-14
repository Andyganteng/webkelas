import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Save, X, Search, Instagram } from 'lucide-react'
import { useData } from '../../context/DataContext'

const MembersManager = () => {
    const { members, updateMembers } = useData()
    const [searchTerm, setSearchTerm] = useState('')
    const [editingIndex, setEditingIndex] = useState(null)
    const [editForm, setEditForm] = useState({ name: '', instagram: '' })
    const [showAddForm, setShowAddForm] = useState(false)
    const [addForm, setAddForm] = useState({ name: '', instagram: '' })

    const filtered = members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleEdit = (index) => {
        setEditingIndex(index)
        setEditForm({ ...members[index] })
    }

    const handleSaveEdit = () => {
        const updated = [...members]
        updated[editingIndex] = { ...editForm }
        updateMembers(updated)
        setEditingIndex(null)
    }

    const handleDelete = (index) => {
        if (window.confirm(`Hapus "${members[index].name}"?`)) {
            const updated = members.filter((_, i) => i !== index)
            updateMembers(updated)
        }
    }

    const handleAdd = () => {
        if (!addForm.name.trim()) return
        updateMembers([...members, { name: addForm.name.trim(), instagram: addForm.instagram.trim() }])
        setAddForm({ name: '', instagram: '' })
        setShowAddForm(false)
    }

    return (
        <div>
            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-[#1d1d1f]">Kelola Anggota</h2>
                    <p className="text-sm text-[#86868b] font-medium">{members.length} anggota terdaftar</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" size={16} />
                        <input
                            type="text"
                            placeholder="Cari nama..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3]/30 transition-all font-medium"
                        />
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#0071e3] text-white text-sm font-bold rounded-xl hover:bg-[#0077ED] transition-all shadow-sm whitespace-nowrap"
                    >
                        <Plus size={16} />
                        Tambah
                    </button>
                </div>
            </div>

            {/* Add Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-6"
                    >
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="font-bold text-[#1d1d1f] mb-4">Tambah Anggota Baru</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Nama lengkap"
                                    value={addForm.name}
                                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                    className="px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:bg-white transition-all text-sm font-medium"
                                />
                                <input
                                    type="url"
                                    placeholder="Link Instagram (opsional)"
                                    value={addForm.instagram}
                                    onChange={(e) => setAddForm({ ...addForm, instagram: e.target.value })}
                                    className="px-4 py-3 bg-[#F5F5F7] rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:bg-white transition-all text-sm font-medium"
                                />
                            </div>
                            <div className="flex gap-2 mt-4">
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

            {/* Members Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#F5F5F7] border-b border-gray-200">
                                <th className="px-6 py-3 text-left font-bold text-[#86868b] text-xs uppercase tracking-wider">No</th>
                                <th className="px-6 py-3 text-left font-bold text-[#86868b] text-xs uppercase tracking-wider">Nama</th>
                                <th className="px-6 py-3 text-left font-bold text-[#86868b] text-xs uppercase tracking-wider">Instagram</th>
                                <th className="px-6 py-3 text-right font-bold text-[#86868b] text-xs uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((member, idx) => {
                                const realIndex = members.indexOf(member)
                                const isEditing = editingIndex === realIndex

                                return (
                                    <motion.tr
                                        key={realIndex}
                                        layout
                                        className="border-b border-gray-100 hover:bg-[#F5F5F7]/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-[#86868b] font-medium">{idx + 1}</td>
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="w-full px-3 py-2 bg-[#F5F5F7] rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 text-sm font-medium"
                                                />
                                            ) : (
                                                <span className="font-semibold text-[#1d1d1f]">{member.name}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <input
                                                    type="url"
                                                    value={editForm.instagram}
                                                    onChange={(e) => setEditForm({ ...editForm, instagram: e.target.value })}
                                                    placeholder="https://instagram.com/..."
                                                    className="w-full px-3 py-2 bg-[#F5F5F7] rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 text-sm font-medium"
                                                />
                                            ) : member.instagram ? (
                                                <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#0071e3] hover:underline font-medium">
                                                    <Instagram size={14} />
                                                    Link
                                                </a>
                                            ) : (
                                                <span className="text-[#d1d1d6]">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {isEditing ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={handleSaveEdit} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all">
                                                        <Save size={16} />
                                                    </button>
                                                    <button onClick={() => setEditingIndex(null)} className="p-2 text-[#86868b] hover:bg-gray-100 rounded-lg transition-all">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-end gap-1">
                                                    <button onClick={() => handleEdit(realIndex)} className="p-2 text-[#86868b] hover:text-[#0071e3] hover:bg-blue-50 rounded-lg transition-all">
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(realIndex)} className="p-2 text-[#86868b] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12 text-[#86868b]">
                        <p className="font-medium">Tidak ada anggota ditemukan</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MembersManager
