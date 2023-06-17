#!/bin/bash

# argv
backend_dir="backend"
frontend_dir="frontend"

# Backend Startup
cd $backend_dir
gnome-terminal -- /bin/bash -c "echo \"starting back-end\"; npm install; npm run start;"

cd ..

# Frontend Startup
cd $frontend_dir
gnome-terminal -- /bin/bash -c "echo \"starting front-end\"; npm install; npm run serve;"

echo "Website front-end & back-end have been started!!!"
