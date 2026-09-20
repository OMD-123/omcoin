# OmCoin (OMC)

OmCoin is an ERC-20 token and wallet dashboard for the Ethereum Sepolia testnet. The project includes the Solidity contract, Hardhat tests and a React interface with a MetaMask-inspired wallet experience.

## Features

- ERC-20 token named `OmCoin` with symbol `OMC`
- Fixed initial supply of 1,000,000 OMC
- Sepolia wallet connection through MetaMask
- Balance lookup, token metadata and network validation
- OMC transfers with recipient and amount validation
- Recent transfer activity stored locally in the browser
- Sepolia Etherscan links for the contract and transactions
- Standalone `portal.html` demo with no build step




## Run The Frontend

```bash
git clone https://github.com/OMD-123/omcoin.git
cd omcoin/frontend
npm install
npm run dev
```

Open the Vite URL, install MetaMask, switch to Sepolia and connect your wallet. Sepolia ETH is required to pay transaction gas.

To use the standalone demo, open `portal.html` in a browser with MetaMask installed.

## Smart Contract Development

From the repository root:

```bash
npm install
npx hardhat test
npx hardhat compile
```

To deploy a new instance, configure `RPC_URL` and `PRIVATE_KEY` only in a local `.env` file, then run:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Never commit private keys, RPC credentials or local environment files.

## Project Structure

```text
contracts/       OmCoin Solidity contract
frontend/        React + Vite wallet dashboard
scripts/         Hardhat deployment scripts
test/            Hardhat contract tests
portal.html      Standalone wallet demo
```

## License

MIT
