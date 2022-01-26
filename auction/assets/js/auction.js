let svgHtml = '<svg version="1.1" id="inline-loader" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve"><circle fill="#2c2c2c" stroke="none" cx="6" cy="50" r="6"><animateTransform attributeName="transform" dur="1s" type="translate" values="0 15 ; 0 -15; 0 15" repeatCount="indefinite" begin="0.1" /></circle><circle fill="#4c4c4c" stroke="none" cx="30" cy="50" r="6"><animateTransform attributeName="transform" dur="1s" type="translate" values="0 10 ; 0 -10; 0 10" repeatCount="indefinite" begin="0.2" /></circle><circle fill="#c2c2c2" stroke="none" cx="54" cy="50" r="6"><animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.3" /></circle></svg>';

let editor = ace.edit("editor");
editor.setTheme("ace/theme/solarized_dark");  // https://github.com/ajaxorg/ace/tree/master/lib/ace/theme
editor.session.setMode("ace/mode/solidity");

loadContract(editor, "../contracts/evm/SimpleAuction.sol");

(function () {
    // Loading Icons
    document.getElementById("total-bid-count").innerHTML = svgHtml;
    document.getElementById("highest-bid-amount").innerHTML = svgHtml;
    document.getElementById("highest-bid-address").innerHTML = svgHtml;

    // Fetch current state.
    // fetchCurrentState()
})();

const auctionAddress = '0xC546360927C71E4f9996aa41220ce32a465abde2';
const auctionAbi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_biddingTime",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_beneficiary",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "AuctionEnded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "bidder",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "HighestBidIncreased",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "auctionEnd",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "auctionEndTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "beneficiary",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "bid",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "highestBid",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "highestBidder",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

window.addEventListener('load', async () => {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        console.log('provider signer:', provider.getSigner());

        window.auctionContract = new ethers.Contract(auctionAddress, auctionAbi, provider);
        console.log('auctionContract:', window.auctionContract);

        fetchCurrentState();
    }
    else if (window.Web3) {
        window.web3 = new Web3(window.Web3.currentProvider)
        // no need to ask for permission
    }
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

    // if (window.web3 && window.web3.currentProvider) {
    //     console.log ('selected address:', window.web3.currentProvider.selectedAddress);
    // } else {
    //     console.log('Web3 Not Injected! 😢');
    // }
})

function initPayButton() {
    const paymentAddress = '0xC546360927C71E4f9996aa41220ce32a465abde2';
    const amountEth = $('#auction-bid-amount').val();
    console.log('to:', paymentAddress, "->", amountEth, 'eth');
    window.web3.eth.sendTransaction({
        to: paymentAddress,
        from: window.web3.currentProvider.selectedAddress,
        value: window.web3.utils.toWei(amountEth, 'ether')
    }, (err, transactionId) => {
        if  (err) {
            console.log('Bid failed:', err)
            // $('#status').html('Payment failed')
        } else {
            console.log('Bid successful:', transactionId)
            // $('#status').html('Payment successful')
        }
    })
}

$('#btn-add-bid').click(() => {
    initPayButton()
});

async function fetchCurrentState() {
    console.log('fetching current state...');
    let highestBid = await window.auctionContract.highestBid();
    console.log('highestBid:', highestBid);
    document.getElementById("highest-bid-amount").innerHTML = highestBid;

    let highestBidder = await window.auctionContract.highestBidder();
    console.log('highestBidder:', highestBidder);
    document.getElementById("highest-bid-address").innerHTML = highestBidder;
}

function loadContract(editor, file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                editor.session.setValue(allText);
            }
        }
    }
    rawFile.send(null);
}
