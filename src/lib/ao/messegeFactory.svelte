<script context="module" lang="ts">
	import { PROCESS_ID, WAR_TOKEN } from "$lib/constants";

	//import type { TokenData } from './models/TokenData.svelte';

	export const Event = () => {
		let _tags = [
			{ name: "Action", value: "Event" },
		];
		return _tags ;
	};


	export const FetchFeed = (filters: string) => {
		return [
			{ name: "Action", value: "FetchFeed" },
			{ name: "Filters", value: filters },
		];
	};

	export const FetchEvents = (filters: string) => {
		return [
			{ name: "Action", value: "FetchEvents" },
			{ name: "Filters", value: filters },
		];
	};
</script>
