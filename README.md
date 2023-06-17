# Hades

Just practicing my frontend and backend skills.

## Goal

This project, although incomplete, was originally designed to assist equipment managers in efficiently overseeing lab operations. It offers a user-friendly interface for effortlessly searching, updating, and viewing equipment along with their corresponding images. Moreover, it provides the capability to manage items both with and without property numbers, while also keeping track of the lab's account balance.

### frontend

- [ ] Pages
    - [ ] Home (Announcement)
    - [x] Equipment (with and without property numbers)
        - [x] Table page
        - [x] CRUD page
    - [x] Account
        - [x] login
        - [x] logout
        - [x] register
        - [ ] management
- [ ] Functionality
    - [x] csv files
        - [x] upload
        - [x] show
        - [x] CRUD
            - [x] showable
            - [ ] sortable
            - [x] editable
    - [ ] upload images
    - [ ] new announcement
    - [ ] manage account level

### backend

- [ ] files (send / receive)
    - [x] csv
    - [ ] image
- [x] CRUD
    - [x] search (fuzzy or not)
    - [x] filter (or & and)
- [ ] account management
    - [x] CRUD
    - [ ] account level management

## System

### Dependencies Installation

- [docker](/document/installation.md#docker)
- [npm & node](/document/installation.md#npm--node)

## Production

> all service inside the docker

### Env setup

- docker

### config files

- `docker-compose.yml`
- `.env`
- `backend/.env`

#### `docker-compose.yml`

copy `docker-compose.all.yml` and name as `docker-compose.yml`

#### `.env`

create a file and name as `.env` with content below

```
## nginx ##
UPSTREAM_FRONTEND_IP=frontend
UPSTREAM_BACKEND_IP=backend

## mongo ##
MONGO_USERNAME=${MONGO_USERNAME}
MONGO_PASSWORD=${MONGO_PASSWORD}
```

#### `backend/.env`

create a file under folder `backend` and name as `.env` with content below

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

### open up

```bash
sudo docker compose up -d (--build)
```

### close off

```bash
sudo docker compose down
```

## Development

> only nginx & mongo inside the docker (but frontend & backend are not)

### Env setup

- docker
- npm & node

### config files

- `docker-compose.yml`
- `.env`
- `backend/.env`

#### `docker-compose.yml`

copy `docker-compose.nginx.yml` and name as `docker-compose.yml`

#### `.env`

create a file and name as `.env` with content below

```
## nginx ##
UPSTREAM_FRONTEND_IP=0.0.0.0 # ip
UPSTREAM_BACKEND_IP=0.0.0.0 # ip

## mongo ##
MONGO_USERNAME=${MONGO_USERNAME}
MONGO_PASSWORD=${MONGO_PASSWORD}
```

#### `backend/.env`

create a file under folder `backend` and name as `.env` with content below

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

### open up

```bash
sudo docker compose up -d (--build)

bash run.sh
```

### close off

```bash
sudo docker compose down
```
