<script lang="typescript">
  import { onMount } from "svelte";
  import "trix/dist/trix.js";
  import { trackChange } from "../util/events";
  import type { ChangeEvent } from "../util/events";

  export let content = "asdf";

  function updateValue(e: ChangeEvent) {
    content = e.target.value;
  }

  onMount(() => {
    trackChange(document.getElementById("x"));
  });
</script>

<style>
  .paper {
    height: max-content;
    background: #fff;
    padding: 30px;
    position: relative;
  }

  .paper,
  .paper::before,
  .paper::after {
    /* Styles to distinguish sheets from one another */
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.25);
    border: 1px solid #bbb;
  }

  .paper::before,
  .paper::after {
    content: "";
    position: absolute;
    height: 95%;
    width: 99%;
    background-color: #eee;
  }

  .paper::before {
    right: 15px;
    top: 0;
    transform: rotate(-1deg);
    z-index: -1;
  }

  .paper::after {
    top: 5px;
    right: -5px;
    transform: rotate(1deg);
    z-index: -2;
  }
  trix-editor {
    height: 100%;
    min-height: 50vh;
  }

  :global(.trix-button--icon-attach) {
    display: none;
  }
</style>

<div class="paper">
  <input
    id="x"
    bind:value={content}
    on:change={updateValue}
    type="hidden"
    name="content" />
  <trix-editor class="trix-content" input="x" />
</div>
