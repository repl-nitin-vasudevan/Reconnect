#!/usr/bin/env python3
import subprocess
import json
import time
import urllib.request
import urllib.error
from urllib.parse import urljoin

def test_website():
    base_url = "http://localhost:8000"
    original_url = "https://deltek-india-e-t-india-reconnect-2025-agenda-v1-3-1080946760059.us-west1.run.app/"
    
    print("=" * 60)
    print("WEBSITE DIAGNOSTIC REPORT")
    print("=" * 60)
    
    # Test 1: Server availability
    print("\n1. SERVER STATUS:")
    try:
        response = urllib.request.urlopen(base_url, timeout=5)
        html_content = response.read().decode('utf-8')
        print(f"   ✓ Server is running on {base_url}")
        print(f"   Status Code: {response.status}")
    except Exception as e:
        print(f"   ✗ Server error: {e}")
        return
    
    # Test 2: HTML structure
    print("\n2. HTML STRUCTURE:")
    checks = [
        ("Title tag", "<title>Deltek India Reconnect 2025</title>" in html_content),
        ("Root div", '<div id="root">' in html_content),
        ("Import map", '<script type="importmap">' in html_content),
        ("React CDN", "unpkg.com/react" in html_content or "esm.sh/react" in html_content),
        ("Module script", '<script type="module">' in html_content)
    ]
    
    for check_name, result in checks:
        status = "✓" if result else "✗"
        print(f"   {status} {check_name}: {'Found' if result else 'Missing'}")
    
    # Test 3: JavaScript modules
    print("\n3. JAVASCRIPT MODULES:")
    js_files = [
        "/js/index.js",
        "/js/App.js",
        "/js/components/IndiaAgenda.js",
        "/js/constants.js",
        "/js/components/SessionModal.js",
        "/js/components/Chatbot.js"
    ]
    
    for js_file in js_files:
        try:
            resp = urllib.request.urlopen(urljoin(base_url, js_file))
            content = resp.read()
            content_type = resp.headers.get('Content-Type', '')
            if 'javascript' in content_type:
                print(f"   ✓ {js_file}: OK ({len(content)} bytes)")
            else:
                print(f"   ⚠ {js_file}: Wrong content-type: {content_type}")
        except urllib.error.HTTPError as e:
            print(f"   ✗ {js_file}: HTTP {e.code}")
        except Exception as e:
            print(f"   ✗ {js_file}: {e}")
    
    # Test 4: CSS files
    print("\n4. CSS FILES:")
    css_files = ["/css/google-fonts.css"]
    
    for css_file in css_files:
        try:
            resp = urllib.request.urlopen(urljoin(base_url, css_file))
            content = resp.read()
            print(f"   ✓ {css_file}: OK ({len(content)} bytes)")
        except urllib.error.HTTPError as e:
            print(f"   ✗ {css_file}: HTTP {e.code}")
        except Exception as e:
            print(f"   ✗ {css_file}: {e}")
    
    # Test 5: Service Worker
    print("\n5. SERVICE WORKER:")
    try:
        resp = urllib.request.urlopen(urljoin(base_url, "/sw.js"))
        content = resp.read()
        print(f"   ✓ /sw.js: OK ({len(content)} bytes)")
    except urllib.error.HTTPError as e:
        print(f"   ✗ /sw.js: HTTP {e.code}")
    except Exception as e:
        print(f"   ✗ /sw.js: {e}")
    
    # Test 6: Compare with original
    print("\n6. COMPARISON WITH ORIGINAL:")
    try:
        orig_resp = urllib.request.urlopen(original_url, timeout=10)
        orig_content = orig_resp.read().decode('utf-8')
        print(f"   Original site status: {orig_resp.status}")
        
        # Check for key features in original
        orig_features = [
            ("React app", "react" in orig_content.lower()),
            ("Agenda data", "agenda" in orig_content.lower()),
            ("Session info", "session" in orig_content.lower()),
            ("Google Fonts", "fonts.googleapis.com" in orig_content or "Google Sans" in orig_content)
        ]
        
        print("   Original site features:")
        for feature, found in orig_features:
            print(f"     {'✓' if found else '✗'} {feature}")
            
    except Exception as e:
        print(f"   Could not fetch original: {e}")
    
    # Test 7: Critical files check
    print("\n7. CRITICAL FILES:")
    import os
    critical_files = [
        "index.html",
        "sw.js",
        "js/index.js",
        "js/App.js",
        "js/constants.js"
    ]
    
    for file in critical_files:
        if os.path.exists(file):
            size = os.path.getsize(file)
            print(f"   ✓ {file}: {size:,} bytes")
        else:
            print(f"   ✗ {file}: NOT FOUND")
    
    print("\n" + "=" * 60)
    print("RECOMMENDATIONS:")
    print("=" * 60)
    
    # Provide recommendations
    if all(result for _, result in checks):
        print("✓ HTML structure looks good")
    else:
        print("⚠ Fix missing HTML elements")
    
    print("\nTo view the website:")
    print(f"1. Open browser: {base_url}")
    print("2. Open Developer Console (F12)")
    print("3. Check Console tab for errors")
    print("4. Check Network tab for failed requests")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    test_website()