# Senior Vue 3 Developer Test

## Project: Crypto Market Summary

```
cp .env.example .env
```


Because provided api endpoints served via https you can either create express
server as proxy to fetch from insecure http localhost or fetch directly from api
endpoint

**VITE_API_URL** for api endpoint;

**VITE_POLLING_INTERVAL** to set polling interval

Variables to set express server:

**EXPRESS_PORT** port on which will run express server

**SERVER_HOST** host of server (localhost)

**EXTERN_API_URL** external api endpoint to fetch market and currencies data

To start vue app instance run command:

```
npm run dev
```

To start express server instance run command:
```
npm run server
```

Optionally you can start concurrently vue app + express server
```
npm run start
```

