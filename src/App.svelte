<script>
  import Cookies from "js-cookie";
  import router from "page";

  import Home from "./pages/Home.svelte";
  import Edit from "./pages/Edit.svelte";
  import ErrorPage from "./pages/ErrorPage.svelte";

  let page;
  let params = {};

  const token = Cookies.get("token");
  if (token) {
    params.token = token;
  }

  router("/", () => (page = Home));
  router("/edit", () => (page = Edit));
  router("/*", () => (page = ErrorPage));
  router.start();
</script>

<svelte:component this={page} {params} />
