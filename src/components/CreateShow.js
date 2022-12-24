import { ethers } from 'ethers'
import { create as ipfsClient} from "ipfs-http-client"
import { useState, useEffect } from 'react'
import env from "react-dotenv";
import { Buffer } from "buffer";
import CREATE_SHOW_ADDRESS from '../addresses/createShow'
import createContractAbi from "../abiAssets/createContractAbi.json"
import controllerAbi from "../abiAssets/controllerAbi.json"

const auth =
  'Basic ' + Buffer.from(env.PROJECT_ID + ':' + env.PROJECT_CODE).toString('base64');

const client = ipfsClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
        },
    });

const toWeiStr = (num) => ethers.utils.parseEther(num.toString())
const toWeiInt = (num) => ethers.utils.parseEther(num) 
const fromWei = (num) => ethers.utils.formatEther(num)


const CreateShow = () => {
    const [showName, setShowName ] = useState()
    const [showSymbol, setShowSymbol] = useState()
    const [bandAddress, setBandAddress] = useState()
    const [venueAddress, setVenueAddress] = useState()
    const [showDate, setShowDate] = useState()
    const [showPrice, setShowPrice] = useState()
    const [maxSupply, setMaxSupply] = useState()
    const [ticketNFTArt, setTicketNFTArt] = useState()
    const [controller, setController] = useState()
    const [ticketAddress, setTicketAddress] = useState()


    const uploadToIPFS = async (e) =>{
        e.preventDefault()
        const files = e.target.files;

        if (!files) {
            return alert("No files selected");
          }

        const file = e.target.files[0]

        try{
            const result = await client.add(file)

            // create json nft meta data with ticketnftart as image meta data with ticket number aand other meta data

            setTicketNFTArt(`https://cryptix.infura-ipfs.io/ipfs/${result.path}`)

            console.log(ticketNFTArt)
            console.log(`https://cryptix.infura-ipfs.io/ipfs/${result.path}`)

            
            let txn, res
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            const ControllerContract = new ethers.Contract(controller, controllerAbi.abi, signer )


            txn = await ControllerContract.setNewBaseUri(`https://cryptix.infura-ipfs.io/ipfs/${result.path}`)
            res = await txn.wait()
            


            if(res.status === 1){
                console.log("success")
                alert("Success, please refresh page")
            }else{
                console.log("failed")
            }
            



        }catch(error){
            console.log(error)
        }
    }

    const _convertDateTime = () =>{
        const endDate = new Date(showDate)
        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date+' '+time;
        const currentDateTime = new Date(dateTime)
        let seconds = Math.abs(endDate.getTime() - currentDateTime.getTime())/1000;

        return seconds
        
    }


    const createNewShow = async (e) =>{
        e.preventDefault()

        const secondsToShow = _convertDateTime()
        console.log(secondsToShow)
        const convertedShowPrice = toWeiStr(showPrice).toString()
        console.log(convertedShowPrice)

        
        try{

            const {ethereum} = window;
            if(ethereum){

                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
    
                const CreateShowContract = new ethers.Contract(CREATE_SHOW_ADDRESS, createContractAbi.abi, signer )
    
                const tx = await CreateShowContract.createShow(showName, showSymbol, bandAddress, venueAddress, secondsToShow, convertedShowPrice)
                

                const receipt = await tx.wait()

                if(receipt.status === 1){
                    console.log("success")
                    alert("success please wait for next transaction")
                }else{
                    alert("failed")
                }
                const currentShowNum = await CreateShowContract.showNumber()
                const currentShowStruct = await CreateShowContract.allShows(currentShowNum)
                const ControllerAddress = currentShowStruct.controllerContract;
                console.log(ControllerAddress)

                setController(ControllerAddress)
                setTicketAddress(currentShowStruct.ticketAddress)
                let txn, res
    
                const ControllerContract = new ethers.Contract(ControllerAddress, controllerAbi.abi, signer )

                txn = await ControllerContract.setNewMaxSupply(maxSupply)
                res = await txn.wait()
                
                if(res.status === 1){
                    console.log("success")
                    alert("Please upload nft image next")
                }else{
                    console.log("failed")
                }
            }



        }catch(error){
            console.log(error)
        }
    }
    
    // temporary fix until install redux
    const [ activeAccount, setActiveAccount] = useState();
    const checkIfWalletIsConnected = async () =>{
        try{
            const {ethereum} = window;
            if(!ethereum){
                alert("Please install metamask")
                return;
            }else{
                console.log("Ethereum Detected")

            }
            const accounts = await ethereum.request({method: "eth_accounts"})
            if(accounts.length !== 0 ){
                setActiveAccount(accounts[0]);
                console.log(`connected to ${activeAccount}`)

            }


        }catch(error){
            console.log(error)
        }
    }
    useEffect(()=>{
        checkIfWalletIsConnected();
    },[])


  return (
    <div className='create-show-container' >
        <div>
            <h1>Create Show</h1>
        </div>
        <div className='create-show-div'>
            <h2>Show info</h2>
            <p>Show Name: {showName} </p>
            <p>Symbol: {showSymbol} </p>
            <p>Band Address: {bandAddress} </p>
            <p>Venue Address: {venueAddress} </p>
            <p>Show Date: {showDate} </p>
            <p>Show Price: {showPrice} </p>
            <p>Max Tickets: {maxSupply} </p>
        </div>
        <div className='create-show-inputs'>
            <h2>Create Tickets For Your Event Below</h2>
            <form className='create-form'>

                <label >Show name</label>
                <input onChange={e=>setShowName(e.target.value)} name="show name" required />
                <br />
                <label >Show Symbol (3 letters)</label>
                <input onChange={e=>setShowSymbol(e.target.value)} name="show symbol" required />
                <br />
                <label >Band Address</label>
                <input onChange={e=>setBandAddress(e.target.value)} name="band address" required />
                <br />
                <label >Venue Address</label>
                <input onChange={e=>setVenueAddress(e.target.value)} name="venue address" required/>
                <br />
                <label >Show Date </label>
                <input type="datetime-local" onChange={e=>setShowDate(e.target.value)} name="show date" required />
                <br />
                <label >Ticket Price </label>
                <input onChange={e=>setShowPrice(e.target.value)} name="ticket price" required />
                <br />
                <label >Set Max Amount of Tickets </label>
                <input onChange={e=>setMaxSupply(e.target.value)} name="max supply" required />
                <br />
                <button onClick={e=>createNewShow(e)} >Create New Show</button>
                <br />

                <label >Ticket Picture Upload</label>
                <input type="file" onChange={uploadToIPFS} placeholder="upload ticket photo" />

            </form>
        </div>
    </div>
  )
}

export default CreateShow