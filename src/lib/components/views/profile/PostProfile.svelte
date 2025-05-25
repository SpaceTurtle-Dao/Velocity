<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import {
        MessageCircle,
        Repeat2,
        Heart,
        Share,
        HandCoins,
    } from "lucide-svelte";
    import {
        profileFromEvent,
        type Profile,
        type UserInfo,
    } from "$lib/models/Profile";
    import { toUrl } from "$lib/constants";

    export let _user: UserInfo

    function formatDate(dateString: number): string {
        return new Date(dateString).toLocaleTimeString();
    }
</script>


