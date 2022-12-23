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

            setTicketNFTArt(`https://ipfs.infura.io:5001/${result.path}`)

            console.log(ticketNFTArt)
            console.log(`https://ipfs.infura.io:5001/${result.path}`)

            
            let txn, res
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            const ControllerContract = new ethers.Contract(controller, controllerAbi.abi, signer )


            txn = await ControllerContract.setNewBaseUri(`https://ipfs.infura.io:5001/${result.path}`)
            res = await txn.wait()
            


            if(res.status === 1){
                console.log("success")
            }else{
                console.log("failed")
            }
            



        }catch(error){
            console.log(error)
        }
    }



    const createNewShow = async (e) =>{
        e.preventDefault()

        
        try{

            const {ethereum} = window;
            if(ethereum){

                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
    
                const CreateShowContract = new ethers.Contract(CREATE_SHOW_ADDRESS, createContractAbi.abi, signer )
    
                const tx = await CreateShowContract.createShow(showName, showSymbol, bandAddress, venueAddress, showDate, showPrice)
                

                const receipt = await tx.wait()

                if(receipt.status === 1){
                    console.log("success")
                    
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
    <div>
        <div>
            <h1>Create Show</h1>
        </div>
        <div>
            <h2>Show info</h2>
            <p>Show Name: {showName} </p>
            <p>Symbol: {showSymbol} </p>
            <p>Band Address: {bandAddress} </p>
            <p>Venue Address: {venueAddress} </p>
            <p>Show Date: {showDate} </p>
            <p>Show Price: {showPrice} </p>
            <p>Max Tickets: {maxSupply} </p>
        </div>
        <div>
            <form>
                <label >Show name</label>
                <input onChange={e=>setShowName(e.target.value)} name="show name" />
                <label >Show Symbol (3 letters)</label>
                <input onChange={e=>setShowSymbol(e.target.value)} name="show name" />
                <label >Band Address</label>
                <input onChange={e=>setBandAddress(e.target.value)} name="show name" />
                <label >Venue Address</label>
                <input onChange={e=>setVenueAddress(e.target.value)} name="show name" />
                <label >Show Date </label>
                <input onChange={e=>setShowDate(e.target.value)} name="show name" />

                <label >Ticket Price </label>
                <input onChange={e=>setShowPrice(e.target.value)} name="show name" />
                <label >Set Max Amount of Tickets </label>
                <input onChange={e=>setMaxSupply(e.target.value)} name="show name" />

                <button onClick={e=>createNewShow(e)} >Create New Show</button>


                <label >Ticket Picture Upload</label>
                <input type="file" onChange={uploadToIPFS} placeholder="upload ticket photo" />

            </form>
        </div>
    </div>
  )
}

export default CreateShow