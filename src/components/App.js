import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3'
import Navbar from './Navbar'
import RandomNumber from '../abis/RandomNumber.json'


class App extends Component {
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const randomNumber = web3.eth.Contract(RandomNumber.abi, "0x3da3dCF9b4a8B3Fbe346434E4fF1710AEdF62D06")
    console.log(randomNumber) 
    this.setState({ randomNumber })
    const number = await this.state.randomNumber.methods.s_randomWord().call()
        this.setState({
          number: number.toNumber()
        })
    console.log(number.toNumber());
  }
  
  asksForRandomNumber() {
    this.setState({ loading: true })
    this.state.randomNumber.methods.requestRandomWords().send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

   async readRandomNumber() {
    this.setState({ loading: true })
    const number = await this.state.randomNumber.methods.s_randomWord().call()
        this.setState({
          number: number.toNumber()
        })
    console.log(number.toNumber());
    this.setState({ loading: false})
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      number: '',
      loading: true
    }
    this.asksForRandomNumber = this.asksForRandomNumber.bind(this)
    this.readRandomNumber = this.readRandomNumber.bind(this)
  }
  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
          <button onClick={(event) => {
                this.asksForRandomNumber()
              }}>
            Request for random number
          </button>
          </div>
          <div className="row">
          <button onClick={(event) => {
                this.readRandomNumber()
              }}>
            Read random number
          </button>
          </div>
          <div className="row">
          Random number: {this.state.number} 
          </div>
        </div>
      </div>
    );
  }
}

export default App;
