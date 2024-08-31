<script lang="ts">
import { send, read } from '$lib/ao/process.svelte';
import { info, pools, pumps, pool, transfer } from '$lib/ao/messegeFactory.svelte';
import {PROCESS_ID} from '$lib/constants';
import {upload} from '$lib/ao/uploader';

const decimals = (value: BigInt) => {
    let _decimals = 1;
    for (let i = 0; i < Number(value); i++) {
        _decimals = _decimals * 10;
    }

    return _decimals;
};

function relDiff(a: number, b: number) {
    return (100) * Math.abs((a - b) / ((a + b) / 2));
}

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

const _fetchPumps = async () => {
    let _pools: Array<any> = [];
    try {
        // @ts-ignore
        let message = pumps();
        let result = await read(PROCESS_ID(), message);
        if (result == undefined) return _pools;
        console.log(result)
        let json = JSON.parse(result.Data);
        console.log(json);
        for (const key in json) {
            _pools.push(json[key]);
            console.log(json[key]);
        }
    } catch (e) {
        console.log(e);
    }
    return _pools;
};

/*export const tokenInfo = async (process: string) => {
    try {
        let obj = {};
        let result = await read(process, info());
        console.log(result);
        console.log(result.Tags);
        let tags = result.Tags;
        console.log("Boom");
        console.log(tags);
        tags.forEach((tag: Tag) => {
            // @ts-ignore
            obj[tag.name] = tag.value;
        });
        // @ts-ignore
        let data: TokenData = {
            id: process,
            // @ts-ignore
            Name: obj.Name,
            // @ts-ignore
            Ticker: obj.Ticker,
            // @ts-ignore
            Logo: obj.Logo,
            // @ts-ignore
            Denomination: obj.Denomination
        };
        //console.log(tags);
        //console.log(obj);
        console.log(data);
        return data;
    } catch (e) {
        console.log(e);
    }
};*/

export const poolInfo = async (poolId: string) => {
    try {
        // @ts-ignore
        let message = pool(poolId);
        let result = await read(PROCESS_ID(), message);
        console.log("res")
        console.log(result[0].Data)
        return result[0]
    } catch (e) {
        console.log(e);
    }
};

/*export const createPump = async (icon: File, tokenB: string, name: string, ticker: string, description: string, amountA: string, amountB: string,) => {
    try {
        // @ts-ignore
        createToast(StatusCode.Loading, "Uploading Image for " + ticker, "", "");
        let imageId = await upload(await icon.arrayBuffer());
        let url = `https://www.arweave.net/${imageId}?ext=png`;
        let message = init(
            tokenB,
            name,
            ticker,
            imageId,
            description,
            amountA,
            amountB,
        );
        let result = await send(PROCESS_ID(), message);
        console.log(result);
        return result[0]
    } catch (e) {
        console.log(e);
    }
};*/

export const add = async (poolId: string, amountA: string, amountB: string) => {
    try {
        console.log('boom');
        // @ts-ignore
        let message = add(amountA, amountB);
        let result = await send(poolId, message);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};


export const swapA = async (poolId: string, amount: string, slippage: string) => {
    try {
        // @ts-ignore
        let message = swapA(amount, slippage);
        let result = await send(poolId, message);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};

export const swapB = async (poolId: string, amount: string, slippage: string) => {
    try {
        // @ts-ignore
        let message = swapB(amount, slippage);
        let result = await send(poolId, message);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};

export const transferToken = async (token: string, recipient: string, quantity: string) => {
    try {
        // @ts-ignore
        let message = transfer(recipient, quantity);
        let result = await send(token, message);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};

/*export const getBalance = async () => {
    try {
        // @ts-ignore
        let result = await send(poolId, balance(), null);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};

export const removeLiquidity = async () => {
    try {
        // @ts-ignore
        let message = remove('100');
        let result = await send(poolId, message, null);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};

export const getInfo = async () => {
    try {
        // @ts-ignore
        let message = info();
        let result = await send('519RPbPUoo-7eIkBt3IFAI5ORP0p14q4DEuICIstN14', message);
        console.log(result)
    } catch (e) {
        console.log(e);
    }
};*/
</script>