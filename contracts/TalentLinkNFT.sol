// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title TalentLink Creator Profile NFT
 * @notice NFT contract for minting creator profiles with metadata
 */
contract TalentLinkNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    // Mapping from token ID to creator profile metadata
    mapping(uint256 => string) private _tokenURIs;
    
    // Mapping from wallet address to token ID (one NFT per creator)
    mapping(address => uint256) public creatorToTokenId;
    
    // Mapping to check if an address has minted
    mapping(address => bool) public hasMinted;
    
    event ProfileMinted(address indexed creator, uint256 indexed tokenId, string tokenURI);
    
    constructor() ERC721("TalentLink Creator", "TLC") {}
    
    /**
     * @notice Mint a creator profile NFT
     * @param to The address to mint the NFT to
     * @param tokenURI The metadata URI for the NFT
     */
    function mintProfile(address to, string memory tokenURI) public returns (uint256) {
        require(!hasMinted[to], "Address has already minted a profile NFT");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        creatorToTokenId[to] = newTokenId;
        hasMinted[to] = true;
        
        emit ProfileMinted(to, newTokenId, tokenURI);
        
        return newTokenId;
    }
    
    /**
     * @notice Set the token URI for a specific token ID
     * @param tokenId The token ID
     * @param tokenURI The metadata URI
     */
    function _setTokenURI(uint256 tokenId, string memory tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = tokenURI;
    }
    
    /**
     * @notice Get the token URI for a specific token ID
     * @param tokenId The token ID
     * @return The metadata URI
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }
    
    /**
     * @notice Get the total number of minted tokens
     * @return The total supply
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
    
    /**
     * @notice Update the metadata URI for a token (only token owner)
     * @param tokenId The token ID
     * @param newTokenURI The new metadata URI
     */
    function updateTokenURI(uint256 tokenId, string memory newTokenURI) public {
        require(ownerOf(tokenId) == msg.sender, "Only token owner can update URI");
        _setTokenURI(tokenId, newTokenURI);
    }
    
    /**
     * @notice Override transfer to prevent transfers (soulbound)
     * @dev Makes the NFT non-transferable except for minting
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        require(from == address(0), "Profile NFTs are soulbound and cannot be transferred");
        super._beforeTokenTransfer(from, to, tokenId);
    }
}