
const { ethers } = require("hardhat");
const hre = require("hardhat");



async function main() {
  const createControllerFactory = await hre.ethers.getContractFactory("CreateController")
  const CreateController = await createControllerFactory.deploy()
  await CreateController.deployed()

  console.log(`Create Controller Deployed to ${CreateController.address}`)

  const createTicketContractFactory = await hre.ethers.getContractFactory("CreateTickets")
  const CreateTickets = await createTicketContractFactory.deploy()
  await CreateTickets.deployed()

  console.log(`Create Tickets Deployed to ${CreateTickets.address}`)

  const creatorContractFactory = await hre.ethers.getContractFactory("CreatorContract")
  const CreatorContract = await creatorContractFactory.deploy(CreateController.address, CreateTickets.address)
  await CreatorContract.deployed()

  console.log(`Creator Contract Deployed to ${CreatorContract.address}`)

  

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
