<script lang="typescript">
  import { post } from "../util/api";
  import Cookies from "js-cookie";

  export let loggedIn = false;

  let email;
  let password;

  let error;
  let showLogin = true;

  async function signup() {
    error = "";
    const res = await post("/signup", { email, password });
    if (res.token) {
      loggedIn = true;
      Cookies.set("token", res.token);
    } else {
      error = res;
    }
  }

  async function login() {
    error = "";
    const res = await post("/login", { email, password });
    if (res.token) {
      loggedIn = true;
      Cookies.set("token", res.token);
    } else {
      error = res;
    }
  }

  function toggleAccount() {
    showLogin = !showLogin;
    document.getElementById("email").focus();
  }
</script>

<style>
  :root {
    --input-border: #8b8a8b;
    --input-focus-h: 245;
    --input-focus-s: 100%;
    --input-focus-l: 42%;
  }

  .login {
    width: 200px;
  }

  .align-items-center {
    display: flex;
    justify-content: center;
  }

  .error {
    color: red;
    margin-top: 1em;
  }
</style>

<div class="page__content-credits align-items-center">
  <div class="login">
    <form on:submit|preventDefault={showLogin ? login : signup}>
      <label class="input-label" for="email">E-mail</label>
      <input class="input" id="email" bind:value={email} type="email" />
      <br />

      <label class="input-label" for="password">Password</label>
      <input
        class="input"
        id="password"
        bind:value={password}
        type="password" />
      <br />

      <button type="submit">
        {#if showLogin}Login{:else}Signup{/if}
      </button>
      {#if error}
        <div class="error">{error}</div>
      {/if}
    </form>
  </div>
</div>
<div class="page__content-copyright">
  {#if showLogin}
    Don't have an account?
    <button class="inline-button" on:click={toggleAccount}>
      Create an Account
    </button>
  {:else}
    Already have an account?
    <button class="inline-button" on:click={toggleAccount}> Login </button>
  {/if}
</div>
