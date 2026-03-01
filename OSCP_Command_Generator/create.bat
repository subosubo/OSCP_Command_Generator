@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "SEED=0"
if /I "%~1"=="--seed" set "SEED=1"


echo Ensuring folder structure...
mkdir "css" 2>nul
mkdir "js" 2>nul
mkdir "data" 2>nul

if "%SEED%"=="1" (
  echo Seeding sample data files...
  > "data\01_Network_Enumeration.txt" (
    echo nmap_basic: nmap -sC -sV ^<target^>
    echo full_tcp: nmap -p- --min-rate 10000 ^<target^>
  )
  > "data\13_Misc.txt" (
    echo find_flags: find / -name "local.txt" 2^>^/dev^/null
    echo interactive_shell: python3 -c "import pty; pty.spawn('/bin/bash')"
  )
)


echo Generating data\manifest.json from data\*.txt ...
echo (REMINDER) Run this again after adding/removing .txt files in /data so the dropdown updates.


set "OUT=data\manifest.json"
> "%OUT%" echo [

set "first=1"
for /f "delims=" %%F in ('dir /b /a:-d /on "data\*.txt" 2^>nul') do (
  set "name=%%~nF"
  if "!first!"=="1" (
    set "first=0"
    >> "%OUT%" echo   "!name!"
  ) else (
    >> "%OUT%" echo ,  "!name!"
  )
)

>> "%OUT%" echo ]

echo Done.
echo - manifest: "%cd%\%OUT%"
echo.
pause
