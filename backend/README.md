# Blogedit Backend

## APIs

| Method | Endpoint             | Description                                                                   |

| ------ | -------------------- | ----------------------------------------------------------------------------- |
| POST   | `/api/auth/register` | `{ username, email, password }`, return new user info (without password) |
| POST   | `/api/auth/login`    | `{ email, password }`, return `{ access_token, refresh_token }`    |
| POST   | `/api/auth/refresh`  | `{ refresh_token }`, return new `{ access_token, refresh_token }` |
| GET    | `/api/user`          | get current user info (need to carry `Authorization: Bearer <access_token>` in Header) |
