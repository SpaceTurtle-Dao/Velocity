import type { Tag } from "$lib/models/Tag";
import { event } from "$lib/ao/relay";
import { ARToken, BazarUCM } from "$lib/constants";

async function buy(asset: string, quantity:string) {
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

}