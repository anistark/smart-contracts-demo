$("body").css("overflow", "hidden");
var voteCol1 = $(".ch1"),
    voteCol2 = $(".ch2"),
    voteCol3 = $(".ch3"),
    voteCol4 = $(".ch4"),
    voteCol5 = $(".ch5");

var contestants = ["34", "55", "21", "84", "42"];

$("#sResults").on("click", function () {
    $(".poll-item").each(function (i) {
        var percent = contestants[i];
        var num = percent / 100;
        $(".vote").addClass("results-r-in");
        $(this).find(".blob-amount").css("transform", "scale(1, " + num + ")");
    });
    voteCol4.addClass("is--winner");
});

$(".vote").on("click", function () {
    console.log('Voting for:');
    // $(this).prepend('<b class="click-voted">+1</b>');
    // setTimeout(function () {
    //     $(".click-voted").remove();
    // }, 600);
});

// $(".expand-btn").on("click", function () {
//     $(".poll-details").addClass("open");
//     $("#ltmWrapper").css("fill", "#333");
//     // $(this).parent().css('flex', '100%');
// });

// $(".close-panel").on("click", function () {
//     $(this).parent().removeClass("open");
//     $("#ltmWrapper").css("fill", "#fff");
// });

// A Web3Provider wraps a standard Web3 provider, which is
// what MetaMask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider(window.ethereum);

async function conn() {
    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = provider.getSigner();
}

// on load
$(function() {
    conn();
    let voteAbi = [
        {
            "inputs": [
                {
                    "internalType": "bytes32[]",
                    "name": "proposalNames",
                    "type": "bytes32[]"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [],
            "name": "chairperson",
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
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                }
            ],
            "name": "delegate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_p",
                    "type": "uint256"
                }
            ],
            "name": "getProposals",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "voter",
                    "type": "address"
                }
            ],
            "name": "giveRightToVote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "proposals",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "name",
                    "type": "bytes32"
                },
                {
                    "internalType": "uint256",
                    "name": "voteCount",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "proposal",
                    "type": "uint256"
                }
            ],
            "name": "vote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "voters",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "weight",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "voted",
                    "type": "bool"
                },
                {
                    "internalType": "address",
                    "name": "delegate",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "vote",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "winnerName",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "winnerName_",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "winningProposal",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "winningProposal_",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    const voteContract = new ethers.Contract(
        '0x1154ACEc3b5Bc2A275f51A05400A8592465566fb',
        voteAbi,
        provider
    );
    fetchCandidates(voteContract);
})

function fetchCandidates(contractClient) {
    console.log('Fetching Candidates...');
    for (let i = 0; i < 3; i++) {
        contractClient.getProposals(i).then(candidateName => {
            $('#vote-c'+(i+1)).text(ethers.utils.parseBytes32String(candidateName));
        });
    }
}
