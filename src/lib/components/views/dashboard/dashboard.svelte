<script lang="ts">
       import Zap from "lucide-svelte/icons/zap";
       import * as Avatar from "$lib/components/ui/avatar/index.js";
       import { Input } from "$lib/components/ui/input/index.js";
       import { Button } from "$lib/components/ui/button/index.js";
       import * as Card from "$lib/components/ui/card/index.js";
       import {
              profileFromEvent,
              type Profile,
              type UserInfo,
       } from "$lib/models/Profile";
       import * as Table from "$lib/components/ui/ui/table/index";
       import { Badge } from "$lib/components/ui/ui/badge/index.js";
       import { postsStore, profilesStore } from "$lib/stores/dashboard.store";
       import { onMount } from "svelte";
       import type { Post } from "$lib/models/Meme";
       import { relay, relays, info, getOwner } from "$lib/ao/relay";
       import { getDate } from "date-fns";
       import Follow from "$lib/components/views/profile/Follow.svelte";
       import {
              currentUser,
              userEvents,
              user,
       } from "../../../stores/profile.store";

       let selectedProfileId: number | null = null;

       function getPosts() {
              postsStore.addPost({
                     Tags: ["e"],
                     Content: "0",
                     Kind: "image",
              });
       }

       onMount(() => {
              fetchRelays();
       });

       let allProfiles: Array<UserInfo> = [];
       let allPosts: Array<Post> = [];

       profilesStore.subscribe((value) => {
              allProfiles = value;
       });

       postsStore.subscribe((value) => {
              allPosts = value;
       });

       async function fetchRelays() {
              // let _relays = await relays("1", "10");
              // for (let i = 0; i < _relays.length; i++) {
              //        let _i = await info(_relays[i].relay);
              //        profilesStore.addProfile(_i);
              // }
              console.log("done");
              console.log(allProfiles.length);
       }

       function getProfile(user: UserInfo) {
              if (user) {
                     let _p: UserInfo | undefined;
                     profilesStore.subscribe((profiles) => {
                            _p = profiles.find(
                                   (p) =>
                                          p.Profile.pubkey ===
                                          user.Profile.pubkey,
                            );
                     });
                     if (_p) {
                            return profileFromEvent(_p.Profile);
                     }
              }
              return {
                     name: "",
                     about: "",
                     picture: "",
                     display_name: "",
                     website: "",
                     banner: "",
                     bot: "",
              };
       }

       function getCreatedDate(pubkey: string): string {
              let _p: UserInfo | undefined;
              profilesStore.subscribe((profiles) => {
                     _p = profiles.find((p) => p.Profile.pubkey === pubkey);
              });
              if (_p) {
                     return formatDate(_p.Profile.created_at);
              }
              return "";
       }

       function formatDate(dateString: number): string {
              return new Date(dateString).toLocaleString();
       }
</script>

<div class="flex min-h-screen w-full flex-col py-20">
       <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
              <div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                     <Card.Root>
                            <Card.Header
                                   class="flex flex-row items-center justify-between space-y-0 pb-2"
                            >
                                   <Card.Title
                                          class="text-sm text-white font-medium"
                                          >All Relays</Card.Title
                                   >
                                   <Zap class="text-muted-foreground h-4 w-4" />
                            </Card.Header>
                            <Card.Content>
                                   <div class="text-2xl font-bold">
                                          {allProfiles.length}
                                   </div>
                                   <p class="text-white text-xs">...</p>
                            </Card.Content>
                     </Card.Root>

                     <Card.Root>
                            <Card.Header
                                   class="flex flex-row items-center justify-between space-y-0 pb-2"
                            >
                                   <Card.Title class="text-sm font-medium"
                                          >Total Posts</Card.Title
                                   >
                                   <Zap class="text-muted-foreground h-4 w-4" />
                            </Card.Header>
                            <Card.Content>
                                   <div class="text-2xl font-bold">_</div>
                                   <p class="text-muted-foreground text-xs">
                                          ...
                                   </p>
                            </Card.Content>
                     </Card.Root>
                     <Card.Root>
                            <Card.Header
                                   class="flex flex-row items-center justify-between space-y-0 pb-2"
                            >
                                   <Card.Title class="text-sm font-medium"
                                          >Engagement</Card.Title
                                   >
                                   <Zap class="text-muted-foreground h-4 w-4" />
                            </Card.Header>
                            <Card.Content>
                                   <div class="text-2xl font-bold">_</div>
                                   <p class="text-muted-foreground text-xs">
                                          ...
                                   </p>
                            </Card.Content>
                     </Card.Root>
              </div>

              <Card.Root>
                     <Card.Header class="px-7">
                            <Card.Title>Relays</Card.Title>
                            <Card.Description
                                   >{allProfiles.length} Relays</Card.Description
                            >
                     </Card.Header>
                     <Card.Content>
                            <Table.Root>
                                   <Table.Header>
                                          <Table.Row>
                                                 <Table.Head
                                                        >Name/acc</Table.Head
                                                 >
                                                 <Table.Head
                                                        class="hidden sm:table-cell"
                                                        >subs/subscribers</Table.Head
                                                 >
                                                 <Table.Head
                                                        class="hidden sm:table-cell"
                                                        >Posts</Table.Head
                                                 >
                                                 <Table.Head
                                                        class="hidden md:table-cell"
                                                        >created at</Table.Head
                                                 >
                                          </Table.Row>
                                   </Table.Header>
                                   <Table.Body>
                                          {#each allProfiles as user}
                                                 <Table.Row class="bg-accent">
                                                        <Table.Cell>
                                                               <div
                                                                      class="font-medium"
                                                               >
                                                                      {getProfile(
                                                                             user,
                                                                      )?.name}
                                                               </div>
                                                               <div
                                                                      class="text-muted-foreground hidden text-sm md:inline"
                                                               >
                                                                      {getProfile(
                                                                             user,
                                                                      )
                                                                             ?.display_name}
                                                               </div>
                                                        </Table.Cell>
                                                        <Table.Cell
                                                               class="hidden sm:table-cell"
                                                               >{user.Subs}/{user.Subscriptions}</Table.Cell
                                                        >
                                                        <Table.Cell
                                                               class="hidden sm:table-cell"
                                                        >
                                                               <Badge
                                                                      class="text-xs"
                                                                      variant="secondary"
                                                               >
                                                                      ""</Badge
                                                               >
                                                        </Table.Cell>
                                                        <Table.Cell
                                                               class="hidden md:table-cell"
                                                        >
                                                               {formatDate(
                                                                      user
                                                                             .Profile
                                                                             .created_at,
                                                               )}
                                                        </Table.Cell>
                                                 </Table.Row>
                                          {/each}
                                   </Table.Body>
                            </Table.Root>
                     </Card.Content>
              </Card.Root>

              <Card.Root>
                     <Card.Header>
                            <Card.Title>Recommended</Card.Title>
                     </Card.Header>
                     <Card.Content class="grid gap-8">
                            {#each allProfiles as profile}
                                   <div class="flex items-center gap-4">
                                          <Avatar.Root
                                                 class="hidden h-9 w-9 sm:flex"
                                          >
                                                 <Avatar.Image
                                                        src=""
                                                        alt="Avatar"
                                                 />
                                                 <Avatar.Fallback
                                                        >{getProfile(
                                                               profile,
                                                        )?.display_name.slice(
                                                               0.2,
                                                        )}</Avatar.Fallback
                                                 >
                                          </Avatar.Root>
                                          <div class="grid gap-1">
                                                 <p
                                                        class="text-sm font-medium leading-none"
                                                 >
                                                        {getProfile(profile)
                                                               ?.name}
                                                 </p>
                                                 <p
                                                        class="text-muted-foreground text-sm"
                                                 >
                                                        {getProfile(profile)
                                                               ?.display_name}
                                                 </p>
                                          </div>
                                          <div class="ml-auto font-medium">
                                                 {#if profile}
                                                        <Follow
                                                               relay={$currentUser
                                                                      .Profile
                                                                      .pubkey}
                                                               userRelay={profile
                                                                      .Profile
                                                                      .pubkey}
                                                               >Subscribe</Follow
                                                        >
                                                 {/if}
                                          </div>
                                   </div>
                            {/each}
                     </Card.Content>
              </Card.Root>
       </main>
</div>
