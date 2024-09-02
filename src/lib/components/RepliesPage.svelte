<script lang="ts">
    //@ts-nocheck
    import { onMount } from 'svelte';
    import { fetchMemesByIds, fetchReplies } from "$lib/ao/mememaker";
    import Tweet from "$lib/Tweet.svelte";
    import { Link } from "svelte-routing";
    import { Button } from "$lib/components/ui/ui/button";
    import CreatePost from "$lib/components/CreateMeme.svelte";  // Import CreatePost component
    
    export let memeId: string;
    
    let meme =   {
        "BondingCurve": "1000000000000000000",
        "Post": {
            "Tags": [],
            "Content": "{\"media\":\"I2mwJiEnHCKqapaBv9N6UXFHcI5W_bTzxkfKyYv_Aj8\",\"content\":\"Hey Test Test\"}",
            "Kind": "0"
        },
        "Denomination": "12",
        "AmountB": "1000000000000",
        "AmountA": "1000000000000",
        "Dumps": 0,
        "createdAt": 1725300924452,
        "Creator": "65w5pmr2a23hNfRToFUgEvRwUWuEwz4bv9wlKPv16p4",
        "Module": "Pq2Zftrqut0hdisH_MC2pDOT6S4eQFoxGsFUzR6r350",
        "Supply": "21000000000000000000",
        "Analytics": {
            "WeekVolume": {
                "Past": "0",
                "Now": "1000000000000"
            },
            "Volume": "1000000000000",
            "Buys": 1,
            "HourVolume": {
                "Past": "1000000000000",
                "Now": "0"
            },
            "MarketCap": "0",
            "Liquidty": "1000000000000",
            "Price": "0",
            "MontlyVolume": {
                "Past": "0",
                "Now": "1000000000000"
            },
            "DayVolume": {
                "Past": "0",
                "Now": "1000000000000"
            }
        },
        "TokenB": "WPyLgOqELOyN_BoTNdeEMZp5sz3RxDL19IGcs3A9IPc",
        "Pumps": 1,
        "TokenA": "aYXy6vBX8qlVvXfty30aJrTGvvI661TD9KymMnrWpvw",
        "IsPump": true,
        "Pool": "tfnWp-fcz8WrCMIVu9u1pZFs6wmVUbOGlcnQEYa1oAU",
        "IsActive": true,
        "Replies": 0,
        "Profile": {
            "Image": "i_BkFjEzfg_Ndr0StijwdoEjKiv46L0GAn1hkKDSAgM",
            "CreatedAt": 1725253591586,
            "Name": "coolestnick",
            "Creator": "65w5pmr2a23hNfRToFUgEvRwUWuEwz4bv9wlKPv16p4"
        },
        "Holders": {
            "count": 2,
            "top10": 4.7619047619048e-8,
            "dev": 0
        }} ;
    let replies = [
  
    {
        "BondingCurve": "1000000000000000000",
        "Post": {
            "Tags": [],
            "Content": "{\"media\":\"2EXs1ha1YSvCjaWpXvT12zlKtO6KPNpOu0nHUwtjwOs\",\"content\":\"Nickzzz\"}",
            "Kind": "0"
        },
        "Denomination": "12",
        "AmountB": "1000000000000",
        "AmountA": "1000000000000",
        "Dumps": 0,
        "createdAt": 1725300265743,
        "Creator": "65w5pmr2a23hNfRToFUgEvRwUWuEwz4bv9wlKPv16p4",
        "Module": "Pq2Zftrqut0hdisH_MC2pDOT6S4eQFoxGsFUzR6r350",
        "Supply": "21000000000000000000",
        "Analytics": {
            "WeekVolume": {
                "Past": "0",
                "Now": "1000000000000"
            },
            "Volume": "1000000000000",
            "Buys": 1,
            "HourVolume": {
                "Past": "1000000000000",
                "Now": "0"
            },
            "MarketCap": "0",
            "Liquidty": "1000000000000",
            "Price": "0",
            "MontlyVolume": {
                "Past": "0",
                "Now": "1000000000000"
            },
            "DayVolume": {
                "Past": "0",
                "Now": "1000000000000"
            }
        },
        "TokenB": "WPyLgOqELOyN_BoTNdeEMZp5sz3RxDL19IGcs3A9IPc",
        "Pumps": 1,
        "TokenA": "h2CfxAYP24UgT1NIdGhPb46cHLwXAR_BEaCDkMsLWsw",
        "IsPump": true,
        "Pool": "fE-2_ybYm5AbUH7I40a_I0FnWQvYBcnc1NL6zpn0Rnw",
        "IsActive": true,
        "Replies": 0,
        "Profile": {
            "Image": "i_BkFjEzfg_Ndr0StijwdoEjKiv46L0GAn1hkKDSAgM",
            "CreatedAt": 1725253591586,
            "Name": "coolestnick",
            "Creator": "65w5pmr2a23hNfRToFUgEvRwUWuEwz4bv9wlKPv16p4"
        },
        "Holders": {
            "count": 2,
            "top10": 4.7619047619048e-8,
            "dev": 0
        }
    },
    {
        "BondingCurve": "1000000000000000000",
        "Post": {
            "Parent": "Wx88y46DYs_4CtT6mxzpegjA8lU0b9JPRRAV8hOBWzw",
            "Tags": [],
            "Content": "{\"media\":\"VxCOtr_uw3XGMrLyG-_Dllw_Xd84IvAYpgm8h7G9KNQ\",\"content\":\"hmmmm\"}",
            "Kind": "0"
        },
        "Denomination": "12",
        "AmountB": "1000000000000",
        "AmountA": "1000000000000000000",
        "Dumps": 0,
        "createdAt": 1725301719333,
        "Creator": "vd97vAnBhKD7zGNDTjTgl5N0WKLcl92MO8Ob3T0w6IM",
        "Module": "Pq2Zftrqut0hdisH_MC2pDOT6S4eQFoxGsFUzR6r350",
        "Supply": "21000000000000000000",
        "Analytics": {
            "WeekVolume": {
                "Past": "0",
                "Now": "1000000000000"
            },
            "Volume": "1000000000000",
            "Buys": 1,
            "HourVolume": {
                "Past": "1000000000000",
                "Now": "0"
            },
            "MarketCap": "0",
            "Liquidty": "1000000000000",
            "Price": "0",
            "MontlyVolume": {
                "Past": "0",
                "Now": "1000000000000"
            },
            "DayVolume": {
                "Past": "0",
                "Now": "1000000000000"
            }
        },
        "TokenB": "WPyLgOqELOyN_BoTNdeEMZp5sz3RxDL19IGcs3A9IPc",
        "Pumps": 1,
        "TokenA": "e9CoazXQdxjOQcENNL5lrohd9fypfoeuL3bs8qQbZMw",
        "IsPump": true,
        "Pool": "BoCnNtNN2BR-eXApI-jB44ARH4MV5gs-VLL4gtVpjTw",
        "IsActive": true,
        "Replies": 0,
        "Profile": {
            "Image": "d_pjOoW0N7Xy8rfnQnDyJMdfYnQwisxYuZ4VsgafcsA",
            "CreatedAt": 1725245189626,
            "Name": "Buff Chu",
            "Creator": "vd97vAnBhKD7zGNDTjTgl5N0WKLcl92MO8Ob3T0w6IM"
        },
        "Holders": {
            "count": 2,
            "top10": 0.047619047619048,
            "dev": 0
        }
    },
    {
        "BondingCurve": "1000000000000000000",
        "Post": {
            "Parent": "Wx88y46DYs_4CtT6mxzpegjA8lU0b9JPRRAV8hOBWzw",
            "Tags": [],
            "Content": "{\"media\":\"4ez111cbay5BtAuq8xBnad-5NLTojUfeIi94nekzX6c\",\"content\":\"Nerd!\"}",
            "Kind": "0"
        },
        "Denomination": "12",
        "AmountB": "1000000000000",
        "AmountA": "1000000000000000000",
        "Dumps": 0,
        "createdAt": 1725301685854,
        "Creator": "vd97vAnBhKD7zGNDTjTgl5N0WKLcl92MO8Ob3T0w6IM",
        "Module": "Pq2Zftrqut0hdisH_MC2pDOT6S4eQFoxGsFUzR6r350",
        "Supply": "21000000000000000000",
        "Analytics": {
            "WeekVolume": {
                "Past": "0",
                "Now": "1000000000000"
            },
            "Volume": "1000000000000",
            "Buys": 1,
            "HourVolume": {
                "Past": "1000000000000",
                "Now": "0"
            },
            "MarketCap": "0",
            "Liquidty": "1000000000000",
            "Price": "0",
            "MontlyVolume": {
                "Past": "0",
                "Now": "1000000000000"
            },
            "DayVolume": {
                "Past": "0",
                "Now": "1000000000000"
            }
        },
        "TokenB": "WPyLgOqELOyN_BoTNdeEMZp5sz3RxDL19IGcs3A9IPc",
        "Pumps": 1,
        "TokenA": "pC-ykiTB8E2bkSpm8IhjWjeHg12Gv9u83eZbf-awJgo",
        "IsPump": true,
        "Pool": "ww5b4QRdUG02kt6PA20S0y30vXq2XgCqIM9taiCKRio",
        "IsActive": true,
        "Replies": 0,
        "Profile": {
            "Image": "d_pjOoW0N7Xy8rfnQnDyJMdfYnQwisxYuZ4VsgafcsA",
            "CreatedAt": 1725245189626,
            "Name": "Buff Chu",
            "Creator": "vd97vAnBhKD7zGNDTjTgl5N0WKLcl92MO8Ob3T0w6IM"
        },
        "Holders": {
            "count": 2,
            "top10": 0.047619047619048,
            "dev": 0
        }
    },
    {
        "BondingCurve": "1000000000000000000",
        "Post": {
            "Parent": "2_ybYm5AbUH7I40a_I0FnWQvYBcnc1NL6zpn0Rnw",
            "Tags": [],
            "Content": "{\"media\":\"VqtJfa_XMvqt_BFYshwFlrMKhEU4difnPSKKcD-SGcI\",\"content\":\"Buff Chu\"}",
            "Kind": "0"
        },
        "Denomination": "12",
        "AmountB": "1000000000000",
        "AmountA": "1000000000000000000",
        "Dumps": 0,
        "createdAt": 1725301217535,
        "Creator": "vd97vAnBhKD7zGNDTjTgl5N0WKLcl92MO8Ob3T0w6IM",
        "Module": "Pq2Zftrqut0hdisH_MC2pDOT6S4eQFoxGsFUzR6r350",
        "Supply": "21000000000000000000",
        "TokenB": "WPyLgOqELOyN_BoTNdeEMZp5sz3RxDL19IGcs3A9IPc",
        "Pumps": 0,
        "IsPump": true,
        "Pool": "Wx88y46DYs_4CtT6mxzpegjA8lU0b9JPRRAV8hOBWzw",
        "IsActive": false,
        "Replies": 2,
        "Analytics": [],
        "Holders": []
    },
    {
        "BondingCurve": "1000000000000000000",
        "Post": {
            "Tags": [],
            "Content": "{\"media\":\"IJQBSN88aUzuyxLWMvQ1wZgJK1FeT6Zg5WcY4RroKG4\",\"content\":\"Test AO\"}",
            "Kind": "0"
        },
        "Denomination": "12",
        "AmountB": "1000000000000",
        "AmountA": "1000000000000",
        "Dumps": 0,
        "createdAt": 1725301332210,
        "Creator": "65w5pmr2a23hNfRToFUgEvRwUWuEwz4bv9wlKPv16p4",
        "Module": "Pq2Zftrqut0hdisH_MC2pDOT6S4eQFoxGsFUzR6r350",
        "Supply": "21000000000000000000",
        "Analytics": {
            "WeekVolume": {
                "Past": "0",
                "Now": "1000000000000"
            },
            "Volume": "1000000000000",
            "Buys": 1,
            "HourVolume": {
                "Past": "1000000000000",
                "Now": "0"
            },
            "MarketCap": "0",
            "Liquidty": "0",
            "MontlyVolume": {
                "Past": "0",
                "Now": "1000000000000"
            },
            "DayVolume": {
                "Past": "0",
                "Now": "1000000000000"
            }
        },
        "TokenB": "WPyLgOqELOyN_BoTNdeEMZp5sz3RxDL19IGcs3A9IPc",
        "Pumps": 1,
        "TokenA": "9JESJwlcVrmb1sUB0Z8UcYvIzHrwKMXAp3pJ80s3G4Q",
        "IsPump": true,
        "Pool": "wTSIFhupsp2JZZIyhUh3c9mG4th_WxYs8fPZCarOTAE",
        "IsActive": true,
        "Replies": 0,
        "Profile": {
            "Image": "i_BkFjEzfg_Ndr0StijwdoEjKiv46L0GAn1hkKDSAgM",
            "CreatedAt": 1725253591586,
            "Name": "coolestnick",
            "Creator": "65w5pmr2a23hNfRToFUgEvRwUWuEwz4bv9wlKPv16p4"
        },
        "Holders": []
    }
];
    let isCreatePostOpen = false;  // State for managing CreatePost modal
  
    // onMount(async () => {
    //   try {
    //     meme = await fetchMemesByIds(memeId);
    //     replies = await fetchReplies(memeId, '1', '100');
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    // });
  
    function openCreatePostModal() {
      isCreatePostOpen = true;
    }
  
    function closeCreatePostModal() {
      isCreatePostOpen = false;
    }
  </script>
  
  {#if meme}
    <div class="max-w-4xl mx-auto p-4">
      <!-- Original Meme Section -->
      <h2 class="text-2xl font-bold mb-4">Original Meme</h2>
      <Link to="/Feed/{meme.Pool}" class="block w-full max-w-3xl mx-auto">
        <Tweet {meme} />
      </Link>
  
      <!-- Reply Button -->
      <div class="mt-4 text-right">
        <Button on:click={openCreatePostModal}>Reply</Button>
      </div>
    
      <!-- Replies Section -->
      <div class="mt-8">
        <h2 class="text-xl font-bold mb-4">Replies</h2>
        {#each replies as reply}
          <Link to="/Feed/{reply.Pool}" class="block w-full max-w-3xl mx-auto mb-6">
            <Tweet meme={reply} />
          </Link>
        {/each}
      </div>
    </div>
  {/if}
  
  {#if isCreatePostOpen}
    <CreatePost
      isOpen={isCreatePostOpen}
      parent={meme?.Pool}  
      on:close={() => isCreatePostOpen = false}
    />
  {/if}
  
  <style>
    :global(body) {
      background-color: #e3f2fd;
    }
  </style>
  