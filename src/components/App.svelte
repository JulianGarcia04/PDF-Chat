<script lang="ts">
    import { Alert, Spinner } from 'flowbite-svelte';

    import { APP_STATUS, appStatus } from '../store'
    import Upload from './steps/Upload.svelte';
    import Chat from './steps/Chat/Chat.svelte';
</script>

<div class="w-full flex flex-col items-center">
    {#if $appStatus === APP_STATUS.INIT}
        <Upload />
    {:else if $appStatus === APP_STATUS.LOADING}
        <Spinner size="10"/>
    {:else if $appStatus === APP_STATUS.CHAT_MODE}
        <Chat />
    {:else if $appStatus === APP_STATUS.ERROR }
        <Alert color="red">
            <span class="font-medium">Danger alert!</span>
            Has error in the application
        </Alert> 
    {/if}
</div>