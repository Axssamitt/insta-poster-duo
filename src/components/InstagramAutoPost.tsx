
import React, { useState } from 'react';
import PostForm from './PostForm';
import SuccessAnimation from './SuccessAnimation';
import TimerControls from './TimerControls';
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FormData {
  mode: 'browser' | 'api';
  postType: 'story' | 'reel';
  mediaFile: File | null;
  mediaUrl: string;
  caption: string;
  accessToken: string;
  igUserId: string;
}

const InstagramAutoPost = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("post");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    console.log('Form data submitted:', formData);
    
    try {
      // Guardar os dados do formulário para uso posterior pelo temporizador
      setFormData(formData);
      
      // Simulate API/browser posting
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message based on form data
      if (formData.mode === 'browser') {
        setSuccessMessage(`${formData.postType === 'story' ? 'Story' : 'Reel'} enviado via navegador com sucesso!`);
      } else {
        setSuccessMessage(`${formData.postType === 'story' ? 'Story' : 'Reel'} publicado via API com sucesso!`);
      }
      
      // Reset success message after some time
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Erro ao fazer postagem:', error);
      toast({
        title: "Erro na postagem",
        description: "Ocorreu um erro ao processar sua postagem",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduledPost = async () => {
    if (formData) {
      await handleSubmit(formData);
    } else {
      toast({
        title: "Dados incompletos",
        description: "Preencha o formulário primeiro e salve os dados antes de agendar postagens",
        variant: "destructive",
      });
    }
  };

  // Verificar se o formulário tem dados preenchidos para habilitar o agendamento
  const isSchedulingDisabled = !formData || !((formData.mode === 'browser' && formData.mediaFile) || 
                              (formData.mode === 'api' && formData.mediaUrl && 
                               formData.accessToken && formData.igUserId));

  return (
    <div className="container max-w-xl px-4 py-8">
      {successMessage && <SuccessAnimation message={successMessage} />}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-instagram-gradient inline-block mb-2">
          Instagram Auto Post
        </h1>
        <p className="text-muted-foreground">
          Automatize suas postagens no Instagram com facilidade
        </p>
      </div>
      
      <Tabs defaultValue="post" className="mb-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="post" onClick={() => setActiveTab("post")}>Postar Conteúdo</TabsTrigger>
          <TabsTrigger value="schedule" onClick={() => setActiveTab("schedule")}>Agendamento</TabsTrigger>
          <TabsTrigger value="help" onClick={() => setActiveTab("help")}>Ajuda</TabsTrigger>
        </TabsList>
        <TabsContent value="post">
          <PostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} onSaveFormData={(data) => setFormData(data)} />
        </TabsContent>
        <TabsContent value="schedule">
          {formData ? (
            <div className="space-y-5">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="font-medium mb-2">Dados da postagem:</h3>
                <ul className="text-sm space-y-1">
                  <li><span className="font-semibold">Modo:</span> {formData.mode === 'browser' ? 'Navegador' : 'API'}</li>
                  <li><span className="font-semibold">Tipo:</span> {formData.postType === 'story' ? 'Story' : 'Reel'}</li>
                  {formData.mode === 'browser' && formData.mediaFile && (
                    <li><span className="font-semibold">Mídia:</span> {formData.mediaFile.name}</li>
                  )}
                  {formData.mode === 'api' && formData.mediaUrl && (
                    <li><span className="font-semibold">URL da mídia:</span> {formData.mediaUrl}</li>
                  )}
                  <li><span className="font-semibold">Legenda:</span> {formData.caption || '(sem legenda)'}</li>
                </ul>
              </div>
              <TimerControls 
                onScheduledPost={handleScheduledPost} 
                disabled={isSchedulingDisabled || isSubmitting} 
              />
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 border rounded-lg">
              <h3 className="text-lg font-medium mb-2">Nenhuma postagem configurada</h3>
              <p className="text-muted-foreground mb-4">
                Configure sua postagem na aba "Postar Conteúdo" antes de agendar
              </p>
              <button 
                className="text-sm text-instagram-purple" 
                onClick={() => setActiveTab("post")}
              >
                Ir para configuração
              </button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="help">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Como usar</h2>
            
            <div>
              <h3 className="font-medium mb-2">Modo Navegador</h3>
              <p className="text-gray-600 mb-2">
                No modo navegador, a publicação é feita através de automação do navegador.
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Selecione o tipo de conteúdo: Story ou Reel</li>
                <li>Faça upload do arquivo de mídia local</li>
                <li>Adicione uma legenda (opcional para Stories)</li>
                <li>Clique em publicar</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Modo API</h3>
              <p className="text-gray-600 mb-2">
                No modo API, a publicação é feita através da API oficial do Instagram.
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Você precisa de um token de acesso válido do Instagram Graph API</li>
                <li>Sua mídia deve estar hospedada em uma URL pública</li>
                <li>Informe o ID da sua conta de Instagram</li>
                <li>Selecione o tipo de conteúdo e adicione uma legenda</li>
              </ul>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <p className="text-sm text-gray-500">
                <strong>Nota:</strong> Para obter um token de acesso e o ID da sua conta de Instagram, 
                visite o <a href="https://developers.facebook.com/docs/instagram-api/getting-started" 
                className="text-instagram-purple underline" target="_blank" rel="noopener noreferrer">
                Facebook para Desenvolvedores</a>.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstagramAutoPost;
