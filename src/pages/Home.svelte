<script>
  import ArtifactsFeatured from "../components/Artifacts_Featured.svelte";
  import ArtifactsOwned from "../components/Artifacts_Owned.svelte";
  import HomeIllustration from "../components/Home_Illustration.svelte";
  import Login from "../components/Login.svelte";

  export let params;
  let open = params.token ? true : false;
</script>

<div class="cover">
  <div class="book">
    <HomeIllustration />
    <ArtifactsOwned />
    <!-- Resets the page -->
    <!-- <input type="radio" name="page" id="page-1" /> -->

    <!-- Goes to the second page -->
    <input
      bind:checked={open}
      disabled
      type="checkbox"
      name="page"
      id="page-2" />
    <label for="page-front" class="book__page book__page--2">
      <div class="book__page-front">
        <div class="page__content">
          <h1 class="page__content-book-title">Tome</h1>
          <h2 class="page__content-author">A Poetry Platform</h2>

          <Login bind:loggedIn={open} />
        </div>
      </div>
      <ArtifactsFeatured />
    </label>
  </div>
</div>
