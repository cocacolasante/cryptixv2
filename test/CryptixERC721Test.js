const { expect } = require("chai");
const {ethers} = require("hardhat")

describe("Cryptix ERC 721 Tickets", () =>{
    let CryptixNFTContract, deployer, user1, user2, user3, band, venue
    beforeEach(async () =>{
        const accounts = await ethers.getSigners()

        deployer = accounts[0]
        user1 = accounts[1]
        user2=accounts[2]
        user3 = accounts[3]
        band = accounts[4]
        venue = accounts[5]

        const cryptixContractFactory = await ethers.getContractFactory("Cryptickets")
        CryptixNFTContract = await cryptixContractFactory.deploy("Test1", "tst1")
        await CryptixNFTContract.deployed()

        // console.log(`Cryptix NFT Deployed to ${CryptixNFTContract.address}`)
    })
    it("checks the admin", async () =>{
        expect(await CryptixNFTContract.returnAdmin()).to.equal(deployer.address)
    })
    it("checks the mint function", async () =>{
        await CryptixNFTContract.connect(user1).purchaseTickets(1)
        expect(await CryptixNFTContract.balanceOf(user1.address)).to.equal(1)
    })
    it("checks the multiple mint function", async () =>{
        await CryptixNFTContract.connect(user1).purchaseTickets(3)
        expect(await CryptixNFTContract.balanceOf(user1.address)).to.equal(3)
    })
    it("checks an event was emited", async () =>{
        expect(await CryptixNFTContract.connect(user1).purchaseTickets(3)).to.emit("Cryptickets", "TicketsPurchased")
    })

})