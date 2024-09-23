<script lang="ts">
       import Zap from "lucide-svelte/icons/zap";
       import * as Avatar from "$lib/components/ui/avatar/index.js";
       import { Input } from "$lib/components/ui/input/index.js";
       import { Button } from "$lib/components/ui/button/index.js";
       import * as Card from "$lib/components/ui/card/index.js";
       import type { Profile } from "$lib/models/Profile";
       import * as Table from "$lib/components/ui/ui/table/index";
       import { Badge } from "$lib/components/ui/ui/badge/index.js";
       import { postsStore, profilesStore } from "$lib/stores/dashboard.store";
       import { onMount } from "svelte";
       import type { Post } from "$lib/models/Meme";
       import { relay, relays, info, getOwner } from "$lib/ao/relay";

       let selectedProfileId: number | null = null;

       function getPosts() {
              postsStore.addPost({
                     Tags: ["e"],
                     Content: "0",
                     Kind: "image",
              });
       }

       function getProfiles() {
              profilesStore.addProfile({
                     name: "Liam Johnson",
                     about: "dsd89sdf89sdf",
                     picture: "https://avatars.githubusercontent.com/u/1?v=4",
                     display_name: "Liam Johnson",
                     website: "https://liamjohnson.dev",
                     banner: "https://avatars.githubusercontent.com/u/1?v=4",
                     bot: false,
              });
       }

       onMount(() => {
              // getPosts();
              // getProfiles();
              fetchRelays();
              // fetchRelayInfo();
       });

       let allRelays: Array<Profile> = [];
       let allPosts: Array<Post> = [];

       profilesStore.subscribe((value) => {
              allRelays = value;
       });

       postsStore.subscribe((value) => {
              allPosts = value;
       });

       async function fetchRelays() {
              let _relays = await relays("1", "10");
              console.log(_relays);
              console.log("got relays");
              let info: Array<any> = [];
              for (let i = 0; i < _relays.length; i++) {
                     console.log(_relays[i]);
                     console.log(typeof _relays[i]);
                     let _i = await _relayInfo(_relays[i]["owner"]);

                     info.push(_i);
              }
              console.log(info);
              console.log("got info");
       }

       async function _relayInfo(_owner: string) {
              let _info = await info(_owner);
              console.log(_info);
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
                                          {profilesStore.subscribe.length}
                                   </div>
                                   <p class="text-white text-xs">+20% today</p>
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
                                   <div class="text-2xl font-bold">45</div>
                                   <p class="text-muted-foreground text-xs">
                                          +20.1% from last week
                                   </p>
                            </Card.Content>
                     </Card.Root>
                     <Card.Root>
                            <Card.Header
                                   class="flex flex-row items-center justify-between space-y-0 pb-2"
                            >
                                   <Card.Title class="text-sm font-medium"
                                          >Total Revenue</Card.Title
                                   >
                                   <Zap class="text-muted-foreground h-4 w-4" />
                            </Card.Header>
                            <Card.Content>
                                   <div class="text-2xl font-bold">45</div>
                                   <p class="text-muted-foreground text-xs">
                                          +20.1% from last week
                                   </p>
                            </Card.Content>
                     </Card.Root>
              </div>

              <Card.Root>
                     <Card.Header class="px-7">
                            <Card.Title>Relays</Card.Title>
                            <Card.Description
                                   >123 total relays, 12 created today</Card.Description
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
                                                        >Type</Table.Head
                                                 >
                                                 <Table.Head
                                                        class="hidden sm:table-cell"
                                                        >Status</Table.Head
                                                 >
                                                 <Table.Head
                                                        class="hidden md:table-cell"
                                                        >Date</Table.Head
                                                 >
                                                 <Table.Head class="text-right"
                                                        >Posts</Table.Head
                                                 >
                                          </Table.Row>
                                   </Table.Header>
                                   <Table.Body>
                                          {#each allRelays as profile}
                                                 <Table.Row class="bg-accent">
                                                        <Table.Cell>
                                                               <div
                                                                      class="font-medium"
                                                               >
                                                                      {profile.name}
                                                               </div>
                                                               <div
                                                                      class="text-muted-foreground hidden text-sm md:inline"
                                                               >
                                                                      {profile.about}
                                                               </div>
                                                        </Table.Cell>
                                                        <Table.Cell
                                                               class="hidden sm:table-cell"
                                                               >{profile.website}</Table.Cell
                                                        >
                                                        <Table.Cell
                                                               class="hidden sm:table-cell"
                                                        >
                                                               <Badge
                                                                      class="text-xs"
                                                                      variant="secondary"
                                                                      >Fulfilled</Badge
                                                               >
                                                        </Table.Cell>
                                                        <Table.Cell
                                                               class="hidden md:table-cell"
                                                               >2023-06-23</Table.Cell
                                                        >
                                                        <Table.Cell
                                                               class="text-right"
                                                               >$250.00</Table.Cell
                                                        >
                                                 </Table.Row>
                                          {/each}
                                   </Table.Body>
                            </Table.Root>
                     </Card.Content>
              </Card.Root>
              <script lang="ts">
                     import * as Avatar from "$lib/registry/default/ui/avatar/index.js";
                     import * as Card from "$lib/registry/default/ui/card/index.js";
              </script>

              <Card.Root>
                     <Card.Header>
                            <Card.Title>Recommended</Card.Title>
                     </Card.Header>
                     <Card.Content class="grid gap-8">
                            <div class="flex items-center gap-4">
                                   <Avatar.Root class="hidden h-9 w-9 sm:flex">
                                          <Avatar.Image
                                                 src="/avatars/01.png"
                                                 alt="Avatar"
                                          />
                                          <Avatar.Fallback>OM</Avatar.Fallback>
                                   </Avatar.Root>
                                   <div class="grid gap-1">
                                          <p
                                                 class="text-sm font-medium leading-none"
                                          >
                                                 Olivia Martin
                                          </p>
                                          <p
                                                 class="text-muted-foreground text-sm"
                                          >
                                                 olivia.martin@email.com
                                          </p>
                                   </div>
                                   <div class="ml-auto font-medium">
                                          +$1,999.00
                                   </div>
                            </div>
                            <div class="flex items-center gap-4">
                                   <Avatar.Root class="hidden h-9 w-9 sm:flex">
                                          <Avatar.Image
                                                 src="/avatars/02.png"
                                                 alt="Avatar"
                                          />
                                          <Avatar.Fallback>JL</Avatar.Fallback>
                                   </Avatar.Root>
                                   <div class="grid gap-1">
                                          <p
                                                 class="text-sm font-medium leading-none"
                                          >
                                                 Jackson Lee
                                          </p>
                                          <p
                                                 class="text-muted-foreground text-sm"
                                          >
                                                 jackson.lee@email.com
                                          </p>
                                   </div>
                                   <div class="ml-auto font-medium">
                                          +$39.00
                                   </div>
                            </div>
                            <div class="flex items-center gap-4">
                                   <Avatar.Root class="hidden h-9 w-9 sm:flex">
                                          <Avatar.Image
                                                 src="/avatars/03.png"
                                                 alt="Avatar"
                                          />
                                          <Avatar.Fallback>IN</Avatar.Fallback>
                                   </Avatar.Root>
                                   <div class="grid gap-1">
                                          <p
                                                 class="text-sm font-medium leading-none"
                                          >
                                                 Isabella Nguyen
                                          </p>
                                          <p
                                                 class="text-muted-foreground text-sm"
                                          >
                                                 isabella.nguyen@email.com
                                          </p>
                                   </div>
                                   <div class="ml-auto font-medium">
                                          +$299.00
                                   </div>
                            </div>
                            <div class="flex items-center gap-4">
                                   <Avatar.Root class="hidden h-9 w-9 sm:flex">
                                          <Avatar.Image
                                                 src="/avatars/04.png"
                                                 alt="Avatar"
                                          />
                                          <Avatar.Fallback>WK</Avatar.Fallback>
                                   </Avatar.Root>
                                   <div class="grid gap-1">
                                          <p
                                                 class="text-sm font-medium leading-none"
                                          >
                                                 William Kim
                                          </p>
                                          <p
                                                 class="text-muted-foreground text-sm"
                                          >
                                                 will@email.com
                                          </p>
                                   </div>
                                   <div class="ml-auto font-medium">
                                          +$99.00
                                   </div>
                            </div>
                            <div class="flex items-center gap-4">
                                   <Avatar.Root class="hidden h-9 w-9 sm:flex">
                                          <Avatar.Image
                                                 src="/avatars/05.png"
                                                 alt="Avatar"
                                          />
                                          <Avatar.Fallback>SD</Avatar.Fallback>
                                   </Avatar.Root>
                                   <div class="grid gap-1">
                                          <p
                                                 class="text-sm font-medium leading-none"
                                          >
                                                 Sofia Davis
                                          </p>
                                          <p
                                                 class="text-muted-foreground text-sm"
                                          >
                                                 sofia.davis@email.com
                                          </p>
                                   </div>
                                   <div class="ml-auto font-medium">
                                          +$39.00
                                   </div>
                            </div>
                     </Card.Content>
              </Card.Root>
       </main>
</div>
