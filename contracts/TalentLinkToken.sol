// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TalentLink Vote Token
 * @notice ERC20 token for voting on creator profiles
 */
contract TalentLinkToken is ERC20, Ownable {
    
    // Token distribution constants
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18; // 1M tokens
    uint256 public constant CURATOR_ALLOCATION = 500000 * 10**18; // 500K for curators
    uint256 public constant COMMUNITY_ALLOCATION = 300000 * 10**18; // 300K for community
    uint256 public constant TEAM_ALLOCATION = 200000 * 10**18; // 200K for team
    
    // Faucet parameters
    uint256 public constant FAUCET_AMOUNT = 100 * 10**18; // 100 tokens per request
    uint256 public constant FAUCET_COOLDOWN = 24 hours;
    
    mapping(address => uint256) public lastFaucetClaim;
    
    event FaucetClaim(address indexed user, uint256 amount);
    
    constructor() ERC20("TalentLink Vote Token", "TLVT") {
        // Mint initial supply to contract owner
        _mint(owner(), INITIAL_SUPPLY);
    }
    
    /**
     * @notice Claim tokens from faucet (for demo/testnet purposes)
     */
    function claimFromFaucet() external {
        require(
            block.timestamp >= lastFaucetClaim[msg.sender] + FAUCET_COOLDOWN,
            "Must wait 24 hours between claims"
        );
        
        lastFaucetClaim[msg.sender] = block.timestamp;
        _transfer(owner(), msg.sender, FAUCET_AMOUNT);
        
        emit FaucetClaim(msg.sender, FAUCET_AMOUNT);
    }
    
    /**
     * @notice Distribute tokens to curators
     * @param curators Array of curator addresses
     * @param amounts Array of amounts to distribute
     */
    function distributeToCurators(
        address[] calldata curators,
        uint256[] calldata amounts
    ) external onlyOwner {
        require(curators.length == amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < curators.length; i++) {
            _transfer(owner(), curators[i], amounts[i]);
        }
    }
    
    /**
     * @notice Emergency token withdrawal (owner only)
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        _transfer(address(this), owner(), amount);
    }
    
    /**
     * @notice Get remaining time until next faucet claim
     * @param user User address
     * @return Time in seconds until next claim
     */
    function getTimeUntilNextClaim(address user) external view returns (uint256) {
        uint256 nextClaimTime = lastFaucetClaim[user] + FAUCET_COOLDOWN;
        if (block.timestamp >= nextClaimTime) {
            return 0;
        }
        return nextClaimTime - block.timestamp;
    }
    
    /**
     * @notice Check if user can claim from faucet
     * @param user User address
     * @return True if user can claim
     */
    function canClaimFromFaucet(address user) external view returns (bool) {
        return block.timestamp >= lastFaucetClaim[user] + FAUCET_COOLDOWN;
    }
}