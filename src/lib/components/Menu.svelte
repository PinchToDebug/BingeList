<script lang="ts">
	let genres = [
		"Drama",
		"Comedy",
		"Action",
		"Crime",
		"Thriller",
		"Romance",
		"Adventure",
		"Mystery",
		"Fantasy",
		"Science-Fiction",
		"Supernatural",
		"Horror",
		"Family",
		"Medical",
		"Espionage",
		"Legal",
		"History",
		"War",
		"Sports",
		"Food",
		"Anime",
		"Western",
		"DIY",
		"Children",
		"Adult",
		"Travel",
		"Nature",
	];

	let selectedGenres: string[] = [];

	function toggleGenre(genre: string) {
		if (selectedGenres.includes(genre)) {
			selectedGenres = selectedGenres.filter((g) => g !== genre);
		} else {
			selectedGenres = [...selectedGenres, genre];
		}
	}
</script>

<div class="buttons">
	{#each genres as genre}
		<button
			class:selected={selectedGenres.includes(genre)}
			on:click={() => toggleGenre(genre)}
		>
			{genre}
		</button>
	{/each}
</div>
<div class="menu">
	<slot></slot>
</div>

<style>
	.menu {
		position: relative;
		margin-bottom: 60px;
	}
	.buttons {
		padding-top: 20px;
		padding-bottom: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
		margin: auto;
		width: 90%;
		overflow-y: auto;
		max-height: 100px;
		position: relative;
		mask-image: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0),
			transparent 0%,
			rgba(0, 0, 0, 1) 10%,
			rgba(0, 0, 0, 1) 90%,
			transparent 100%,
			rgba(0, 0, 0, 0)
		);
		-webkit-mask-image: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0),
			transparent 0%,
			rgba(0, 0, 0, 1) 10%,
			rgba(0, 0, 0, 1) 90%,
			transparent 100%,
			rgba(0, 0, 0, 0)
		);
	}

	button {
		color: white;
		padding: 15px 20px;
		font-size: 14px;
		border: 1px solid #3e3b4e;
		border-radius: 15px;
		background-color: #1a1a29b0;
		cursor: pointer;
		width: fit-content;
		transition: 0.1s ease;

		&:hover {
			transform: scale(1.1);
			background-color: rgba(57, 57, 92, 0.979);
		}
	}

	button.selected {
		background-color: rgba(53, 53, 75, 0.979);
		border-color: rgba(255, 255, 255, 0.212);
	}

	@media (max-width: 767px) {
		.buttons {
			-ms-overflow-style: none;
			scrollbar-width: none;
			flex-wrap: wrap;
		}
		.buttons::-webkit-scrollbar {
			display: none;
		}
		button {
			max-width: 150px;
			margin-bottom: 10px;
		}
	}
</style>
