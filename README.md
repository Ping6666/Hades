# MVNLab Hades

## env

### docker-compose

```
# development
cp docker-compose.db.yml docker-compose.yml

# production
cp docker-compose.all.yml docker-compose.yml
```

### service in docker-compose

```
# (re)build the service
sudo docker compose build

# turn up the service
sudo docker compose up -d

# turn down the service
sudo docker compose down
```

### service not in docker-compose (when development)

```
bash run.sh
```

## config files

### .env

```
MONGO_USERNAME=${MONGO_USERNAME}
MONGO_PASSWORD=${MONGO_PASSWORD}
```

### backend/database/config.js

```
module.exports = {
    USERNAME: `${MONGO_USERNAME}`,
    PASSWORD: `${MONGO_PASSWORD}`,
    HOST: '127.0.0.1', // only mongo inside the docker
    // HOST: 'mongo', // both inside the docker
    PORT: 27017,
};
```
