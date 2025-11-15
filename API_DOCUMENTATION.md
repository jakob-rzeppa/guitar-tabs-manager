# Guitar Tabs Manager - API Documentation

This document describes all available API endpoints for the Guitar Tabs Manager application.

## Base URL

All endpoints are prefixed with your API base URL (e.g., `http://localhost:8000`)

## Response Format

All responses follow this format:

```json
{
  "content": <data>,
  "message": "<optional message>"
}
```

---

## Tabs

### Get All Tabs

Retrieve a list of all guitar tabs (reduced format without full content).

-   **URL:** `/tabs`
-   **Method:** `GET`
-   **URL Parameters:** None
-   **Request Body:** None

**Success Response:**

-   **Code:** 200 OK
-   **Content:**

```json
{
    "content": [
        {
            "id": 1,
            "title": "Wonderwall",
            "artist": {
                "id": 1,
                "name": "Oasis"
            },
            "tags": [
                {
                    "id": 1,
                    "name": "rock"
                }
            ]
        }
    ]
}
```

---

### Get Tab by ID

Retrieve a specific tab with full content.

-   **URL:** `/tabs/{id}`
-   **Method:** `GET`
-   **URL Parameters:**
    -   `id` (integer, required) - Tab ID
-   **Request Body:** None

**Success Response:**

-   **Code:** 200 OK
-   **Content:**

```json
{
    "content": {
        "id": 1,
        "title": "Wonderwall",
        "artist": {
            "id": 1,
            "name": "Oasis"
        },
        "tags": [
            {
                "id": 1,
                "name": "rock"
            }
        ],
        "capo": 2,
        "content": "E    A    D...\n[tab notation here]"
    }
}
```

**Error Response:**

-   **Code:** 404 NOT FOUND
-   **Content:** `{"error": "Not Found"}`

---

### Create Tab

Create a new guitar tab.

-   **URL:** `/tabs`
-   **Method:** `POST`
-   **URL Parameters:** None
-   **Request Body:**

```json
{
    "title": "Wonderwall",
    "content": "E    A    D...\n[tab notation here]",
    "capo": 2,
    "artist_id": 1,
    "tag_ids": [1, 2]
}
```

**Required Fields:**

-   `title` (string)
-   `content` (string)
-   `capo` (integer)

**Optional Fields:**

-   `artist_id` (integer) - ID of existing artist
-   `tag_ids` (array of integers) - IDs of existing tags

**Success Response:**

-   **Code:** 200 OK
-   **Content:** Same as "Get Tab by ID" response

---

### Update Tab

Update an existing tab.

-   **URL:** `/tabs/{id}`
-   **Method:** `PUT`
-   **URL Parameters:**
    -   `id` (integer, required) - Tab ID
-   **Request Body:**

```json
{
    "title": "Wonderwall (Updated)",
    "content": "E    A    D...\n[updated tab notation]",
    "capo": 3,
    "artist_id": 2,
    "tag_ids": [1, 3]
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Success Response:**

-   **Code:** 200 OK
-   **Content:** Same as "Get Tab by ID" response

**Error Response:**

-   **Code:** 404 NOT FOUND

---

### Delete Tab

Delete a tab.

-   **URL:** `/tabs/{id}`
-   **Method:** `DELETE`
-   **URL Parameters:**
    -   `id` (integer, required) - Tab ID
-   **Request Body:** None

**Success Response:**

-   **Code:** 200 OK
-   **Content:**

```json
{
    "message": "Tab deleted successfully"
}
```

**Error Response:**

-   **Code:** 404 NOT FOUND

---

### Format Tab

Format tab content (utility endpoint).

-   **URL:** `/tabs/format`
-   **Method:** `POST`
-   **URL Parameters:** None
-   **Request Body:**

```json
{
    "content": "unformatted tab content"
}
```

**Success Response:**

-   **Code:** 200 OK
-   **Content:**

```json
{
    "content": "formatted tab content"
}
```

---

### Transpose Tab

Transpose tab content up or down (utility endpoint).

-   **URL:** `/tabs/transpose`
-   **Method:** `POST`
-   **URL Parameters:** None
-   **Request Body:**

```json
{
    "content": "tab content with chords",
    "dir": 1
}
```

**Fields:**

-   `content` (string, required) - Tab content with chords
-   `dir` (integer, required) - Direction: positive for up, negative for down

**Success Response:**

-   **Code:** 200 OK
-   **Content:**

```json
{
    "content": "transposed tab content"
}
```

---

## Artists

### Get All Artists

Retrieve a list of all artists.

-   **URL:** `/artists`
-   **Method:** `GET`
-   **URL Parameters:** None
-   **Request Body:** None

**Success Response:**

-   **Code:** 200 OK
-   **Content:**

```json
{
    "content": [
        {
            "id": 1,
            "name": "Oasis"
        },
        {
            "id": 2,
            "name": "The Beatles"
        }
    ]
}
```

---

### Get Artist by ID

Retrieve a specific artist.

-   **URL:** `/artists/{id}`
-   **Method:** `GET`
-   **URL Parameters:**
    -   `id` (integer, required) - Artist ID
-   **Request Body:** None

**Success Response:**

-   **Code:** 200 OK
-   **Content:**

```json
{
    "content": {
        "id": 1,
        "name": "Oasis"
    }
}
```

**Error Response:**

-   **Code:** 404 NOT FOUND

---

### Create Artist

Create a new artist.

-   **URL:** `/artists`
-   **Method:** `POST`
-   **URL Parameters:** None
-   **Request Body:**

```json
{
    "name": "Oasis"
}
```

**Required Fields:**

-   `name` (string)

**Success Response:**

-   **Code:** 200 OK
-   **Content:**

```json
{
    "content": {
        "id": 1,
        "name": "Oasis"
    },
    "message": "Artist created successfully"
}
```

---

### Update Artist

Update an existing artist.

-   **URL:** `/artists/{id}`
-   **Method:** `PUT`
-   **URL Parameters:**
    -   `id` (integer, required) - Artist ID
-   **Request Body:**

```json
{
    "name": "Oasis (Updated)"
}
```

**Optional Fields:**

-   `name` (string)

**Success Response:**

-   **Code:** 200 OK
-   **Content:**

```json
{
    "content": {
        "id": 1,
        "name": "Oasis (Updated)"
    },
    "message": "Artist created successfully"
}
```

**Error Response:**

-   **Code:** 404 NOT FOUND

---

### Delete Artist

Delete an artist.

-   **URL:** `/artists/{id}`
-   **Method:** `DELETE`
-   **URL Parameters:**
    -   `id` (integer, required) - Artist ID
-   **Request Body:** None

**Success Response:**

-   **Code:** 200 OK
-   **Content:**

```json
{
    "message": "Artist deleted successfully"
}
```

**Error Response:**

-   **Code:** 404 NOT FOUND

---

## Tags

### Get All Tags

Retrieve a list of all tags.

-   **URL:** `/tags`
-   **Method:** `GET`
-   **URL Parameters:** None
-   **Request Body:** None

**Success Response:**

-   **Code:** 200 OK
-   **Content:**

```json
{
    "content": [
        {
            "id": 1,
            "name": "rock"
        },
        {
            "id": 2,
            "name": "acoustic"
        }
    ]
}
```

---

### Get Tag by ID

Retrieve a specific tag.

-   **URL:** `/tags/{id}`
-   **Method:** `GET`
-   **URL Parameters:**
    -   `id` (integer, required) - Tag ID
-   **Request Body:** None

**Success Response:**

-   **Code:** 200 OK
-   **Content:**

```json
{
    "content": {
        "id": 1,
        "name": "rock"
    }
}
```

**Error Response:**

-   **Code:** 404 NOT FOUND

---

### Create Tag

Create a new tag.

-   **URL:** `/tags`
-   **Method:** `POST`
-   **URL Parameters:** None
-   **Request Body:**

```json
{
    "name": "rock"
}
```

**Required Fields:**

-   `name` (string)

**Success Response:**

-   **Code:** 200 OK
-   **Content:**

```json
{
    "content": {
        "id": 1,
        "name": "rock"
    },
    "message": "Tag created successfully"
}
```

---

### Update Tag

Update an existing tag.

-   **URL:** `/tags/{id}`
-   **Method:** `PUT`
-   **URL Parameters:**
    -   `id` (integer, required) - Tag ID
-   **Request Body:**

```json
{
    "name": "rock-updated"
}
```

**Optional Fields:**

-   `name` (string)

**Success Response:**

-   **Code:** 200 OK
-   **Content:**

```json
{
    "content": {
        "id": 1,
        "name": "rock-updated"
    },
    "message": "Tag created successfully"
}
```

**Error Response:**

-   **Code:** 404 NOT FOUND

---

### Delete Tag

Delete a tag.

-   **URL:** `/tags/{id}`
-   **Method:** `DELETE`
-   **URL Parameters:**
    -   `id` (integer, required) - Tag ID
-   **Request Body:** None

**Success Response:**

-   **Code:** 200 OK
-   **Content:**

```json
{
    "message": "Tag deleted successfully"
}
```

**Error Response:**

-   **Code:** 404 NOT FOUND

---

## Error Codes

| Code | Description                        |
| ---- | ---------------------------------- |
| 200  | OK - Request succeeded             |
| 404  | Not Found - Resource doesn't exist |
| 400  | Bad Request - Invalid request data |
| 500  | Internal Server Error              |

---

## Example Usage

### cURL Examples

**Get all tabs:**

```bash
curl -X GET http://localhost:8000/tabs
```

**Create a new tab:**

```bash
curl -X POST http://localhost:8000/tabs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Wonderwall",
    "content": "E A D...",
    "capo": 2,
    "artist_id": 1,
    "tag_ids": [1, 2]
  }'
```

**Update a tab:**

```bash
curl -X PUT http://localhost:8000/tabs/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Wonderwall (Updated)",
    "capo": 3
  }'
```

**Delete a tab:**

```bash
curl -X DELETE http://localhost:8000/tabs/1
```

### JavaScript/Fetch Examples

**Get all artists:**

```javascript
fetch("http://localhost:8000/artists")
    .then((response) => response.json())
    .then((data) => console.log(data.content));
```

**Create a new artist:**

```javascript
fetch("http://localhost:8000/artists", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        name: "Oasis",
    }),
})
    .then((response) => response.json())
    .then((data) => console.log(data));
```
