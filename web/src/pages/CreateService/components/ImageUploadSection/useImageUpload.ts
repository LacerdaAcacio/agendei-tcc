import { useState } from 'react';
import type { UseFormSetValue } from 'react-hook-form';

import type { CreateServiceForm } from '../../types';

export function useImageUpload(setValue: UseFormSetValue<CreateServiceForm>) {
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return;

    setIsUploading(true);
    const newImages: string[] = [];
    const fileReaders: Promise<void>[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      const promise = new Promise<void>((resolve) => {
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            newImages.push(reader.result);
          }
          resolve();
        };
      });
      fileReaders.push(promise);
      reader.readAsDataURL(file);
    });

    Promise.all(fileReaders).then(() => {
      const updatedImages = [...images, ...newImages].slice(0, 5);
      setImages(updatedImages);
      setValue('images', updatedImages);
      setIsUploading(false);
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setValue('images', updatedImages);
  };

  return {
    images,
    isUploading,
    handleImageUpload,
    removeImage,
  };
}
