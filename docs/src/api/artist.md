# Artists API

## Artist Endpoints

| Method | Endpoint        | Description      |
| ------ | --------------- | ---------------- |
| GET    | `/artists`      | List all artists |
| GET    | `/artists/:id` | Get artist by ID |
| POST   | `/artists`      | Create artist    |
| PUT    | `/artists/:id` | Update artist    |
| DELETE | `/artists/:id` | Delete artist    |

## GET /artists

Returns list of all artists.

### Response

```json
{
  "payload": [
    { "id": 1, "name": "Eagles" },
    { "id": 2, "name": "The Beatles" }
  ]
}
```

## GET /artists/:id

Returns a single artist by ID.

### Parameters

| Name | Type | Location | Description |
| ---- | ---- | -------- | ----------- |
| id   | int  | path     | Artist ID   |

### Response

```json
{
  "payload": { "id": 1, "name": "The Beatles" }
}
```

## POST /artists

Create a new artist.

### Request Body

```json
{
  "name": "The Beatles"
}
```

| Field | Type   | Required | Description  |
| ----- | ------ | -------- | ------------ |
| name  | string | Yes      | Artist name  |

### Response

```json
{
  "payload": { "id": 5, "name": "The Beatles" },
  "message": "Artist created successfully"
}
```

## PUT /artists/:id

Update an existing artist.

### Parameters

| Name | Type | Location | Description |
| ---- | ---- | -------- | ----------- |
| id   | int  | path     | Artist ID   |

### Request Body

```json
{
  "name": "Ed Sheeran"
}
```

### Response

```json
{
  "payload": { "id": 5, "name": "Ed Sheeran" },
  "message": "Artist updated successfully"
}
```

## DELETE /artists/:id

Delete an artist.

### Parameters

| Name | Type | Location | Description |
| ---- | ---- | -------- | ----------- |
| id   | int  | path     | Artist ID   |

### Response

```json
{
  "message": "Artist deleted successfully"
}
```