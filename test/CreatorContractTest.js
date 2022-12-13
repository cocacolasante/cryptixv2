const { expect } = require("chai");
const {ethers} = require("hardhat")
const cryptixAbi = require("./testAbi/CryptixAbi.json")
const escrowAbi = require("./testAbi/EscrowAbi.json")

const nullAddress = "0x0000000000000000000000000000000000000000"

describe("Creator Contract", () =>{
    let CreatorContract, deployer, user1, user2, user3, venue, band

    beforeEach(async () =>{
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]
        user3 = accounts[3]
        venue = accounts[4]
        band = accounts[5]

        const creatorContractFactory = await ethers.getContractFactory("CreatorContract")
        CreatorContract = await creatorContractFactory.deploy()
        await CreatorContract.deployed()

        // console.log(`Creator deployed to ${CreatorContract.address}`)

    })
    it("checks the admin", async () =>{
        expect(await CreatorContract.admin())
    })
    describe("Create Show", () =>{
        let firstShowStruct, TicketsFirstShow, EscrowFirstShow
        beforeEach(async () =>{
            await CreatorContract.connect(user1).createShow("T-Swizzle", "TSZ", band.address, venue.address, 10, 100 )
            firstShowStruct = await CreatorContract.allShows(1)

            TicketsFirstShow = new ethers.Contract(firstShowStruct.ticketAddress, cryptixAbi.abi, ethers.provider)
            EscrowFirstShow = new ethers.Contract(firstShowStruct.escrowAddress, escrowAbi.abi, ethers.provider)

        })
        it("checks the show number", async () =>{
            expect(await CreatorContract.showNumber()).to.equal(1)
        })
        it("checks the escrow contract was created", async () =>{
            expect(firstShowStruct.escrowAddress).to.not.equal(nullAddress)
        })
        it("checks the ticket contract was created", async () =>{
            expect(firstShowStruct.ticketAddress).to.not.equal(nullAddress)
        })
        it("checks the band, venue, and bool", async () =>{
            expect(firstShowStruct.completed).to.equal(false)
            expect(firstShowStruct.band).to.equal(band.address)
            expect(firstShowStruct.venue).to.equal(venue.address)
        })
        it("checks the ticket price was set", async () =>{

            expect(await TicketsFirstShow.ticketPrice()).to.equal(100)
        })
        it("checks the escrow contract end date was set ", async () =>{
            expect(await EscrowFirstShow.showDate()).to.equal()
        })
    })
})