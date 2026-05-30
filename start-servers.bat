@echo off
echo Starting E-Commerce Platform...
echo.

echo Installing Backend Dependencies...
cd backend
call npm install
echo.

echo Installing Frontend Dependencies...
cd ../frontend
call npm install
echo.

echo Starting Backend Server (Port 5001)...
cd ../backend
start "Backend Server" cmd /k "npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server (Port 3000)...
cd ../frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5001
echo.
echo Press any key to close this window...
pause > nul