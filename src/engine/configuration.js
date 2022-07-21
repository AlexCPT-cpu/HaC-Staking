/* 
       ___  ___    _  _  ___  _____   __  __             _         _   
 _ _  |_  )|   \  | \| || __||_   _| |  \/  | __ _  _ _ | |__ ___ | |_ 
| ' \  / / | |) | | .` || _|   | |   | |\/| |/ _` || '_|| / // -_)|  _|
|_||_|/___||___/  |_|\_||_|    |_|   |_|  |_|\__,_||_|  |_\_\\___| \__|
                                                                    
Update values accordingly
*/

/*
Private Key Encryption
Replace hhraw with your contract 
owner wallet private key "0xPRIVATEKEY"
*/

import SimpleCrypto from "simple-crypto-js"
const cipherKey = "#ffg3$dvcv4rtkljjkh38dfkhhjgt"
const hhraw = "405f878100f0e507ae49eb23c3003ca592208c16670b06c61a60214f4990fa63";
export const simpleCrypto = new SimpleCrypto(cipherKey)
export const cipherEth = simpleCrypto.encrypt(hhraw)
export const cipherHH = simpleCrypto.encrypt(hhraw)

/*
MARKET AND NFT CONTRACTS
*/
export var hhresell = "0x32b598a60EBe5f3b06d4b9D6571D2a8d9fe0d7E8";
export var hhnftcol = "0xAFc7647b584730694B9606511F11F423A0816eFf";

/*
NETWORK RPC ADDRESSES, Choose one then 
change the value of "hhrpc" below.
*/
var mumbai = 'https://matic-mumbai.chainstacklabs.com';
var goerli = 'https://rpc.ankr.com/eth_goerli';
var rinkeby = 'https://rpc.ankr.com/eth_rinkeby';
var bsc = 'https://bsc-dataseed1.binance.org';

/*
CHANGE THIS TO YOUR PREFERRED TESTNET
*/
var hhrpc = bsc;
/*
Global Parameters
*/
export var mainnet = hhrpc

/*
DON'T FORGET TO SAVE!
*/