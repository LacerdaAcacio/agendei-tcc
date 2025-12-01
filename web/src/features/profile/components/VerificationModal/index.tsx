import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, ShieldCheck, AlertCircle, Camera, FileText } from 'lucide-react';
import type { VerificationModalProps } from './types';
import { useVerificationModal } from './useVerificationModal';

export function VerificationModal({ open, onOpenChange }: VerificationModalProps) {
  const {
    docFile,
    docPreview,
    selfieFile,
    selfiePreview,
    isLoading,
    handleDocChange,
    handleSelfieChange,
    handleSubmit,
  } = useVerificationModal(onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            Verificação de Conta
          </DialogTitle>
          <DialogDescription>
            Para sua segurança, precisamos de uma foto do seu documento e uma selfie segurando-o.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Document Upload */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Frente do Documento (RG ou CNH)
            </Label>
            <div className="relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:bg-gray-50">
              <Input
                type="file"
                accept="image/*"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onChange={handleDocChange}
              />
              {docPreview ? (
                <div className="relative h-full w-full">
                  <img
                    src={docPreview}
                    alt="Document Preview"
                    className="h-full w-full rounded-md object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                    <p className="font-medium text-white">Trocar imagem</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-center">
                  <div className="inline-block rounded-full bg-blue-100 p-3">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-sm font-medium">Clique para enviar foto do documento</div>
                  <div className="text-xs text-gray-500">JPG ou PNG</div>
                </div>
              )}
            </div>
          </div>

          {/* Selfie Upload */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Selfie com o Documento
            </Label>
            <div className="relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:bg-gray-50">
              <Input
                type="file"
                accept="image/*"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onChange={handleSelfieChange}
              />
              {selfiePreview ? (
                <div className="relative h-full w-full">
                  <img
                    src={selfiePreview}
                    alt="Selfie Preview"
                    className="h-full w-full rounded-md object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                    <p className="font-medium text-white">Trocar imagem</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-center">
                  <div className="inline-block rounded-full bg-blue-100 p-3">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-sm font-medium">Clique para enviar sua selfie</div>
                  <div className="text-xs text-gray-500">
                    Certifique-se que seu rosto está visível
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-md border border-yellow-200 bg-yellow-50 p-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
            <p className="text-xs text-yellow-700">
              Seus documentos são armazenados de forma segura e usados apenas para verificação de
              identidade.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!docFile || !selfieFile || isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar Documentos'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
