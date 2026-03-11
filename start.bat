@echo off
echo === Загрузка образов из файлов ===
docker load -i app-dev.tar
docker load -i postgres.tar

echo === Запуск приложения ===
docker-compose --profile dev up -d

echo === Готово! Открой http://localhost:3000 в браузере ===
pause
