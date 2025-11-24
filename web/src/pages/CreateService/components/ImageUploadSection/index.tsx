import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { MAX_IMAGES } from '../../constants';
import { useImageUpload } from './useImageUpload';
import type { ImageUploadSectionProps } from './types';

export function ImageUploadSection({ setValue, errors }: ImageUploadSectionProps) {
  const { images, isUploading, handleImageUpload, removeImage } = useImageUpload(setValue);

  return (
    <Card className="bg-white dark:bg-slate-900 border dark:border-slate-800">
      <CardHeader>
        <CardTitle>Fotos</CardTitle>
        <CardDescription>Adicione até {MAX_IMAGES} fotos para mostrar seu serviço</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          {images.map((img, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group border">
              <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {images.length < MAX_IMAGES && (
            <label className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500 font-medium">Adicionar Foto</span>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                className="hidden" 
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </label>
          )}
        </div>
        {errors.images && <p className="text-sm text-red-500">{errors.images.message}</p>}
      </CardContent>
    </Card>
  );
}
