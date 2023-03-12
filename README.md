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
- `backend/.env`

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

#### `backend/.env`

```
## backend ##

# express-session
SESSION_SECRET=${SESSION_SECRET}

# jsonwebtoken
JWT_SECRET=${JWT_SECRET}

# mongodb
MONGO_USERNAME=${MONGO_USERNAME}
MONGO_PASSWORD=${MONGO_PASSWORD}

MONGO_HOST=127.0.0.1
MONGO_PORT=27017
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

#### `backend/.env`

```
## backend ##

# express-session
SESSION_SECRET=${SESSION_SECRET}

# jsonwebtoken
JWT_SECRET=${JWT_SECRET}

# mongodb
MONGO_USERNAME=${MONGO_USERNAME}
MONGO_PASSWORD=${MONGO_PASSWORD}

MONGO_HOST=mongo
MONGO_PORT=27017
```
