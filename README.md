# connect4-dapp

## Install
Minimum project requirements:
- Go 	v1.9+ (older is likely fine as this is a very simple server)
- go-ethereum client (https://github.com/ethereum/go-ethereum)

This scope of this project doesn't include building solidity contracts or compiling solidity contracts into Go code. Solidity contract documentation can be found [here](http://solidity.readthedocs.io/en/v0.4.21/introduction-to-smart-contracts.html). A helpful tutorial for generating Go code from a solidity contract for interfacing with the contract is here: https://www.youtube.com/watch?v=k_w6seLoem4.

## Code
The webserver is written in Go and is all included in the `main.go` file. It is configured to run on port 8080 for development purposes. A solidity contract for the Connect4 token has been compiled into Go code and can be found in `contract.go`. The original solidity contract is located in `Connect4_Token.sol` and is only included for reference. `index.html` holds all html for the Dapp and is styled by css found in the `/css` directory. Dynamic content in the dapp is provided by vanilla javascript found in the `/js` directory.

## Run
To start the dapp locally, open a terminal in the `connect4-app/` directory and run `go run main.go contract.go`. Open a web browser and navigate to `localhost:8080`. Enjoy!

