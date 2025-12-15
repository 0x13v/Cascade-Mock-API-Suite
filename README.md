
# Cascade Mock API Suite

Mock-friendly Express server that serves JSON files as deterministic API responses. Useful for rapid prototyping, contract testing, or local integration work.

## Prerequisites

- Node.js 18+ (tested on 18/20)
- npm 9+

## Installation

```bash
git clone https://github.com/0x13v/Cascade-Mock-API-Suite.git mock-app
cd mock-app
npm install
```

## Running the server

```bash
node server.js
```

The API boots on `http://localhost:3000`. Logs show incoming requests, methods, paths, and body payloads.

## Available endpoints

| Method | Path                                                     | Response file            | Notes                                   |
| ------ | -------------------------------------------------------- | ------------------------ | --------------------------------------- |
| GET    | `/api/status`                                            | `responses/status.json`  | Health check                            |
| GET    | `/api/info`                                              | `responses/info.json`    | Static metadata                         |
| POST   | `/api/echo`                                              | `responses/echo.json`    | Returns templated `{{body}}` payload    |
| POST   | `/api/token`                                             | `responses/token.json`   | Static OAuth token mock (body driven)   |
| POST   | `/api/:id/token`                                         | `responses/token.json`   | Path param `:id` available as `{{id}}`  |
| GET    | `/api/dynamic`                                           | `responses/dynamic.json` | Query/body attributes mapped via config |

### Template placeholders

- `{{body}}`: replaced with the entire JSON request body when the endpoint sets `injectBody: true`.
- `{{attributeName}}`: replaced with the value of `attributeName` from query params or body.
- Nested attributes (e.g., `price.value`) are supported using dot notation in the `config.attributes` array inside the response JSON.
- `{{param}}`: any Express route parameter (e.g., `:id`) will replace matching placeholders.

### Dynamic attribute mapping

Each response file can define:

```json
{
  "config": {
    "attributes": [
      "mpn",
      "price.value"
    ]
  },
  "return": {
    "data": {
      "sku": "{{mpn}}",
      "price": {
        "value": "{{price.value}}"
      }
    }
  }
}
```

The controller will populate placeholders using query/body data and return only the `return` block to clients.

## Testing with curl

```bash
# Dynamic example
curl -X GET "http://localhost:3000/api/dynamic?mpn=12345&availability=in_stock"

# Token mock
curl -X POST "http://localhost:3000/api/token" \
  -H "Content-Type: application/json" \
  -d '{"client_id":"demo","grant_type":"refresh_token"}'

# Token mock with path param
curl -X POST "http://localhost:3000/api/merchant-123/token" \
  -H "Content-Type: application/json" \
  -d '{"client_id":"demo","grant_type":"refresh_token"}'
```

## Extending the mock API

1. Create a new JSON file under `responses/`.
2. Add a definition to `config/endpoints.json` describing the method, path, file, and options (e.g., `injectBody: true`).
3. Restart the server to load the updated configuration. (The loader reads the JSON file at boot.)

## Logging & Debugging

Every request is logged with timestamp, method, URL, IP, and (if present) the parsed JSON body. Use these logs to confirm payloads while iterating.
