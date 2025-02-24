import type { Tag } from "$lib/models/Tag";
import { event } from "$lib/ao/relay";
import { ARToken, BazarUCM } from "$lib/constants";
import { get, writable, type Readable } from "svelte/store";
import Arweave from "arweave";
import { connect, createDataItemSigner } from "@permaweb/aoconnect";
import Permaweb from "@permaweb/libs";

export interface UCMService extends Readable<Map<string, any>> {
    fetchCollection: () => void;
}

const service = (): UCMService => {
    const { subscribe, set, update } = writable<Map<string, any>>(new Map<string, any>())
    return {
        subscribe,
        fetchCollection: async () => {
            // Browser Usage
            const wallet = window.arweaveWallet;
            const permaweb = Permaweb.init({
                ao: connect(),
                arweave: Arweave.init({
                    host: "arweave.net",
                    port: 443,
                    protocol: "https",
                }),
                signer: createDataItemSigner(wallet),
            });

            const collections = await permaweb.getCollectionsWith();
            console.log(collections)
        }
    }
}

export const ucmService = service()

/*async function buy(asset: string, quantity:string) {
    let _tags: Array<Tag> = [];

    const actionTag: Tag = {
        name: "Action",
        value: "Transfer",
      };
    let targetTag: Tag = {
        name: "Target",
        value: ARToken,
    };
    let recipientTag: Tag = {
        name: "Recipient",
        value: BazarUCM,
    };
    let quantityTag: Tag = {
        name: "Quantity",
        value: quantity,
    };
    let orderTag: Tag = {
        name: "X-Order-Action",
        value: "Create-Order",
    };
    let swapTag: Tag = {
        name: "X-Swap-Token",
        value: asset,
    };
    _tags.push(actionTag);
    _tags.push(targetTag);
    _tags.push(recipientTag);
    _tags.push(quantityTag);
    _tags.push(orderTag);
    _tags.push(swapTag);
    
    await event(_tags);

}*/