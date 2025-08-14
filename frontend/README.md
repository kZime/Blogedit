# Blogedit Frontend

## Development

```bash
npm install
npm run dev # use real api
npm run dev:mock # use mock api
```

## Every time you change the API contract, run

```bash
npm run orval
```

generated `src/api/gen/client.ts` from `backend/docs/api/api-contract-v1.yaml`

check `src/mocks/browser.ts` to use fake api handlers.

## Debug

remember to clear localstorage before switching between mock and real mode.

```js
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
location.reload();
```
