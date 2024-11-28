<script lang="ts">
       import { Button } from "$lib/components/ui/button/index.js";
       import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
       import { ARWEAVE_ADDRESS } from "$lib/constants";
       import { profileFromEvent, type Profile } from "$lib/models/Profile";
       import { addressStore } from "$lib/stores/address.store";
       import { currentUser } from "$lib/stores/profile.store";
       import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

       // import {}

       let profile: Profile;

       currentUser.subscribe((value) => {
              profile = profileFromEvent(value.Profile);
       });

       function toUrl(tx: string) {
              return ARWEAVE_ADDRESS + tx;
       }

       async function diconnectWallet() {
              await addressStore.disconnectWallet();
       }
</script>

<DropdownMenu.Root>
       <DropdownMenu.Trigger asChild let:builder>
              <div class="p-4">
                     <div
                            class="bg-gradient-to-r from-secondary-500 to-pink-500 p-6"
                     >
                            <div class="flex items-center space-x-4">
                                   {#if profile.picture}
                                          <Avatar
                                                 class="h-24 w-24 ring-4 ring-white"
                                          >
                                                 <AvatarImage
                                                        src={toUrl(
                                                               profile.picture,
                                                        )}
                                                        alt={profile.name}
                                                 />
                                                 <AvatarFallback
                                                        >{profile.name}</AvatarFallback
                                                 >
                                          </Avatar>
                                   {/if}
                                   <div>
                                          <h1
                                                 class="text-3xl font-extrabold text-white"
                                          >
                                                 {profile.name}
                                          </h1>
                                          <p class="text-secondary-200">
                                                 @{profile.name}
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
