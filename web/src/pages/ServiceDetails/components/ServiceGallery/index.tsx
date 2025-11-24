import type { ServiceGalleryProps } from '../../types';

export function ServiceGallery({ images, onImageClick }: ServiceGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-10">
        <div className="col-span-4 row-span-2 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Sem imagens disponíveis</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-10">
      {/* Main Image */}
      <div 
        className="md:col-span-2 md:row-span-2 relative group cursor-pointer" 
        onClick={() => onImageClick(0)}
      >
        <img 
          src={images[0]} 
          alt="Main view" 
          className="w-full h-full object-cover hover:brightness-95 transition-all"
        />
      </div>

      {/* Secondary Images */}
      {images.slice(1, 5).map((img, idx) => (
        <div 
          key={idx} 
          className="relative group cursor-pointer" 
          onClick={() => onImageClick(idx + 1)}
        >
          <img 
            src={img} 
            alt={`View ${idx + 2}`} 
            className="w-full h-full object-cover hover:brightness-95 transition-all"
          />
          {idx === 3 && images.length > 5 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl">
              +{images.length - 5} fotos
            </div>
          )}
        </div>
      ))}

      {/* Fill remaining slots if less than 5 images */}
      {Array.from({ length: Math.max(0, 4 - (images.length - 1)) }).map((_, idx) => (
        <div key={`placeholder-${idx}`} className="bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-xs">Sem imagem</span>
        </div>
      ))}
    </div>
  );
}
