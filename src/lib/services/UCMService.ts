import type { Tag } from "$lib/models/Tag";
import { event } from "$lib/ao/relay";
import { ARToken, BazarUCM } from "$lib/constants";
import { get, writable, type Readable } from "svelte/store";
import Arweave from "arweave";
import { connect, createDataItemSigner } from "@permaweb/aoconnect";
import Permaweb, { type AssetCreateArgsType, type AssetDetailType, type AssetHeaderType, type CollectionDetailType, type CollectionType, } from '@permaweb/libs'


export interface UCMService extends Readable<Map<string, CollectionType>> {
    fetchCollections: () => Promise<CollectionType[]>;
    getCollection: (id: string) => Promise<CollectionDetailType>;
    getAtomicAsset: (id: string, args?: {useGateway?: boolean}) => Promise<AssetDetailType>;
    fetchAtomicAssets: (id: string []) => Promise<AssetHeaderType []>;
    createAtomicAsset: (args:AssetCreateArgsType) => Promise<string>;
}

const service = (): UCMService => {
    const { subscribe, set, update } = writable<Map<string, any>>(new Map<string, CollectionType>())
    return {
        subscribe,
        fetchCollections: async ():Promise<CollectionType[]> => {

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

            const collections = await permaweb.getCollections({});
            if(collections){
                console.log(collections)
                return collections
            }else{
                return []
            }
        },
        getCollection: async (collectionId: string):Promise<CollectionDetailType> => {
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
            const collection = permaweb.getCollection(collectionId)
            if(collection){
                console.log(collection)
                return collection
            }else{
                throw("Not Found")
            }
        },
        getAtomicAsset: async (id: string, args?: {useGateway?: boolean}):Promise<AssetDetailType> => {
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
            const asset = await permaweb.getAtomicAsset(id,args)
            if(asset){
                console.log(asset)
                return asset
            }else{
                throw("Not Found")
            }
        },
        fetchAtomicAssets: async (ids: string []):Promise<AssetHeaderType []> => {
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
            const assets = await permaweb.getAtomicAssets(ids)
            if(assets){
                console.log(assets)
                return assets
            }else{
                throw("Not Found")
            }
        },
        createAtomicAsset: async (args:AssetCreateArgsType): Promise<string> => {
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
            
            let assetId = await permaweb.createAtomicAsset(args)
            return assetId
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