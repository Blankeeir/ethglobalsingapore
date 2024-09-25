# Technical Proposal for Attornato MVP Development

**Date:** [Insert Current Date]

## Table of Contents

1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [Technical Architecture](#technical-architecture)
   - [Frontend](#frontend)
   - [Backend](#backend)
   - [Blockchain Networks](#blockchain-networks)
4. [Key Components](#key-components)
   - [User Authentication and Wallet Connection](#user-authentication-and-wallet-connection)
   - [User Dashboard](#user-dashboard)
   - [Marketplace Exploration](#marketplace-exploration)
   - [Asset Attestation Process](#asset-attestation-process)
   - [Asset Selling Process](#asset-selling-process)
5. [Integration of Sponsor Libraries](#integration-of-sponsor-libraries)
6. [Smart Contract Development](#smart-contract-development)
7. [Implementation Plan](#implementation-plan)
   - [Phase 1: Setup and Configuration](#phase-1-setup-and-configuration)
   - [Phase 2: Frontend Development](#phase-2-frontend-development)
   - [Phase 3: Backend and Smart Contracts](#phase-3-backend-and-smart-contracts)
   - [Phase 4: Integration and Testing](#phase-4-integration-and-testing)
   - [Phase 5: Deployment](#phase-5-deployment)
8. [Project Timeline and Milestones](#project-timeline-and-milestones)
9. [Risk Management](#risk-management)
10. [Conclusion](#conclusion)

---

## Introduction

This technical proposal outlines the development plan for **Attornato**, a decentralized platform enabling users to customize and execute legal agreements for trading real-world assets (RWAs) using blockchain technology. The MVP aims to demonstrate core functionalities such as asset tokenization, smart contract-based agreements, and verification through a decentralized network involving professional legal nodes.

## Project Overview

Attornato will:

- Allow users to tokenize their real-world assets.
- Enable creation and management of smart contract-based agreements.
- Ensure verification and compliance via decentralized attestation processes.
- Integrate multiple blockchain technologies and protocols for seamless operation.

## Technical Architecture

### Frontend

- **Framework:** React.js (with Next.js for server-side rendering if needed)
- **State Management:** Redux or Context API
- **UI Libraries:** Material-UI or Tailwind CSS
- **Authentication:** Dynamic SDK
- **Wallet Connection:** WalletConnect

### Backend

- **Language:** Node.js with Express.js
- **Database:** No traditional database; user data stored on-chain
- **APIs:** Interaction with blockchain via Web3.js or Ethers.js
- **Off-chain Storage:** IPFS for storing asset metadata and images

### Blockchain Networks

- **Primary Network:** Gnosis Chain (due to Sign Protocol support)
- **Secondary Network:** Flow Blockchain (for hackathon prize eligibility)
- **Smart Contract Languages:**
  - **Gnosis Chain:** Solidity
  - **Flow Blockchain:** Cadence

## Key Components

### User Authentication and Wallet Connection

- **Dynamic SDK Integration:**
  - Users can sign up/login using Dynamic.
  - Supports OAuth and other authentication methods.
- **WalletConnect Integration:**
  - Users can connect their wallets securely.
  - Supports multiple wallet providers (MetaMask, Trust Wallet, etc.).

### User Dashboard

- **Historical Transactions:**
  - **Purchases:**
    - Seller's address, tokens transferred, gas fees, timestamp, asset info, attestation status, verifying node.
  - **Sales:**
    - Buyer's address, tokens transferred, gas fees, timestamp, asset info, attestation status, verifying node.
  - **Verifications:**
    - Parties involved, tokens transferred, gas fees, timestamp, asset info, attestation outcome.

### Marketplace Exploration

- **Asset Listings:**
  - Display assets available for sale.
  - Asset cards show price and attestation status.
- **Attestation Status:**
  - Historical attestations (success/failure, timestamps).
  - Current status: "Open to Attestation" or "Not Open to Attestation".

### Asset Attestation Process

- **Initiation:**
  - Users can trigger attestation by paying a fee.
  - Fee deducted directly from the user's wallet.
- **Schema Creation (Sign Protocol):**
  - Schema with fields: image (string), year (int), length (float), price (float).
- **Binding Contract:**
  - Created after schema creation.
  - Automated via Chainlink Automation and Functions.
- **1inch ERC-20 Token Plugin:**
  - Ensures user has sufficient balance.
  - Tokens remain in the wallet but are locked for the attestation process.

### Asset Selling Process

- **Asset Upload:**
  - Sellers provide asset details: image, year, length, price.
- **Tokenization:**
  - Minting of dYACHT NFT via Chainlink.
  - NFT swapped for USDC at current market rates.
  - USDC held in the contract, not immediately transferred to the seller.
- **Marketplace Update:**
  - Asset listed with no historical attestations.

## Integration of Sponsor Libraries

- **Dynamic SDK:** For user authentication.
- **WalletConnect:** For secure wallet connections.
- **Sign Protocol SDK:** For creating schemas and managing attestations.
- **Chainlink Automation & Functions:** For automating smart contracts.
- **1inch API/SDK:** For token management and financial functionalities.

## Smart Contract Development

- **Contracts on Gnosis Chain:**
  - Written in Solidity.
  - Include marketplace logic, asset tokenization, attestation processes.
- **Contracts on Flow Blockchain:**
  - Written in Cadence.
  - Adapted versions of Gnosis contracts to fit Flow's architecture.
- **Security Audits:**
  - Internal code reviews.
  - Utilize tools like MythX or Slither for static analysis.

## Implementation Plan

### Phase 1: Setup and Configuration

- **Development Environment:**
  - Configure IDEs with Solidity and Cadence support.
  - Set up version control with Git and GitHub.
- **Blockchain Nodes:**
  - Connect to Gnosis and Flow testnets.
  - Set up local nodes if necessary.

### Phase 2: Frontend Development

- **Authentication Flow:**
  - Integrate Dynamic SDK.
  - Implement login/signup pages.
- **Wallet Connection:**
  - Integrate WalletConnect.
  - Test connections with multiple wallets.
- **User Dashboard:**
  - Design UI for displaying historical data.
  - Implement components for purchases, sales, verifications.
- **Marketplace:**
  - Develop asset listing pages.
  - Implement asset cards with dynamic data.

### Phase 3: Backend and Smart Contracts

- **Smart Contract Development:**
  - Write contracts for asset tokenization, marketplace logic, attestation.
  - Implement on Gnosis Chain first, then adapt to Flow.
- **Integration with Sign Protocol:**
  - Use SDK to create and manage schemas.
  - Ensure compatibility with smart contracts.
- **Chainlink Integration:**
  - Set up Automation and Functions.
  - Write off-chain code for contract automation.

### Phase 4: Integration and Testing

- **Frontend-Backend Integration:**
  - Connect frontend components to smart contract functions.
  - Use Web3.js or Ethers.js for blockchain interactions.
- **Testing:**
  - Unit tests for smart contracts using Truffle or Hardhat.
  - End-to-end tests for user flows.
  - Testnet deployments for real-world testing.

### Phase 5: Deployment

- **Mainnet Deployment:**
  - Deploy smart contracts to Gnosis Chain and Flow mainnets.
- **Frontend Hosting:**
  - Host the frontend application on services like Netlify or Vercel.
- **Post-Deployment Testing:**
  - Verify all functionalities in the production environment.
  - Monitor for any issues and fix promptly.

## Project Timeline and Milestones

| Phase                         | Duration  | Milestones                                    |
|-------------------------------|-----------|-----------------------------------------------|
| Phase 1: Setup and Configuration | 1 Week    | Environment set up, tools configured          |
| Phase 2: Frontend Development    | 2 Weeks   | UI components ready, authentication working   |
| Phase 3: Backend and Smart Contracts | 2 Weeks   | Smart contracts developed and tested          |
| Phase 4: Integration and Testing  | 1 Week    | Full integration, all tests passing           |
| Phase 5: Deployment               | 1 Week    | Application deployed, final testing completed |

**Total Duration:** Approximately 7 weeks

## Risk Management

- **Integration Challenges:**
  - **Mitigation:** Allocate extra time for integrating complex SDKs and APIs.
- **Smart Contract Bugs:**
  - **Mitigation:** Conduct thorough testing and code reviews.
- **Blockchain Network Issues:**
  - **Mitigation:** Use testnets extensively before mainnet deployment.
- **Security Vulnerabilities:**
  - **Mitigation:** Follow best practices and consider external audits if feasible.
- **Regulatory Compliance:**
  - **Mitigation:** Consult legal experts regarding RWA tokenization.

## Conclusion

This proposal outlines a comprehensive plan to develop the Attornato MVP. By leveraging blockchain technology and integrating key sponsor libraries, we aim to deliver a functional and secure platform for trading real-world assets. The project plan is designed to be achievable within the specified timeframe and addresses potential risks with appropriate mitigation strategies.

---

**Next Steps:**

- **Team Review:** Discuss the proposal in a team meeting.
- **Task Allocation:** Assign responsibilities to team members.
- **Kick-off:** Begin Phase 1 as per the implementation plan.

**Note:** Regular updates and meetings will be scheduled to ensure the project stays on track and any issues are promptly addressed.

### Deployed smart contract

[0x82871BC35482F3453AF61Ff23C0D97fAc6d0d0FD](https://sepolia.etherscan.io/address/0x82871BC35482F3453AF61Ff23C0D97fAc6d0d0FD)




#### Chainlink

We use Chainlink to tokenize RWAs

#### Dynamic

We use Dynamic for seemless user onboarding
