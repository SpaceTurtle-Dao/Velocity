<script>
    import ButtonWithLoader from "$lib/components/ButtonWithLoader/ButtonWithLoader.svelte";
    import { walletService } from "$lib/services/WalletService";
    export let loader = false;
</script>

<ButtonWithLoader
    {loader}
    class="w-full"
    on:click={async () => {
        loader = true;
        await walletService.connectWallet();
    }}>Connect Wallet</ButtonWithLoader
>
