@echo off
set ORIG_DIR=%cd%

cd PYTHON_SERVER
start cmd /k "call venv\Scripts\activate.bat && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

cd %ORIG_DIR%

npm run dev

PAUSE