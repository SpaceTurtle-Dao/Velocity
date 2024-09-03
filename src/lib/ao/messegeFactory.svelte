<script context="module" lang="ts">
	import { PROCESS_ID, WAR_TOKEN } from "$lib/constants";

	//import type { TokenData } from './models/TokenData.svelte';

	export const Meme = (
		quantity: string,
		amount: string,
		kind: string,
		tags: string,
		content: string,
		parent: string | null | undefined,
	) => {
		let _tags = [
			{ name: "Action", value: "Transfer" },
			{ name: "Quantity", value: quantity },
			{ name: "Recipient", value: PROCESS_ID() },
			{ name: "X-Kind", value: kind },
			{ name: "X-Tags", value: tags },
			{ name: "X-Content", value: content },
			{ name: "X-Amount", value: amount },
		];
		if(parent)_tags.push({ name: "X-Parent", value: parent });
		return _tags ;
	};

	export const Profile = (name: string, image: string, bio: string) => {
		return [
			{ name: "Action", value: "Profile" },
			{ name: "Name", value: name },
			{ name: "Image", value: image },
			{ name: "Bio", value: bio },
		];
	};

	export const Pump = (
		quantity: string,
		slippage: string,
		recipient: string,
	) => {
		return [
			{ name: "Action", value: "Transfer" },
			{ name: "Quantity", value: quantity },
			{ name: "Recipient", value: recipient },
			{ name: "X-Slippage", value: slippage },
			{ name: "X-Swap", value: "" },
		];
	};

	export const FetchSwaps = (pool: string) => {
		return [
			{ name: "Action", value: "FetchSwaps" },
			{ name: "Pool", value: pool },
		];
	};

	export const FetchMemes = (page: string, size: string) => {
		return [
			{ name: "Action", value: "FetchMemes" },
			{ name: "Page", value: page },
			{ name: "Size", value: size },
		];
	};

	export const FetchProfileMemes = (
		profile: string,
		page: string,
		size: string,
	) => {
		return [
			{ name: "Action", value: "FetchProfileMemes" },
			{ name: "Profile", value: profile },
			{ name: "Page", value: page },
			{ name: "Size", value: size },
		];
	};

	export const FetchReplies = (
		parent: string,
		page: string,
		size: string,
	) => {
		return [
			{ name: "Action", value: "FetchReplies" },
			{ name: "Parent", value: parent },
			{ name: "Page", value: page },
			{ name: "Size", value: size },
		];
	};

	export const FetchMemesByIds = (
		memes: string, //stringified json string array
	) => {
		return [
			{ name: "Action", value: "FetchMemesByIds" },
			{ name: "Memes", value: memes },
		];
	};

	export const FetchProfiles = (page: string, size: string) => {
		return [
			{ name: "Action", value: "FetchProfiles" },
			{ name: "Page", value: page },
			{ name: "Size", value: size },
		];
	};

	export const GetProfile = (profile: string) => {
		return [
			{ name: "Action", value: "GetProfile" },
			{ name: "Profile", value: profile },
		];
	};

	export const GetMeme = (meme: string) => {
		return [
			{ name: "Action", value: "GetMeme" },
			{ name: "Meme", value: meme },
		];
	};
</script>
