import Web3 from 'web3';
//console.log(window.web3.currentProvider);
const web3 = new Web3(window.web3.currentProvider);
window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        let ethereum = window.ethereum;
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            //web3.eth.sendTransaction({/* ... */});
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    //else if (window.web3) {
        //window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        //web3.eth.sendTransaction({/* ... */});
   // }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});
//const web3 = new Web3(window.web3.currentProvider);

  //web3.eth.getAccounts().then(fetchedAccounts =>{ console.log(fetchedAccounts) });
  //fetchedAccounts = await web3.eth.getAccounts();
  //console.log(fetchedAccounts);

export default web3;

