import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Calendar, Image as ImageIcon, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react'
import { useData } from '../../context/DataContext'

const RamadanManager = () => {
    const { ramadan, updateRamadan } = useData()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        isActive: false,
        targetDate: '',
        backgroundImage: ''
    })

    useEffect(() => {
        if (ramadan) {
            setFormData({
                isActive: ramadan.isActive || false,
                targetDate: ramadan.targetDate || '',
                backgroundImage: ramadan.backgroundImage || ''
            })
        }
    }, [ramadan])

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 500000) { // 500KB limit
                alert("File too large! Please choose an image under 500KB.")
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
        await updateRamadan(formData)
        setIsLoading(false)
        alert("Settings saved!")
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Calendar className="text-[#007aff]" />
                    Ramadan Countdown Settings
                </h2>

                <div className="space-y-6">
                    {/* Toggle Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                            <h3 className="font-medium text-gray-900">Feature Status</h3>
                            <p className="text-sm text-gray-500">Enable or disable the countdown screen</p>
                        </div>
                        <button
                            onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${formData.isActive
                                    ? 'bg-[#34c759] text-white'
                                    : 'bg-gray-200 text-gray-600'
                                }`}
                        >
                            {formData.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                            <span className="font-medium">{formData.isActive ? 'Active' : 'Disabled'}</span>
                        </button>
                    </div>

                    {/* Target Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Date & Time</label>
                        <input
                            type="datetime-local"
                            value={formData.targetDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#007aff] focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Background Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                        <div className="relative group cursor-pointer border-2 border-dashed border-gray-300 rounded-xl overflow-hidden min-h-[200px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            {formData.backgroundImage ? (
                                <div className="relative w-full h-full aspect-video">
                                    <img
                                        src={formData.backgroundImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white font-medium flex items-center gap-2">
                                            <ImageIcon size={20} />
                                            Change Image
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-6 text-gray-400">
                                    <ImageIcon size={48} className="mx-auto mb-2" />
                                    <p className="font-medium">Click to upload image</p>
                                    <p className="text-xs mt-1">Max 500KB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 border-t border-gray-100">
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="w-full py-3 bg-[#007aff] hover:bg-[#007aff]/90 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RamadanManager
