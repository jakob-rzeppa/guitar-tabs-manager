# API Overview

## Base URL

```
http://localhost:8000
```

## Response Format

All API responses follow a consistent structure:

```json
{
  "payload": <data>,
  "message": "<optional message>"
}
```

## Resources

- **[Sheets](/api/sheet)** - Manage chord sheets with content, artists, and tags
- **[Artists](/api/artist)** - Manage artist information
- **[Tags](/api/tag)** - Organize sheets with tags

## Authentication

Currently, the API does not require authentication.

## Content Type

All requests and responses use `application/json`.
