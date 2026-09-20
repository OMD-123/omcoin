# 🪙 OmCoin (OMC) - Professional ERC-20 Token Ecosystem

OmCoin is a high-performance, transparent digital asset built on the Ethereum blockchain (Sepolia Testnet). This project demonstrates a full-stack Web3 implementation, from smart contract engineering to a professional user interface.

## 🚀 Features

- **Smart Contract**: Built with Solidity 0.8.20 and OpenZeppelin standards for maximum security.
- **Professional Portal**: A MetaMask-style dashboard for managing assets, checking balances, and performing peer-to-peer transfers.
- **Blockchain Integration**: Real-time interaction with the Sepolia network via `ethers.js`.
- **Developer Ready**: Structured for easy deployment and extension.

## 🛠️ Technical Stack

- **Blockchain**: Ethereum (Sepolia Testnet)
- **Smart Contract**: Solidity, Hardhat, OpenZeppelin
- **Frontend**: React, TypeScript, Tailwind CSS, Ethers.js
- **Wallet**: MetaMask

## 📦 Project Structure

- `/contracts`: The OmCoin smart contract.
- `/frontend`: The professional React-based dashboard.
- `/scripts`: Deployment scripts for the Sepolia network.
- `/test`: Comprehensive regression tests for token functionality.
- `portal.html`: A zero-build, standalone version of the portal for instant demonstration.

## ⚙️ Setup & Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/OMD-123/omcoin.git
   ```
2. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```
3. **Configure Environment**
   Create a `.env.local` in the `/frontend` directory:
   ```env
   VITE_CONTRACT_ADDRESS=your_contract_address_here
   VITE_NETWORK=Sepolia
   ```
4. **Run the Portal**
   ```bash
   npm run dev
   ```

## 📄 License
Distributed under the MIT License.

Created by **Om Dandagvhal** as a Proof-of-Work for Blockchain Engineering.
