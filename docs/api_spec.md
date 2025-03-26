
##### `docs/api_spec.md` (Yangilangan)
```markdown
# API Spetsifikatsiyasi

## Auth
- **POST /api/auth/login**
  - Body: `{ "username": "string", "password": "string" }`
  - Javob: `{ "token": "string" }`
  - Tashkilot ID token ichida qaytariladi.

## Queue
- **GET /api/queue**
  - Header: `Authorization: Bearer <token>`
  - Javob: `{ "queue": [], "current": {} }`
  - Keshdan olinadi (TTL: 60s).

## Organizations
- **GET /api/organizations/:id**
  - Header: `Authorization: Bearer <token>`
  - Javob: `{ "id": number, "name": "string", "styles": {}, "tariff_id": number }`
  - Keshdan olinadi (TTL: 1h).g