<script lang="ts">
    import { Textarea, Alert, ToolbarButton } from 'flowbite-svelte';
    import { PapperPlaneOutline } from 'flowbite-svelte-icons';

    import { chatModeStatusInfo } from '../../../store'
    import { askPDF } from '../../../services'

    import ChatBubble from './ChatBubble.svelte'

    const { title } = $chatModeStatusInfo

    interface Message {
        label: string
        time: string,
        loading?: boolean
    }

    let message:Message = {
        label: '',
        time: ''
    }

    let response:Message = {
        label: '',
        time: '',
        loading: false
    }

    let conversationNumber = 1

    let conversation:{
        id: number
        message:Message,
        response:Message
    }[] = []

    const handlerOnSubmit = async (e:Event) => {
        e.preventDefault()
        try {

            response = {
                ...response,
                loading: true
            }

            conversation = [
                ...conversation,
                {
                    id: conversationNumber,
                    message,
                    response
                },
            ]

            message = {
                label: '',
                time: ''
            }

            const request = await askPDF(message.label, title.processed)

            response = {
                label: request.message,
                time: request.created_at.formatted,
                loading: false
            }

            const currentConversationKey = conversation.findIndex(conversation => conversation.id === conversationNumber)

            const currentConversation = conversation.at(currentConversationKey)

            if (!currentConversation) {
                throw new Error('Conversation not found')
            }

            conversation.splice(currentConversationKey, 1)

            conversation = [
                ...conversation,
                {
                    ...currentConversation,
                    response
                }
            ]

            console.log(conversation)

            response = {
                label: '',
                time: '',
                loading: false
            }

            conversationNumber++
        } catch (error) {
            console.error(error)
        }
    }

    const handleOnChange = (e:Event) => {
        const target = e.target as HTMLTextAreaElement
        message = {
            label: target.value,
            time: new Date().toLocaleString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone: "America/Bogota",
            })
        }

    }

</script>

<section class="grid w-full h-[30rem] bg-gray-200 dark:bg-gray-700 rounded-md animate-zoom-in">
    <div class="px-3 pt-3">
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">Chat with "{ title.raw }"</h3>
        <div class="w-full h-4/5">
            {#each conversation as { message, response, id } (id)}
                <div class="my-2">
                    <div class="flex justify-end w-full">
                        <ChatBubble message={message.label} time={message.time} name="Me" rotate />
                    </div>
                    <ChatBubble 
                        message={response?.label} 
                        time={response?.time}
                        profileAlt="Ollama Logo"
                        profileSrc="https://djeqr6to3dedg.cloudfront.net/repo-logos/ollama/ollama/live/logo-1701412810306.png"
                        name="Ollama"
                        loading={response?.loading}
                    />
                </div>
            {/each}
        </div>
    </div>
    <form class="self-end" on:submit={handlerOnSubmit}>
        <label for="chat" class="sr-only">Pregunta a { title.raw }</label>
        <Alert color="dark" class="px-3 py-2 w-full rounded-none bg-gray-300 dark:bg-gray-800">
            <svelte:fragment slot="icon">
            <Textarea id="chat" value={message.label} class="mx-4" rows="1" placeholder="Your message..." on:change={handleOnChange} />
            <ToolbarButton type="submit" color="blue" class="rounded-full text-primary-600 dark:text-primary-500">
                <PapperPlaneOutline class="w-5 h-5 rotate-45" />
                <span class="sr-only">Send message</span>
            </ToolbarButton>
            </svelte:fragment>
        </Alert>
    </form>
</section>
  