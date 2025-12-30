import React, { useState } from "react";
import { Package, Layers, X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { BookingData } from "../../interface/IBooking";
import SessionCard from "./SessionCard";
import { useParams } from "react-router";
import { getSessionImages } from "../../api/admin/bookingServie";


interface ServicesTabProps {
    booking: BookingData;
}

const ServicesTab: React.FC<ServicesTabProps> = ({ booking }) => {
    const totalSessions = booking.package?.totalSessions || 0;
    const params = useParams();
    
    const [images, setImages] = useState<string[]>([]);
    const [imageModal, setImagesModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loadingImage, setLoadingImage] = useState(false);
    

    const handleSessionImage = async (sessionId: string, sessionType: string, addonId: string) => {
        setLoadingImage(true);
        try {
            const res = await getSessionImages(sessionId, sessionType, params.id as string, addonId);
            if (res?.data && res.data.length > 0) {
                setImages(res.data);
                setCurrentImageIndex(0);
                setImagesModal(true);
            }
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoadingImage(false);
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const closeModal = () => {
        setImagesModal(false);
        setImages([]);
        setCurrentImageIndex(0);
    };

    const handleDownload = () => {
        const currentImage = images[currentImageIndex];
        if (!currentImage) return;
        
        const link = document.createElement("a");
        link.href = currentImage;
        link.download = `session-image-${currentImageIndex + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Handle keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!imageModal) return;
            
            switch (e.key) {
                case "Escape":
                    closeModal();
                    break;
                case "ArrowLeft":
                    prevImage();
                    break;
                case "ArrowRight":
                    nextImage();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [imageModal]);

    return (
        <>
            <div className="space-y-8 animate-in fade-in duration-300">
                {/* Main Package */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#5DB7AE] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#5DB7AE]/20">
                                <Package className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{booking.package?.packageId?.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{booking.package?.packageId?.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-400 shadow-sm">
                                {totalSessions} Sessions
                            </span>
                            <span className="px-3 py-1 bg-[#5DB7AE]/10 border border-[#5DB7AE]/20 rounded-lg text-sm font-medium text-[#5DB7AE]">Primary Package</span>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white">Session Schedule</h4>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Completed
                                <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 ml-2"></div> Pending
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {booking.package?.sessions.map((session, index) => (
                                <SessionCard
                                    key={session._id}
                                    session={session}
                                    bookingId={booking?._id}
                                    index={index}
                                    total={totalSessions}
                                    type="PACKAGE"
                                    addonId={''}
                                    onClick={() => {
                                        handleSessionImage(session?._id, "package", '');
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Addons */}
                {booking.addons && booking.addons.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add-on Services</h3>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-white/5">
                            {booking.addons.map((addon, index) => (
                                <div key={addon._id} className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg">
                                            <Layers className="w-5 h-5" />
                                        </div>
                                        <span className="font-semibold text-gray-900 dark:text-white">Add-on Package {index + 1}</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {addon.sessions.map((session, sIndex) => (
                                            <SessionCard
                                                onClick={() => {
                                                    
                                                    handleSessionImage(session?._id, "addon", addon?.addonId as any);
                                                }}
                                                key={session._id}
                                                session={session}
                                                index={sIndex}
                                                total={addon.totalSessions}
                                                bookingId={booking?._id}
                                                type="ADDON"
                                                addonId={addon?.addonId}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Image View Modal */}
            {imageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={closeModal}
                    />
                    
                    {/* Modal Container */}
                    <div className="relative z-10 w-full max-w-6xl h-full max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                            <div className="flex items-center gap-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Session Images ({currentImageIndex + 1} of {images.length})
                                </h3>
                                {loadingImage && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-gray-300 border-t-[#5DB7AE] rounded-full animate-spin" />
                                        <span className="text-sm text-gray-500">Loading...</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleDownload}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                                    title="Download image"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Image Content */}
                        <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
                            {loadingImage ? (
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <div className="w-12 h-12 border-4 border-gray-300 border-t-[#5DB7AE] rounded-full animate-spin" />
                                    <p className="text-gray-500 dark:text-gray-400">Loading images...</p>
                                </div>
                            ) : images.length > 0 ? (
                                <>
                                    {/* Previous Button */}
                                    {images.length > 1 && (
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all z-20 group"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-[#5DB7AE]" />
                                        </button>
                                    )}

                                    {/* Image Container */}
                                    <div className="relative w-full h-full max-h-[calc(90vh-8rem)] flex items-center justify-center">
                                        <img
                                            src={images[currentImageIndex]}
                                            alt={`Session image ${currentImageIndex + 1}`}
                                            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "https://via.placeholder.com/800x600/5DB7AE/FFFFFF?text=Image+Not+Available";
                                            }}
                                        />
                                    </div>

                                    {/* Next Button */}
                                    {images.length > 1 && (
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all z-20 group"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-[#5DB7AE]" />
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                        <Package className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        No Images Available
                                    </h4>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                        There are no images uploaded for this session yet.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-x-auto">
                                <div className="flex items-center gap-3">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                                index === currentImageIndex
                                                    ? "border-[#5DB7AE] ring-2 ring-[#5DB7AE]/20"
                                                    : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = "https://via.placeholder.com/100x75/5DB7AE/FFFFFF?text=Img";
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Navigation Instructions */}
                        {images.length > 1 && (
                            <div className="px-4 py-2 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                Use arrow keys ← → to navigate, Esc to close
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ServicesTab;