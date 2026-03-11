@echo off
echo === Сборка образов ===
docker-compose --profile dev up --build -d
docker-compose --profile dev down

echo === Экспорт образов на флешку ===
mkdir flash 2>nul
docker save demo_easy-app-dev:latest -o flash\app-dev.tar
docker save postgres:17 -o flash\postgres.tar

echo === Готово! Скопируй папку flash на флешку вместе с проектом ===
pause
