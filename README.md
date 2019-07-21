# Tome

## How to use

### 1. Database
Tome is backed by Postgresql and uses Sqitch to manage migrations. A quick development environment requires docker to run:
```sh
cd db
./local-db.sh
```

A postgresql database will be running on port 5421 and an administrative ui will be available at http://localhost:7772

### 2. Environment File
Then create a `.env` file with the required creds:
```
PORT=3000
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...
AUTH0_CALLBACK_URL=http://localhost:3000/callback
BASE_URL=http://localhost:3000
TARGET_URI=postgres://postgres:example@db/postgres
```
Make sure you set the callback and login urls in the auth0 dashboard for auth to work.
Also, it's best not use the default username and password for postgres in production...

### 3. Localhost dev environment
Finally, install the node packages and spin up a dev environment:

```sh
yarn
yarn dev
```

## Deployment

Tome deploys to PCF via GitHub Actions. See the `.github` directory for more info.
