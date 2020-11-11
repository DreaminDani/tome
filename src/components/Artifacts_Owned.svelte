<script>
  import { fade } from "svelte/transition";
  export let visible;
</script>

<label for="page-2" class="book__page book__page--4" class:visible>
  {#if visible}
    <div class="page__content" transition:fade>
      <h1 class="page__content-title">My Artifacts</h1>
      <table class="page__content-table">
        <tr>
          <td align="left">Artifact name</td>
          <td align="right">12-01-2020</td>
        </tr>
      </table>
    </div>
  {/if}
</label>
