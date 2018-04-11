git pull
cd frontend
npm install
npm run build
cd ..
cd backend
npm install
pm2 delete all
pm2 start src/server.js
cd ..
