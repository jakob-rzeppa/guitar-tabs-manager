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
  "data": [
    {
      "id": 1,
      "title": "Hotel California",
      "artist": { "id": 1, "name": "Eagles" },
      "tags": [{ "id": 1, "name": "classic rock" }]
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
  "data": {
    "id": 1,
    "title": "Wish You Were Here",
    "artist": { "id": 2, "name": "Pink Floyd" },
    "tags": [{ "id": 2, "name": "classic rock" }],
    "capo": 0,
    "source_url": "https://...",
    "content": "Em7  G  Em7  G  Em7  A7sus4  Em7  A7sus4\n[Verse 1]\nC              D\nSo, so you think you can tell..."
  }
}
```

## POST /sheets

Create a new sheet.

### Request Body

```json
{
  "title": "Blackbird",
  "content": "G  Am7  G/B  G  A7sus4  D7sus4\n[Verse]\nG       Am7      G/B      G\nBlackbird singing in the dead of night...",
  "capo": 3,
  "source_url": "https://...",
  "artist_id": 3,
  "tag_ids": [1, 3]
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
  \"message\": \"Sheet created successfully\",
  \"data\": {
    \"id\": 3,
    \"title\": \"Blackbird\",
    \"artist\": { \"id\": 3, \"name\": \"The Beatles\" },
    \"tags\": [{ \"id\": 1, \"name\": \"classic rock\" }, { \"id\": 3, \"name\": \"fingerstyle\" }],
    \"capo\": 3,
    \"source_url\": \"https://...\",
    \"content\": \"G  Am7  G/B  G  A7sus4  D7sus4\\n[Verse]\\nG       Am7      G/B      G\\nBlackbird singing in the dead of night...\"
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
  "title": "Tears in Heaven",
  "content": "A  E/G#  F#m  A/E  D/F#  E7sus4  E7\n[Verse]\nA        E/G#     F#m    A/E\nWould you know my name...",
  "capo": 2,
  "source_url": "https://...",
  "artist_id": 4,
  "tag_ids": [2, 3]
}
```

### Response

```json
{
  \"message\": \"Sheet updated successfully\",
  \"data\": {
    \"id\": 1,
    \"title\": \"Tears in Heaven\",
    \"artist\": { \"id\": 4, \"name\": \"Eric Clapton\" },
    \"tags\": [{ \"id\": 2, \"name\": \"acoustic\" }, { \"id\": 3, \"name\": \"fingerstyle\" }],
    \"capo\": 2,
    \"source_url\": \"https://...\",
    \"content\": \"A  E/G#  F#m  A/E  D/F#  E7sus4  E7\\n[Verse]\\nA        E/G#     F#m    A/E\\nWould you know my name...\"
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
  "data": {
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
  "data": {
    "content": "G#  C#  D#  G#"
  }
}
```