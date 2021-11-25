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

window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try{
            // ask user for permission
            window.ethereum.enable();
            // user approved permission
        } catch (error) {
            // user rejected permission
            console.log('user rejected permission');
        }
    }
    else if (window.Web3) {
        window.web3 = new Web3(window.Web3.currentProvider)
        // no need to ask for permission
    }
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

    if (window.web3 && window.web3.currentProvider) {
        console.log ('selected address:', window.web3.currentProvider.selectedAddress);
    } else {
        console.log('Web3 Not Injected! 😢');
    }
})

function initPayButton() {
    const paymentAddress = '0x3635Fc964e6fb314627587e7896387D6E63b1baf';
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

function fetchCurrentState() {
    console.log('fetching current state...');
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
