import './App.css';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import 'sf-font';
import axios from 'axios';
import ABI from './ABI.json';
import VAULTABI from './VAULTABI.json';
import TOKENABI from './TOKENABI.json';
import { NFTCONTRACT, STAKINGCONTRACT, bscscanapi, moralisapi } from './config';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from "walletlink";
import Web3 from 'web3';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';

var account = null;
var contract = null;
var vaultcontract = null;
var web3 = null;

const Web3Alc = createAlchemyWeb3("https://eth-rinkeby.alchemyapi.io/v2/8AX5AP2TU6G45ctsOXNt8K4Fz_BkhhZG");

const moralisapikey = "pC41kxQ1eakXfyd0ME3DEgmGGkTxQnF0iLLygWMeeDni2mLrGoKmNw5hxUKWIWHC";
const bscscanapikey = "FXW7MUUF8VFMBAGZTSGQ91AQCEDFQDJVAT";

const providerOptions = {
	binancechainwallet: {
		package: true
	  },
	  walletconnect: {
		package: WalletConnectProvider,
		options: {
		  infuraId: "3cf2d8833a2143b795b7796087fff369"
		}
	},
	walletlink: {
		package: WalletLink, 
		options: {
		  appName: "Net2Dev NFT Minter", 
		  infuraId: "3cf2d8833a2143b795b7796087fff369",
		  rpc: "", 
		  chainId: 4, 
		  appLogoUrl: null, 
		  darkMode: true 
		}
	  },
};

const web3Modal = new Web3Modal({
	network: "rinkeby",
	theme: "dark",
	cacheProvider: true,
	providerOptions 
  });

class App extends Component {
	constructor() {
		super();
		this.state = {
			balance: [],
			rawearn: [],
		};
	}
  
	handleModal(){  
		this.setState({show:!this.state.show})  
	} 

	handleNFT(nftamount) {
		this.setState({outvalue:nftamount.target.value});
  	}

	async componentDidMount() {
		
		await axios.get((bscscanapi + `?module=stats&action=tokensupply&contractaddress=${NFTCONTRACT}&apikey=${bscscanapikey}`))
		.then(outputa => {
            this.setState({
                balance:outputa.data
            })
            console.log(outputa.data)
        })
		let config = {'X-API-Key': moralisapikey, 'accept': 'application/json'};
		await axios.get((moralisapi + `/nft/${NFTCONTRACT}/owners?chain=bsc&format=decimal`), {headers: config})
		.then(outputb => {
			const { result } = outputb.data
            this.setState({
                nftdata:result
            })
            console.log(outputb.data)
        })
	}


render() {
	const {balance} = this.state;
	const {outvalue} = this.state;
  

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const expectedBlockTime = 10000;

  async function connectwallet() {
    var provider = await web3Modal.connect();
    web3 = new Web3(provider);
    await provider.send('eth_requestAccounts');
    var accounts = await web3.eth.getAccounts();
    account = accounts[0];
    document.getElementById('wallet-address').textContent = account;
    contract = new web3.eth.Contract(ABI, NFTCONTRACT);
    vaultcontract = new web3.eth.Contract(VAULTABI, STAKINGCONTRACT);
    var getstakednfts = await vaultcontract.methods.tokensOfOwner(account).call();
    document.getElementById('yournfts').textContent = getstakednfts;
    var getbalance = Number(await vaultcontract.methods.balanceOf(account).call());
    document.getElementById('stakedbalance').textContent = getbalance;
    const arraynft = Array.from(getstakednfts.map(Number));
		const tokenid = arraynft.filter(Number);
		var rwdArray = [];
    tokenid.forEach(async (id) => {
      var rawearn = await vaultcontract.methods.earningInfo(account, [id]).call();
      var array = Array.from(rawearn.map(Number));
      console.log(array);
      array.forEach(async (item) => {
        var earned = String(item).split(",")[0];
        var earnedrwd = Web3.utils.fromWei(earned);
        var rewardx = Number(earnedrwd).toFixed(2);
        var numrwd = Number(rewardx);
        console.log(numrwd);
        rwdArray.push(numrwd);
      });
    });
    function delay() {
      return new Promise(resolve => setTimeout(resolve, 300));
    }
    async function delayedLog(item) {
      await delay();
      var sum = item.reduce((a, b) => a + b, 0);
      var formatsum = Number(sum).toFixed(2);
      document.getElementById('earned').textContent = formatsum;
    }
    async function processArray(rwdArray) {
      for (const item of rwdArray) {
        await delayedLog(item);
      }
    }
    return processArray([rwdArray]);
  }

  async function verify() {
    var getstakednfts = await vaultcontract.methods.tokensOfOwner(account).call();
    document.getElementById('yournfts').textContent = getstakednfts;
    var getbalance = Number(await vaultcontract.methods.balanceOf(account).call());
    document.getElementById('stakedbalance').textContent = getbalance;
  }

  async function enable() {
    contract.methods.setApprovalForAll(STAKINGCONTRACT, true).send({ from: account });
  }
  async function rewardinfo() {
    var rawnfts = await vaultcontract.methods.tokensOfOwner(account).call();
    const arraynft = Array.from(rawnfts.map(Number));
    const tokenid = arraynft.filter(Number);
    var rwdArray = [];
    tokenid.forEach(async (id) => {
      var rawearn = await vaultcontract.methods.earningInfo(account, [id]).call();
      var array = Array.from(rawearn.map(Number));
      array.forEach(async (item) => {
        var earned = String(item).split(",")[0];
        var earnedrwd = Web3.utils.fromWei(earned);
        var rewardx = Number(earnedrwd).toFixed(2);
        var numrwd = Number(rewardx);
        rwdArray.push(numrwd)
      });
    });
    function delay() {
      return new Promise(resolve => setTimeout(resolve, 300));
    }
    async function delayedLog(item) {
      await delay();
      var sum = item.reduce((a, b) => a + b, 0);
      var formatsum = Number(sum).toFixed(2);
      document.getElementById('earned').textContent = formatsum;
    }
    async function processArray(rwdArray) {
      for (const item of rwdArray) {
        await delayedLog(item);
      }
    }
    return processArray([rwdArray]);
  }
  async function claimit() {
    var rawnfts = await vaultcontract.methods.tokensOfOwner(account).call();
    const arraynft = Array.from(rawnfts.map(Number));
    const tokenid = arraynft.filter(Number);
        tokenid.forEach(async (id) => {
          await vaultcontract.methods.claim([id])
            .send({from: account })
        })
  }
  async function unstakeall() {
    var rawnfts = await vaultcontract.methods.tokensOfOwner(account).call();
    const arraynft = Array.from(rawnfts.map(Number));
    const tokenid = arraynft.filter(Number);
    await Web3Alc.eth.getMaxPriorityFeePerGas().then((tip) => {
      Web3Alc.eth.getBlock('pending').then((block) => {
        var baseFee = Number(block.baseFeePerGas);
        var maxPriority = Number(tip);
        var maxFee = maxPriority + baseFee;
        tokenid.forEach(async (id) => {
          await vaultcontract.methods.unstake([id])
            .send({
              from: account,
              maxFeePerGas: maxFee,
              maxPriorityFeePerGas: maxPriority
            })
        })
      });
    })
  }
  async function mintnative() {
    var _mintAmount = Number(outvalue);
    var mintRate = Number(await contract.methods.cost().call());
    var totalAmount = mintRate * _mintAmount;
    await Web3Alc.eth.getMaxPriorityFeePerGas().then((tip) => {
        Web3Alc.eth.getBlock('pending').then((block) => {
            var baseFee = Number(block.baseFeePerGas);
            var maxPriority = Number(tip);
            var maxFee = baseFee + maxPriority
        contract.methods.mint(account, _mintAmount)
            .send({ from: account,
              value: String(totalAmount),
              maxFeePerGas: maxFee,
              maxPriorityFeePerGas: maxPriority});
        });
    })
  }

  async function mint0() {
    var _pid = "0";
    var erc20address = await contract.methods.getCryptotoken(_pid).call();
    var currency = new web3.eth.Contract(TOKENABI, erc20address);
    var mintRate = await contract.methods.getNFTCost(_pid).call();
    var _mintAmount = Number(outvalue);
    var totalAmount = mintRate * _mintAmount;
    await Web3Alc.eth.getMaxPriorityFeePerGas().then((tip) => {
      Web3Alc.eth.getBlock('pending').then((block) => {
        var baseFee = Number(block.baseFeePerGas);
        var maxPriority = Number(tip);
        var maxFee = maxPriority + baseFee;
        currency.methods.approve(NFTCONTRACT, String(totalAmount))
					  .send({
						  from: account})
              .then(currency.methods.transfer(NFTCONTRACT, String(totalAmount))
						  .send({
							  from: account,
							  maxFeePerGas: maxFee,
							  maxPriorityFeePerGas: maxPriority
						  },
              async function (error, transactionHash) {
                console.log("Transfer Submitted, Hash: ", transactionHash)
                let transactionReceipt = null
                while (transactionReceipt == null) {
                  transactionReceipt = await web3.eth.getTransactionReceipt(transactionHash);
                  await sleep(expectedBlockTime)
                }
                window.console = {
                  log: function (str) {
                    var out = document.createElement("div");
                    out.appendChild(document.createTextNode(str));
                    document.getElementById("txout").appendChild(out);
                  }
                }
                console.log("Transfer Complete", transactionReceipt);
                contract.methods.mintpid(account, _mintAmount, _pid)
                .send({
                  from: account,
                  maxFeePerGas: maxFee,
                  maxPriorityFeePerGas: maxPriority
                });
            }));
    });
  });
}
const refreshPage = ()=>{
  window.location.reload();  
}

  return (
    <div className="App nftapp">
        <nav class="navbar navbarfont navbarglow navbar-expand-md navbar-dark bg-dark mb-4">
          <div class="container-fluid" style={{ fontFamily: "SF Pro Display" }}>
            <a class="navbar-brand px-5" style={{ fontWeight: "800", fontSize: '25px' }} href="https://Horror-Ape.club"></a><img src="art.png" width="26%" id='heading' />
            
            <Button onClick={verify} style={{ backgroundColor: "skyblue",color: "black", boxShadow: "1px 1px 3px gold",textAlign:"center",margin:"0 auto" }} >Hac lottery</Button>
          </div>
          <div className="pb-3" id='wallet-address' style={{
                color: "#white",
                fontWeight: "400",
                textShadow: "1px 1px 1px white",
              }}>
                <button id="connectbtn" type="button" className="connectbutton" onClick={connectwallet} for="floatingInput">Connect Wallet</button>
              </div>
        </nav>
        <div className='container' marginBottom="0px">
          <hr></hr>
        <div className='row px-3'>
          <body className='nftstaker border-0'>
            <form  style={{ fontFamily: "SF Pro Display" }} >
              <h2 style={{ borderRadius: '14px', fontWeight: "300", fontSize: "25px" }}>HAC NFT Staking Vault </h2>
              <h6 style={{ fontWeight: "300" }}>First time staking?</h6>
              <Button className="btn" onClick={enable} style={{ backgroundColor: "darkgray",color: "black", boxShadow: "1px 1px 3px white" }} >Authorize Your Wallet</Button><hr></hr>
              <div className="row px-3">
                <div className="row">
                  <form class="stakingrewards" style={{ borderRadius: "25px", boxShadow: "1px 1px 10px white" }}>
                    <h5 style={{ color: "white", fontWeight: '700' }}>Your HAC Activity</h5>
                    <h6 style={{ color: "white", fontWeight: '400' }}>Verify Staked Amount</h6>
                    <Button onClick={verify} style={{ backgroundColor: "darkgray",color: "black", boxShadow: "1px 1px 3px white" }} >Verify</Button>
                    <table className='table mt-3 mb-5 px-3 table-dark'>
                      <tr>
                        <td style={{ fontSize: "19px", color:"white",fontWeight: '400' }}>Staked NFTs ID:
                          <span style={{ backgroundColor: "#ffffff00", fontSize: "21px", color: "skyblue", fontWeight: "500", textShadow: "1px 1px 2px #000000" }} id='yournfts'></span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontSize: "19px", color:"white",fontWeight: '400' }}>Staked NFTs:
                          <span style={{ backgroundColor: "#ffffff00", fontSize: "21px", color: "skyblue", fontWeight: "500", textShadow: "1px 1px 2px #000000" }} id='stakedbalance'></span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontSize: "19px", color:"white",fontWeight: '400' }}>Unstake All Staked NFTs&nbsp;
                          <Button onClick={unstakeall} className='mb-2' style={{ backgroundColor: "darkgray", boxShadow: "1px 1px 3px white",color: "black" }}>Unstake All</Button>
                        </td>
                      </tr>
                    </table>
                  </form>
                  </div>
                  <a href='https://Horror-Ape.club'><img className="col-lg-4" src="art.png" id='image' width='40%' /></a>
                  <div className="row">
                    <form className='stakingrewards' style={{ borderRadius: "25px", boxShadow: "1px 1px 15px white", fontFamily: "SF Pro Display" }}>
                      <h5 style={{ color: "#FFFFFF", fontWeight: '300', color:"white",fontWeight: '700' }}> Staking Rewards</h5>
                      <Button onClick={rewardinfo} style={{ backgroundColor: "darkgray",color: "black", boxShadow: "1px 1px 3px white" }} >Earned HACT</Button>
                      <div id='earned' style={{ color: "skyblue", marginTop: "5px", fontSize: '25px', fontWeight: '500', textShadow: "1px 1px 2px #000000" }}><p style={{ fontSize: "20px" }}>Earned Tokens</p></div>
                      <div className='col-12 mt-2'>
                        <div style={{ color: 'white',fontWeight: '400' }}>Claim Rewards</div>
                        <Button onClick={claimit} style={{ backgroundColor: "darkgray",color: "black", boxShadow: "1px 1px 3px white" }} className="mb-2">Claim</Button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="row px-4 pt-2">
                  <div class="header">

                    <div class="header">
                      <div style={{ fontSize: '25px', borderRadius: '14px', fontWeight: '300' }}>HAC NFT Staking Info</div>
                      <table className='table table-bordered table-dark' style={{ borderRadius: '14px' }} id="tabler" >
                        <thead className='thead-light'>
                          <tr>
                            <th scope="col" style={{backgroundColor:'skyblue',borderRadius: "10px"}}>1 STAKED HAC = 10 HACT DAILY </th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                  </div>
                </div>
            </form>
          </body>
        </div>
      </div>
      <div className='row nftportal mt-3'>
      <div style={{boxShadow: "0px 8px 15px purple"}}><hr></hr></div>
        <div className='col mt-4 ml-3'>
      </div>
      <div className='col'>
        <h1 className='n2dtitlestyle mt-3'>Your HAC NFTs</h1>
      <Button onClick={refreshPage} style={{ backgroundColor: "darkgray",color: "black", boxShadow: "1px 1px 3px white" }}>Refresh NFT Portal</Button>
      </div>
      <div className='col mt-3 mr-5'>
      </div>
      </div>
      </div>
    )
  }
}
export default App;

