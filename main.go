package main

import (
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"math/big"
	"net/http"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

const key = `{"address":"6f3ff3e713372fabadb8be469861b9edde95809f","crypto":{"cipher":"aes-128-ctr","ciphertext":"839688dd222e2854c266938e092b63533a27bf4f56eaed7b79e586c95195529b","cipherparams":{"iv":"141e4c5fd69811383b41381b8ad2727f"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"f766a9c6856a46ad04ea09343239ffb5c907aa1e87fdae96b1021f7b7b12747d"},"mac":"81933b20d57ffef44d08a4920bd7ba563efc920afe1346ce9b8f1c35693a1f69"},"id":"24689da4-4755-4084-8d06-aea9bb9477ca","version":3}`
const tokenAddress = "0x52f2b1aa9a8aa1780f03c99f6cbe01720840c72a"

var tpl *template.Template

type TokenSession struct {
	Contract     *SimpleToken
	CallOpts     bind.CallOpts
	TransactOpts bind.TransactOpts
}

func init() {
	tpl = template.Must(template.ParseGlob("*.html"))
}

func main() {
	http.HandleFunc("/", index)
	http.HandleFunc("/requestTokens", requestTokens)
	http.Handle("/js/", http.StripPrefix("/js", http.FileServer(http.Dir("js"))))
	http.Handle("/css/", http.StripPrefix("/css", http.FileServer(http.Dir("css"))))
	http.Handle("/favicon.ico", http.NotFoundHandler())
	http.ListenAndServe(":8080", nil)
}

func index(res http.ResponseWriter, req *http.Request) {
	err := tpl.ExecuteTemplate(res, "index.html", tokenAddress)
	if err != nil {
		log.Fatalln("template didn't execute: ", err)
	}
}

func tokenSession() TokenSession {
	conn, err := ethclient.Dial("https://ropsten.infura.io/FVaBfad4qY889MogGrbu")
	if err != nil {
		log.Fatalf("Failed to connect to Ethereum network: %v", err)
	}

	token, err := NewSimpleToken(common.HexToAddress(tokenAddress), conn)
	if err != nil {
		log.Fatalf("Failed to instantiate contract: %v", err)
	}

	auth, err := bind.NewTransactor(strings.NewReader(key), "password")
	if err != nil {
		log.Fatalf("Failed to create authorized transactor: %v", err)
	}

	// Wrap the Token contract instance into a session
	session := &TokenSession{
		Contract: token,
		CallOpts: bind.CallOpts{
			Pending: true,
		},
		TransactOpts: bind.TransactOpts{
			From:     auth.From,
			Signer:   auth.Signer,
			GasLimit: uint64(500000),
		},
	}
	return *session
}

func requestTokens(res http.ResponseWriter, req *http.Request) {
	bsAddress, err := ioutil.ReadAll(req.Body)
	if err != nil {
		fmt.Println(err)
	}
	strAddress := string(bsAddress)

	session := tokenSession()

	txTrans, err := session.Contract.Transfer(&session.TransactOpts,
		common.HexToAddress(strAddress),
		big.NewInt(1))
	if err != nil {
		log.Fatalf("Failed to perform Transfer: %v", err)
	}
	fmt.Println(txTrans.Hash())
}
