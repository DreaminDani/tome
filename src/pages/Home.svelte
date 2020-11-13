<script>
  import { fade } from "svelte/transition";
  import ArtifactsFeatured from "../components/Artifacts_Featured.svelte";
  import ArtifactsOwned from "../components/Artifacts_Owned.svelte";
  import HomeIllustration from "../components/Home_Illustration.svelte";
  import CreateButton from "../components/CreateButton.svelte";
  import Login from "../components/Login.svelte";

  export let params;
  let loggedIn = params.token ? true : false;
  let open = params.token ? true : false;
</script>

<main transition:fade>
  <div class="cover">
    <div class="book">
      <HomeIllustration visible={!loggedIn} />
      <ArtifactsOwned visible={open} />
      <CreateButton />
      <!-- Resets the page -->
      <!-- <input type="radio" name="page" id="page-1" /> -->

      <!-- Goes to the second page -->
      <input
        bind:checked={loggedIn}
        disabled
        type="checkbox"
        name="page"
        id="page-2" />
      <label for="page-front" class="book__page book__page--2">
        <div class="book__page-front">
          {#if !loggedIn}
            <div
              class="page__content"
              transition:fade={{ duration: 300 }}
              on:outroend={() => (open = true)}>
              <h1 class="page__content-book-title">Tome</h1>
              <h2 class="page__content-author">A Poetry Platform</h2>

              <Login bind:loggedIn />
            </div>
          {/if}
        </div>
        <ArtifactsFeatured visible={open} />
      </label>
    </div>
  </div>
</main>
