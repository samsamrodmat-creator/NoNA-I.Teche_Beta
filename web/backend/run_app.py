import uvicorn
import webbrowser
import threading
import time
from main import app

def open_browser():
    time.sleep(2)  # Wait for the server to start
    webbrowser.open("http://127.0.0.1:8000/dashboard")

if __name__ == "__main__":
    threading.Thread(target=open_browser, daemon=True).start()
    uvicorn.run(app, host="127.0.0.1", port=8000)
