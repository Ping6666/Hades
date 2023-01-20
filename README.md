# MVNLab Hades

## env

### `docker-compose.yml`

```
## mode ##
# development
cp docker-compose.db.yml docker-compose.yml

# production
cp docker-compose.all.yml docker-compose.yml
```

```
## docker ##
# (re)build the service
sudo docker compose build

# turn up the service
sudo docker compose up -d

# turn down the service
sudo docker compose down
```

#### development

```
sudo docker compose up -d

bash run.sh
```

#### production

```
sudo docker compose up -d
```

## config files

- `.env`
- `backend/database/config.js`

### development

> only nginx & mongo inside the docker (but frontend & backend are not)

#### `.env`

```
## nginx ##
UPSTREAM_FRONTEND_IP=${UPSTREAM_FRONTEND_IP} # ip
UPSTREAM_BACKEND_IP=${UPSTREAM_BACKEND_IP} # ip

## mongo ##
MONGO_USERNAME=${MONGO_USERNAME}
MONGO_PASSWORD=${MONGO_PASSWORD}
```

#### `backend/database/config.js`

```
module.exports = {
    USERNAME: `${MONGO_USERNAME}`,
    PASSWORD: `${MONGO_PASSWORD}`,
    HOST: '127.0.0.1',
    PORT: 27017,
};
```

### production

> all service inside the docker

#### `.env`

```
## nginx ##
UPSTREAM_FRONTEND_IP=frontend
UPSTREAM_BACKEND_IP=backend

## mongo ##
MONGO_USERNAME=${MONGO_USERNAME}
MONGO_PASSWORD=${MONGO_PASSWORD}
```

#### `backend/database/config.js`

```
module.exports = {
    USERNAME: `${MONGO_USERNAME}`,
    PASSWORD: `${MONGO_PASSWORD}`,
    HOST: 'mongo',
    PORT: 27017,
};
```
