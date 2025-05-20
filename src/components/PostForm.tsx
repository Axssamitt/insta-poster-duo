
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface PostFormProps {
  onSubmit: (formData: FormData) => void;
  onSaveFormData?: (formData: FormData) => void;
  isSubmitting?: boolean;
}

interface FormData {
  mode: 'browser' | 'api';
  postType: 'story' | 'reel';
  mediaFile: File | null;
  mediaUrl: string;
  caption: string;
  accessToken: string;
  igUserId: string;
}

const PostForm = ({ onSubmit, onSaveFormData, isSubmitting = false }: PostFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    mode: 'browser',
    postType: 'story',
    mediaFile: null,
    mediaUrl: '',
    caption: '',
    accessToken: '',
    igUserId: ''
  });

  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleModeChange = (value: 'browser' | 'api') => {
    setFormData({ ...formData, mode: value });
  };

  const handlePostTypeChange = (value: 'story' | 'reel') => {
    setFormData({ ...formData, postType: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, mediaFile: file });
      
      // Create preview
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target) {
          setFilePreview(e.target.result as string);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSaveData = () => {
    if (onSaveFormData) {
      onSaveFormData(formData);
    }
  };

  // Verifica se o formulário tem dados válidos para salvar
  const isFormValid = formData.mode === 'browser' ? !!formData.mediaFile : 
                     (!!formData.mediaUrl && !!formData.accessToken && !!formData.igUserId);

  return (
    <form onSubmit={handleSubmit}>
      <Card className="instagram-border-gradient">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Instagram Auto Post</CardTitle>
          <CardDescription>Poste Stories ou Reels via navegador automatizado ou via API oficial</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mode">Modo de operação</Label>
            <Select
              value={formData.mode}
              onValueChange={(value: 'browser' | 'api') => handleModeChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um modo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="browser">Navegador</SelectItem>
                <SelectItem value="api">API</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="postType">Tipo de postagem</Label>
            <Select
              value={formData.postType}
              onValueChange={(value: 'story' | 'reel') => handlePostTypeChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="reel">Reel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.mode === 'browser' ? (
            <div className="space-y-2">
              <Label htmlFor="mediaFile">Arquivo de mídia local</Label>
              <Input 
                id="mediaFile" 
                type="file" 
                accept={formData.postType === 'story' ? "image/*" : "video/*"} 
                onChange={handleFileChange}
              />
              {filePreview && (
                <div className="mt-2 flex justify-center">
                  {formData.postType === 'story' ? (
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="max-h-48 rounded-md border"
                    />
                  ) : (
                    <video 
                      src={filePreview} 
                      controls
                      className="max-h-48 rounded-md border"
                    />
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="mediaUrl">URL pública da mídia</Label>
              <Input 
                id="mediaUrl" 
                name="mediaUrl"
                type="text" 
                value={formData.mediaUrl}
                onChange={handleInputChange}
                placeholder="https://exemplo.com/sua-midia.jpg"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="caption">Legenda</Label>
            <Textarea 
              id="caption" 
              name="caption"
              value={formData.caption}
              onChange={handleInputChange}
              placeholder="Sua legenda aqui..."
              rows={3}
            />
          </div>

          {formData.mode === 'api' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="accessToken">Token de acesso do Instagram Graph API</Label>
                <Input 
                  id="accessToken"
                  name="accessToken" 
                  type="password" 
                  value={formData.accessToken}
                  onChange={handleInputChange}
                  placeholder="••••••••••••••••••••••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="igUserId">ID da conta de Instagram</Label>
                <Input 
                  id="igUserId" 
                  name="igUserId"
                  type="text" 
                  value={formData.igUserId}
                  onChange={handleInputChange}
                  placeholder="12345678901234567"
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex-col space-y-2">
          <div className="flex gap-2 w-full">
            <Button
              type="submit"
              className="flex-1 bg-instagram-gradient hover:opacity-90 transition-opacity"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publicando..." : `Publicar ${formData.postType === 'story' ? 'Story' : 'Reel'}`}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveData}
              disabled={!isFormValid || isSubmitting}
            >
              Salvar Dados
            </Button>
          </div>
          {onSaveFormData && (
            <p className="text-xs text-center text-muted-foreground">
              Salve os dados antes de agendar postagens automáticas
            </p>
          )}
        </CardFooter>
      </Card>
    </form>
  );
};

export default PostForm;
