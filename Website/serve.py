#!/usr/bin/env python3
"""
Simple HTTP server for testing the website locally.
Serves files with proper MIME types for ES modules.
"""

import http.server
import socketserver
import os
import sys
import socket

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        # Set proper MIME type for JavaScript modules
        if self.path.endswith('.js'):
            self.send_header('Content-Type', 'application/javascript; charset=utf-8')
        elif self.path.endswith('.mjs'):
            self.send_header('Content-Type', 'application/javascript; charset=utf-8')
        
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        # Custom logging format
        sys.stderr.write(f"[{self.log_date_time_string()}] {format % args}\n")

def find_free_port(start_port=8000, max_attempts=10):
    """Find a free port starting from start_port"""
    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except OSError:
            continue
    return None

def run_server(port=None):
    Handler = MyHTTPRequestHandler
    
    # If no port specified, try to find a free one
    if port is None:
        port = find_free_port()
        if port is None:
            print("❌ Error: Could not find a free port between 8000-8010")
            print("\nTo fix this, you can:")
            print("1. Kill existing processes: lsof -i :8000 | grep LISTEN")
            print("2. Specify a different port: python3 serve.py 8080")
            sys.exit(1)
    
    # Allow port reuse
    socketserver.TCPServer.allow_reuse_address = True
    
    try:
        with socketserver.TCPServer(("", port), Handler) as httpd:
            print("=" * 60)
            print("🚀 Deltek India Reconnect 2025 - Local Server")
            print("=" * 60)
            print(f"✅ Server running at: http://localhost:{port}/")
            print(f"📂 Serving directory: {os.getcwd()}")
            print("\nPress Ctrl+C to stop the server")
            print("=" * 60)
            
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n\n🛑 Server stopped.")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Error: Port {port} is already in use!")
            print("\nTrying to find an alternative port...")
            
            # Try to find another port
            alt_port = find_free_port(port + 1)
            if alt_port:
                print(f"✅ Found free port: {alt_port}")
                run_server(alt_port)
            else:
                print("\nTo fix this issue:")
                print(f"1. Find process: lsof -i :{port}")
                print(f"2. Kill process: kill -9 <PID>")
                print(f"3. Or use different port: python3 serve.py 8080")
        else:
            print(f"❌ Error starting server: {e}")
            sys.exit(1)

if __name__ == "__main__":
    # Check if port is provided as command line argument
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
            run_server(port)
        except ValueError:
            print(f"❌ Invalid port number: {sys.argv[1]}")
            print("Usage: python3 serve.py [port]")
            print("Example: python3 serve.py 8080")
            sys.exit(1)
    else:
        run_server()