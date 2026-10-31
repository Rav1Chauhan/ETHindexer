# ETHindexer

**An Ethereum Blockchain Indexing System**

ETHindexer is a backend infrastructure project designed to retrieve, process, organize, and expose Ethereum blockchain data through a structured database and REST APIs.

The goal is to make blockchain data easier and faster to query without repeatedly fetching and processing information directly from Ethereum RPC nodes.

> **Project Status:** Work in Progress 🚧

## Overview

Ethereum stores transaction and event data in blocks. Although this data is publicly accessible, retrieving and querying it efficiently can be challenging for applications that need historical blockchain information.

ETHindexer aims to solve this problem by building an indexing pipeline that:

- Connects to an Ethereum node through RPC.
- Retrieves blockchain blocks and transactions.
- Processes and organizes blockchain information.
- Stores indexed data in PostgreSQL.
- Exposes stored blockchain data through backend APIs.

## Architecture

```text
                 Ethereum Blockchain
                         |
                         |
                    Ethereum RPC
                         |
                         v
                  +--------------+
                  |   Indexer    |
                  |  TypeScript  |
                  +--------------+
                         |
                         |
                  Process Blockchain
                       Data
                         |
                         v
                  +--------------+
                  |   Backend    |
                  | Node.js/Express
                  +--------------+
                         |
                         |
                         v
                  +--------------+
                  |  PostgreSQL  |
                  |    Prisma    |
                  +--------------+
                         |
                         v
                  REST API Consumers
```

## Tech Stack

| Technology | Purpose |
|---|---|
| TypeScript | Application development |
| Node.js | JavaScript runtime |
| Ethereum JSON-RPC | Blockchain connectivity |
| Express.js | Backend API |
| PostgreSQL | Persistent data storage |
| Prisma ORM | Database access and migrations |
| Git & GitHub | Version control |

## Project Structure

```text
ETHindexer/
│
├── Indexer/
│   ├── src/
│   │   └── indexer.ts
│   ├── package.json
│   └── tsconfig.json
│
├── backend/
│   ├── src/
│   │   ├── lib/
│   │   │   └── prisma.ts
│   │   └── generated/
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

*Note: The structure above describes the current intended organization. Update it as the implementation evolves.*

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Rav1Chauhan/ETHindexer.git

cd ETHindexer
```

### 2. Install dependencies

Install dependencies separately in each application:

```bash
cd backend
npm install
```

```bash
cd ../Indexer
npm install
```

### 3. Environment Configuration

Create environment files according to the configuration used by each application.

Example:

**Backend `.env`**

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ethindexer"
PORT=5000
```

**Indexer `.env`**

```env
ETHEREUM_RPC_URL="YOUR_ETHEREUM_RPC_URL"
```

Never commit actual credentials, private keys, or API secrets.

### 4. Generate Prisma Client

From the backend directory:

```bash
cd backend
npx prisma generate
```

### 5. Run Database Migrations

```bash
npx prisma migrate dev
```

### 6. Run the Applications

Start the backend and indexer using their respective development scripts defined in their `package.json` files.

## Planned Features

- [ ] Ethereum RPC connection.
- [ ] Fetch historical Ethereum blocks.
- [ ] Extract transaction information.
- [ ] Store blocks and transactions in PostgreSQL.
- [ ] REST APIs for indexed blockchain data.
- [ ] ERC-20 Transfer event indexing.
- [ ] Real-time blockchain event monitoring.
- [ ] Historical synchronization.
- [ ] Duplicate event prevention.
- [ ] Blockchain reorganization (reorg) handling.
- [ ] Efficient database queries and pagination.

## Learning Objectives

This project is also intended to explore:

- Ethereum blockchain architecture.
- JSON-RPC communication.
- Transaction receipts and event logs.
- Blockchain data indexing.
- Database schema design.
- Backend architecture.
- Event-driven systems.
- Blockchain reorganization handling.

## Future Improvements

Potential future enhancements include:

- WebSocket-based real-time indexing.
- Support for multiple EVM-compatible networks.
- Advanced event filtering.
- Improved indexing performance.
- Monitoring and logging infrastructure.
- Docker-based deployment.

## Contribution

Contributions, suggestions, and feedback are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request.

## Author

**Ravi Chauhan**

- GitHub: [@Rav1Chauhan](https://github.com/Rav1Chauhan)
- Project: [ETHindexer](https://github.com/Rav1Chauhan/ETHindexer)

---

*Built to understand and explore Ethereum indexing infrastructure.*
