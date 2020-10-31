<script>
  import { post } from "../util/api";
  let email;
  let password;
  function signup() {
    console.log(post("/signup", { email, password }));
  }
  function login() {
    console.log(post("/login", { email, password }));
  }
</script>

<h1>Home page</h1>

<h3>Login</h3>
<label for="mail">E-mail:</label>
<input bind:value={email} type="email" />

<label for="msg">Password</label>
<input bind:value={password} type="password" />

<button on:click={login} type="button">Login</button>

<h3>Signup</h3>
<label for="mail">E-mail:</label>
<input bind:value={email} type="email" />

<label for="msg">Password</label>
<input bind:value={password} type="password" />

<button on:click={signup} type="button">Signup</button>
