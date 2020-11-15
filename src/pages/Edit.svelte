<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import Editor from "../components/Editor.svelte";
  import Sidebar from "../components/Sidebar.svelte";

  onMount(() => {
    const button = document.createElement("button");
    button.innerHTML = "Save";
    document.getElementsByClassName("trix-button-row")[0].appendChild(button);
    // todo: append popover with version history
  });
</script>

<style>
  .App {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
  }
  main {
    height: 100%;
    display: flex;
    align-items: stretch;
    justify-content: space-evenly;
  }
</style>

<div class="App" in:fly={{ delay: 500, duration: 600 }}>
  <main>
    <Editor />
    <Sidebar />
  </main>
</div>
