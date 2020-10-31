<script>
  import { onMount } from "svelte";
  import { post, get } from "../util/api";
  let email;
  let password;

  let error;
  let open = false;
  let showLogin = true;

  let illustration;
  onMount(async () => {
    illustration = await get("/illustration");
  });
  async function signup() {
    const res = await post("/signup", { email, password });
    if (res.token) {
      open = true;
    } else {
      error = res;
    }
  }
  async function login() {
    const res = await post("/login", { email, password });
    if (res.token) {
      open = true;
    } else {
      error = res;
    }
  }
</script>

<style>
  /* Inspired by https://codepen.io/diemoritat/pen/LKROYZ */
  :root {
    /* colors */
    --body-bg: #fafafa;
    --page-bg: #ffffff;
    --dark-text: #2a2935;
    /* spacing */
    /* this is what defines the global scale */
    --baseline: 12px;
    /* fonts */
    font-family: "Cormorant Garamond", serif;
    --base-size: var(--baseline) * 1.2;
  }

  * {
    box-sizing: border-box;
  }

  :global(body) {
    background-color: var(--body-bg);
    height: 100vh;
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
  }

  .cover {
    width: calc(var(--baseline) * 60);
    height: calc(var(--baseline) * 42.6);
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.3);
  }

  .book {
    width: 100%;
    height: 100%;
    display: -webkit-box;
    display: flex;
    -webkit-perspective: 1200px;
    perspective: 1200px;
  }
  .book__page {
    position: relative;
    width: 50%;
    height: 100%;
    display: grid;
    -webkit-transform: rotateY(0deg);
    transform: rotateY(0deg);
    -webkit-transition: -webkit-transform 0.9s
      cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: -webkit-transform 0.9s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: transform 0.9s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: transform 0.9s cubic-bezier(0.645, 0.045, 0.355, 1),
      -webkit-transform 0.9s cubic-bezier(0.645, 0.045, 0.355, 1);
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
    background-color: var(--page-bg);
    background-image: -webkit-gradient(
      linear,
      left top,
      right top,
      from(#e3e3e3),
      color-stop(18%, rgba(247, 247, 247, 0))
    );
    background-image: linear-gradient(
      90deg,
      #e3e3e3 0%,
      rgba(247, 247, 247, 0) 18%
    );
  }
  .book__page:nth-of-type(1) {
    background-image: -webkit-gradient(
      linear,
      right top,
      left top,
      from(#e3e3e3),
      color-stop(18%, rgba(247, 247, 247, 0))
    );
    background-image: linear-gradient(
      -90deg,
      #e3e3e3 0%,
      rgba(247, 247, 247, 0) 18%
    );
  }
  .book__page--1 {
    overflow: hidden;
  }
  .book__page--1 img {
    height: 100%;
    width: auto;
    align-self: center;
  }
  .book__page--2 {
    position: absolute;
    right: 0;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    background-color: var(--page-bg);
    background-image: -webkit-gradient(
      linear,
      left top,
      right top,
      from(#e3e3e3),
      color-stop(18%, rgba(247, 247, 247, 0))
    );
    background-image: linear-gradient(
      90deg,
      #e3e3e3 0%,
      rgba(247, 247, 247, 0) 18%
    );
  }
  .book__page--4 {
    padding: 0 calc(var(--baseline) * 3);
  }
  .book__page-front {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-transform: rotateY(0deg) translateZ(1px);
    transform: rotateY(0deg) translateZ(1px);
  }
  .book__page-back {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 0 calc(var(--baseline) * 1.8);
    -webkit-transform: rotateY(180deg) translateZ(1px);
    transform: rotateY(180deg) translateZ(1px);
  }
  .book__page .page__content {
    padding: var(--baseline);
    height: 100%;
    position: relative;
    text-align: center;
  }
  .book__page .page__content-book-title {
    font-size: calc(var(--base-size) * 3);
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: var(--dark-text);
    margin-top: calc(var(--baseline) * 5);
    margin-bottom: calc(var(--baseline) * 2);
  }
  .book__page .page__content-author {
    font-size: calc(var(--base-size) * 1.2);
    font-weight: 100;
    text-transform: uppercase;
    color: var(--dark-text);
    border-top: 1px solid var(--dark-text);
    border-bottom: 1px solid var(--dark-text);
    display: inline-block;
    padding: calc(var(--baseline) / 2) calc(var(--baseline) / 5);
    margin-bottom: calc(var(--baseline) * 6);
  }
  .book__page .page__content-credits {
    text-transform: uppercase;
    font-size: calc(var(--base-size) * 0.8);
    margin-bottom: calc(var(--baseline) * 2);
    letter-spacing: 1px;
  }
  .book__page .page__content-credits span {
    display: block;
    font-size: calc(var(--base-size) * 1.2);
    letter-spacing: 0;
  }
  .book__page .page__content-copyright {
    position: absolute;
    width: calc(100% - (var(--baseline) * 2));
    bottom: calc(var(--baseline) * 2);
    font-size: calc(var(--base-size) * 0.8);
    text-transform: uppercase;
  }
  .book__page .page__content-title {
    font-size: calc(var(--base-size) * 1);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: calc(var(--baseline) * 5);
    margin-bottom: calc(var(--baseline) * 3);
  }
  .book__page .page__content-table {
    width: 100%;
    margin-top: calc(var(--baseline) * 2);
  }
  .book__page .page__content-table td {
    font-size: calc(var(--base-size) * 1);
    padding-bottom: calc(var(--baseline) * 1.5);
    text-transform: uppercase;
  }
  .book__page .page__content-blockquote {
    margin-bottom: calc(var(--baseline) * 2);
  }
  .book__page .page__content-blockquote-text {
    font-size: calc(var(--base-size) * 0.67);
    font-style: italic;
    text-align: justify;
  }
  .book__page .page__content-blockquote-reference {
    font-size: calc(var(--base-size) * 0.7);
    margin-top: calc(var(--baseline) * 0.3);
    float: right;
    text-transform: uppercase;
  }
  .book__page .page__content-text {
    font-size: calc(var(--base-size) * 0.67);
    text-align: justify;
    text-indent: var(--baseline);
  }
  .book__page .page__number {
    position: absolute;
    bottom: var(--baseline);
    width: calc(100% - (var(--baseline) * 2));
    font-size: calc(var(--base-size) * 0.67);
    text-align: center;
  }
  .book input[type="checkbox"] {
    display: none;
  }
  .book input[type="checkbox"]:checked + .book__page {
    -webkit-transition: -webkit-transform 0.9s
      cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: -webkit-transform 0.9s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: transform 0.9s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: transform 0.9s cubic-bezier(0.645, 0.045, 0.355, 1),
      -webkit-transform 0.9s cubic-bezier(0.645, 0.045, 0.355, 1);
    -webkit-transform: rotateY(-180deg);
    transform: rotateY(-180deg);
  }
</style>

<div class="cover">
  <div class="book">
    <label for="page-1" class="book__page book__page--1">
      <img src={illustration} alt="An illustrative book cover" />
    </label>

    <label for="page-2" class="book__page book__page--4">
      <div class="page__content">
        <h1 class="page__content-title">My Artifacts</h1>
        <table class="page__content-table">
          <tr>
            <td align="left">Artifact name</td>
            <td align="right">12-01-2020</td>
          </tr>
        </table>
      </div>
    </label>
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

          <div class="page__content-credits">
            <div class="login">
              <label for="mail">E-mail</label><br />
              <input bind:value={email} type="email" />
              <br />

              <label for="msg">Password</label><br />
              <input bind:value={password} type="password" />
              <br />

              <button on:click={showLogin ? login : signup} type="button">
                {#if showLogin}Login{:else}Signup{/if}
              </button>
              {#if error}
                <div style="color: red">{error}</div>
              {/if}
            </div>
          </div>

          <div class="page__content-copyright">
            <button on:click={() => (showLogin = !showLogin)}>
              Create an Account
            </button>
          </div>
        </div>
      </div>
      <div class="book__page-back">
        <div class="page__content">
          <h1 class="page__content-title">Featured Artifacts</h1>
          <table class="page__content-table">
            <tr>
              <td align="left">Artifact name</td>
              <td align="right">12-01-2020</td>
            </tr>
          </table>
        </div>
      </div>
    </label>
  </div>
</div>
