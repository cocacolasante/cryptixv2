const { expect } = require("chai");
const {ethers} = require("hardhat")
const cryptixAbi = require("./testAbi/CryptixAbi.json")
const escrowAbi = require("./testAbi/EscrowAbi.json")
const controllerAbi = require("./testAbi/ControlShowAbi.json")

const nullAddress = "0x0000000000000000000000000000000000000000"

describe("Creator Contract", () =>{
    let CreatorContract, deployer, user1, user2, user3, venue, band, CreateController, TixCreator

    beforeEach(async () =>{
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]
        user3 = accounts[3]
        venue = accounts[4]
        band = accounts[5]

        const controllerContractFactory = await ethers.getContractFactory("CreateController")
        CreateController = await controllerContractFactory.deploy()
        await CreateController.deployed()

        const tickCreateContractorFactory = await ethers.getContractFactory("CreateTickets")
        TixCreator = await tickCreateContractorFactory.deploy()
        await TixCreator.deployed()
        

        const creatorContractFactory = await ethers.getContractFactory("CreatorContract")
        CreatorContract = await creatorContractFactory.deploy(CreateController.address, TixCreator.address)
        await CreatorContract.deployed()

        // console.log(`Creator deployed to ${CreatorContract.address}`)

    })
    it("checks the createControllerAddress", async () =>{
        expect(await CreatorContract.createContAdd()).to.equal(CreateController.address)
    })
    describe("Create Show", () =>{
        let firstShowStruct, TicketsFirstShow, EscrowFirstShow, endingDate, blockNumBefore, blockBefore, timestampBefore, ControllerFirstShow
        beforeEach(async () =>{
            await CreatorContract.connect(user1).createShow("T-swiz", "TSZ", band.address, venue.address, 10, 100 )
            // console.log(ControllerContract);
            // console.log(ControllerContract.address)
            firstShowStruct = await CreatorContract.allShows(1)

            blockNumBefore = await ethers.provider.getBlockNumber();
            blockBefore = await ethers.provider.getBlock(blockNumBefore);
            timestampBefore = blockBefore.timestamp;
            endingDate = (timestampBefore) + (10);

            TicketsFirstShow = new ethers.Contract(firstShowStruct.ticketAddress, cryptixAbi.abi, ethers.provider)
            EscrowFirstShow = new ethers.Contract(firstShowStruct.escrowAddress, escrowAbi.abi, ethers.provider)
            ControllerFirstShow = new ethers.Contract(firstShowStruct.controllerContract, controllerAbi.abi, ethers.provider)

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
        it("checks the escrow and ticket contract end date was set ", async () =>{
            expect(await TicketsFirstShow.endDate()).to.equal(endingDate)
        })
        it("checks the admin of the ticket contract", async () =>{
            expect(await TicketsFirstShow.admin()).to.equal(ControllerFirstShow.address);
        })
        it("checks the complete show function", async () =>{
            await TicketsFirstShow.connect(user2).purchaseTickets(1, {value: 100})
            await ControllerFirstShow.connect(venue).completeShow()
            expect(await ethers.provider.getBalance(band.address)).to.equal("10000000000000000000010")
        })
        it("checks the refund show function", async () =>{
            await TicketsFirstShow.connect(user3).purchaseTickets(1, {value: 100})
            let initialBalUser3 = await ethers.provider.getBalance(user3.address)
            // eslint-disable-next-line no-undef
            initialBalUser3 = BigInt(initialBalUser3)
            await ControllerFirstShow.connect(venue).refundShow()

            // eslint-disable-next-line no-undef
            expect(await ethers.provider.getBalance(user3.address)).to.equal(initialBalUser3 + BigInt(100))

        })
        it("checks the reschedule and refund functions", async () =>{
            await TicketsFirstShow.connect(user2).purchaseTickets(1, {value: 100})
            let initialBalUser2 = await ethers.provider.getBalance(user2.address)

            await ControllerFirstShow.connect(venue).rescheduleShow(100)
            await TicketsFirstShow.connect(user2).requestRefund();


            expect(await ethers.provider.getBalance(user3.address)).is.greaterThan(initialBalUser2)
        })
        it("checks the change max ticket supply", async () =>{
            await ControllerFirstShow.connect(venue).setNewMaxSupply(1000)
            expect(await TicketsFirstShow.maxSupply()).to.equal(1000);

        })
        it("checks the base uri can be set", async () =>{
            await ControllerFirstShow.connect(venue).setNewBaseUri("SAMPLE2")
            expect(await TicketsFirstShow.baseUri()).to.equal("SAMPLE2")
        })
      
    })
})