let svgHtml = '<svg version="1.1" id="inline-loader" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve"><circle fill="#2c2c2c" stroke="none" cx="6" cy="50" r="6"><animateTransform attributeName="transform" dur="1s" type="translate" values="0 15 ; 0 -15; 0 15" repeatCount="indefinite" begin="0.1" /></circle><circle fill="#4c4c4c" stroke="none" cx="30" cy="50" r="6"><animateTransform attributeName="transform" dur="1s" type="translate" values="0 10 ; 0 -10; 0 10" repeatCount="indefinite" begin="0.2" /></circle><circle fill="#c2c2c2" stroke="none" cx="54" cy="50" r="6"><animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.3" /></circle></svg>';


(function () {
    // Loading Icons
    document.getElementById("highest-bid-amount").innerHTML = svgHtml;
    document.getElementById("total-bid-count").innerHTML = svgHtml;

    // Fetch current state.
    // fetchCurrentState()
})();

window.addEventListener('load', async () => {
    // Check if Web3 has been injected by the browser
    // if (window.ethereum) {
    //     window.web3 = new Web3(window.ethereum);
    //     try {
    //         await window.ethereum.enable();
    //         console.log('Ethereum Provider Detected! All Good!')
    //     } catch (err) {
    //         console.log('User denied account access', err)
    //     }
    // } else if (window.Web3) {
    //     window.web3 = new Web3(web3.currentProvider)
    //     // await window.ethereum.send('eth_requestAccounts');
    //     // window.web3 = new Web3(window.ethereum);
    //     console.log("defaultAccount:", window.web3.eth.getAccounts());
    //     console.log('Web3 Provider Detected! All Good!')
    // } else {
    //     console.log('No Metamask (or other Web3 Provider) installed')
    // }

    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        console.log('1');
        try {
            console.log('2');
            // ask user for permission
            window.ethereum.enable()
            // user approved permission
        } catch (error) {
            // user rejected permission
            console.log('user rejected permission')
        }
    }
    else if (window.Web3) {
        console.log('3');
        window.web3 = new Web3(window.Web3.currentProvider)
        // no need to ask for permission
    }
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

    if (window.web3 && window.web3.currentProvider) {
        console.log ('currentProvider:', window.web3.currentProvider);
    } else {
        console.log('Web3 Not Injected! 😢');
    }
})

function initPayButton() {
    const paymentAddress = '0x48e28C1681BBb92a2E5874113bc740cC11A0FD7a';
    const amountEth = $('#auction-bid-amount').val();
    console.log('to:', paymentAddress, "->", amountEth, 'eth');
    window.web3.eth.sendTransaction({
        to: paymentAddress,
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

function fetchCurrentState() {
    console.log('fetching current state...');
}
