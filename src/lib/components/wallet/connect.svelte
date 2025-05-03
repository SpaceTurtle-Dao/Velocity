<script>
    import ButtonWithLoader from "$lib/components/ButtonWithLoader/ButtonWithLoader.svelte";
    import { currentUser } from "$lib/stores/currentUser.store";
    export let loader = false;
</script>

<ButtonWithLoader
    {loader}
    class="w-full"
    on:click={async () => {
        loader = true;
        await currentUser.connectWallet();
        loader = false;
    }}>Connect Wallet</ButtonWithLoader
>
