@echo off
start cmd /k "cd /d ./user-service && npm run start:dev"
start cmd /k "cd /d ./auth-service && npm run start:dev"
start cmd /k "cd /d ./api-gateway && npm run start:dev"
start cmd /k "cd /d ./card-service && npm run start:dev"
start cmd /k "cd /d ./transaction-service && npm run start:dev"
start cmd /k "cd /d ./notification-service && npm run start:dev"
start cmd /k "cd /d ./client && npm run dev"