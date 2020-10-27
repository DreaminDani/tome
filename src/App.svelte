<script>
  import Editor from "./Editor.svelte";
  import Sidebar from "./Sidebar.svelte";
</script>

<style>
  .App {
    height: 50vh;
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

<div class="App">
  <header class="App-header">
    <h1>Type anything</h1>
  </header>
  <main>
    <Editor />
    <Sidebar />
  </main>
</div>
