<script lang="ts">

   import { Spinner } from 'flowbite-svelte'

    export let profileSrc: string | undefined = undefined
    export let profileAlt: string | undefined = undefined
    export let name: string | undefined = undefined
    export let time: string | undefined = undefined
    export let message: string | undefined = undefined
    export let rotate: boolean = false
    export let loading: boolean = false
</script>

<div class="flex items-start gap-2.5">
    {#if profileSrc && profileAlt}
      <img class="w-8 h-8 rounded-full" src={profileSrc} alt={profileAlt}>
    {/if}
    <div class="flex flex-col gap-1 w-full max-w-[320px]">
       <div class="flex items-center space-x-2 rtl:space-x-reverse">
         {#if name}
            <span class="text-sm font-semibold text-gray-900 dark:text-white">{name}</span>
         {/if}
         {#if time}
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400">{time}</span>
         {/if}
       </div>
       <div 
         class={
            `
               ${rotate ? 'rounded-s-xl rounded-t-xl' : 'rounded-e-xl rounded-es-xl'}
               flex flex-col leading-1.5 p-4 border-gray-200 bg-blue-700 dark:bg-blue-500
            `
         }
       >
         {#if loading && !message}
            <Spinner size="6" color="white" />
         {:else}
            <p class="text-sm font-normal text-white"> {message}</p>
         {/if}
       </div>
    </div>
</div>