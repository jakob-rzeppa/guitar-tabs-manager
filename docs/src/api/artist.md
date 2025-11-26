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
  "data": [
    { "id": 1, "name": "Eagles" },
    { "id": 2, "name": "Pink Floyd" },
    { "id": 3, "name": "The Beatles" },
    { "id": 4, "name": "Eric Clapton" }
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
  "data": { "id": 1, "name": "Eagles" }
}
```

## POST /artists

Create a new artist.

### Request Body

```json
{
  "name": "Simon & Garfunkel"
}
```

| Field | Type   | Required | Description  |
| ----- | ------ | -------- | ------------ |
| name  | string | Yes      | Artist name  |

### Response

```json
{
  "data": { "id": 5, "name": "Simon & Garfunkel" },
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
  "name": "Paul Simon"
}
```

### Response

```json
{
  "data": { "id": 5, "name": "Paul Simon" },
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
``` -->
