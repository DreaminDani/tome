<script>
  import { post } from "../util/api";
  import Cookies from "js-cookie";

  let email;
  let password;

  let error;
  export let loggedIn = false;
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

  .input-label {
    align-self: center;
    display: block;
    text-align: left;
    margin-bottom: 2px;
  }

  .input {
    font-size: inherit;
    font-size: inherit;
    font-family: inherit;
    line-height: 1;
    height: 2.25rem;
    padding: 0.25em 0.5em;
    margin-bottom: 0.5em;
    background-color: #fff;
    border: 2px solid var(--input-border);
    border-radius: 4px;
    transition: 180ms box-shadow ease-in-out;
  }

  .input:focus {
    border-color: hsl(
      var(--input-focus-h),
      var(--input-focus-s),
      var(--input-focus-l)
    );
    box-shadow: 0 0 0 3px
      hsla(
        var(--input-focus-h),
        var(--input-focus-s),
        calc(var(--input-focus-l) + 40%),
        0.8
      );
    /* For Windows High Contrast mode */
    outline: 3px solid transparent;
  }
  .button {
    width: 100%;
    font-size: inherit;
    font-size: inherit;
    font-family: inherit;
    font-weight: bold;
    line-height: 1;
    height: 2.25rem;
    padding: 0.25em 0.5em;
    background-color: #fff;
    border-radius: 4px;
    background-color: hsl(245, 54%, 44%);
    color: #fff;
    transition: 180ms box-shadow ease-in-out;
  }
  .button:focus {
    border-color: hsl(
      var(--input-focus-h),
      var(--input-focus-s),
      var(--input-focus-l)
    );
    box-shadow: 0 0 0 3px
      hsla(
        var(--input-focus-h),
        var(--input-focus-s),
        calc(var(--input-focus-l) + 40%),
        0.8
      );
    /* For Windows High Contrast mode */
    outline: 3px solid transparent;
  }
  .inline-button {
    background: none !important;
    border: none;
    padding: 0 !important;
    color: hsl(
      var(--input-focus-h),
      var(--input-focus-s),
      var(--input-focus-l)
    );
    text-decoration: underline;
    cursor: pointer;
    transition: 180ms box-shadow ease-in-out;
  }
  .inline-button:focus {
    border-color: hsl(
      var(--input-focus-h),
      var(--input-focus-s),
      var(--input-focus-l)
    );
    box-shadow: 0 0 0 3px
      hsla(
        var(--input-focus-h),
        var(--input-focus-s),
        calc(var(--input-focus-l) + 40%),
        0.8
      );
    /* For Windows High Contrast mode */
    outline: 3px solid transparent;
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

      <button class="button" type="submit">
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
