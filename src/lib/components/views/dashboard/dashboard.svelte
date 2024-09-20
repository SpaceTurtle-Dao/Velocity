<script lang="ts">
       import Zap from "lucide-svelte/icons/zap";
       import * as Avatar from "$lib/components/ui/avatar/index.js";
       import { Input } from "$lib/components/ui/input/index.js";
       import { Button } from "$lib/components/ui/button/index.js";
       import * as Card from "$lib/components/ui/card/index.js";
       import type { Profile } from "$lib/models/Profile";
       import * as Table from "$lib/components/ui/ui/table/index";
       import { Badge } from "$lib/components/ui/ui/badge/index.js";

       // import * as Table from "$lib/registry/default/ui/table/index.js";

       let profiles: Profile[] = [];
       let selectedProfileId: number | null = null;
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
                                   <div class="text-2xl font-bold">12</div>
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
                                          <Table.Row class="bg-accent">
                                                 <Table.Cell>
                                                        <div
                                                               class="font-medium"
                                                        >
                                                               Liam Johnson
                                                        </div>
                                                        <div
                                                               class="text-muted-foreground hidden text-sm md:inline"
                                                        >
                                                               dsd89sdf89sdf
                                                        </div>
                                                 </Table.Cell>
                                                 <Table.Cell
                                                        class="hidden sm:table-cell"
                                                        >Sale</Table.Cell
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
                                                 <Table.Cell class="text-right"
                                                        >$250.00</Table.Cell
                                                 >
                                          </Table.Row>
                                   </Table.Body>
                            </Table.Root>
                     </Card.Content>
              </Card.Root>
       </main>
</div>
