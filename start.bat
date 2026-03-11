@echo off
echo === Загрузка образов из файлов ===
docker load -i flash\app-dev.tar
docker load -i flash\postgres.tar

echo === Переименование образа ===
docker tag demo-exam-app-dev:latest korochki-app-dev:latest 2>nul
docker tag demo_easy-app-dev:latest korochki-app-dev:latest 2>nul

echo === Подготовка конфигурации ===
if not exist .env copy .env.example .env

echo === Запуск приложения ===
docker-compose --profile dev up -d

echo === Готово! Открой http://localhost:3000 в браузере ===
pause