<script lang="ts">
    import { Toggle } from 'flowbite-svelte';
	import { onMount } from 'svelte';

    const isThemeDark = localStorage?.getItem('theme') === 'dark';

    const handlerChangeTheme = (e:any) => {
        const theme = e.target.checked ? 'dark' : 'light';
        localStorage?.setItem('theme', theme);

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    onMount(() => {
        if (isThemeDark) {
            document.documentElement.classList.add('dark');
        }
    });

</script>

<main class="grid w-screen min-h-screen">
    <Toggle 
        class="justify-self-end mt-3 mr-3 cursor-pointer min-h-[3vh]" 
        color="orange" 
        checked={isThemeDark}
        on:change={handlerChangeTheme}
    >
    </Toggle>
    <div class="grid place-content-center w-screen min-h-[95vh]">
        <h1 class="text-6xl opacity-70 font-bold text-center pb-10 dark:text-white text-black">Chat with your pdf</h1>
        <section class="container w-full h-64">
            <slot></slot>
        </section>
    </div>
</main>