import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState, ChangeEvent, FormEvent } from 'react'
import { toast } from 'sonner'


interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    let speechRecognition = new SpeechRecognitionAPI()

export function NewNoteCard({onNoteCreated}: NewNoteCardProps) {

  const [ shouldShowOnboarding, setShouldShowOnboarding ] = useState(true);
  const [ content, setContent ] = useState('');
  const [isRecording, setIsRecording] = useState(false)


  function handleStartEditor() {
    setShouldShowOnboarding(false);
  }

  
  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>){
    setContent(event.target.value);
   if(event.target.value === ''){
    setShouldShowOnboarding(true)
   }
  }

  function handleSaveNote(event: FormEvent){
    event.preventDefault();
    

    if (content === '') {
      return
    }

    onNoteCreated(content)

    setContent('');
    setShouldShowOnboarding(true);
    toast.success('Nota criada com sucesso!');
  }

  function handleStartRecording (){
     const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition'

    if(!isSpeechRecognitionAPIAvailable) {
      alert('Infelizmente o seu navegador não suporta a API de gravação')
      return 
    }

    setIsRecording(true)
    setShouldShowOnboarding(false);
    

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const trascription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(trascription)
    }

    speechRecognition.onerror = (event) => {
      console.log(event.error)
    }

    speechRecognition.start()
  }

  function handleStopRecording (){
    setIsRecording(false)

    if (speechRecognition != null) {
      speechRecognition.stop()
    }
  }

    return (
      <Dialog.Root onOpenChange={(open) => !open && setShouldShowOnboarding(true)}>
      
        <Dialog.Trigger className='rounded-md flex flex-col p-5 bg-slate-700 text-left gap-3 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none'>
        <span className='text-sm font-medium text-slate-200'>
          Adicionar nota
        </span>

        <p className='text-sm leading-6 text-slate-400'>
          Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>
        </Dialog.Trigger>
        <Dialog.Portal>
          
          <Dialog.Overlay className="inset-0 fixed bg-black/50"/>
          <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md outline-none flex flex-col">

            <Dialog.Close className='absolute bg-slate-800 right-0 top-0 p-1.5 text-slate-500 hover:text-slate-100'>
              <X className='size-5'/>
            </Dialog.Close>

             <form className='flex flex-1 flex-col'>
                <div className='flex flex-1 flex-col gap-3 p-5'>

                  <span className='text-sm font-medium text-slate-300'>
                  Adicionar nota
                  </span>

                  {shouldShowOnboarding ? (

                  <p className='text-sm leading-6 text-slate-400 '>
                  Comece{" "}
                  <button 
                  className='text-lime-400 hover:underline font-medium' type='button' onClick={handleStartRecording}> gravando uma nota</button>{" "} em áudio ou se preferir{" "} 

                
                  <button 
                  onClick={handleStartEditor}
                  className='text-lime-400 hover:underline font-medium' type='button'>utilize apenas texto</button>.

                  </p>

                  ): (
                  <textarea 
                  onChange={handleContentChanged} 
                  autoFocus
                  className='text-sm leading-6 text-slate-400 resize-none bg-transparent outline-none min-h-full'
                  value={content}
                  />
                  )}

                </div>

                 {isRecording ? ( 
                    <button 
                    onClick={handleStopRecording}
                    type='button' className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100'>

                    <div className='size-3 rounded-full bg-red-500 animate-pulse'/>  
                    Gravando! (clique p/ interromper)
                    </button>
                  ):( 
                    <button
                    type='button' 
                    onClick={handleSaveNote}
                    className='w-full bg-lime-400 mt-5 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'>
                     Salvar nota
                    </button>
                  )}
              </form>
          </Dialog.Content>
        </Dialog.Portal>

      </Dialog.Root>
    )
}    