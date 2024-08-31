<script context="module" lang="ts">
	//import type { TokenData } from './models/TokenData.svelte';

	export const Create = (
		tokenB: string,
		name: string,
		ticker: string,
		logo: string,
		description: string,
		amountA: string,
		amountB: string
	) => {
		return [
			{ name: 'Action', value: 'Init' },
			{ name: 'Name', value: name },
			{ name: 'Ticker', value: ticker },
			{ name: 'Logo', value: logo },
			{ name: 'Description', value: description },
			{ name: 'TokenB', value: tokenB },
			{ name: 'AmountA', value: amountA },
			{ name: 'AmountB', value: amountB }
		];
	};

	export const pools = () => {
		return [{ name: 'Action', value: 'Pools' }];
	};

	export const pumps = () => {
		return [{ name: 'Action', value: 'Pumps' }];
	};

	export const pool = (poolId:string) => {
		return [
			{ name: 'Action', value: 'Pool' },
			{ name: 'PoolId', value: poolId }
		];
	};

	export const add = (amountA: string, amountB: string) => {
		return [
			{ name: 'Action', value: 'Add' },
			{ name: 'amountA', value: amountA },
			{ name: 'amountB', value: amountB }
		];
	};

	export const remove = (share: string) => {
		return [
			{ name: 'Action', value: 'Remove' },
			{ name: 'share', value: share }
		];
	};

	export const swapA = (amount: string, slippage: string) => {
		return [
			{ name: 'Action', value: 'SwapA' },
			{ name: 'amount', value: amount },
			{ name: 'slippage', value: slippage }
		];
	};

	export const swapB = (amount: string, slippage: string) => {
		return [
			{ name: 'Action', value: 'SwapB' },
			{ name: 'amount', value: amount },
			{ name: 'slippage', value: slippage }
		];
	};

	export const balance = () => {
		return [{ name: 'Action', value: 'Balance' }];
	};

	export const info = () => {
		return [{ name: 'Action', value: 'Info' }];
	};

	export const transfer = (recipient: string, quantity: string) => {
		return [
			{ name: 'Action', value: 'Transfer' },
			{ name: 'Recipient', value: recipient },
			{ name: 'Quantity', value: quantity }
		];
	};

	/*export const withdrawB = (amount: string) => {
		return [
			{ name: 'Action', value: 'WithdrawBox' },
			{ name: 'Quantity', value: amount },
			{ name: 'isTokenA', value: "false" }
		];
	};

	export const withdrawA = (amount: string) => {
		return [
			{ name: 'Action', value: 'WithdrawBox' },
			{ name: 'Quantity', value: amount },
			{ name: 'isTokenA', value: "true" }
		];
	};*/
</script>
