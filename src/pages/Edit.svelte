<script lang="typescript">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import Editor from "../components/Editor.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import { post } from "../util/api";

  let content = ""; // todo, get existing content (via id in params)
  async function save() {
    console.log(content);
    const saved = await post("/edit", { content }); // todo, if there's an ID, pass that here too
    console.log(saved);
  }

  onMount(() => {
    const button = document.createElement("button");
    button.innerHTML = "Save";
    button.onclick = save;
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
    <Editor bind:content />
    <Sidebar />
  </main>
</div>
