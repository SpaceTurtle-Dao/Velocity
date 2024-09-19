<script context="module" lang="ts">
    // @ts-ignore
import { connect, createDataItemSigner } from '@permaweb/aoconnect';
//import { createToast } from '$lib/utils/toastHandler.svelte';

// @ts-ignore
const { result, results, message, spawn, monitor, unmonitor, dryrun } = connect({
	MU_URL: 'https://mu.ao-testnet.xyz',
	CU_URL: 'https://cu.ao-testnet.xyz',
	GATEWAY_URL: 'https://arweave.net'
});

// @ts-ignore
export async function send (processId, tags, data: string | null) {
	console.log("tags")
	console.log(tags)
	console.log("data")
	console.log(data)
	console.log("Sending message to: " + processId)
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
		// A signer function used to build the message "signature"
		// @ts-ignore
		signer: createDataItemSigner(window.arweaveWallet)
	}
	if (data) _message.data = data;
	let messageId = await message(_message);
	console.log(messageId);
	return await readMessage(messageId, processId);
	//return result
};

// @ts-ignore
/*export const sendData = async (processId, tags, data) => {
	console.log("Sending message to: " + processId)
	// The only 2 mandatory parameters here are process and signer
	// connect to the extension
	// @ts-ignore
	let messageId = await message({

		process: processId,

		// Tags that the process will use as input.
		tags: tags,
		data: data,
		// A signer function used to build the message "signature"
		// @ts-ignore
		signer: createDataItemSigner(window.arweaveWallet)
	});
	console.log(messageId);
	return await readMessage(messageId, processId);
	//return result
};*/

// @ts-ignore
export const read = async (processId, tags) => {
	console.log("Sending message to: " + processId)
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
		tags: tags
	});
	console.log(result.Messages)
	let message = result.Messages.pop();
	console.log(message);
	return message;
	//return result
};


/*export const createProcess = async (owner: string) => {
	const processId = await spawn({
		// The Arweave TXID of the ao Module
		module: 'Pq2Zftrqut0hdisH_MC2pDOT6S4eQFoxGsFUzR6r350',
		// The Arweave wallet address of a Scheduler Unit
		scheduler: '_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA',
		// A signer function containing your wallet
		// @ts-ignore
		signer: createDataItemSigner(window.arweaveWallet),
	});
	let tags = [
		{ name: "Action", value: "Eval" },
	];
	let data: string | null | undefined = 'local ao = require("ao"); Owner = "' + owner + '";';
	var delayInMilliseconds = 5000; //1 second
	setTimeout(async function () {
		let messageId = await sendData(processId, tags, data)
		console.log("Message: " + messageId)
	}, delayInMilliseconds);
	return processId;
};*/

// @ts-ignore
const readMessage = async (messageId: string, processId: string) => {
	let { Messages, Spawns, Output, Error } = await result({
		// the arweave TXID of the message
		message: messageId,
		// the arweave TXID of the process
		process: processId
	});
	if (Error == undefined) {
		//let message = Messages.pop();
		//let data = JSON.parse(message.Data);
	}else{

	}
	console.log(Messages);
	console.log(Output);
	console.log(Error);
	throw (Error)
};
</script>