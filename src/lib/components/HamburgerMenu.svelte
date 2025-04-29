<script lang="ts">
	import { onMount } from "svelte";
	import { Spring } from "svelte/motion";
	import checkToken from "$lib/utility/checkToken";
	export let switchViews: boolean;
	let isOpen = false;
	let isLoggedIn = true;
	const spring = new Spring(10, { stiffness: 0.5 });
	$: spring.target = isOpen ? 10 : 0;
	let token: string;
	$: if (isOpen) {
		checkToken(token).then((valid) => {
			isLoggedIn = valid;
			console.log("logged in:", isLoggedIn);
		});
	}
	let menuRef: HTMLDivElement;

	function switchView() {
		switchViews = !switchViews;
	}

	const handleLogout = async () => {
		await fetch("/", { method: "DELETE" });
		window.location.href = "/";
	};
	const handleClick = (e: MouseEvent) => {
		if (isOpen && menuRef && !menuRef.contains(e.target as Node)) {
			isOpen = false;
		}
	};
	onMount(async () => {
		token = await (await fetch("/")).text();
		document.addEventListener("click", handleClick);
	});
</script>

<div class="menu-container" bind:this={menuRef}>
	<button
		class="hamburger"
		on:click={() => (isOpen = !isOpen)}
		aria-label="Toggle menu"
	>
		<div class="line"></div>
		<div class="line"></div>
		<div class="line"></div>
	</button>

	{#if isOpen && spring.current > -10}
		<div
			class="dropdown"
			style="transform: translateY({spring.current}px); opacity: {Math.max(
				0,
				(spring.current + 10) / 10
			)}; transition: opacity 0.2s ease;"
		>
			{#if !isLoggedIn}
				<a href="/auth">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 512 512"
						style="margin-right: 10px;"
					>
						<path
							d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"
						/>
					</svg>
					Login
				</a>{/if}
			{#if isLoggedIn}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_missing_attribute -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<a on:click={() => switchView()}>
					{#if !switchViews}<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							viewBox="0 0 512 512"
							style="margin-right: 10px;"
							><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
								d="M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"
							/></svg
						>Watch list
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							style="margin-right: 10px;"
							viewBox="0 0 576 512"
							><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
								d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"
							/></svg
						>Featured
					{/if}
				</a>

				<div class="divider"></div>
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_missing_attribute -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<a on:click={() => handleLogout()}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 512 512"
						width="16"
						height="16"
						fill="currentColor"
						style="margin-right: 10px;"
						><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
							d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
						/></svg
					>Logout</a
				>{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.menu-container {
		-webkit-touch-callout: none;
		user-select: none;
		-webkit-user-select: none;
		position: relative;
		right: 10px;
	}

	.hamburger {
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: rgba(18, 17, 22, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.15);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		padding: 0;
		z-index: 200;
		transition: background-color 0.15s ease;
		&:hover {
			background-color: rgba(40, 38, 49, 0.7);
		}
	}
	.divider {
		width: 80%;
		margin: 5px auto 5px auto;
		height: 2px;
		background-color: rgba(211, 211, 211, 0.13);
	}
	.line {
		width: 20px;
		height: 2px;
		background-color: rgb(211, 211, 211);
		margin: 2px 0;
	}

	.dropdown {
		position: absolute;
		right: 0;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		background-color: rgb(18, 17, 22);
		border: 1.5px solid rgba(255, 255, 255, 0.15);
		box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.75);
	}

	.dropdown a {
		cursor: pointer;
		display: flex;
		align-items: center;
		font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
			"Lucida Sans Unicode", Geneva, Verdana, sans-serif;
		letter-spacing: 0.5px;
		width: 110px;
		padding: 8px;
		color: rgb(172, 172, 172);
		text-decoration: none;
		margin: 0 10px;
		&:first-child {
			margin-top: 10px;
		}
		&:last-child {
			margin-bottom: 10px;
		}
		&:hover {
			color: rgb(146, 138, 222);
			background-color: rgba(255, 255, 255, 0.05);
			border-radius: 5px;
		}
	}
	@media (max-width: 768px) {
		.dropdown {
			bottom: 80px;
			a {
				letter-spacing: 0.5px;
				padding: 16px;
				color: rgb(172, 172, 172);
				text-decoration: none;
				margin: 0 10px;

				&:hover {
					color: rgb(146, 138, 222);
					background-color: rgba(255, 255, 255, 0.05);
					border-radius: 5px;
				}
			}
		}
	}
</style>
