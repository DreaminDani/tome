<script>
  import router from "page";

  import Home from "./pages/Home.svelte";
  import Edit from "./pages/Edit.svelte";
  import ErrorPage from "./pages/ErrorPage.svelte";

  let page;
  let params;

  router("/", () => (page = Home));
  router("/edit", () => (page = Edit));
  router("/*", () => (page = ErrorPage));
  router.start();
</script>

<svelte:component this={page} {params} />
