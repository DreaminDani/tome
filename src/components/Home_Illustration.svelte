<script>
  import { get } from "../util/api";
  import { onMount } from "svelte";
  let illustration;
  onMount(async () => {
    illustration = await get("/illustration");
  });
</script>

<label for="page-1" class="book__page book__page--1">
  <img src={illustration} alt="An illustrative book cover" />
</label>
