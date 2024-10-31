<script context="module" lang="ts">
       interface Token {
              symbol: string;
              name: string;
              balance: string;
              value: number;
       }
</script>

<script lang="ts">
       import {
              Card,
              CardContent,
              CardDescription,
              CardHeader,
              CardTitle,
       } from "$lib/components/ui/card";
       import { Button } from "$lib/components/ui/button";
       import { walletAddress } from "$lib/stores/walletStore";

       // Mock token data - replace with actual Arweave token data
       const tokens: Token[] = [
              {
                     symbol: "AR",
                     name: "Arweave",
                     balance: "0.000",
                     value: 0.0,
              },
              {
                     symbol: "U",
                     name: "AO Credits",
                     balance: "0.000",
                     value: 0.0,
              },
       ];

       const handleDeposit = async (token: Token): Promise<void> => {
              try {
                     // @ts-ignore
                     if (!window.arweaveWallet) {
                            throw new Error("Arweave wallet not found");
                     }
                     console.log(`Initiating deposit for ${token.symbol}`);
                     // Implement Arweave deposit logic here
              } catch (error) {
                     console.error(`Deposit error:`, error);
              }
       };

       const handleWithdraw = async (token: Token): Promise<void> => {
              try {
                     // @ts-ignore
                     if (!window.arweaveWallet) {
                            throw new Error("Arweave wallet not found");
                     }
                     console.log(`Initiating withdrawal for ${token.symbol}`);
                     // Implement Arweave withdrawal logic here
              } catch (error) {
                     console.error(`Withdrawal error:`, error);
              }
       };

       const formatNumber = (num: string | number, decimals = 4): string => {
              return Number(num).toLocaleString("en-US", {
                     minimumFractionDigits: decimals,
                     maximumFractionDigits: decimals,
              });
       };

       $: walletAddressDisplay = $walletAddress
              ? `${$walletAddress.slice(0, 6)}...${$walletAddress.slice(-4)}`
              : "Please connect your wallet";
</script>

<div class="w-full px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto">
       <Card>
              <CardHeader>
                     <CardTitle class="text-xl sm:text-2xl"
                            >Wallet Balance</CardTitle
                     >
                     <CardDescription
                            class="text-sm sm:text-base break-all sm:break-normal"
                     >
                            {#if $walletAddress}
                                   Address: {walletAddressDisplay}
                            {:else}
                                   {walletAddressDisplay}
                            {/if}
                     </CardDescription>
              </CardHeader>
              <CardContent>
                     <div class="space-y-4">
                            {#each tokens as token}
                                   <div
                                          class="border rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:bg-gray-50 transition-colors"
                                   >
                                          <!-- Token Info -->
                                          <div class="w-full sm:w-1/3">
                                                 <div
                                                        class="font-semibold text-lg"
                                                 >
                                                        {token.symbol}
                                                 </div>
                                                 <div
                                                        class="text-sm text-gray-500"
                                                 >
                                                        {token.name}
                                                 </div>
                                          </div>

                                          <!-- Balance Info -->
                                          <div
                                                 class="w-full sm:w-1/3 text-left sm:text-right"
                                          >
                                                 <div
                                                        class="font-mono text-base sm:text-lg"
                                                 >
                                                        {formatNumber(
                                                               token.balance,
                                                        )}
                                                 </div>
                                                 <div
                                                        class="text-sm text-gray-500"
                                                 >
                                                        ${formatNumber(
                                                               token.value,
                                                               2,
                                                        )}
                                                 </div>
                                          </div>

                                          <!-- Action Buttons -->
                                          <div
                                                 class="w-full sm:w-1/3 flex gap-2 sm:justify-end"
                                          >
                                                 <Button
                                                        variant="outline"
                                                        size="sm"
                                                        class="flex-1 sm:flex-none min-w-[100px]"
                                                        disabled={!$walletAddress}
                                                        on:click={() =>
                                                               handleDeposit(
                                                                      token,
                                                               )}
                                                 >
                                                        Deposit
                                                 </Button>
                                                 <Button
                                                        variant="outline"
                                                        size="sm"
                                                        class="flex-1 sm:flex-none min-w-[100px]"
                                                        disabled={!$walletAddress ||
                                                               Number(
                                                                      token.balance,
                                                               ) <= 0}
                                                        on:click={() =>
                                                               handleWithdraw(
                                                                      token,
                                                               )}
                                                 >
                                                        Withdraw
                                                 </Button>
                                          </div>
                                   </div>
                            {/each}
                     </div>
              </CardContent>
       </Card>
</div>
