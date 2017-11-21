pragma solidity >=0.4.15;

import './Common.sol';
import './Token.sol';

contract TokenController is SafeMath, Owned, Constants {

    Token token;

    function TokenController() {
        owner = msg.sender;
    }

    function setToken(address _token)
    onlyOwner 
    {
        token = Token(_token);
    }

    uint256 public sellPrice;
    uint256 public buyPrice;

    /// @notice Allow users to buy tokens for `newBuyPriceTokensPerEth` eth and sell tokens for `newSellPriceTokensPerEth` eth
    /// @param newSellPriceTokensPerEth Price the users can sell to the contract
    /// @param newBuyPriceTokensPerEth Price users can buy from the contract
    function setPricesForTokensPerEth(uint256 newSellPriceTokensPerEth, uint256 newBuyPriceTokensPerEth) 
    onlyOwner 
    public {
        sellPrice = newSellPriceTokensPerEth;
        buyPrice = newBuyPriceTokensPerEth;
    }

    address private tokenContractCoinbase = 0x5ff51b742ecb1644fd284390b8a06668f82f11e9;

    function () payable {
        buyTokens();       
    }

    /// @notice Buy tokens from contract by sending ether
    function buyTokens() payable public {
        // uint ethers = msg.value;
        uint amount = calculateTokensFromWei(msg.value);    /// calculates the amount 
        token.mint(msg.sender, amount);   /// makes the transfers 
        ///sending received ethers to the coinbase
        tokenContractCoinbase.transfer(msg.value);           
    }

    function calculateTokensFromWei(uint _weiAmount) private returns (uint) {
        uint tokenAmount;
        uint ethers;
        uint remainingWeis;
        uint etherFraction;

        ethers = _weiAmount / 1000000000000000000; // dividing buy 10e+18
        remainingWeis = _weiAmount % 1000000000000000000; // dividing buy 10e+18
        etherFraction = remainingWeis / 10000000000000000; // 100th of an ether like anything in fraction upto 2 digits


        tokenAmount = (ethers * buyPrice) + ( etherFraction * (buyPrice / 100) );

        return tokenAmount;
    }

    /// @notice Sell `amount` tokens to contract
    /// @param amount amount of tokens to be sold
    function sell(uint256 amount) public {
        require(this.balance >= amount * sellPrice);      // checks if the contract has enough ether to buy
        token.transferFrom(msg.sender, this, amount);              // makes the transfers
        msg.sender.transfer(amount * sellPrice);          // sends ether to the seller. It's important to do this last to avoid recursion attacks
    }
}