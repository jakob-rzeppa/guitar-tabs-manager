# Guitar Tabs Manager - API Documentation

Base URL: `http://localhost:8000`

All responses follow the format: `{ "content": <data>, "message": "<optional message>" }`

## Status Codes

| Code | Description  |
| ---- | ------------ |
| 200  | Success      |
| 404  | Not Found    |
| 400  | Bad Request  |
| 500  | Server Error |

---

## Tabs

| Endpoint          | Method | Description                     |
| ----------------- | ------ | ------------------------------- |
| `/tabs`           | GET    | List all tabs (without content) |
| `/tabs/{id}`      | GET    | Get tab with full content       |
| `/tabs`           | POST   | Create tab                      |
| `/tabs/{id}`      | PUT    | Update tab                      |
| `/tabs/{id}`      | DELETE | Delete tab                      |
| `/tabs/format`    | POST   | Format tab content              |
| `/tabs/transpose` | POST   | Transpose tab content           |

### GET /tabs

Returns list of tabs without full content.

**Response:**

```json
{
    "content": [
        {
            "id": 1,
            "title": "Wonderwall",
            "artist": { "id": 1, "name": "Oasis" },
            "tags": [{ "id": 1, "name": "rock" }]
        }
    ]
}
```

### GET /tabs/{id}

Returns full tab including content.

**Response:**

```json
{
    "content": {
        "id": 1,
        "title": "Wonderwall",
        "artist": { "id": 1, "name": "Oasis" },
        "tags": [{ "id": 1, "name": "rock" }],
        "capo": 2,
        "source_url": "https://...",
        "content": "E    A    D...\n[tab notation]"
    }
}
```

### POST /tabs

Create a new tab.

**Request:**

```json
{
    "title": "Wonderwall", // required
    "content": "E A D...", // required
    "capo": 2, // required
    "source_url": "https://...", // optional
    "artist_id": 1, // optional
    "tag_ids": [1, 2] // optional
}
```

**Response:** Same as GET /tabs/{id}

### PUT /tabs/{id}

Update tab. All fields optional.

**Request:**

```json
{
    "title": "Wonderwall (Updated)",
    "content": "E A D...",
    "capo": 3,
    "source_url": "https://...",
    "artist_id": 2,
    "tag_ids": [1, 3]
}
```

**Response:** Same as GET /tabs/{id}

### DELETE /tabs/{id}

**Response:** `{ "message": "Tab deleted successfully" }`

### POST /tabs/format

Format tab content.

**Request:** `{ "content": "unformatted tab" }`  
**Response:** `{ "content": "formatted tab" }`

### POST /tabs/transpose

Transpose tab content. `dir` is positive for up, negative for down.

**Request:** `{ "content": "tab with chords", "dir": 1 }`  
**Response:** `{ "content": "transposed tab" }`

---

## Artists

| Endpoint        | Method | Description      |
| --------------- | ------ | ---------------- |
| `/artists`      | GET    | List all artists |
| `/artists/{id}` | GET    | Get artist by ID |
| `/artists`      | POST   | Create artist    |
| `/artists/{id}` | PUT    | Update artist    |
| `/artists/{id}` | DELETE | Delete artist    |

### GET /artists

**Response:**

```json
{
    "content": [
        { "id": 1, "name": "Oasis" },
        { "id": 2, "name": "The Beatles" }
    ]
}
```

### GET /artists/{id}

**Response:**

```json
{
    "content": { "id": 1, "name": "Oasis" }
}
```

### POST /artists

**Request:** `{ "name": "Oasis" }`  
**Response:** `{ "content": { "id": 1, "name": "Oasis" }, "message": "Artist created successfully" }`

### PUT /artists/{id}

**Request:** `{ "name": "Oasis (Updated)" }`  
**Response:** `{ "content": { "id": 1, "name": "Oasis (Updated)" }, "message": "Artist updated successfully" }`

### DELETE /artists/{id}

**Response:** `{ "message": "Artist deleted successfully" }`

---

## Tags

| Endpoint     | Method | Description   |
| ------------ | ------ | ------------- |
| `/tags`      | GET    | List all tags |
| `/tags/{id}` | GET    | Get tag by ID |
| `/tags`      | POST   | Create tag    |
| `/tags/{id}` | PUT    | Update tag    |
| `/tags/{id}` | DELETE | Delete tag    |

### GET /tags

**Response:**

```json
{
    "content": [
        { "id": 1, "name": "rock" },
        { "id": 2, "name": "acoustic" }
    ]
}
```

### GET /tags/{id}

**Response:**

```json
{
    "content": { "id": 1, "name": "rock" }
}
```

### POST /tags

**Request:** `{ "name": "rock" }`  
**Response:** `{ "content": { "id": 1, "name": "rock" }, "message": "Tag created successfully" }`

### PUT /tags/{id}

**Request:** `{ "name": "rock-updated" }`  
**Response:** `{ "content": { "id": 1, "name": "rock-updated" }, "message": "Tag updated successfully" }`

### DELETE /tags/{id}

**Response:** `{ "message": "Tag deleted successfully" }`

---

## Examples

### cURL

```bash
# Get all tabs
curl http://localhost:8000/tabs

# Create tab
curl -X POST http://localhost:8000/tabs \
  -H "Content-Type: application/json" \
  -d '{"title":"Wonderwall","content":"E A D...","capo":2,"artist_id":1,"tag_ids":[1,2]}'

# Update tab
curl -X PUT http://localhost:8000/tabs/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Wonderwall (Updated)","capo":3}'

# Delete tab
curl -X DELETE http://localhost:8000/tabs/1
```

### JavaScript

```javascript
// Get all artists
const artists = await fetch("http://localhost:8000/artists")
    .then((res) => res.json())
    .then((data) => data.content);

// Create artist
const newArtist = await fetch("http://localhost:8000/artists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Oasis" }),
}).then((res) => res.json());
```
