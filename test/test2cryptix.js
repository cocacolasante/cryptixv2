const { expect } = require("chai");
const {ethers} = require("hardhat")

describe("Cryptix ERC 721 Tickets", () =>{
    let CryptixNFTContract, deployer, user1, user2, user3, band, venue, EscrowContract
    beforeEach(async () =>{
        const accounts = await ethers.getSigners()

        deployer = accounts[0]
        user1 = accounts[1]
        user2=accounts[2]
        user3 = accounts[3]
        band = accounts[4]
        venue = accounts[5]

        const escrowContractFactory = await ethers.getContractFactory("Escrow")
        EscrowContract = await escrowContractFactory.deploy()
        await EscrowContract.deployed()

        const cryptixContractFactory = await ethers.getContractFactory("Cryptickets")
        CryptixNFTContract = await cryptixContractFactory.deploy("Test1", "tst1", EscrowContract.address, band.address, venue.address, 100, 10)
        await CryptixNFTContract.deployed()

        await EscrowContract.connect(deployer).setTicketContract(CryptixNFTContract.address);

        // console.log(`Cryptix NFT Deployed to ${CryptixNFTContract.address}`)
    })
    it("checks the mint function", async () =>{
        await CryptixNFTContract.purchaseTickets(1, "SAMPLEURI", {value: 10})
        expect(await CryptixNFTContract.tokenURI(1)).to.equal("SAMPLEURI")
    })
})