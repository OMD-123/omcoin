const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OmCoin Token", function () {
  let OmCoin;
  let omc;
  let owner;
  let addr1;
  let addr2;

  const INITIAL_SUPPLY = 1000000;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    OmCoin = await ethers.getContractFactory("OmCoin");
    omc = await OmCoin.deploy();
    await omc.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name", async function () {
      expect(await omc.name()).to.equal("OmCoin");
    });

    it("Should set the correct symbol", async function () {
      expect(await omc.symbol()).to.equal("OMC");
    });

    it("Should set the correct decimals", async function () {
      expect(await omc.decimals()).to.equal(18);
    });

    it("Should mint the total supply to the owner", async function () {
      const ownerBalance = await omc.balanceOf(owner.address);
      expect(ownerBalance).to.equal(ethers.parseEther(INITIAL_SUPPLY.toString()));
    });

    it("Should have the correct total supply", async function () {
      expect(await omc.totalSupply()).to.equal(ethers.parseEther(INITIAL_SUPPLY.toString()));
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const amount = ethers.parseEther("100");
      await omc.transfer(addr1.address, amount);
      expect(await omc.balanceOf(addr1.address)).to.equal(amount);
      
      const ownerBalance = await omc.balanceOf(owner.address);
      expect(ownerBalance).to.equal(ethers.parseEther((INITIAL_SUPPLY - 100).toString()));
    });

    it("Should fail if sender does not have enough tokens", async function () {
      const amount = ethers.parseEther("2000000"); // More than total supply
      await expect(omc.connect(addr1).transfer(addr2.address, amount)).to.be.revertedWithCustomError(omc, "ERC20InsufficientBalance");
    });
  });

  describe("Allowances", function () {
    it("Should update allowance after approve()", async function () {
      const amount = ethers.parseEther("500");
      await omc.approve(addr1.address, amount);
      expect(await omc.allowance(owner.address, addr1.address)).to.equal(amount);
    });

    it("Should transfer tokens using transferFrom()", async function () {
      const amount = ethers.parseEther("100");
      await omc.approve(addr1.address, amount);
      
      // addr1 transfers from owner to addr2
      await omc.connect(addr1).transferFrom(owner.address, addr2.address, amount);
      
      expect(await omc.balanceOf(addr2.address)).to.equal(amount);
      expect(await omc.allowance(owner.address, addr1.address)).to.equal(0);
    });

    it("Should fail transferFrom if allowance is insufficient", async function () {
      const amount = ethers.parseEther("100");
      await omc.approve(addr1.address, ethers.parseEther("10")); // Only 10 allowed
      
      await expect(omc.connect(addr1).transferFrom(owner.address, addr2.address, amount))
        .to.be.revertedWithCustomError(omc, "ERC20InsufficientAllowance");
    });
  });
});