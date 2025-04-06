<script>
    import ButtonWithLoader from "$lib/components/ButtonWithLoader/ButtonWithLoader.svelte";
    import { addressStore } from "$lib/stores/address.store";
    export let loader = false;
</script>

<ButtonWithLoader
    {loader}
    class="w-full"
    on:click={async () => {
        loader = true;
        await addressStore.connectWallet();
        loader = false;
    }}>Connect Wallet</ButtonWithLoader
>
