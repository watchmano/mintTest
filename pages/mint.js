import { useState, useEffect } from 'react'
import { initOnboard } from '../utils/onboard'
import { useConnectWallet, useSetChain, useWallets } from '@web3-onboard/react'
import { config } from '../dapp.config'
import createGuest from 'cross-domain-storage/guest'
import {
  getTotalMinted,
  getMaxSupply,
  isPausedState,
  isPublicSaleState,
  isPreSaleState,
  presaleMint,
  publicMint
} from '../utils/interact'
import {axios} from 'axios'

export default function Mint() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
  const connectedWallets = useWallets()

  const [maxSupply, setMaxSupply] = useState(0)
  const [totalMinted, setTotalMinted] = useState(0)
  const [maxMintAmount, setMaxMintAmount] = useState(0)
  const [paused, setPaused] = useState(false)
  const [isPublicSale, setIsPublicSale] = useState(false)
  const [isPreSale, setIsPreSale] = useState(false)

  const [status, setStatus] = useState(null)
  const [mintAmount, setMintAmount] = useState(1)
  const [isMinting, setIsMinting] = useState(false)
  const [onboard, setOnboard] = useState(null)

  const [nftPrice, setNftPrice] = useState(0)
  const [currency, setCurrency] = useState('eth')
  const [walletAddress, setWalletAddress] = useState('')


  useEffect(() => {
    var bazStorage = createGuest('https://360hexaworld.com');
    bazStorage.get('logininfo', function(error, value) {
      console.log(value)
      // value for the key of 'fizz' will be retrieved from localStorage on www.baz.com
  });
    // const { address } = walletAddress
    // sendRequest('dev.nft', 'post', {address})
  }, [walletAddress])

  useEffect(() => {
    if (!connectedWallets.length) return

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    )
    window.localStorage.setItem(
      'connectedWallets',
      JSON.stringify(connectedWalletsLabelArray)
    )
    setWalletAddress(wallet?.accounts[0])
    console.log(walletAddress)
  }, [connectedWallets])

  useEffect(() => {
    if (!onboard) return

    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem('connectedWallets')
    )

    if (previouslyConnectedWallets?.length) {
      async function setWalletFromLocalStorage() {
        await connect({
          autoSelect: {
            label: previouslyConnectedWallets[0],
            disableModals: true
          }
        })
      }
      
      // setWalletAddress(setWalletAddress)
      setWalletFromLocalStorage()
    }
  }, [onboard, connect])

  useEffect(() => {
    const init = async () => {
      setMaxSupply(await getMaxSupply())
      setTotalMinted(await getTotalMinted())

      setPaused(await isPausedState())
      setIsPublicSale(await isPublicSaleState())
      const isPreSale = await isPreSaleState()
      setIsPreSale(isPreSale)

      setMaxMintAmount(
        isPreSale ? config.presaleMaxMintAmount : config.maxMintAmount
      )
    }

    init()
  }, [])

  useEffect(() => {
    
  }, [walletAddress])
  
  const sendRequest = async (url, method, body = {}) => {
    const result = await axios[method](url, { ...body})
  }

  const publicMintHandler = async () => {
    setIsMinting(true)

    const { success, status } = await publicMint(mintAmount)

    setStatus({
      success,
      message: status
    })

    setIsMinting(false)
  }

  const onPriceChange = (e) => setNftPrice(e.target.value)


  return (
    // border-[rgba(0,0,0,1)]
    <div className="min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center h-full w-full px-2 md:px-10">
        <div
          style= {{
            borderColor: '#f49289',
            borderWidth: '3px'
          }}
          className="border border-primary relative z-1 md:max-w-3xl w-full bg-white filter backdrop-blur-sm py-4 rounded-lg px-2 flex flex-col items-center"
        >
          
          {wallet && (
            <button
              style={{
                backgroundColor: '#ffcccc'
              }}
              className="absolute right-4 transition duration-200 ease-in-out px-4 py-2 rounded-md text-sm text-white tracking-wide uppercase"
              onClick={() =>
                disconnect({
                  label: wallet.label
                })
              }
            >
              Disconnect
            </button>
          )}
          <button
            style={{
              backgroundColor: '#ffcccc'
            }}
            className="absolute left-4 transition duration-200 ease-in-out px-4 py-2 rounded-md text-sm text-white tracking-wide uppercase"
            onClick={() =>
              disconnect({
                label: wallet.label
              })
            }
          >
            go Back
          </button>
          <h1 className="text-gray-500 uppercase font-bold text-3xl md:text-3xl bg-gradient-to-br  from-brand-green to-brand-blue bg-clip-text  mt-3">
            {/* {paused ? 'Paused' : isPreSale ? 'Pre-Sale' : 'Public Sale'} */}
            {paused ? 'NFT Mint Paused temporally' : 'NFT OpenSea Upload'}
          </h1>
          <h3 className="text-sm text-gray-500 tracking-widest">
            {wallet?.accounts[0]?.address
              ? 'Wallet Address : ' + wallet?.accounts[0]?.address.slice(0, 8) +
                '...' +
                wallet?.accounts[0]?.address.slice(-4)
              : ''}
          </h3>

          <div className="flex flex-col md:flex-row md:space-x-1 w-5/6 mt-10 md:mt-14">
            <div className="relative w-full md:w-1/2">
              <img
                src="/images/13.png"
                className=" object-cover w-full sm:h-[280px] md:w-[250px] rounded-md"
              />
            </div>

            <div
              className="flex flex-col items-start w-full md:w-1/2 mt-5 md:mt-0"
              style= {{
                borderColor: '#f49289',
                borderWidth: '3px'
              }}
            >
              
              {/* NFT price input */}
              <div className="py-1 w-full">
                <div className="w-full text-xl  flex flex-col items-start justify-between text-brand-yellow">
                  <div className="flex">
                    <label htmlFor="price-input" className="block text-md font-medium text-gray-700">Price</label>
                  </div>
                  
                  <div className="mt-1 flex rounded-md">
                    <input
                      type="number"
                      value={nftPrice} onChange={onPriceChange} name="price-input"
                      id=""
                      className="text-gray-500 border-b block w-full flex-1 rounded-l-md sm:text-sm"
                      placeholder=""
                    />
                    <select id="currency" name="currency" class="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                      <option>ETH</option>
                    </select>
                  </div>
                </div>
              </div>
              
              
              <div className="text-gray-500 border-b py-2 mt-10 w-full">
                <div className="w-full text-xl  flex items-center justify-start text-brand-yellow">
                  <p className="text-gray-500 mr-5">Total</p>
                  <p className="text-gray-500 mr-2">
                    {nftPrice}
                  </p>
                  <p className="text-gray-500 mr-2">
                    {currency.toUpperCase()}
                  </p>
                  <p className="text-gray-500">
                    + GAS
                  </p>
                </div>
              </div>

              {/* Mint Button && Connect Wallet Button */}
              {wallet ? (
                <button
                  className={` ${
                    paused || isMinting
                      ? 'cursor-not-allowed'
                      : ''
                    }  mt-12 px-6 py-3 rounded-md text-xl text-white  mx-auto tracking-wide uppercase`
                    
                  }
                  disabled={paused || isMinting}
                  onClick={publicMintHandler}
                  style={{
                    backgroundColor: '#ffcccc'
                  }}
                >
                  {isMinting ? 'Minting...' : 'Mint'}
                </button>
              ) : (
                <button
                  className=" mt-12 from-brand-purple to-brand-pink shadow-lg px-6 py-3 rounded-md text-xl text-white mx-auto tracking-wide uppercase"
                  onClick={() => connect()}
                  style={{
                    backgroundColor: '#ffcccc'
                  }}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>

          {/* Status */}
          {status && (
            <div
              className={`border ${
                status.success ? 'border-green-500' : 'border-brand-pink-400 '
              } rounded-md text-start h-full px-4 py-4 w-full mx-auto mt-8 md:mt-4"`}
            >
              <p className="flex flex-col space-y-2 text-gray-500 text-sm md:text-base break-words ...">
                {status.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
