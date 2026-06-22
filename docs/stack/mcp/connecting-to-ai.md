---
title: Connecting to AI Tools
description: Configuring MCP servers in Claude Desktop, Cursor, VS Code GitHub Copilot, and other hosts — with environment variables, secrets management, and debugging connection issues.
---

# Connecting to AI Tools

Once your MCP server is built, you need to register it with AI hosts so they know to connect to it. Each host has its own configuration mechanism, but the underlying pattern is the same: tell the host how to launch or connect to your server.

---

## Claude Desktop

Claude Desktop reads MCP server configuration from a JSON file on disk.

### Configuration file location

| OS | Path |
|---|---|
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json` |
| **Linux** | `~/.config/Claude/claude_desktop_config.json` |

### stdio server (local process)

```json
{
  "mcpServers": {
    "orders-db": {
      "command": "node",
      "args": ["/Users/alice/projects/orders-mcp-server/dist/index.js"],
      "env": {
        "DATABASE_URL": "postgresql://localhost:5432/orders",
        "DB_PASSWORD": "mysecretpassword"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/alice/projects"   // allowed root directory
      ]
    }
  }
}
```

### SSE server (remote URL)

```json
{
  "mcpServers": {
    "team-orders-server": {
      "url": "https://mcp.company.internal/sse",
      "headers": {
        "X-Api-Key": "your-api-key-here"
      }
    }
  }
}
```

### After editing

Restart Claude Desktop for configuration changes to take effect. New servers appear as available capabilities in your conversations. You can ask Claude "what tools do you have available?" and it will list all connected MCP tools.

---

## Cursor

Cursor supports MCP through workspace-level and global configurations.

### Workspace configuration (`.cursor/mcp.json`)

This file lives in your project root and can be committed to source control (with secrets excluded):

```json
{
  "mcpServers": {
    "project-db": {
      "command": "node",
      "args": ["./mcp-server/dist/index.js"],
      "env": {
        "DATABASE_URL": "${env:PROJECT_DB_URL}"
      }
    },
    "project-docs": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./docs"]
    }
  }
}
```

### Global configuration (`~/.cursor/mcp.json`)

Servers available across all Cursor workspaces:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-xxxxxxxxxxxx",
        "SLACK_TEAM_ID": "T0XXXXXXXXX"
      }
    }
  }
}
```

Cursor uses MCP tools in its **Agent** mode (the chat panel with the `@` mention syntax). After adding servers, use `@mcp` mentions or ask the agent to use specific tools.

---

## VS Code + GitHub Copilot

VS Code with GitHub Copilot supports MCP in **agent mode** (the Copilot chat side panel).

### `settings.json`

```json
{
  "github.copilot.chat.mcp.servers": {
    "orders-db": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/orders-mcp-server/dist/index.js"],
      "env": {
        "DATABASE_URL": "postgresql://localhost:5432/orders"
      }
    }
  }
}
```

Or via workspace `.vscode/mcp.json`:

```json
{
  "servers": {
    "project-tools": {
      "type": "stdio",
      "command": "node",
      "args": ["./mcp/dist/index.js"]
    }
  }
}
```

Use MCP tools in the Copilot agent panel by switching to **Agent** mode and mentioning a tool or asking the agent to perform a task that requires it.

---

## Secrets Management

**Never commit secrets to source control.** Use environment variables and reference them from the MCP config.

### Using OS environment variables

In Claude Desktop on macOS, environment variables set in your shell profile (`~/.zshrc`, `~/.bashrc`) are NOT automatically available to GUI applications launched from the dock.

**Fix:** use a `.env` file loaded by your server process, or pass values directly in the `env` block:

```json
// claude_desktop_config.json
{
  "mcpServers": {
    "orders-db": {
      "command": "node",
      "args": ["/path/to/server/dist/index.js"],
      "env": {
        "DATABASE_URL": "postgresql://user:password@localhost/orders",
        "API_SECRET": "your-secret-here"
      }
    }
  }
}
```

### Using a secrets manager

For team deployments, reference secrets from a vault rather than hardcoding:

```typescript
// In your server startup
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

async function loadSecrets() {
  const client = new SecretsManagerClient({ region: 'us-east-1' });
  const response = await client.send(new GetSecretValueCommand({
    SecretId: 'prod/mcp-server/database'
  }));
  return JSON.parse(response.SecretString!);
}

const secrets = await loadSecrets();
const db = new Pool({ connectionString: secrets.DATABASE_URL });
```

---

## Debugging Connection Issues

### Server not appearing in Claude

1. Verify the config file path and JSON syntax (JSON is strict — no trailing commas)
2. Test the command manually in your terminal:
   ```bash
   node /path/to/server/dist/index.js
   # Should not crash; press Ctrl+C to exit
   ```
3. Check Claude Desktop's developer tools: **Help → Developer Tools** → Console tab for MCP errors

### Tools not working as expected

Use MCP Inspector to test your server in isolation:
```bash
npx @modelcontextprotocol/inspector node /path/to/dist/index.js
```

This opens a browser UI where you can call tools with specific arguments and see the raw JSON response, without going through any AI model.

### Server crashes on startup

Common causes:
- Missing environment variables → add validation at startup
- Module not found → check build step (`npm run build`) ran successfully
- Permission denied on database → check connection string and credentials
- Wrong Node.js version → add `engines` field to `package.json`

```typescript
// Validate required environment at startup
const requiredEnv = ['DATABASE_URL', 'API_KEY'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`ERROR: Required environment variable ${key} is not set`);
    process.exit(1);
  }
}
```

---

## Other MCP-Compatible Hosts

| Host | Config location | Notes |
|---|---|---|
| **Zed** | `~/.config/zed/settings.json` | `"context_servers"` key |
| **Continue** | `~/.continue/config.json` | `"mcpServers"` key |
| **Windsurf** | Workspace `.windsurf/mcp.json` | Cascade agent mode |
| **Sourcegraph Cody** | Extension settings | Limited support |

The configuration format varies slightly per host, but all follow the same pattern: provide a command/URL, arguments, and environment variables.
