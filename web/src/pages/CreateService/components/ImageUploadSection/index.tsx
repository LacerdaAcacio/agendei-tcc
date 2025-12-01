import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { MAX_IMAGES } from '../../constants';
import { useImageUpload } from './useImageUpload';
import type { ImageUploadSectionProps } from './types';

export function ImageUploadSection({ setValue, errors }: ImageUploadSectionProps) {
  const { images, isUploading, handleImageUpload, removeImage } = useImageUpload(setValue);

  return (
    <Card className="border bg-white dark:border-slate-800 dark:bg-slate-900">
      <CardHeader>
        <CardTitle>Fotos</CardTitle>
        <CardDescription>Adicione até {MAX_IMAGES} fotos para mostrar seu serviço</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-5">
          {images.map((img, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg border"
            >
              <img src={img} alt={`Preview ${index}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {images.length < MAX_IMAGES && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-primary hover:bg-primary/5">
              <Upload className="mb-2 h-6 w-6 text-gray-400" />
              <span className="text-xs font-medium text-gray-500">Adicionar Foto</span>
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
