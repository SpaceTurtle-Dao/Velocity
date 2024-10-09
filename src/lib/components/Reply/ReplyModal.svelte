<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Image, Smile, Calendar } from 'lucide-svelte';
  import * as Dialog from "$lib/components/ui/dialog";
  import Nip92 from "$lib/handlers/NIP92.svelte";
  import { Separator } from "$lib/components/ui/separator/index";

  export let isOpen = false;
  export let originalPost: { author: string, content: string, avatar: string, event: any };
  export let currentUser: { name: string, avatar: string };

  let replyText = '';

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('close');
  }

  function handleSubmit() {
    dispatch('submit', replyText);
    replyText = '';
    closeModal();
  }

  $: if (!isOpen) {
    replyText = '';
  }
</script>

