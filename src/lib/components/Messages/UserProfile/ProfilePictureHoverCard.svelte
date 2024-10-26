<script lang="ts">
  import ProfileHoverCard from "./ProfileHoverCard.svelte";
  import ProfilePicture from "./ProfilePicture.svelte";

  export let image = "";
  export let name: string;
  export let username: string;
  export let about: string = "";
  export let isSubscribed = true;
  export let website = "";
  export let subscribers = 0;
  export let subscribing = 0;
  export let processId;
  export let size: "sm" | "base" | "lg" | "xl" = "sm";
</script>

<ProfileHoverCard
  {image}
  {name}
  {username}
  {about}
  {isSubscribed}
  {website}
  {subscribers}
  {subscribing}
  {processId}
>
  <ProfilePicture {name} src={image} {size} />
</ProfileHoverCard>
