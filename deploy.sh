#/bin/sh

# deployment without prisma migrate

cd ./backend
docker-compose up -d --build
cd ../frontend
docker-compose up -d --build