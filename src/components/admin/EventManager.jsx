import { useState, useEffect } from 'react'
import { Save, CalendarClock, Image as ImageIcon, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react'
import { useData } from '../../context/DataContext'

const EventManager = () => {
    const { eventData, updateEventData } = useData()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        isActive: false,
        title: '',
        description: '',
        targetDate: '',
        backgroundImage: ''
    })

    useEffect(() => {
        if (eventData) {
            setFormData({
                isActive: eventData.isActive || false,
                title: eventData.title || '',
                description: eventData.description || '',
                targetDate: eventData.targetDate || '',
                backgroundImage: eventData.backgroundImage || ''
            })
        }
    }, [eventData])

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 800000) { // 800KB limit
                alert("File terlalu besar! Pilih gambar di bawah 800KB.")
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, backgroundImage: reader.result }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = async () => {
        setIsLoading(true)
        await updateEventData(formData)
        setIsLoading(false)
        alert("Pengaturan event berhasil disimpan!")
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#1d1d1f] mb-1 flex items-center gap-2">
                        <CalendarClock className="text-[#007aff]" />
                        Kelola Event & Hitung Mundur
                    </h2>
                    <p className="text-[#86868b] text-sm font-medium">Ubah tampilan layar hitung mundur (countdown) untuk event kelas.</p>
                </div>

                <div className="space-y-8">
                    {/* Toggle Status */}
                    <div className="flex items-center justify-between p-5 bg-[#F5F5F7] rounded-2xl">
                        <div>
                            <h3 className="font-bold text-[#1d1d1f]">Status Tampilan Event</h3>
                            <p className="text-sm text-[#86868b] mt-1">Aktifkan untuk menampilkan layar hitung mundur di halaman utama</p>
                        </div>
                        <button
                            onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all shadow-sm ${formData.isActive
                                    ? 'bg-[#34c759] text-white hover:bg-[#2fb350]'
                                    : 'bg-white text-[#86868b] border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {formData.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                            <span className="font-bold text-sm">{formData.isActive ? 'Aktif' : 'Nonaktif'}</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold text-[#1d1d1f] mb-2">Nama Event (Acara)</label>
                            <input
                                type="text"
                                placeholder="Contoh: Ramadhan 1447 H"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-4 py-3.5 rounded-xl bg-[#F5F5F7] border border-transparent focus:bg-white focus:border-[#007aff]/30 focus:ring-4 focus:ring-[#007aff]/10 outline-none transition-all font-medium text-[#1d1d1f]"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-[#1d1d1f] mb-2">Teks Deskripsi Singkat</label>
                            <input
                                type="text"
                                placeholder="Contoh: Menghitung Mundur Menuju"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full px-4 py-3.5 rounded-xl bg-[#F5F5F7] border border-transparent focus:bg-white focus:border-[#007aff]/30 focus:ring-4 focus:ring-[#007aff]/10 outline-none transition-all font-medium text-[#1d1d1f]"
                            />
                        </div>
                    </div>

                    {/* Target Date */}
                    <div>
                        <label className="block text-sm font-bold text-[#1d1d1f] mb-2">Tanggal & Waktu Target (Hitung Mundur)</label>
                        <input
                            type="datetime-local"
                            value={formData.targetDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                            className="w-full md:w-1/2 px-4 py-3.5 rounded-xl bg-[#F5F5F7] border border-transparent focus:bg-white focus:border-[#007aff]/30 focus:ring-4 focus:ring-[#007aff]/10 outline-none transition-all font-medium text-[#1d1d1f]"
                        />
                    </div>

                    {/* Background Image */}
                    <div>
                        <label className="block text-sm font-bold text-[#1d1d1f] mb-2">Gambar Latar (Background)</label>
                        <div className="relative group cursor-pointer border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden min-h-[240px] flex items-center justify-center bg-[#F5F5F7] hover:bg-gray-100 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            {formData.backgroundImage ? (
                                <div className="relative w-full h-full aspect-[21/9] md:aspect-[3/1]">
                                    <img
                                        src={formData.backgroundImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white font-bold flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full border border-white/30">
                                            <ImageIcon size={20} />
                                            Ganti Gambar Latar
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-8 text-[#86868b]">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                                        <ImageIcon size={28} className="text-[#007aff]" />
                                    </div>
                                    <p className="font-bold text-[#1d1d1f]">Klik untuk upload gambar</p>
                                    <p className="text-xs mt-2 font-medium">Ukuran maksimal 800KB. Gunakan resolusi tinggi (Landscape) untuk hasil terbaik.</p>
                                </div>
                            )}
                        </div>
                        {formData.backgroundImage && (
                            <div className="mt-3 flex justify-end">
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, backgroundImage: '' }))}
                                    className="text-xs font-bold text-red-500 hover:text-red-700"
                                >
                                    Hapus Gambar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="pt-6 border-t border-gray-100">
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="w-full py-4 bg-[#007aff] hover:bg-[#0077ED] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventManager
