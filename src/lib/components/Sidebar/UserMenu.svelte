<script lang="ts">
       import { Button } from "$lib/components/ui/button/index.js";
       import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
       import { ARWEAVE_ADDRESS } from "$lib/constants";
       import { profileFromEvent, type Profile } from "$lib/models/Profile";
       import { currentUser } from "$lib/services/CurrentUser";
       import { onMount } from "svelte";
       import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
       import { profileService } from "$lib/services/ProfileService";
       import { walletService } from "$lib/services/walletService";

       // import {}

       let profile: Profile;

       function toUrl(tx: string) {
              return ARWEAVE_ADDRESS + tx;
       }

       async function diconnectWallet() {
              await walletService.disconnectWallet();
       }

       profileService.subscribe(async (profiles) => {
              if(!$currentUser) return;
              let _profile = profiles.get($currentUser.address)
              if (_profile) {
                     profile = _profile;
              }
       });

       onMount(async () => {});
</script>

{#if profile}
       <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild let:builder>
                     <div class="p-4">
                            <div class="p-6">
                                   <div class="flex items-center space-x-4">
                                          {#if profile.profileImage}
                                                 <Avatar
                                                        class="h-24 w-24 ring-4 ring-white"
                                                 >
                                                        <AvatarImage
                                                               src={toUrl(
                                                                      profile.profileImage,
                                                               )}
                                                               alt={profile.displayName}
                                                        />
                                                        <AvatarFallback
                                                               >{profile.displayName}</AvatarFallback
                                                        >
                                                 </Avatar>
                                          {/if}
                                          <div>
                                                 <h1
                                                        class="text-3xl font-extrabold text-white"
                                                 >
                                                        {profile.userName}
                                                 </h1>
                                                 <p class="text-secondary-200">
                                                        @{profile.userName}
                                                 </p>
                                                 <p class="mt-2 text-white">
                                                        {"profile.bio"}
                                                 </p>
                                          </div>
                                   </div>
                            </div>
                     </div>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                     <DropdownMenu.Group>
                            <DropdownMenu.Label>Log out</DropdownMenu.Label>
                            <!-- <DropdownMenu.Separator />
                     <DropdownMenu.Item>Profile</DropdownMenu.Item>
                     <DropdownMenu.Item>Billing</DropdownMenu.Item>
                     <DropdownMenu.Item>Team</DropdownMenu.Item>
                     <DropdownMenu.Item>Subscription</DropdownMenu.Item> -->
                     </DropdownMenu.Group>
              </DropdownMenu.Content>
       </DropdownMenu.Root>
{/if}
