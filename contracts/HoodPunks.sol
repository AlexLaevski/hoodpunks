// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {HoodPunksMetadata} from "./HoodPunksMetadata.sol";

contract HoodPunks is ERC721, Ownable, ReentrancyGuard, ERC2981 {
    using Strings for uint256;

    error MintInactive();
    error EligibleMintInactive();
    error InvalidMintSource();
    error ExceedsSupply();
    error ExceedsWalletLimit();
    error WrongPayment();
    error InvalidProof();
    error SourceAlreadyMinted();
    error WithdrawFailed();
    error NonexistentToken();
    error MetadataFrozen();
    error MintRulesFrozen();
    error OwnerMintDisabled();

    event BatchMetadataUpdate(uint256 fromTokenId, uint256 toTokenId);
    event ContractURIUpdated();
    event MetadataFrozenPermanently();
    event MintRulesFrozenPermanently();
    event OwnerMintDisabledPermanently();

    uint256 public constant PUBLIC_MINT_PRICE = 0.002 ether;
    uint256 public immutable maxSupply;
    uint256 public publicMaxPerWallet = 10;
    uint256 public eligibleMaxPerWallet = 2;

    uint256 public totalMinted;
    bool public publicMintOpen;
    bool public eligibleMintOpen;
    bool public onchainMetadataEnabled = true;
    bool public metadataFrozen;
    bool public mintRulesFrozen;
    bool public ownerMintDisabled;
    bytes32 public eligibleRoot;
    string public baseTokenURI;
    string public contractMetadataURI;
    string public collectionExternalLink;
    string public collectionImageURI;
    string public collectionBannerURI;

    mapping(address => uint256) public publicMintedByWallet;
    mapping(address => uint256) public eligibleMintedByWallet;
    mapping(bytes32 => bool) public mintedTxHashes;
    mapping(uint256 => bytes32) public tokenSourceHash;

    constructor(
        uint256 maxSupply_,
        address owner_,
        string memory baseTokenURI_
    ) ERC721("HOODPUNKS", "TXP") {
        maxSupply = maxSupply_;
        baseTokenURI = baseTokenURI_;
        transferOwnership(owner_);
    }

    function publicMint(bytes32 sourceTxHash) external payable nonReentrant {
        if (!publicMintOpen) revert MintInactive();
        _mintWithChecks(msg.sender, sourceTxHash, publicMintedByWallet, publicMaxPerWallet);
    }

    function eligibleMint(bytes32 sourceTxHash, bytes32[] calldata proof) external payable nonReentrant {
        if (!eligibleMintOpen) revert EligibleMintInactive();

        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(msg.sender))));
        if (!MerkleProof.verify(proof, eligibleRoot, leaf)) revert InvalidProof();

        _mintWithChecks(msg.sender, sourceTxHash, eligibleMintedByWallet, eligibleMaxPerWallet);
    }

    function ownerMint(address to, bytes32 sourceTxHash) external onlyOwner {
        if (ownerMintDisabled) revert OwnerMintDisabled();
        if (sourceTxHash == bytes32(0)) revert InvalidMintSource();
        if (mintedTxHashes[sourceTxHash]) revert SourceAlreadyMinted();
        mintedTxHashes[sourceTxHash] = true;
        _mintOne(to, sourceTxHash);
    }

    function setPublicMintOpen(bool isOpen) external onlyOwner {
        publicMintOpen = isOpen;
    }

    function setEligibleMintOpen(bool isOpen) external onlyOwner {
        eligibleMintOpen = isOpen;
    }

    function setEligibleRoot(bytes32 root) external onlyOwner {
        if (mintRulesFrozen) revert MintRulesFrozen();
        eligibleRoot = root;
    }

    function setPublicMaxPerWallet(uint256 nextLimit) external onlyOwner {
        if (mintRulesFrozen) revert MintRulesFrozen();
        if (nextLimit == 0) revert InvalidMintSource();
        publicMaxPerWallet = nextLimit;
    }

    function setEligibleMaxPerWallet(uint256 nextLimit) external onlyOwner {
        if (mintRulesFrozen) revert MintRulesFrozen();
        if (nextLimit == 0) revert InvalidMintSource();
        eligibleMaxPerWallet = nextLimit;
    }

    function setOnchainMetadataEnabled(bool enabled) external onlyOwner {
        if (metadataFrozen) revert MetadataFrozen();
        onchainMetadataEnabled = enabled;
        emit BatchMetadataUpdate(0, type(uint256).max);
    }

    function setBaseTokenURI(string calldata nextBaseTokenURI) external onlyOwner {
        if (metadataFrozen) revert MetadataFrozen();
        baseTokenURI = nextBaseTokenURI;
        emit BatchMetadataUpdate(0, type(uint256).max);
    }

    function setContractMetadataURI(string calldata nextContractMetadataURI) external onlyOwner {
        if (metadataFrozen) revert MetadataFrozen();
        contractMetadataURI = nextContractMetadataURI;
        emit ContractURIUpdated();
    }

    function setCollectionPresentation(
        string calldata nextExternalLink,
        string calldata nextImageURI,
        string calldata nextBannerURI
    ) external onlyOwner {
        if (metadataFrozen) revert MetadataFrozen();
        collectionExternalLink = nextExternalLink;
        collectionImageURI = nextImageURI;
        collectionBannerURI = nextBannerURI;
        emit ContractURIUpdated();
    }

    function setDefaultRoyalty(address recipient, uint96 feeNumerator) external onlyOwner {
        if (metadataFrozen) revert MetadataFrozen();
        _setDefaultRoyalty(recipient, feeNumerator);
        emit ContractURIUpdated();
    }

    function deleteDefaultRoyalty() external onlyOwner {
        if (metadataFrozen) revert MetadataFrozen();
        _deleteDefaultRoyalty();
        emit ContractURIUpdated();
    }

    function freezeMetadata() external onlyOwner {
        metadataFrozen = true;
        emit MetadataFrozenPermanently();
    }

    function freezeMintRules() external onlyOwner {
        mintRulesFrozen = true;
        emit MintRulesFrozenPermanently();
    }

    function disableOwnerMintPermanently() external onlyOwner {
        ownerMintDisabled = true;
        emit OwnerMintDisabledPermanently();
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (_ownerOf(tokenId) == address(0)) revert NonexistentToken();

        if (!onchainMetadataEnabled) {
            return bytes(baseTokenURI).length == 0
                ? ""
                : string.concat(baseTokenURI, tokenId.toString(), ".json");
        }

        bytes32 sourceHash = tokenSourceHash[tokenId];
        return HoodPunksMetadata.tokenURI(tokenId, sourceHash, collectionExternalLink);
    }

    function contractURI() external view returns (string memory) {
        return HoodPunksMetadata.contractURI(
            contractMetadataURI,
            collectionExternalLink,
            collectionImageURI,
            collectionBannerURI,
            _royaltyBpsString(),
            _royaltyRecipientString()
        );
    }

    function withdraw(address payable recipient) external onlyOwner nonReentrant {
        (bool sent, ) = recipient.call{value: address(this).balance}("");
        if (!sent) revert WithdrawFailed();
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function _mintWithChecks(
        address to,
        bytes32 sourceTxHash,
        mapping(address => uint256) storage mintedByWallet,
        uint256 walletLimit
    ) internal {
        if (sourceTxHash == bytes32(0)) revert InvalidMintSource();
        if (mintedTxHashes[sourceTxHash]) revert SourceAlreadyMinted();
        if (mintedByWallet[to] + 1 > walletLimit) revert ExceedsWalletLimit();
        if (msg.value != PUBLIC_MINT_PRICE) revert WrongPayment();

        mintedByWallet[to] += 1;
        mintedTxHashes[sourceTxHash] = true;
        _mintOne(to, sourceTxHash);
    }

    function _mintOne(address to, bytes32 sourceTxHash) internal {
        if (totalMinted + 1 > maxSupply) revert ExceedsSupply();

        uint256 tokenId = totalMinted;
        totalMinted += 1;
        tokenSourceHash[tokenId] = sourceTxHash;
        _safeMint(to, tokenId);
    }

    function _royaltyBpsString() internal view returns (string memory) {
        (address recipient, uint256 amount) = royaltyInfo(0, 10_000);
        if (recipient == address(0) || amount == 0) {
            return "0";
        }
        return amount.toString();
    }

    function _royaltyRecipientString() internal view returns (string memory) {
        (address recipient, uint256 amount) = royaltyInfo(0, 10_000);
        if (recipient == address(0) || amount == 0) {
            return "0x0000000000000000000000000000000000000000";
        }
        return Strings.toHexString(uint256(uint160(recipient)), 20);
    }
}
