# Mintok

This project demonstrates how to mint SPL tokens using blinks. It is built using [Next.js](https://nextjs.org) and leverages the `@solana/actions`, `@solana/web3.js`, and `@solana/spl-token` libraries to interact with the Solana blockchain. Live at [`Mintok`](https://mintok.ayushagr.me).

## What is it?

The main use of Mintok is to provide a simple and efficient way to mint SPL tokens on the Solana blockchain. This can be useful for developers building decentralized applications (dApps) on the Solana blockchain, as well as for users who need to create and manage their own SPL tokens.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Endpoints

### Mint SPL Tokens

**Endpoint:** `/api/actions/mint-spl`

**Method:** GET

**Query Parameters:**

- `tokenMint`: The public key of the token mint.
- `amount`: The amount of tokens to mint.

### Mint SPL Tokens (Devnet)

**Endpoint:** `/api/actions/mint-spl-dev`

**Method:** GET

**Query Parameters:**

- `tokenMint`: The public key of the token mint.
- `amount`: The amount of tokens to mint.
