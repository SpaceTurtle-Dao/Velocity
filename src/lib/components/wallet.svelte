<script>
	import { onMount } from 'svelte';
	import SmallSpinner from '$lib/components/smallSpinner.svelte';
	import WalletModal from '$lib/components/walletModal.svelte';
	
	export let buttonClass = "";

	let title = 'Connect Wallet';
	let isLoading = false;
	let walletAddress = '';
	let showModal = false;

	onMount(async () => {
		// Checking if wallet is already connected on component mount
		await checkWalletConnection();
	});

	async function checkWalletConnection() {
		// @ts-ignore
		if (window.arweaveWallet) {
			try {
				// @ts-ignore
				const address = await window.arweaveWallet.getActiveAddress();
				if (address) {
					walletAddress = formatAddress(address);
					title = walletAddress;
				}
			} catch (error) {
				console.error('Failed to get active address:', error);
			}
		}
	}

	// @ts-ignore
	function formatAddress(address) {
		return `${address.slice(0, 4)}...${address.slice(-4)}`;
	}
	
	const connectWallet = async () => {
		if (walletAddress) {
			showModal = true;
      		return;
		}

		title = "Connecting";
		isLoading = true;
		try {
			// @ts-ignore
			await window.arweaveWallet.connect(
				[
					'ACCESS_ADDRESS',
					'ACCESS_PUBLIC_KEY',
					'ACCESS_ALL_ADDRESSES',
					'SIGN_TRANSACTION',
					'ENCRYPT',
					'DECRYPT',
					'SIGNATURE',
					'ACCESS_ARWEAVE_CONFIG',
					'DISPATCH'
				],
				{
					name: 'Super Cool App',
					logo: 'https://arweave.net/jAvd7Z1CBd8gVF2D6ESj7SMCCUYxDX_z3vpp5aHdaYk'
				},
				{
					host: 'g8way.io',
					port: 443,
					protocol: 'https'
				}
			);
			console.log('Wallet connected successfully');
			await checkWalletConnection();
		} catch (error) {
			console.error('Failed to connect wallet:', error);
			title = "Connect Wallet";
		} finally {
			isLoading = false;
		}
	};

	function closeModal() {
    	showModal = false;
  	}
</script>

<button
  on:click={connectWallet}
  type="button"
  class={`btn justify-center self-stretch px-4 py-2 text-sm rounded ${buttonClass}`}
  tabindex="0"
>
  {#if isLoading}
    <div class="flex flex-row items-center">
      {title}
      <div class="pl-2"><SmallSpinner /></div>
    </div>
  {:else}
    {title}
  {/if}
</button>

{#if showModal}
  <WalletModal 
    walletAddress={walletAddress} 
    on:close={closeModal}
  />
{/if}