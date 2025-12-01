import type { ServiceGalleryProps } from '../../types';

export function ServiceGallery({ images, onImageClick }: ServiceGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <div className="mb-10 grid h-[400px] grid-cols-1 grid-rows-2 gap-2 overflow-hidden rounded-xl md:h-[500px] md:grid-cols-4">
        <div className="col-span-4 row-span-2 flex items-center justify-center bg-gray-200">
          <span className="text-gray-500">Sem imagens disponíveis</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10 grid h-[400px] grid-cols-1 grid-rows-2 gap-2 overflow-hidden rounded-xl md:h-[500px] md:grid-cols-4">
      {/* Main Image */}
      <div
        className="group relative cursor-pointer md:col-span-2 md:row-span-2"
        onClick={() => onImageClick(0)}
      >
        <img
          src={images[0]}
          alt="Main view"
          className="h-full w-full object-cover transition-all hover:brightness-95"
        />
      </div>

      {/* Secondary Images */}
      {images.slice(1, 5).map((img, idx) => (
        <div
          key={idx}
          className="group relative cursor-pointer"
          onClick={() => onImageClick(idx + 1)}
        >
          <img
            src={img}
            alt={`View ${idx + 2}`}
            className="h-full w-full object-cover transition-all hover:brightness-95"
          />
          {idx === 3 && images.length > 5 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xl font-bold text-white">
              +{images.length - 5} fotos
            </div>
          )}
        </div>
      ))}

      {/* Fill remaining slots if less than 5 images */}
      {Array.from({ length: Math.max(0, 4 - (images.length - 1)) }).map((_, idx) => (
        <div key={`placeholder-${idx}`} className="flex items-center justify-center bg-gray-100">
          <span className="text-xs text-gray-400">Sem imagem</span>
        </div>
      ))}
    </div>
  );
}
