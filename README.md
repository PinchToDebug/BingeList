<p align="center">
  <b>BingeList</b> is a SvelteKit based project to help discover and track TV shows. It allows users to organize their entertainment choices in one place, offering a streamlined interface to search for shows, add them to a watchlist, and keep track of their progress through episodes.
</p>
<br>
<details>

<summary><strong>SQLite tables</strong></summary>

### 1. **`shows`**
Stores information about TV shows.

| Column       | Type    | Description                          |
|--------------|---------|--------------------------------------|
| `id`         | INTEGER | Primary key, auto-incremented.      |
| `name`       | TEXT    | The name of the show.               |
| `show_data`  | TEXT    | JSON from external api              |

### 2. **`users`**
Stores user account information.

| Column       | Type    | Description                          |
|--------------|---------|--------------------------------------|
| `id`         | INTEGER | Primary key, auto-incremented.      |
| `username`   | TEXT    | Unique username for the user.       |
| `displayname`| TEXT    | The user's display name.            |
| `password`   | TEXT    | The user's hashed password.         |

### 3. **`watched_episodes`**
Tracks the episodes watched by users.

| Column       | Type    | Description                          |
|--------------|---------|--------------------------------------|
| `id`         | INTEGER | Primary key, auto-incremented.      |
| `user_id`    | INTEGER | Foreign key referencing `users(id)`.|
| `show_id`    | INTEGER | Foreign key referencing `shows(id)`.|
| `season_id`  | INTEGER | ID of the season.                   |
| `episode_id` | INTEGER | ID of the episode.                  |

### 4. **`user_shows`**
Links users to the shows they have added to their watchlist.

| Column       | Type    | Description                          |
|--------------|---------|--------------------------------------|
| `user_id`    | INTEGER | Foreign key referencing `users(id)`.|
| `show_id`    | INTEGER | Foreign key referencing `shows(id)`.|
| Primary Key  | -       | Combination of `user_id` and `show_id`. |
</details>
<details>
  <summary><strong>Internal API documentation</strong></summary>
  <details>
    <summary><strong>POST /api/v1/dbload</strong></summary>
    <strong>Summary:</strong> Fetch all shows to the database<br>
    <strong>Query Parameters:</strong> None<br>
    <strong>Request Body:</strong> None<br>
    <strong>Authentication:</strong> None<br>
    <strong>Responses:</strong><br>
    - 200: Shows fetched and inserted successfully<br>
    - 500: Failed to fetch and insert shows
  </details>

  <details>
    <summary><strong>GET /api/v1/featured</strong></summary>
    <strong>Summary:</strong> Get the latest 400 shows<br>
    <strong>Query Parameters:</strong> None<br>
    <strong>Request Body:</strong> None<br>
    <strong>Authentication:</strong> None<br>
    <strong>Responses:</strong><br>
    - 200: List of featured shows<br>
    - 500: Failed to fetch shows
  </details>

  <details>
    <summary><strong>GET /api/v1/genres</strong></summary>
    <strong>Summary:</strong> Get available genres from the top 5000 shows (not used)<br>
    <strong>Query Parameters:</strong> None<br>
    <strong>Request Body:</strong> None<br>
    <strong>Authentication:</strong> None<br>
    <strong>Responses:</strong><br>
    - 200: List of genres<br>
    - 500: Database query failed
  </details>

  <details>
    <summary><strong>POST /api/v1/login</strong></summary>
    <strong>Summary:</strong> Authenticate user<br>
    <strong>Query Parameters:</strong> None<br>
    <strong>Request Body (JSON):</strong><br>
    - username: string (required)<br>
    - password: string (required)<br>
    <strong>Authentication:</strong> None<br>
    <strong>Responses:</strong><br>
    - 200: token, user.id, user.name, user.display_name<br>
    - 401: Unauthorized
  </details>

  <details>
    <summary><strong>POST /api/v1/register</strong></summary>
    <strong>Summary:</strong> Register a new user<br>
    <strong>Query Parameters:</strong> None<br>
    <strong>Request Body (JSON):</strong><br>
    - username: string (required)<br>
    - password: string (required)<br>
    <strong>Authentication:</strong> None<br>
    <strong>Responses:</strong><br>
    - 200: JWT token<br>
    - 400: Missing required fields<br>
    - 409: Username already taken
  </details>

  <details>
    <summary><strong>GET /api/v1/search</strong></summary>
    <strong>Summary:</strong> Search for shows<br>
    <strong>Query Parameters:</strong><br>
    - q: string (required)<br>
    <strong>Request Body:</strong> None<br>
    <strong>Authentication:</strong> None<br>
    <strong>Responses:</strong><br>
    - 200: Search results<br>
    - 500: Database search failed
  </details>

  <details>
    <summary><strong>GET /api/v1/user/getWatchedEpisodes</strong></summary>
    <strong>Summary:</strong> Get watched episodes<br>
    <strong>Query Parameters:</strong> None<br>
    <strong>Request Body:</strong> None<br>
    <strong>Authentication:</strong> Required (Bearer Token)<br>
    <strong>Responses:</strong><br>
    - 200: List of watched episodes<br>
    - 400: Missing showId<br>
    - 401: Unauthorized
  </details>

  <details>
    <summary><strong>GET /api/v1/user/list</strong></summary>
    <strong>Summary:</strong> Retrieve all shows in the user's list<br>
    <strong>Authentication:</strong> Required (Bearer Token)<br>
    <strong>Query Parameters:</strong> None<br>
    <strong>Request Body:</strong> None<br>
    <strong>Responses:</strong><br>
    - 200: JSON with user's shows<br>
    - 401: Unauthorized<br>
    - 500: Server error while fetching data
  </details>

  <details>
    <summary><strong>POST /api/v1/user/list</strong></summary>
    <strong>Summary:</strong> Add a show to the user's list<br>
    <strong>Authentication:</strong> Required (Bearer Token)<br>
    <strong>Request Body (JSON):</strong><br>
    - id: string (required) — ID of the show to add<br>
    <strong>Responses:</strong><br>
    - 200: Show added successfully<br>
    - 400: Missing show ID<br>
    - 401: Unauthorized<br>
    - 500: Server error while adding show
  </details>

  <details>
    <summary><strong>DELETE /api/v1/user/list</strong></summary>
    <strong>Summary:</strong> Remove a show from the user's list<br>
    <strong>Authentication:</strong> Required (Bearer Token)<br>
    <strong>Request Body (JSON):</strong><br>
    - id: string (required) — ID of the show to remove<br>
    <strong>Responses:</strong><br>
    - 200: Show removed successfully<br>
    - 400: Missing show ID or show not found<br>
    - 401: Unauthorized<br>
    - 500: Server error while removing show
  </details>

  <details>
    <summary><strong>POST /api/v1/user/watchedEpisode</strong></summary>
    <strong>Summary:</strong> Mark an episode as watched<br>
    <strong>Authentication:</strong> Required (Bearer Token)<br>
    <strong>Request Body (JSON):</strong><br>
    - showId: string (required) — ID of the show<br>
    - seasonId: string (required) — ID of the season<br>
    - episodeId: string (required) — ID of the episode<br>
    <strong>Responses:</strong><br>
    - 201: Episode marked as watched<br>
    - 401: Unauthorized<br>
    - 500: Server error during insert
  </details>

  <details>
    <summary><strong>DELETE /api/v1/user/watchedEpisode</strong></summary>
    <strong>Summary:</strong> Unmark an episode as watched<br>
    <strong>Authentication:</strong> Required (Bearer Token)<br>
    <strong>Request Body (JSON):</strong><br>
    - showId: string (required) — ID of the show<br>
    - seasonId: string (required) — ID of the season<br>
    - episodeId: string (required) — ID of the episode<br>
    <strong>Responses:</strong><br>
    - 201: Episode unmarked<br>
    - 401: Unauthorized<br>
    - 500: Server error during delete
  </details>

  <details>
    <summary><strong>GET /api/v1/user/watchlist</strong></summary>
    <strong>Summary:</strong> Get user watchlist<br>
    <strong>Query Parameters:</strong> None<br>
    <strong>Request Body:</strong> None<br>
    <strong>Authentication:</strong> Required (Bearer Token)<br>
    <strong>Responses:</strong><br>
    - 200: List of watchlist shows<br>
    - 500: Internal Server Error
  </details>

  <details>
    <summary><strong>GET /api/v1/verifytoken</strong></summary>
    <strong>Summary:</strong> Verify JWT token<br>
    <strong>Query Parameters:</strong> None<br>
    <strong>Request Body:</strong> None<br>
    <strong>Authentication:</strong> Required (Bearer Token)<br>
    <strong>Responses:</strong><br>
    - 200: Token validity status<br>
    - 404: Token missing<br>
    - 500: Internal Server Error
  </details>
</details>


<details>
  <summary><strong>External APIs</strong></summary>
  <strong>GET https://api.tvmaze.com/shows/[id]/episodes</strong><br>
  <strong>GET https://api.tvmaze.com/shows/[id]/images</strong>
</details>



