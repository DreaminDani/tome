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
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
BASE_URL=http://localhost:3000
TARGET_URI=postgres://postgres:example@db/postgres
```
Make sure you set the callback and login urls to the actual domain you're running on (it'll be localhost:3000 in dev).
Also, it's best not use the default username and password for postgres in production...

### 3. Localhost dev environment
Finally, install the node packages and spin up a dev environment:

```sh
yarn
yarn dev
```

## Testing Locally
`yarn test` and `yarn test:journey` will run the jest and cypress tests, respectively

On Windows Subsystems for Linux (WSL), you must first follow these [X Window setup instructions](https://nickymeuleman.netlify.com/blog/gui-on-wsl2-cypress). **Note that, the `$DISPLAY` IP Address is not always correct** Use `ipconfig` in Windows to verify the IP of for the vEthernet and replace `DISPLAY=<your_ip>:0.0` in your bash profile.

## Deployment

Tome deploys to PCF via GitHub Actions. See the `.github` directory for more info.
