// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OmCoin (OMC)
 * @dev A professional, transparent ERC-20 token implementation.
 * This contract follows the ERC-20 standard, ensuring compatibility with 
 * all EVM wallets and explorers.
 */
contract OmCoin is ERC20, Ownable {
    // Initial supply: 1,000,000 OMC
    // We multiply by 10**decimals() because the blockchain handles 
    // tokens as whole integers (18 decimal places).
    uint256 private constant INITIAL_SUPPLY = 1000000 * 10**18;

    /**
     * @dev Constructor that initializes the token.
     * The initial supply is minted to the wallet that deploys the contract.
     */
    constructor() ERC20("OmCoin", "OMC") Ownable(msg.sender) {
        // _mint creates the tokens and assigns them to the deployer's address
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /**
     * @dev This contract is a standard ERC-20. 
     * No hidden minting, no taxes, and no backdoors.
     * Only the standard functions (transfer, approve, transferFrom) are available.
     */
}