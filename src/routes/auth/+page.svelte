<script lang="ts">
	import { redirect } from "@sveltejs/kit";
	let username = "";
	let password = "";
	let confirmPassword = "";
	let displayName = "";
	let errorMessage = "";
	let loginUsername = "";
	let loginPassword = "";
	let loginErrorMessage = "";
	let isLogin = true;

	const handleRegisterSubmit = async () => {
		if (!username || !password || !confirmPassword || !displayName) {
			errorMessage = "All fields are required!";
			return;
		}

		if (password !== confirmPassword) {
			errorMessage = "Passwords do not match!";
			return;
		}
		try {
			const res = await fetch("/api/v1/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password, displayName }),
			});

			const data = await res.json();

			if (!res.ok) {
				errorMessage = data.error || "Registration failed.";
				return;
			}
			localStorage.setItem("token", data.token);
			isLogin = true;
			redirect(307, "/setup");
		} catch (err) {
			errorMessage = "Something went wrong. Try again.";
		}
	};

	const handleLoginSubmit = async () => {
		if (!loginUsername || !loginPassword) {
			loginErrorMessage = "Username and password are required!";
			return;
		}

		loginErrorMessage = "";

		try {
			const response = await fetch("/api/v1/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: loginUsername,
					password: loginPassword,
				}),
			});
			if (!response.ok) {
				const data = await response.json();
				loginErrorMessage = data.error || "Login failed!";
				return;
			}
			const data = await response.json();
			const { token, user } = data;
			console.log("Login successful:", { user });
			window.location.href = "/";
		} catch (error) {
			loginErrorMessage = "An error occurred. Please try again.";
			console.error("Login error:", error);
		}
	};
</script>

<div class="main">
	{#if !isLogin}
		<form on:submit|preventDefault={handleRegisterSubmit} class="form">
			<h2>Create account</h2>
			<div>
				<label for="username">Username</label>
				<input id="username" type="text" bind:value={username} required />
			</div>
			<div>
				<label for="displayName">Display Name</label>
				<input id="displayName" type="text" bind:value={displayName} required />
			</div>
			<div>
				<label for="password">Password</label>
				<input id="password" type="password" bind:value={password} required />
			</div>
			<div>
				<label for="confirmPassword">Confirm Password</label>
				<input
					id="confirmPassword"
					type="password"
					bind:value={confirmPassword}
					required
				/>
			</div>
			{#if errorMessage}
				<p class="error">{errorMessage}</p>
			{/if}
			<button type="submit">Register</button>
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<p class="switch-text" on:click={() => (isLogin = !isLogin)}>
				Already have an account? Login now
			</p>
		</form>
	{/if}

	{#if isLogin}
		<form on:submit|preventDefault={handleLoginSubmit} class="form">
			<h2>Log in</h2>
			<div>
				<label for="loginUsername">Username</label>
				<input
					id="loginUsername"
					type="text"
					bind:value={loginUsername}
					required
				/>
			</div>
			<div>
				<label for="loginPassword">Password</label>
				<input
					id="loginPassword"
					type="password"
					bind:value={loginPassword}
					required
				/>
			</div>
			{#if loginErrorMessage}
				<p class="error">{loginErrorMessage}</p>
			{/if}
			<button type="submit">Login</button>
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<p class="switch-text" on:click={() => (isLogin = !isLogin)}>
				Don't have an account? Register now
			</p>
		</form>
	{/if}
</div>

<style lang="scss">
	.main {
		user-select: none;
		color: rgb(238, 238, 238);
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		flex-direction: column;
		position: relative;
	}

	.form {
		width: 300px;
		font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
			"Lucida Sans Unicode", Geneva, Verdana, sans-serif;
		margin: 20px auto;
		padding: 20px;
		font-size: 13px;
		background-color: rgba(40, 38, 49, 0.7);
		border: 1px solid #8080801a;
		border-radius: 8px;
	}

	.form div {
		margin-bottom: 10px;
		margin-right: 20px;
	}

	.form label {
		display: block;
		margin-bottom: 5px;
	}

	.form input {
		width: 100%;
		padding: 8px;
		font-size: 16px;
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 4px;
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
	}

	.form button {
		width: 100%;
		padding: 10px;
		background-color: rgb(63, 58, 109);
		margin-top: 10px;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 16px;
		cursor: pointer;
		transition: 0.1s ease;
		&:hover {
			background-color: rgb(43, 38, 89);
		}
		&:active {
			transform: scale(0.96);
		}
	}

	.error {
		color: rgb(224, 83, 83);
		font-size: 14px;
	}

	.switch-text {
		text-align: center;
		font-size: 12px;
		color: rgb(172, 172, 172);
		cursor: pointer;
		margin-top: 10px;
	}

	.switch-text:hover {
		color: rgb(146, 138, 222);
	}
</style>
