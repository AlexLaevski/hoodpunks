const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HoodPunks", function () {
  async function deployFixture() {
    const [owner, alice, bob] = await ethers.getSigners();
    const metadataLibrary = await ethers.deployContract("HoodPunksMetadata");
    await metadataLibrary.waitForDeployment();
    const factory = await ethers.getContractFactory("HoodPunks", {
      libraries: {
        HoodPunksMetadata: await metadataLibrary.getAddress(),
      },
    });
    const contract = await factory.deploy(10000, owner.address, "ipfs://hoodpunks/");

    return { contract, owner, alice, bob };
  }

  const txHashOne = ethers.keccak256(ethers.toUtf8Bytes("tx-one"));
  const txHashTwo = ethers.keccak256(ethers.toUtf8Bytes("tx-two"));
  const txHashThree = ethers.keccak256(ethers.toUtf8Bytes("tx-three"));

  it("uses the intended public mint price", async function () {
    const { contract } = await loadFixture(deployFixture);
    expect(await contract.PUBLIC_MINT_PRICE()).to.equal(
      ethers.parseEther("0.002")
    );
  });

  it("mints publicly from a unique tx hash with the right payment", async function () {
    const { contract, alice } = await loadFixture(deployFixture);
    await contract.setPublicMintOpen(true);

    await expect(
      contract.connect(alice).publicMint(txHashOne, {
        value: ethers.parseEther("0.002"),
      })
    ).to.changeEtherBalances(
      [alice, contract],
      [ethers.parseEther("-0.002"), ethers.parseEther("0.002")]
    );

    expect(await contract.totalMinted()).to.equal(1n);
    expect(await contract.publicMintedByWallet(alice.address)).to.equal(1n);
    expect(await contract.mintedTxHashes(txHashOne)).to.equal(true);
  });

  it("rejects minting the same tx hash twice", async function () {
    const { contract, alice } = await loadFixture(deployFixture);
    await contract.setPublicMintOpen(true);

    await contract.connect(alice).publicMint(txHashOne, {
      value: ethers.parseEther("0.002"),
    });

    await expect(
      contract.connect(alice).publicMint(txHashOne, {
        value: ethers.parseEther("0.002"),
      })
    ).to.be.revertedWithCustomError(contract, "SourceAlreadyMinted");
  });

  it("rejects public mints above 10 per wallet", async function () {
    const { contract, alice } = await loadFixture(deployFixture);
    await contract.setPublicMintOpen(true);

    for (let index = 0; index < 10; index += 1) {
      const sourceHash = ethers.keccak256(ethers.toUtf8Bytes(`wallet-cap-${index}`));
      await contract.connect(alice).publicMint(sourceHash, {
        value: ethers.parseEther("0.002"),
      });
    }

    await expect(
      contract.connect(alice).publicMint(txHashThree, {
        value: ethers.parseEther("0.002"),
      })
    ).to.be.revertedWithCustomError(contract, "ExceedsWalletLimit");
  });

  it("supports an eligible mint phase with a merkle root", async function () {
    const { contract, alice, bob } = await loadFixture(deployFixture);

    const aliceInner = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(["address"], [alice.address])
    );
    const bobInner = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(["address"], [bob.address])
    );

    const aliceLeaf = ethers.keccak256(
      ethers.solidityPacked(["bytes32"], [aliceInner])
    );
    const bobLeaf = ethers.keccak256(
      ethers.solidityPacked(["bytes32"], [bobInner])
    );

    const sortedLeaves = [aliceLeaf, bobLeaf].sort();
    const root = ethers.keccak256(
      ethers.concat(sortedLeaves.map((leaf) => ethers.getBytes(leaf)))
    );

    await contract.setEligibleRoot(root);
    await contract.setEligibleMintOpen(true);

    const proofForAlice =
      aliceLeaf === sortedLeaves[0] ? [bobLeaf] : [sortedLeaves[0]];

    await expect(
      contract.connect(alice).eligibleMint(txHashTwo, proofForAlice, {
        value: ethers.parseEther("0.002"),
      })
    ).not.to.be.reverted;
  });

  it("returns fully on-chain token metadata by default", async function () {
    const { contract, alice } = await loadFixture(deployFixture);
    await contract.setPublicMintOpen(true);

    await contract.connect(alice).publicMint(txHashOne, {
      value: ethers.parseEther("0.002"),
    });

    const tokenUri = await contract.tokenURI(0);
    expect(tokenUri.startsWith("data:application/json;base64,")).to.equal(true);
  });

  it("returns a contractURI payload even without external hosting", async function () {
    const { contract } = await loadFixture(deployFixture);

    const contractUri = await contract.contractURI();
    expect(contractUri.startsWith("data:application/json;base64,")).to.equal(true);
  });

  it("can fall back to an external base URI when on-chain metadata is disabled", async function () {
    const { contract, alice } = await loadFixture(deployFixture);
    await contract.setPublicMintOpen(true);

    await contract.connect(alice).publicMint(txHashOne, {
      value: ethers.parseEther("0.002"),
    });

    await contract.setOnchainMetadataEnabled(false);
    expect(await contract.tokenURI(0)).to.equal("ipfs://hoodpunks/0.json");
  });

  it("can permanently disable owner minting", async function () {
    const { contract, owner } = await loadFixture(deployFixture);

    await contract.disableOwnerMintPermanently();

    await expect(
      contract.ownerMint(owner.address, txHashOne)
    ).to.be.revertedWithCustomError(contract, "OwnerMintDisabled");
  });

  it("can permanently freeze metadata changes", async function () {
    const { contract } = await loadFixture(deployFixture);

    await contract.freezeMetadata();

    await expect(
      contract.setOnchainMetadataEnabled(false)
    ).to.be.revertedWithCustomError(contract, "MetadataFrozen");
    await expect(
      contract.setContractMetadataURI("https://example.com/contract.json")
    ).to.be.revertedWithCustomError(contract, "MetadataFrozen");
    await expect(
      contract.setCollectionPresentation(
        "https://hoodpunks.xyz",
        "https://hoodpunks.xyz/image.png",
        "https://hoodpunks.xyz/banner.png"
      )
    ).to.be.revertedWithCustomError(contract, "MetadataFrozen");
  });

  it("can permanently freeze mint rule changes", async function () {
    const { contract } = await loadFixture(deployFixture);

    await contract.freezeMintRules();

    await expect(
      contract.setPublicMaxPerWallet(12)
    ).to.be.revertedWithCustomError(contract, "MintRulesFrozen");
    await expect(
      contract.setEligibleMaxPerWallet(4)
    ).to.be.revertedWithCustomError(contract, "MintRulesFrozen");
    await expect(
      contract.setEligibleRoot(ethers.ZeroHash)
    ).to.be.revertedWithCustomError(contract, "MintRulesFrozen");
  });
});
