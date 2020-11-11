<script>
  import { post } from "../util/api";
  let email;
  let password;

  let error;
  export let loggedIn = false;
  let showLogin = true;

  async function signup() {
    const res = await post("/signup", { email, password });
    if (res.token) {
      loggedIn = true;
    } else {
      error = res;
    }
  }
  async function login() {
    const res = await post("/login", { email, password });
    if (res.token) {
      loggedIn = true;
    } else {
      error = res;
    }
  }
</script>

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
  <button on:click={() => (showLogin = !showLogin)}> Create an Account </button>
</div>
