import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    handleSubmit
  } = useVerificationModal(onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
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
              <FileText className="w-4 h-4" />
              Frente do Documento (RG ou CNH)
            </Label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer relative h-48">
              <Input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleDocChange}
              />
              {docPreview ? (
                <div className="relative w-full h-full">
                  <img src={docPreview} alt="Document Preview" className="w-full h-full object-contain rounded-md" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                    <p className="text-white font-medium">Trocar imagem</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="bg-blue-100 p-3 rounded-full inline-block">
                    <Upload className="w-6 h-6 text-blue-600" />
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
              <Camera className="w-4 h-4" />
              Selfie com o Documento
            </Label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer relative h-48">
              <Input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleSelfieChange}
              />
              {selfiePreview ? (
                <div className="relative w-full h-full">
                  <img src={selfiePreview} alt="Selfie Preview" className="w-full h-full object-contain rounded-md" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                    <p className="text-white font-medium">Trocar imagem</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="bg-blue-100 p-3 rounded-full inline-block">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-sm font-medium">Clique para enviar sua selfie</div>
                  <div className="text-xs text-gray-500">Certifique-se que seu rosto está visível</div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-700">
              Seus documentos são armazenados de forma segura e usados apenas para verificação de identidade.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!docFile || !selfieFile || isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar Documentos'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
