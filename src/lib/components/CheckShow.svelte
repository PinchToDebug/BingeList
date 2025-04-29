<script lang="ts">
	import { onMount } from "svelte";
	import RatingBar from "./RatingBar.svelte";
	import checkToken from "$lib/utility/checkToken";
	export let showPopup: boolean;
	export let popupData: any = [];
	export let onClose: () => void;
	let isReady: boolean = false;
	let backgroundImage: string | null = null;
	$: showPopup, showPopup && popupData.id && getBackground();
	let token = "";
	let selectedSeason = 0;
	type Episode = {
		name: string;
		number: number;
		rating: number;
		image: string;
		summary: string;
		airstamp: Date;
		isWatched: boolean;
	};
	type Season = Episode[];
	let allSeasons: Season[] = [];

	async function getWatchedEpisodeIds(
		showId: number
	): Promise<{ season_id: number; episode_id: number }[]> {
		if (token === "") return [];
		const response = await fetch(`/api/v1/user/getWatchedEpisodes`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ showId }),
		});
		const data = await response.json();
		return data.watchedEpisodes;
	}
	async function getShowEpisodes() {
		let res = await fetch(
			`https://api.tvmaze.com/shows/${popupData.id}/episodes`
		);

		const allEpisodes = await res.json();

		const watchedEpisodes = await getWatchedEpisodeIds(popupData.id); // will be an array now
		allSeasons = [];

		for (let i = 0; i < allEpisodes.length; i++) {
			const item = allEpisodes[i];

			const isWatched =
				watchedEpisodes != null
					? watchedEpisodes.some(
							(ep: { season_id: number; episode_id: number }) =>
								ep.season_id === item.season && ep.episode_id === item.number
						)
					: false;
			const episode: Episode = {
				name: item.name,
				number: item.number,
				rating: item.rating?.average ?? 0,
				image: item.image?.medium ?? "",
				summary: item.summary,
				airstamp: new Date(item.airdate),
				isWatched: isWatched,
			};

			if (!allSeasons[item.season - 1]) {
				allSeasons[item.season - 1] = [];
			}
			allSeasons[item.season - 1].push(episode);
		}
	}
	async function getBackground() {
		selectedSeason = 0;
		getShowEpisodes();
		const res = await fetch(
			`https://api.tvmaze.com/shows/${popupData.id}/images`
		);
		const images = await res.json();
		const foundBackground = images.find(
			(img: { type: string }) => img.type === "background"
		);
		backgroundImage = foundBackground
			? foundBackground.resolutions.original.url
			: null;
		isReady = true;
	}
	async function markAsWatched(episode: Episode) {
		if (!token) return;
		const seasonId = selectedSeason + 1;
		const showId = popupData.id;
		const episodeId = episode.number;
		try {
			const response = await fetch("/api/v1/user/watchedEpisode", {
				method: episode.isWatched ? "DELETE" : "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					showId,
					seasonId,
					episodeId,
				}),
			});

			if (!response.ok) {
				console.error("Failed to mark episode as watched");
			} else {
				console.log(
					episode.isWatched
						? "Episode marked as not watched"
						: "Episode marked as watched"
				);
				episode.isWatched = !episode.isWatched;
			}
		} catch (error) {
			console.error(
				"Error marking episode as " + episode.isWatched
					? "not watched"
					: "watched",
				error
			);
		}
	}

	onMount(async () => {
		const res = await fetch("/");
		token = await res.text();
		if (token !== "" && (await checkToken(token))) {
			if (showPopup && popupData.id) {
				getBackground;
			}
		}
	});
</script>

{#if showPopup}
	{#if popupData.name != null && popupData.name != "" && popupData.name != undefined}
		{console.log("[" + popupData.name + "]")}
		<title>BingeList - {popupData.name}</title>
	{:else}<title>BingeList</title>
	{/if}
{:else}<title>BingeList</title>
{/if}
{#if showPopup && isReady}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="popup-overlay" on:click={onClose}>
		<div class="popup-content" on:click|stopPropagation>
			<div class="close-button-wrap" on:click={onClose}>
				<svg
					width="16px"
					height="16px"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
						id="SVGRepo_tracerCarrier"
						stroke-linecap="round"
						stroke-linejoin="round"
					></g><g id="SVGRepo_iconCarrier">
						<g id="Menu / Close_MD">
							<path
								id="Vector"
								d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18"
								stroke="white"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path>
						</g>
					</g></svg
				>
			</div>
			<div class="background-image">
				<img src={backgroundImage} alt={popupData.name} />
			</div>

			<div class="img">
				{#if backgroundImage != null}<img
						src={backgroundImage}
						alt={popupData.name}
					/>
				{:else}<svg
						height="40px"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
							id="SVGRepo_tracerCarrier"
							stroke-linecap="round"
							stroke-linejoin="round"
						></g><g id="SVGRepo_iconCarrier">
							<path
								d="M14.2647 15.9377L12.5473 14.2346C11.758 13.4519 11.3633 13.0605 10.9089 12.9137C10.5092 12.7845 10.079 12.7845 9.67922 12.9137C9.22485 13.0605 8.83017 13.4519 8.04082 14.2346L4.04193 18.2622M14.2647 15.9377L14.606 15.5991C15.412 14.7999 15.8149 14.4003 16.2773 14.2545C16.6839 14.1262 17.1208 14.1312 17.5244 14.2688C17.9832 14.4253 18.3769 14.834 19.1642 15.6515L20 16.5001M14.2647 15.9377L18.22 19.9628M12 4H7.2C6.07989 4 5.51984 4 5.09202 4.21799C4.7157 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.0799 4 7.2V16.8C4 17.4466 4 17.9066 4.04193 18.2622M4.04193 18.2622C4.07264 18.5226 4.12583 18.7271 4.21799 18.908C4.40973 19.2843 4.7157 19.5903 5.09202 19.782C5.51984 20 6.07989 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12M16 3L18.5 5.5M18.5 5.5L21 8M18.5 5.5L21 3M18.5 5.5L16 8"
								stroke="rgba(255, 255, 255, 0.3)"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path>
						</g></svg
					>{/if}
			</div>
			<div class="details">
				<div class="row">
					<h2>{popupData.name}</h2>
					<div class="genre-wrapper">
						{#each popupData.genres as genre}
							<div class="genre">{genre}</div>
						{/each}
					</div>
				</div>
				<div class="summary-wrapper-container">
					<div class="summary-wrapper">
						<div class="summary">
							<p>{@html popupData.summary}</p>
						</div>
						<div class="show-info">
							<p>Language: <b>{popupData.language}</b></p>
							<p>
								Release date: <b
									>{new Date(popupData.premiered).toLocaleDateString()}</b
								>
							</p>
							<p>
								Network: <b
									>{popupData?.webChannel?.name ?? popupData?.network?.name}</b
								>
							</p>
							{#if popupData.rating?.average != null}
								<p>Rating: <b>{popupData.rating?.average} / 10</b></p>
								<RatingBar rating={popupData.rating?.average} />
							{:else}
								<p>Rating: <b>N / A</b></p>
								<RatingBar rating={0} />
							{/if}
						</div>
					</div>

					<div class="season-selector">
						<select id="season-dropdown" bind:value={selectedSeason}>
							{#each allSeasons as _, index}
								<option value={index}>Season {index + 1}</option>
							{/each}
						</select>
					</div>

					<div class="episodes-wrapper">
						{#if allSeasons[selectedSeason]}
							<div class="season">
								<div class="episodes">
									{#each allSeasons[selectedSeason] as episode}
										<div class="episode">
											<div class="episode-wr">
												<div class="episode-wrapper">
													<div class="episode-image-wrapper">
														<div class="image-hover">
															{#if token != ""}
																<div
																	class="watched-button"
																	on:click={async () => {
																		await markAsWatched(episode);
																		allSeasons = [...allSeasons];
																	}}
																>
																	{#if !episode.isWatched}
																		<svg
																			viewBox="0 0 24 24"
																			fill="none"
																			xmlns="http://www.w3.org/2000/svg"
																			><g id="SVGRepo_iconCarrier">
																				<path
																					d="M9 12L10.6828 13.6828V13.6828C10.858 13.858 11.142 13.858 11.3172 13.6828V13.6828L15 10"
																					stroke="rgb(88, 220, 88)"
																					stroke-width="1.5"
																					stroke-linecap="round"
																					stroke-linejoin="round"
																				></path>
																			</g></svg
																		>
																	{:else}
																		<svg
																			width="16px"
																			height="16px"
																			viewBox="0 0 24 24"
																			fill="none"
																			xmlns="http://www.w3.org/2000/svg"
																			><g id="SVGRepo_iconCarrier">
																				<g id="Menu / Close_MD">
																					<path
																						id="Vector"
																						d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18"
																						stroke="rgb(220, 88, 88)"
																						stroke-width="1.5"
																						stroke-linecap="round"
																						stroke-linejoin="round"
																					></path>
																				</g>
																			</g></svg
																		>
																	{/if}
																</div>{/if}
														</div>
														{#if episode.image == ""}<div
																class="svg-container"
																style={episode.isWatched
																	? "background-color: rgba(0, 0, 0, 0.6)"
																	: "background-color: rgba(0, 0, 0, 0.2)"}
															>
																<svg
																	height="40px"
																	viewBox="0 0 24 24"
																	fill="none"
																	xmlns="http://www.w3.org/2000/svg"
																	><g id="SVGRepo_bgCarrier" stroke-width="0"
																	></g><g
																		id="SVGRepo_tracerCarrier"
																		stroke-linecap="round"
																		stroke-linejoin="round"
																	></g><g id="SVGRepo_iconCarrier">
																		<path
																			d="M14.2647 15.9377L12.5473 14.2346C11.758 13.4519 11.3633 13.0605 10.9089 12.9137C10.5092 12.7845 10.079 12.7845 9.67922 12.9137C9.22485 13.0605 8.83017 13.4519 8.04082 14.2346L4.04193 18.2622M14.2647 15.9377L14.606 15.5991C15.412 14.7999 15.8149 14.4003 16.2773 14.2545C16.6839 14.1262 17.1208 14.1312 17.5244 14.2688C17.9832 14.4253 18.3769 14.834 19.1642 15.6515L20 16.5001M14.2647 15.9377L18.22 19.9628M12 4H7.2C6.07989 4 5.51984 4 5.09202 4.21799C4.7157 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.0799 4 7.2V16.8C4 17.4466 4 17.9066 4.04193 18.2622M4.04193 18.2622C4.07264 18.5226 4.12583 18.7271 4.21799 18.908C4.40973 19.2843 4.7157 19.5903 5.09202 19.782C5.51984 20 6.07989 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12M16 3L18.5 5.5M18.5 5.5L21 8M18.5 5.5L21 3M18.5 5.5L16 8"
																			stroke="rgba(255, 255, 255, 0.3)"
																			stroke-width="2"
																			stroke-linecap="round"
																			stroke-linejoin="round"
																		></path>
																	</g></svg
																>
															</div>{:else}
															<img
																style="transition: 75ms ease-in-out; filter: {episode.isWatched
																	? 'grayscale(30%) brightness(0.4)'
																	: 'none'};"
																src={episode.image}
																alt={episode.name}
															/>{/if}
													</div>
													<div class="episode-more-info-badge">
														<p>
															{episode.airstamp.toLocaleDateString()}{#if episode.rating != 0},
																{episode.rating} / 10{/if}
														</p>
													</div>

													<div
														class="episode-badge"
														style={episode.isWatched
															? "background-color: rgba(21, 151, 28, 0.6);color: rgb(138, 255, 138);"
															: ""}
													>
														E{episode.number}
													</div>
													<div class="episode-details">
														<div class="title-rating-wrapper">
															<h3>
																{episode.name}
															</h3>
														</div>
														<p>{@html episode.summary}</p>
													</div>
												</div>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.season-selector {
		padding: 15px 0;
		select {
			min-height: 10px;
			border: 1px solid rgba(255, 255, 255, 0.15);
			border-radius: 10px;
			padding: 10px;
			font-size: 16px;
			background-color: rgba(97, 97, 97, 0.5);
			box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
			-webkit-backdrop-filter: blur(10px);

			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);

			color: rgb(194, 194, 194);
			font-weight: 300;
			cursor: pointer;
			transition: 0.2s ease;
			option {
				background-color: rgba(0, 0, 0, 0.735);
			}
		}
	}

	.episodes-wrapper {
		margin-top: 10px;

		.season {
			margin-bottom: 20px;

			.episodes {
				display: flex;
				flex-direction: column;
				gap: 30px;

				.episode {
					overflow: hidden;
					.episode-wr {
						.episode-wrapper {
							position: relative;
							display: flex;
							flex-direction: row;

							min-height: 140px;

							max-height: 140px;
							min-width: 250px;
							.episode-image-wrapper {
								transition: transform 0.1s ease-in-out;

								.image-hover {
									z-index: 1;
									transition: 1ms ease-in-out;
									user-select: none;
									position: absolute;
									border-radius: 10px;
									top: 0;
									left: 0;
									height: 100%;
									width: 250px;
									transition: 0.2s;
									&:hover {
										.watched-button {
											opacity: 1;
										}
									}
									// &:hover {
									// 	// .episode-image-wrapper img {
									// 	// 	transition: transform 0.1s;
									// 	// 	transform: translate(-50%, -50%) scale(0.9);

									// 	// }
									// 	.watched-button {
									// 		opacity: 1;
									// 	}
									// }

									.watched-button {
										opacity: 0;
										height: 50px;
										width: 50px;
										position: absolute;
										top: 50%;
										left: 50%;
										z-index: 1;
										transform: translate(-50%, -50%);
										display: flex;
										align-items: center;
										justify-content: center;
										&:active {
											transition: transform 0.1s;
											transform: translate(-50%, -50%) scale(0.9);
										}

										svg {
											border: 1px solid rgba(0, 0, 0, 0.3);
											height: 50px;
											width: 50px;
											border-radius: 50%;
											justify-content: center;
											align-items: center;
											background-color: rgba(97, 97, 97, 0.5);
											backdrop-filter: blur(10px);
											-webkit-backdrop-filter: blur(10px);
											// &:active {
											// 	background-color: rgba(68, 156, 81, 0.5);
											// }
										}
									}
								}
							}

							.episode-details {
								margin-left: 20px;
								h3 {
									margin: 0 !important;
									line-height: 20px;
									padding: 0 !important;
								}
								max-height: 100px;
								p {
									text-overflow: ellipsis;
									display: flex;
									flex-direction: column;
									line-height: 18px;
									overflow: hidden;
								}
							}

							img {
								width: auto;
								min-height: 100%;
								border-radius: 10px;
							}
							.svg-container {
								min-width: 250px;
								min-height: 140px;
								max-width: 250px;
								max-height: 140px;
								margin-bottom: 15px;
								display: flex;
								background-color: rgba(255, 255, 255, 0.05);
								justify-content: center;
								align-items: center;
								border-radius: 10px;
							}
							.episode-badge {
								pointer-events: none;
								position: absolute;
								top: 5px;
								left: 5px;
								padding: 0 10px;
								border-radius: 10px;
								background-color: rgba(0, 0, 0, 0.5);

								backdrop-filter: blur(20px);
								-webkit-backdrop-filter: blur(20px);
							}
							&:hover {
								.episode-more-info-badge {
									opacity: 1;
								}
							}
							.episode-more-info-badge {
								pointer-events: none;
								position: absolute;
								bottom: 5px;
								transition: 0.1s;
								left: 5px;
								padding: 5px 10px;
								opacity: 10;
								background-color: rgba(0, 0, 0, 0.3);
								backdrop-filter: blur(50px);
								-webkit-backdrop-filter: blur(50px);
								border-radius: 10px;
								p {
									text-align: center;
									color: white;
									margin: 0;
									font-size: 14px;
									padding: 0;
								}
							}
						}
					}
				}
			}
			h3 {
				font-size: 16px;
				margin: 5px 0;
			}

			p {
				font-size: 12px;
				color: rgb(160, 160, 160);
				margin: 3px 0;
			}
		}
	}

	.summary-wrapper {
		overflow-x: hidden;
		font-size: 13px;
		display: flex;
		flex-direction: row;
		.show-info {
			min-width: fit-content;
			padding-top: 20px;
			padding-left: 20px;
			font-size: 12px;
			p {
				line-height: 13px;
			}
		}
	}
	.background-image {
		position: absolute;
		pointer-events: none;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			opacity: 0.5;
			filter: blur(100px) saturate(0.7) brightness(0.6);
		}

		z-index: 0;
		//overflow: hidden;
	}
	.close-button-wrap {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 20;
		cursor: pointer;
		height: 40px;
		width: 40px;
		border-radius: 50%;
		display: flex;
		border: 1px solid rgba(0, 0, 0, 0.15);
		justify-content: center;
		align-items: center;
		background-color: rgba(97, 97, 97, 0.5);

		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}
	.popup-overlay {
		font-family:
			Helvetica Neue,
			Helvetica,
			Arial,
			sans-serif;
		position: fixed;
		z-index: 9999;
		top: 0;
		left: 0;
		color: white;
		width: 100%;
		height: 100%;
		transform: 1s;
		background-color: rgba(0, 0, 0, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: auto;
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
	}
	.popup-content {
		min-height: 400px;
		height: 90%;
		overflow: scroll;
		&::-webkit-scrollbar {
			width: 0px;
		}

		overflow-x: hidden;
		border-radius: 20px;
		min-width: 300px;
		margin: 60px;
		max-width: 60%;
		color: white;
		position: relative;
		border: 1px solid #80808031;
		box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.75);
		background-color: rgb(31, 29, 35);
	}

	.details {
		.row {
			width: 100%;
			top: 0;
			display: flex;
			text-shadow: rgba(0, 0, 0, 0.3) 0 0 5px;
			.genre-wrapper {
				margin-left: auto;
				display: flex;
				flex-direction: row;
				.genre {
					background-color: rgba(255, 255, 255, 0.15);
					padding: 0 10px;
					margin-left: 10px;
					font-size: 13px;
					text-shadow: rgba(0, 0, 0, 0.3) 0 0 3px;
					text-wrap-mode: nowrap;
					max-height: 25px;
					backdrop-filter: blur(10px);
					-webkit-backdrop-filter: blur(10px);
					border-radius: 20px;
				}
			}
		}

		// max-height: 320px;
		padding-left: 20px;
		padding-right: 20px;

		line-height: 25px;
		flex-direction: column;
		overflow: hidden;
		.summary {
			margin-top: 20px;
			position: relative;
			max-height: 148px;
			overflow-y: auto;
			padding-right: 5px;

			p {
				line-height: 20px;
			}
			mask-image: linear-gradient(
				to bottom,
				transparent 0%,
				black 10%,
				black 80%,
				transparent 100%
			);
			-webkit-mask-image: linear-gradient(
				to bottom,
				transparent 0%,
				black 10%,
				black 90%,
				transparent 100%
			);
			&::-webkit-scrollbar {
				width: 8px;
			}

			&::-webkit-scrollbar-track {
				background: transparent;
			}
			&::-webkit-scrollbar-thumb {
				background-color: rgba(255, 255, 255, 0.2);
				border-radius: 4px;
			}

			&::-webkit-scrollbar-thumb:hover {
				background-color: rgba(255, 255, 255, 0.4);
			}
		}
		position: relative;
		top: -120px;
		h2 {
			margin: 0;
			min-width: 0px;
		}
		p {
			color: rgb(211, 211, 211);
		}
	}
	// .watched-button {
	// 	svg {
	// 		&:hover {
	// 			//	background-color: rgba(68, 156, 81, 0.5);
	// 		}
	// 	}
	// }
	.img {
		width: 100%;
		position: relative;
		margin-bottom: 20px;

		img,
		svg {
			max-height: 400px;
			min-height: 400px;
			pointer-events: none;
			user-select: none;

			width: 100%;
			object-fit: cover;
			mask-image: linear-gradient(
				to bottom,
				rgba(0, 0, 0, 1) 65%,
				rgba(0, 0, 0, 0.5) 70%,

				rgba(0, 0, 0, 0) 80%
			);
			-webkit-mask-image: linear-gradient(
				to bottom,
				rgba(0, 0, 0, 1) 65%,
				rgba(0, 0, 0, 0.5) 70%,

				rgba(0, 0, 0, 0) 80%
			);
		}
		svg {
			max-height: 80px;
			min-height: 80px;
			padding: 0 0 80px 0;
			margin: 120px 0;
		}
	}

	@media (max-width: 768px) {
		.summary-wrapper {
			flex-direction: column;
			margin-left: 0;
			.summary {
				max-height: 100px;
			}
			.show-info {
				min-width: 100% !important;
				padding-left: 0px;
				margin-top: 0px !important;
				column-count: 2;
				min-width: auto !important;
				p {
					margin-top: 0px !important;
				}
			}
		}
		.img {
			margin-bottom: 35px;
			justify-content: center;
			img {
				max-height: 300px;
				min-height: 300px;
			}
		}

		.episode-wrapper {
			min-width: 200px !important;
			min-height: 10px !important;
			height: 98px !important;
			border-radius: 10px;
			.episode-image-wrapper {
				img {
					max-height: 98px !important;
				}
				.image-hover {
					width: 175px !important;
				}
			}

			.svg-container {
				width: auto !important;
				min-height: 98px !important;
				min-width: 175px !important;
			}
			.episode-details {
				min-height: 10px !important;
			}
			padding: 0px !important;
			margin-top: 0px !important;
			p {
				padding-top: 0px !important;
				margin-top: -7px !important;
				overflow: visible !important;
			}
			h3 {
				margin-bottom: 1px !important;
			}
		}

		.row {
			flex-direction: column;
		}
		.genre-wrapper {
			margin: 10px -20px -5px 0px !important;
			.genre {
				margin-left: 0px !important;
				margin-right: 10px !important;
			}
		}
		.episode-more-info-badge {
			bottom: 5px;
			left: 5px;
			padding: 0px !important;
			p {
				margin: 0 10px !important;
				font-size: 12px !important;
			}
		}
		.popup-content {
			position: absolute;
			right: 0;
			left: 0;
			min-width: 90%;
			min-height: 90vh;
			max-height: 90vh;
			padding: 0;
			margin: auto;
		}
		.close-button-wrap {
			height: 50px;
			width: 50px;
		}
		svg {
			width: 25px;
			height: 25px;
		}
		.genre {
			font-size: 14px !important;
			margin-left: 7px !important;
		}
	}
</style>
