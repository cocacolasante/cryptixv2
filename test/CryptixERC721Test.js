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
        CryptixNFTContract = await cryptixContractFactory.deploy("Test1", "tst1", EscrowContract.address, band.address, venue.address)
        await CryptixNFTContract.deployed()

        await EscrowContract.connect(deployer).setTicketContract(CryptixNFTContract.address);

        // console.log(`Cryptix NFT Deployed to ${CryptixNFTContract.address}`)
    })
    it("checks the admin", async () =>{
        expect(await CryptixNFTContract.returnAdmin()).to.equal(deployer.address)
    })
    it("checks the mint function", async () =>{
        await CryptixNFTContract.connect(user1).purchaseTickets(1, {value: "100"})
        expect(await CryptixNFTContract.balanceOf(user1.address)).to.equal(1)
    })
    it("checks the multiple mint function", async () =>{
        await CryptixNFTContract.connect(user1).purchaseTickets(3, {value: "100"})
        expect(await CryptixNFTContract.balanceOf(user1.address)).to.equal(3)
    })
    it("checks an event was emited", async () =>{
        expect(await CryptixNFTContract.connect(user1).purchaseTickets(3, {value: "100"})).to.emit("Cryptickets", "TicketsPurchased")
    })
    describe("minting function", async () =>{
        beforeEach(async () =>{
            await CryptixNFTContract.connect(user1).purchaseTickets(3, {value: "100"})
            await CryptixNFTContract.connect(user2).purchaseTickets(3, {value: "100"})

        })
        it("checks the addresses added to array", async () =>{
            expect(await CryptixNFTContract.allOwners(0)).to.equal(user1.address)
            expect(await CryptixNFTContract.allOwners(1)).to.equal(user2.address)
        })
        it("checks the return current owners", async () =>{
            const allOwnersArray = (await CryptixNFTContract.returnAllOwners())
            expect(await allOwnersArray.length).to.equal(2)
        })
        it("checks addy added to array from transferfrom function", async () =>{
            await CryptixNFTContract.connect(user1).setApprovalForAll(CryptixNFTContract.address, true)

            await CryptixNFTContract.connect(user1).transferFrom(user1.address, user3.address, 1)
            expect(await CryptixNFTContract.allOwners(2)).to.equal(user3.address)

        })
        it("checks the balance of the escrow contract", async () =>{
            expect(await ethers.provider.getBalance(EscrowContract.address)).to.equal(200)
        })
        // it("checks the refund function for original ticket purchasers", async () =>{
        //     let initialBalanceUser1 = await ethers.provider.getBalance(user1.address)
        //     initialBalanceUser1 = BigInt(initialBalanceUser1);
        //     await CryptixNFTContract.connect(deployer).setCancelledShow()
        //     await CryptixNFTContract.connect(deployer).refundAllTickets()

        //     expect(await ethers.provider.getBalance(user1.address)).to.equal(initialBalanceUser1 + BigInt(100))

        // })
    })

})