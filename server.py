#!/usr/bin/env python3
"""No-cache HTTP server — forces browser to always load fresh files."""
import http.server
import os

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))
print("\n🌹 Romantic Server running at: http://localhost:8003\n")
http.server.HTTPServer(('', 8003), NoCacheHandler).serve_forever()
