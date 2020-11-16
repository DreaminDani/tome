<script lang="typescript">
  import { fade } from "svelte/transition";
  import { get } from "../util/api";
  import { onMount } from "svelte";

  export let visible;

  let illustration;
  onMount(async () => {
    illustration = await get("/illustration");
  });
</script>

<label for="page-1" class="book__page book__page--1">
  {#if visible}
    <img
      src={illustration}
      alt="An illustrative book cover"
      transition:fade={{ duration: 300 }} />
  {/if}
</label>
