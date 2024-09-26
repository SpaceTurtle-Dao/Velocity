<script lang="ts">
  import { followers } from "$lib/stores/profile.store";
  import { profileFromEvent, type UserInfo } from "$lib/models/Profile";
  import ProfileCard from "./ProfileCard.svelte";
  import { info } from "$lib/ao/relay";

  let userProfiles: Array<UserInfo> = [];

  followers.subscribe(async (_followers) => {
    if (_followers.length > 0) {
      userProfiles = [];
    }
    for (var i = 0; i < _followers.length; i++) {
      console.log("getting info for");
      console.log(_followers[i]);
      let userInfo: UserInfo = await info(_followers[i]);
      console.log(userInfo);
      userProfiles.push(userInfo);
    }
    userProfiles = userProfiles;
    console.log("got followers");
    console.log(userProfiles);
  });

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  function toUrl(tx: string) {
    return (
      "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
      tx
    );
  }
</script>

<div class="flex flex-col space-y-2">
  {#each userProfiles as userProfile}
    <ProfileCard data={userProfile} />
  {/each}
</div>
