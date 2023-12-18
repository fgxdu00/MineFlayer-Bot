@echo off
set mainFile=main.js
set clientFile=client.js

REM set arguments here
set mainParams=here

start cmd /k "node %mainFile% %mainParams%"
timeout /nobreak /t 5 >nul
start cmd /k "node %clientFile%"