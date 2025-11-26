# Tags API

## Tag Endpoints

| Method | Endpoint     | Description   |
| ------ | ------------ | ------------- |
| GET    | `/tags`      | List all tags |
| GET    | `/tags/:id` | Get tag by ID |
| POST   | `/tags`      | Create tag    |
| PUT    | `/tags/:id` | Update tag    |
| DELETE | `/tags/:id` | Delete tag    |

## GET /tags

Returns list of all tags.

### Response

```json
{
  "data": [
    { "id": 1, "name": "classic rock" },
    { "id": 2, "name": "acoustic" },
    { "id": 3, "name": "fingerstyle" }
  ]
}
```

## GET /tags/:id

Returns a single tag by ID.

### Parameters

| Name | Type | Location | Description |
| ---- | ---- | -------- | ----------- |
| id   | int  | path     | Tag ID      |

### Response

```json
{
  "data": { "id": 2, "name": "acoustic" }
}
```

## POST /tags

Create a new tag.

### Request Body

```json
{
  "name": "fingerstyle"
}
```

| Field | Type   | Required | Description |
| ----- | ------ | -------- | ----------- |
| name  | string | Yes      | Tag name    |

### Response

```json
{
  "data": { "id": 3, "name": "fingerstyle" },
  "message": "Tag created successfully"
}
```

## PUT /tags/:id

Update an existing tag.

### Parameters

| Name | Type | Location | Description |
| ---- | ---- | -------- | ----------- |
| id   | int  | path     | Tag ID      |

### Request Body

```json
{
  "name": "fingerpicking"
}
```

### Response

```json
{
  "message": "Tag updated successfully",
  "data": { "id": 3, "name": "fingerpicking" }
}
```

## DELETE /tags/:id

Delete a tag.

### Parameters

| Name | Type | Location | Description |
| ---- | ---- | -------- | ----------- |
| id   | int  | path     | Tag ID      |

### Response

```json
{
  "message": "Tag deleted successfully"
}
```
