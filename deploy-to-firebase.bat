@echo off
echo Installing Firebase CLI...
call npm install -g firebase-tools

echo Logging into Firebase (this will open a browser window)...
call firebase login

echo Initializing Firebase...
call firebase init hosting

echo Deploying to Firebase...
call firebase deploy --only hosting

echo Deployment complete!
pause 