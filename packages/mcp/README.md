# @rolebase/mcp

Serveur MCP (Model Context Protocol) pour accéder à l'API GraphQL de Rolebase.

## Installation

```bash
npm install
```

## Configuration

Définir les variables d'environnement :

```bash
# Endpoint GraphQL Hasura (requis)
ROLEBASE_API_URL=http://localhost:8888/graphql

# Authentification (l'un des deux requis)
ROLEBASE_API_KEY=your-api-key       # Via la table api_key
ROLEBASE_JWT_TOKEN=your-jwt-token   # Via Nhost Auth
```

### Via opencode.jsonc

```jsonc
{
  "mcp": {
    "rolebase": {
      "type": "local",
      "command": ["npx", "tsx", "packages/mcp/src/index.ts"],
      "environment": {
        "ROLEBASE_API_URL": "http://localhost:8888/graphql",
        "ROLEBASE_API_KEY": "your-api-key"
      },
      "enabled": true,
      "timeout": 10000
    }
  }
}
```

### Via .mcp.json (Claude Code, etc.)

```json
{
  "mcpServers": {
    "rolebase": {
      "command": "npx",
      "args": ["tsx", "packages/mcp/src/index.ts"],
      "env": {
        "ROLEBASE_API_URL": "http://localhost:8888/graphql",
        "ROLEBASE_API_KEY": ""
      }
    }
  }
}
```

## Lancement

```bash
# Développement
npm run dev

# Production
npm run build && npm start
```

## Tools disponibles (29)

### GraphQL

| Tool | Description |
|------|-------------|
| `graphql` | Exécuter une requête ou mutation GraphQL arbitraire |

### Organisations

| Tool | Type | Description |
|------|------|-------------|
| `get_orgs` | read | Lister les organisations de l'utilisateur |
| `get_org` | read | Détails d'une org (rôles, cercles, membres) |
| `update_org` | write | Modifier une org (nom, paramètres) |

### Rôles

| Tool | Type | Description |
|------|------|-------------|
| `get_roles` | read | Lister les rôles d'une organisation |
| `get_role` | read | Détails d'un rôle avec ses cercles |
| `create_role` | write | Créer un rôle + circle automatiquement |
| `update_role` | write | Modifier un rôle |

`create_role` accepte un paramètre `parentId` pour positionner le cercle sous un parent existant.

### Cercles

| Tool | Type | Description |
|------|------|-------------|
| `get_circles` | read | Lister les cercles (organigramme) |
| `get_circle` | read | Détails d'un cercle (membres, enfants, threads, meetings) |
| `create_circle` | write | Créer un cercle dans l'organigramme |
| `update_circle` | write | Modifier un cercle (changer parent) |
| `add_circle_member` | write | Affecter un membre à un cercle |
| `remove_circle_member` | write | Retirer un membre d'un cercle (archivage) |

### Membres

| Tool | Type | Description |
|------|------|-------------|
| `get_members` | read | Lister les membres d'une organisation |
| `get_member` | read | Détails d'un membre (cercles assignés) |
| `update_member` | write | Modifier le profil d'un membre |

### Threads

| Tool | Type | Description |
|------|------|-------------|
| `get_threads` | read | Lister les threads d'un cercle |
| `get_thread` | read | Détails d'un thread (activités, réactions) |
| `create_thread` | write | Créer un thread de discussion |
| `add_thread_activity` | write | Ajouter un message dans un thread |

### Meetings

| Tool | Type | Description |
|------|------|-------------|
| `get_meetings` | read | Lister les meetings d'un cercle |
| `get_meeting` | read | Détails d'un meeting (étapes, participants) |
| `create_meeting` | write | Créer un meeting avec stepsConfig |

`create_meeting` requiert un `stepsConfig` (tableau d'étapes). Valeurs de type : `Tour`, `Threads`, `Checklist`, `Indicators`, `Tasks`.

### Décisions

| Tool | Type | Description |
|------|------|-------------|
| `get_decisions` | read | Lister les décisions d'un cercle |
| `create_decision` | write | Enregistrer une décision |

### Tâches

| Tool | Type | Description |
|------|------|-------------|
| `get_tasks` | read | Lister les tâches d'un cercle |
| `create_task` | write | Créer une tâche |
| `update_task` | write | Modifier statut/assignation/due date |

Statuts de tâche : `Open`, `InProgress`, `InReview`, `Blocked`, `Done`.

### Actualités

| Tool | Type | Description |
|------|------|-------------|
| `get_news` | read | Feed unifié (threads, décisions, meetings terminés) |
| `get_recent_activities` | read | Activités récentes (messages, propositions, votes) |

`get_news` retourne un feed chronologique fusionnant threads, décisions et meetings terminés depuis une VIEW SQL. Supports la pagination (`limit`/`offset`) et le filtrage par `circleId`.

`get_recent_activities` retourne les messages, propositions et votes à travers tous les threads d'un org ou cercle. Utile pour voir les dernières modifications sans ouvrir chaque thread.

## Structure du code

```
packages/mcp/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts              # Entry point (McpServer + StdioTransport)
    ├── client.ts             # Client GraphQL Hasura (fetch + auth)
    ├── schema.ts             # Fragments GraphQL réutilisables
    └── tools/
        ├── types.ts          # Type ToolRegistrar
        ├── graphql.ts        # Tool générique GraphQL
        ├── org.ts            # Organisations
        ├── role.ts           # Rôles (+ création circle auto)
        ├── circle.ts         # Cercles + affectation membres
        ├── member.ts         # Membres
        ├── thread.ts         # Threads + activités
        ├── meeting.ts        # Meetings
        ├── decision.ts       # Décisions
        ├── task.ts           # Tâches
        ├── news.ts           # Feed unifié (VIEW SQL news)
        └── activity.ts       # Activités récentes cross-threads
```

## Notes techniques

- Authentification via API key (`x-api-key`) ou JWT (`Authorization: Bearer`)
- Le champ `leaders` (view SQL `circle_leader`) n'est pas accessible via l'endpoint API key
- Les suppressions sont simulées par archivage (`archived: true`) conformément aux permissions Hasura
- Les champs optionnels avec valeur `null` ne sont pas envoyés à Hasura (rejet sinon)
- `create_role` crée automatiquement un circle dans l'organigramme (comme le webapp)
