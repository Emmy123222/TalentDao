// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TalentLinkToken.sol";
import "./TalentLinkNFT.sol";

/**
 * @title TalentLink DAO Voting Contract
 * @notice Handles voting on creator profiles using TLVT tokens
 */
contract TalentLinkDAO is ReentrancyGuard, Ownable {
    
    TalentLinkToken public immutable voteToken;
    TalentLinkNFT public immutable profileNFT;
    
    // Voting parameters
    uint256 public constant MIN_VOTE_AMOUNT = 1 * 10**18; // 1 token minimum
    uint256 public constant MAX_VOTE_AMOUNT = 10 * 10**18; // 10 tokens maximum
    uint256 public constant VOTING_COOLDOWN = 1 hours; // 1 hour between votes for same creator
    
    // Vote tracking
    struct Vote {
        address curator;
        address creator;
        uint256 amount;
        uint256 timestamp;
        uint256 tokenId;
    }
    
    // Mappings
    mapping(address => uint256) public creatorVoteCounts; // creator => total votes
    mapping(address => Vote[]) public creatorVotes; // creator => votes array
    mapping(address => mapping(address => uint256)) public lastVoteTime; // curator => creator => timestamp
    
    // Events
    event VoteCast(
        address indexed curator,
        address indexed creator,
        uint256 indexed tokenId,
        uint256 amount,
        uint256 timestamp
    );
    
    event CreatorRankingUpdated(address indexed creator, uint256 newRank);
    
    constructor(address _voteToken, address _profileNFT) {
        voteToken = TalentLinkToken(_voteToken);
        profileNFT = TalentLinkNFT(_profileNFT);
    }
    
    /**
     * @notice Vote for a creator profile
     * @param creator The creator's address
     * @param amount The number of tokens to vote with
     */
    function voteForCreator(address creator, uint256 amount) external nonReentrant {
        require(creator != address(0), "Invalid creator address");
        require(creator != msg.sender, "Cannot vote for yourself");
        require(amount >= MIN_VOTE_AMOUNT && amount <= MAX_VOTE_AMOUNT, "Invalid vote amount");
        require(
            block.timestamp >= lastVoteTime[msg.sender][creator] + VOTING_COOLDOWN,
            "Must wait before voting for same creator again"
        );
        
        // Check if creator has minted a profile NFT
        require(profileNFT.hasMinted(creator), "Creator must have a profile NFT");
        uint256 tokenId = profileNFT.creatorToTokenId(creator);
        
        // Transfer tokens from curator to contract
        require(
            voteToken.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );
        
        // Record the vote
        Vote memory newVote = Vote({
            curator: msg.sender,
            creator: creator,
            amount: amount,
            timestamp: block.timestamp,
            tokenId: tokenId
        });
        
        creatorVotes[creator].push(newVote);
        creatorVoteCounts[creator] += amount;
        lastVoteTime[msg.sender][creator] = block.timestamp;
        
        emit VoteCast(msg.sender, creator, tokenId, amount, block.timestamp);
    }
    
    /**
     * @notice Get total votes for a creator
     * @param creator The creator's address
     * @return Total vote count
     */
    function getCreatorVotes(address creator) external view returns (uint256) {
        return creatorVoteCounts[creator];
    }
    
    /**
     * @notice Get all votes for a creator
     * @param creator The creator's address
     * @return Array of votes
     */
    function getCreatorVoteHistory(address creator) external view returns (Vote[] memory) {
        return creatorVotes[creator];
    }
    
    /**
     * @notice Get number of votes cast for a creator
     * @param creator The creator's address
     * @return Number of individual votes
     */
    function getCreatorVoteHistoryLength(address creator) external view returns (uint256) {
        return creatorVotes[creator].length;
    }
    
    /**
     * @notice Check if curator can vote for creator
     * @param curator The curator's address
     * @param creator The creator's address
     * @return True if curator can vote
     */
    function canVoteForCreator(address curator, address creator) external view returns (bool) {
        return block.timestamp >= lastVoteTime[curator][creator] + VOTING_COOLDOWN;
    }
    
    /**
     * @notice Get time until next vote for creator
     * @param curator The curator's address
     * @param creator The creator's address
     * @return Time in seconds until next vote allowed
     */
    function getTimeUntilNextVote(address curator, address creator) external view returns (uint256) {
        uint256 nextVoteTime = lastVoteTime[curator][creator] + VOTING_COOLDOWN;
        if (block.timestamp >= nextVoteTime) {
            return 0;
        }
        return nextVoteTime - block.timestamp;
    }
    
    /**
     * @notice Emergency function to withdraw accumulated tokens (owner only)
     * @param amount Amount to withdraw
     */
    function emergencyWithdrawTokens(uint256 amount) external onlyOwner {
        require(voteToken.transfer(owner(), amount), "Token transfer failed");
    }
    
    /**
     * @notice Get contract token balance
     * @return Token balance of this contract
     */
    function getContractTokenBalance() external view returns (uint256) {
        return voteToken.balanceOf(address(this));
    }
}