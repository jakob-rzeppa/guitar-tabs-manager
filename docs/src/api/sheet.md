# Sheets API

## Endpoints

| Method | Endpoint            | Description                     |
| ------ | ------------------- | ------------------------------- |
| GET    | `/sheets`           | List all sheets (without content) |
| GET    | `/sheets/:id`      | Get sheet with full content       |
| POST   | `/sheets`           | Create sheet                      |
| PUT    | `/sheets/:id`      | Update sheet                      |
| DELETE | `/sheets/:id`      | Delete sheet                      |
| POST   | `/sheets/format`    | Format sheet content              |
| POST   | `/sheets/transpose` | Transpose sheet content           |

## GET /sheets

Returns list of all sheets without full content.

### Response

```json
{
  "payload": [
    {
      "id": 1,
      "title": "Hotel California",
      "artist": { "id": 1, "name": "Eagles" },
      "tags": [{ "id": 1, "name": "classic rock" }]
    },
    {
      "id": 2,
      "title": "Perfect",
      "artist": { "id": 2, "name": "Ed Sheeran" },
      "tags": []
    }
  ]
}
```

## GET /sheets/:id

Returns full sheet including content.

### Parameters

| Name | Type | Location | Description |
| ---- | ---- | -------- | ----------- |
| id   | int  | path     | Sheet ID    |

### Response

```json
{
  "payload": {
    "id": 1,
    "title": "Hotel California",
    "artist": { "id": 1, "name": "Eagles" },
    "tags": [{ "id": 1, "name": "classic rock" }],
    "capo": 0,
    "source_url": "https://...",
    "content": "Bm  F#  A  E  G  D  Em  F#\n[Intro]\nBm       F#       A       E\nChords go here..."
  }
}
```

## POST /sheets

Create a new sheet.

### Request Body

```json
{
  "title": "Hotel California",
  "content": "Bm  F#  A  E  G  D  Em  F#\n[Intro]\nBm       F#       A       E\nChords go here...",
  "capo": 0,
  "source_url": "https://...",
  "artist_id": 1,
  "tag_ids": [1]
}
```

| Field      | Type   | Required | Description              |
| ---------- | ------ | -------- | ------------------------ |
| title      | string | Yes      | Sheet title              |
| content    | string | Yes      | Chord sheet content      |
| capo       | int    | Yes      | Capo position (0-12)     |
| source_url | string | No       | Source URL               |
| artist_id  | int    | No       | Artist ID                |
| tag_ids    | array  | No       | Array of tag IDs         |

### Response

```json
{
  "message": "Sheet created successfully",
  "payload": {
    "id": 3,
    "title": "Hotel California",
    "artist": { "id": 1, "name": "Eagles" },
    "tags": [{ "id": 1, "name": "classic rock" }],
    "capo": 0,
    "source_url": "https://...",
    "content": "Bm  F#  A  E  G  D  Em  F#\n[Intro]\nBm       F#       A       E\nChords go here..."
  }
}
```

## PUT /sheets/:id

Update an existing sheet.

### Parameters

| Name | Type | Location | Description |
| ---- | ---- | -------- | ----------- |
| id   | int  | path     | Sheet ID    |

### Request Body

All fields are optional:

```json
{
  "title": "Hotel California",
  "content": "Bm  F#  A  E  G  D  Em  F#\n[Verse]\nBm       F#       A       E\nUpdated chords...",
  "capo": 0,
  "source_url": "https://...",
  "artist_id": 1,
  "tag_ids": [1]
}
```

### Response

```json
{
  "message": "Sheet updated successfully",
  "payload": {
    "id": 1,
    "title": "Hotel California",
    "artist": { "id": 1, "name": "Eagles" },
    "tags": [{ "id": 1, "name": "classic rock" }],
    "capo": 0,
    "source_url": "https://...",
    "content": "Bm  F#  A  E  G  D  Em  F#\n[Verse]\nBm       F#       A       E\nUpdated chords..."
  }
}
```

## DELETE /sheets/:id

Delete a sheet.

### Parameters

| Name | Type | Location | Description |
| ---- | ---- | -------- | ----------- |
| id   | int  | path     | Sheet ID    |

### Response

```json
{
  "message": "Sheet deleted successfully"
}
```

## POST /sheets/format

Format sheet content with consistent spacing and layout.

### Request Body

```json
{
  "content": "unformatted sheet content"
}
```

### Response

```json
{
  "payload": {
    "content": "formatted sheet content"
  }
}
```

## POST /sheets/transpose

Transpose sheet content up or down.

### Request Body

```json
{
  "content": "G  C  D  G",
  "dir": "up" | "down"
}
```

| Field   | Type   | Required | Description                      |
| ------- | ------ | -------- | -------------------------------- |
| content | string | Yes      | Sheet content with chords        |
| dir     | string    | Yes      | Direction (positive=up, negative=down) |

### Response

```json
{
  "payload": {
    "content": "G#  C#  D#  G#"
  }
}
```