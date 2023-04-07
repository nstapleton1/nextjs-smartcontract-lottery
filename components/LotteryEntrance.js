// have a function to enter the lottery
import { useWeb3Contract } from "react-moralis"
import {abi, contractAddresses} from "../constants"  //sepcify just folder as the index.js in the folder will take care of it
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import {ethers} from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const {chainId: chainIdHex, isWeb3Enabled} = useMoralis()
    // const {useMoralisQuery, useMoralisSubscription} = useMoralis()

    // console.log("chainId: " + parseInt(chainIdHex))
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    //makes entranceFee a hook so UI will re-render; 
    //setEntranceFee is a function call; 
    //0 simply a starting value
    const [entranceFee, setEntranceFee] = useState("0") 
    const [numPlayers, setNumPlayers] = useState("0") 
    const [recentWinner, setRecentWinner] = useState("0") 

    const dispatch = useNotification()

    const {runContractFunction: getRecentWinner} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const {runContractFunction: getNumberOfPlayers} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })
    
    const {runContractFunction: getEntranceFee} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    useEffect(() => {
        if(isWeb3Enabled){
            updateUI()
        }
    }, [isWeb3Enabled])

    async function updateUI() {
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function (tx) {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">
            Hi from Lottery Entrance!
            {raffleAddress ? (
                <div className="">
                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function() {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled = { isLoading || isFetching }
                    >
                        { isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div> 
                        ) : (
                            <div>Enter Raffle</div> 
                        )}
                    </button>
                    <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee,"ether")} ETH</div>
                    <div>Number of Players: {numPlayers}</div>
                    <div>Recent Winner: {recentWinner}</div>
                </div> 
            ) : (
                <div>No Raffle Address Detected</div>
            )}
        </div>
    )
}