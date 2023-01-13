#!/bin/sh

# argv
home_dir="/home/ping"
base_dir="hades"
backend_dir="backend"
frontend_dir="frontend"

# env set
cd $home_dir/$base_dir

# Backend Startup
cd $backend_dir
gnome-terminal -- /bin/bash -c "echo \"starting back-end\"; npm install; npm run start;"

# env set
cd $home_dir/$base_dir

# Frontend Startup
cd $frontend_dir
gnome-terminal -- /bin/bash -c "echo \"starting front-end\"; npm install; npm run serve;"

# env set
cd $home_dir/$base_dir

echo "Website front-end & back-end have been started!!!"
