#!/usr/bin/env python3
"""
Composio Google Meet MCP Setup Script

Generates an MCP URL for the Google Meet integration and prints
the `claude mcp add` command to register it.

Usage:
  export COMPOSIO_API_KEY="your-key-here"
  python3 scripts/setup-meet-mcp.py

To get a Composio API key:
  1. Go to https://app.composio.dev
  2. Sign up / log in
  3. Navigate to Settings → API Keys
  4. Create a new key and copy it
"""

import os
import sys
import json


def main():
    api_key = os.environ.get("COMPOSIO_API_KEY")
    if not api_key:
        print("ERROR: COMPOSIO_API_KEY environment variable is not set.\n")
        print("To get your API key:")
        print("  1. Go to https://app.composio.dev")
        print("  2. Sign up or log in")
        print("  3. Settings → API Keys → Create new key")
        print("  4. Then run:")
        print('     export COMPOSIO_API_KEY="your-key-here"')
        print(f"     python3 {sys.argv[0]}")
        sys.exit(1)

    user_id = os.environ.get("USER_ID", os.environ.get("USER", "default"))

    try:
        from composio import Composio

        client = Composio(api_key=api_key)
        session = client.create(user_id=user_id, toolkits=["googlemeet"])
        mcp_url = session.mcp.url
    except ImportError:
        print("Composio SDK not installed. Using REST API fallback...\n")
        import urllib.request

        req = urllib.request.Request(
            "https://backend.composio.dev/api/v1/mcp/sessions",
            data=json.dumps({
                "user_id": user_id,
                "toolkits": ["googlemeet"],
            }).encode(),
            headers={
                "Content-Type": "application/json",
                "X-API-Key": api_key,
            },
        )
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode())
                mcp_url = data.get("mcp", {}).get("url") or data.get("url")
                if not mcp_url:
                    print("Response:", json.dumps(data, indent=2))
                    print("\nCould not extract MCP URL from response.")
                    print("Check https://docs.composio.dev for current API format.")
                    sys.exit(1)
        except urllib.error.HTTPError as e:
            print(f"HTTP {e.code}: {e.read().decode()}")
            sys.exit(1)
    except Exception as e:
        print(f"Error creating Composio session: {e}")
        sys.exit(1)

    print("=" * 60)
    print("  Google Meet MCP URL generated successfully!")
    print("=" * 60)
    print()
    print("MCP URL:", mcp_url)
    print()
    print("Run this command to register with Claude Code:")
    print()
    print(f'  claude mcp add --transport http googlemeet-composio "{mcp_url}" \\')
    print(f'    --headers "X-API-Key:{api_key}"')
    print()
    print("Or add to .claude/settings.json manually:")
    print()
    settings = {
        "mcpServers": {
            "googlemeet-composio": {
                "type": "http",
                "url": mcp_url,
                "headers": {
                    "X-API-Key": api_key,
                },
            }
        }
    }
    print(json.dumps(settings, indent=2))
    print()

    settings_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        ".claude",
        "settings.local.json",
    )
    write = input(f"Write MCP config to {settings_path}? [y/N] ").strip().lower()
    if write == "y":
        existing = {}
        if os.path.exists(settings_path):
            with open(settings_path) as f:
                existing = json.load(f)
        existing.setdefault("mcpServers", {})
        existing["mcpServers"]["googlemeet-composio"] = settings["mcpServers"]["googlemeet-composio"]
        with open(settings_path, "w") as f:
            json.dump(existing, f, indent=2)
            f.write("\n")
        print(f"Written to {settings_path}")
        print("Restart Claude Code to pick up the new MCP server.")
    else:
        print("Skipped. Add the config manually when ready.")


if __name__ == "__main__":
    main()
