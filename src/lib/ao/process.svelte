<script context="module" lang="ts">
	import { RELAY_MESSAGE_ID } from "$lib/constants";
	// @ts-ignore
	import { connect, createDataItemSigner, assign } from "@permaweb/aoconnect";
	//import { createToast } from '$lib/utils/toastHandler.svelte';

	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// @ts-ignore
	const { result, results, message, spawn, monitor, unmonitor, dryrun } =
		connect({
			MU_URL: "https://mu.ao-testnet.xyz",
			CU_URL: "https://cu.ao-testnet.xyz",
			GATEWAY_URL: "https://arweave.net",
		});

	// @ts-ignore
	export async function send(processId, tags, data: string | null) {
		console.log("tags");
		console.log(tags);
		console.log("data");
		//console.log(data);
		console.log("Sending message to: " + processId);
		// The only 2 mandatory parameters here are process and signer
		// connect to the extension
		// @ts-ignore
		let _message = {
			/*
		The arweave TXID of the process, this will become the "target".
		This is the process the message is ultimately sent to.
	*/
			process: processId,

			// Tags that the process will use as input.
			tags: tags,
			data: "",
			scheduler: "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA",
			// A signer function used to build the message "signature"
			// @ts-ignore
			signer: createDataItemSigner(window.arweaveWallet),
		};
		if (data) _message.data = data;
		let messageId = await message(_message);
		console.log(messageId);
		return await readMessage(messageId, processId);
		//return result
	}

	// @ts-ignore
	export const read = async (processId, tags) => {
		//console.log("reading data")
		// The only 2 mandatory parameters here are process and signer
		// connect to the extension
		// @ts-ignore
		let result = await dryrun({
			/*
		The arweave TXID of the process, this will become the "target".
		This is the process the message is ultimately sent to.
	*/
			process: processId,

			// Tags that the process will use as input.
			tags: tags,
		});
		//console.log(result)
		if (result.Messages) {
			let message = result.Messages.pop();
			return message;
		}
		//return result
	};

	export const createProcess = async () => {
		const processId = await spawn({
			// The Arweave TXID of the ao Module
			module: "Do_Uc2Sju_ffp6Ev0AnLVdPtot15rvMjP-a9VVaA5fM",
			scheduler: "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA",
			// @ts-ignore
			signer: createDataItemSigner(window.arweaveWallet),
		});
		await sleep(3000);
		return processId;
	};

	// @ts-ignore
	const readMessage = async (messageId: string, processId: string) => {
		let { Messages, Spawns, Output, Error } = await result({
			// the arweave TXID of the message
			message: messageId,
			// the arweave TXID of the process
			process: processId,
		});
		if (Error == undefined) {
			//let message = Messages.pop();
			//let data = JSON.parse(message.Data);
		} else {
		}
		throw Error;
	};
</script>
