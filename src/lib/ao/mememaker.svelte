<script lang="ts">
    import { send, read } from "$lib/ao/process.svelte";
    import {
        Meme,
        Profile,
        Pump,
        FetchMemes,
        FetchProfileMemes,
        FetchReplies,
        FetchMemesByIds,
        FetchProfiles,
        GetProfile,
        GetMeme,
    } from "$lib/ao/messegeFactory.svelte";
    import { PROCESS_ID } from "$lib/constants";
    import { upload } from "$lib/ao/uploader";
    // @ts-ignore
    import { Quantity, Token } from "ao-tokens";

    export const profile = async (name: string, image: string, bio: string) => {
        try {
            // @ts-ignore
            let message = Profile(name, image, bio);
            let result = await send(PROCESS_ID(), message);
            console.log(result);
        } catch (e) {
            console.log(e);
        }
    };

    export const meme = async (
        token: string,
        quantity: string,
        amount: string,
        kind: string,
        tags: string,
        content: string,
        parent: string | null | undefined,
    ) => {
        try {
            // @ts-ignore
            let message = Meme(quantity, amount, kind, tags, content, parent);
            let result = await send(token, message);
            console.log(result);
        } catch (e) {
            console.log(e);
        }
    };

    export const pump = async (
        quantity: string,
        slippage: string,
        recipient: string,
        token: string,
    ) => {
        try {
            // @ts-ignore
            let message = Pump(quantity, slippage, recipient);
            let result = await send(token, message);
            console.log(result);
        } catch (e) {
            console.log(e);
        }
    };

    export const fetchMemes = async (page: string, size: string) => {
        let _memes: Array<any> = [];
        try {
            // @ts-ignore
            let message = FetchMemes(page, size);
            let result = await read(PROCESS_ID(), message);
            if (result == undefined) return _memes;
            console.log(result);
            let json = JSON.parse(result.Data);
            console.log(json);
            for (const key in json) {
                _memes.push(json[key]);
                console.log(json[key]);
            }
        } catch (e) {
            console.log(e);
        }
        return _memes;
    };

    export const fetchReplies = async (parent: string, page: string, size: string) => {
        let _memes: Array<any> = [];
        try {
            // @ts-ignore
            let message = FetchReplies(parent, page, size);
            let result = await read(PROCESS_ID(), message);
            if (result == undefined) return _memes;
            console.log(result);
            let json = JSON.parse(result.Data);
            console.log(json);
            for (const key in json) {
                _memes.push(json[key]);
                console.log(json[key]);
            }
        } catch (e) {
            console.log(e);
        }
        return _memes;
    };

    export const fetchMemesByIds = async (memes: string) => {
        let _memes: Array<any> = [];
        try {
            // @ts-ignore
            let message = FetchMemesByIds(memes);
            let result = await read(PROCESS_ID(), message);
            if (result == undefined) return _memes;
            console.log(result);
            let json = JSON.parse(result.Data);
            console.log(json);
            for (const key in json) {
                _memes.push(json[key]);
                console.log(json[key]);
            }
        } catch (e) {
            console.log(e);
        }
        return _memes;
    };

    export const fetchProfileMemes = async (
        profile: string,
        page: string,
        size: string,
    ) => {
        let _memes: Array<any> = [];
        try {
            // @ts-ignore
            let message = FetchProfileMemes(profile, page, size);
            let result = await read(PROCESS_ID(), message);
            if (result == undefined) return _memes;
            console.log(result);
            let json = JSON.parse(result.Data);
            console.log(json);
            for (const key in json) {
                _memes.push(json[key]);
                console.log(json[key]);
            }
        } catch (e) {
            console.log(e);
        }
        return _memes;
    };

    export const getProfiles = async (profile: string) => {
        let _profile: any;
        try {
            // @ts-ignore
            let message = GetProfile(profile);
            let result = await read(PROCESS_ID(), message);
            if (result == undefined) return _profile;
            console.log(result);
            let json = JSON.parse(result.Data);
            console.log(json);
        } catch (e) {
            console.log(e);
        }
        return _profile;
    };

    export const getMeme = async (meme: string) => {
        let _profile: any;
        try {
            // @ts-ignore
            let message = GetMeme(meme);
            let result = await read(PROCESS_ID(), message);
            if (result == undefined) return _profile;
            console.log(result);
            let json = JSON.parse(result.Data);
            console.log(json);
        } catch (e) {
            console.log(e);
        }
        return _profile;
    };

    export const fetchProfiles = async (page: string, size: string) => {
        let _profiles: Array<any> = [];
        try {
            // @ts-ignore
            let message = FetchProfiles(page, size);
            let result = await read(PROCESS_ID(), message);
            if (result == undefined) return _profiles;
            console.log(result);
            let json = JSON.parse(result.Data);
            console.log(json);
            for (const key in json) {
                _profiles.push(json[key]);
                console.log(json[key]);
            }
        } catch (e) {
            console.log(e);
        }
        return _profiles;
    };


    /*const stuff = async () => {
        const aoCredToken = await Token(
            // id of the token
            "Sa0iBLPNyJQrwpTTG-tWLQU-1QeUAJA73DdxGGiKoJc",
        );
        const amountToSend = aoCredToken.Quantity.fromString("752.34");
    };*/

    /*export const fetchPumps = async () => {
    let _pools: Array<Pool> = [];
    let pools = await _fetchPumps();
    for (let i = 0; i < pools!.length; i++) {
        const _pump = pools![i];
        let amountA = _pump.pool.AmountA / decimals(BigInt(8));
        let amountB = _pump.pool.AmountB / decimals(BigInt(8));
        let marketCap = Number(_pump.analytics.marketCap) / decimals(BigInt(8));
        let url = `https://www.arweave.net/${_pump.pool.Logo}?ext=png`;
        let volume = 0.0;
        volume = isFinite(decimals(BigInt(8)) / Number(_pump.analytics.volume)) ? volume : 0.0;
        _pools.push({
            processId: _pump.pool.pool,
            image: url,
            price: (amountB / amountA),
            createdBy: _pump.pool.Minter,
            marketCap: Math.round(marketCap * 100) / 100,
            ticker: _pump.pool.Ticker,
            liquidty: _pump.analytics.liquidty,
            description: _pump.pool.Description,
            name: _pump.pool.Name,
            time: _pump.pool.createdAt,
            holders: _pump.pool.Holders,
            buyers: _pump.analytics.buys,
            volume: volume,
            hourVolume: _pump.analytics.hourVolume,
            dayVolume: _pump.analytics.dayVolume,
            weekVolume: _pump.analytics.weekVolume,
            montlyVolume: _pump.analytics.montlyVolume
        });
    }
    //console.log(typeof(_pools[0]));
    //console.log('pools in' + _pools[0].processId);
    console.log(_pools)
    Pools.set(_pools)
    return _pools;
};*/

</script>

