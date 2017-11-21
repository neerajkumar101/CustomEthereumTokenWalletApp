pragma solidity >=0.4.15;

import './Common.sol';

//ERC20 token
contract ERC20Interface {
     // Get the total token supply
     function getTotalSupply() returns (uint totalSupply);
  
     // Get the account balance of another account with address _owner
     function getTokenBalance(address _owner) constant returns (uint balance);
  
     // Send _value amount of tokens to address _to
     function transfer(address _to, uint _value) returns (bool success);
  
     // Send _value amount of tokens from address _from to address _to
     function transferFrom(address _from, address _to, uint _value) returns (bool success);
  
     // Allow _spender to withdraw from your account, multiple times, up to the _value amount.
     // If this function is called again it overwrites the current allowance with _value.
     // this function is required for some DEX functionality
     function approve(address _spender, uint _value) returns (bool success);
  
     // Returns the amount which _spender is still allowed to withdraw from _owner
     function allowance(address _owner, address _spender) constant returns (uint remaining);
  

    //============================================ events ===========================================
    // Triggered when tokens are transferred.
    event Transfer(address indexed _from, address indexed _to, uint _value);
  
    // Triggered whenever approve(address _spender, uint256 _value) is called.
    event Approval(address indexed _owner, address indexed _spender, uint _value);

    event Mint(address owner, uint amount);

 }

contract Token is ERC20Interface, SafeMath, Owned, Constants {
    uint public totalSupply;

    address ico;
    address controller;

    string public name;
    uint public decimals; 
    string public symbol;     

    modifier onlyPayloadSize(uint numwords) {
        assert(msg.data.length == numwords * 32 + 4);
        _;
    } 

    function Token() {     
        owner = msg.sender;

        // totalSupply = 100000000000000000000000;        
        // balanceOf[owner] = totalSupply;

        owner = msg.sender;
        name = "Custom Token";
        decimals = uint(DECIMALS);
        symbol = "CT";
    }

    function getTotalSupply() returns (uint) {
        return totalSupply;
    }

    function getTokenBalance(address _a) constant returns (uint) {
        return balanceOf[_a];
    }

    //only called from contracts so don't need msg.data.length check
    function mint(address addr, uint amount) {
        if (maxSupply > 0 && safeAdd(totalSupply, amount) > maxSupply) 
            revert();
        balanceOf[addr] = safeAdd(balanceOf[addr], amount);
        totalSupply = safeAdd(totalSupply, amount);

        //updating the maxSupply to new reduced value
        maxSupply = safeSub(maxSupply, amount);
        Mint(addr, amount);
    }

    mapping(address => uint) public balanceOf;
    mapping (address => mapping (address => uint)) public allowance;

    function transfer(address _to, uint _value) 
    onlyPayloadSize(2)
    returns (bool success) 
    {
        if (balanceOf[msg.sender] < _value) 
            return false;

        balanceOf[msg.sender] = balanceOf[msg.sender] - _value;
        balanceOf[_to] = safeAdd(balanceOf[_to], _value);
        Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint _value) 
    onlyPayloadSize(3)
    returns (bool success) 
    {
        if (balanceOf[_from] < _value) 
            return false; 

        var allowed = allowance[_from][msg.sender];
        if (allowed < _value) 
            return false;

        balanceOf[_to] = safeAdd(balanceOf[_to], _value);
        balanceOf[_from] = safeSub(balanceOf[_from], _value);
        allowance[_from][msg.sender] = safeSub(allowed, _value);
        Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint _value) 
    onlyPayloadSize(2)
    returns (bool success) 
    {
        //require user to set to zero before resetting to nonzero
        if ((_value != 0) && (allowance[msg.sender][_spender] != 0)) {
            return false;
        }
    
        allowance[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender)
    onlyPayloadSize(2) 
    constant 
    returns (uint remaining) {
         return allowance[_owner][_spender];
    }

    function increaseApproval (address _spender, uint _addedValue) 
    onlyPayloadSize(2)
    returns (bool success) 
    {
        uint oldValue = allowance[msg.sender][_spender];
        allowance[msg.sender][_spender] = safeAdd(oldValue, _addedValue);
        return true;
    }

    function decreaseApproval (address _spender, uint _subtractedValue) 
    onlyPayloadSize(2)
    returns (bool success) 
    {
        uint oldValue = allowance[msg.sender][_spender];
        if (_subtractedValue > oldValue) {
            allowance[msg.sender][_spender] = 0;
        } else {
            allowance[msg.sender][_spender] = safeSub(oldValue, _subtractedValue);
        }
        return true;
    }

    //Holds accumulated dividend tokens other than TKN
    TokenHolder tokenholder;

    //once locked, can no longer upgrade tokenholder
    bool lockedTokenHolder;

    function lockTokenHolder() onlyOwner {
        lockedTokenHolder = true;
    }

    //while unlocked, 
    //this gives owner lots of power over held dividend tokens
    //effectively can deny access to all accumulated tokens
    //thus crashing TKN value
    function setTokenHolder(address _th) onlyOwner {
        if (lockedTokenHolder) 
            revert();
        tokenholder = TokenHolder(_th);
    }

    event Burn(address burner, uint amount);

    function burn(uint _amount) returns (bool result) {
        if (_amount > balanceOf[msg.sender]) 
            return false;
        balanceOf[msg.sender] = safeSub(balanceOf[msg.sender], _amount);
        totalSupply = safeSub(totalSupply, _amount);
        result = tokenholder.burn(msg.sender, _amount);
        if (!result) 
            revert();
        Burn(msg.sender, _amount);
    }

    bool public flag = false;

    modifier onlyOnce() {
        if(flag == true)
            revert();
        _;
    }

    uint public maxSupply;

    function setMaxSupply(uint _maxSupply)
    onlyOnce 
    {
        if (maxSupply > 0) 
            revert();
        maxSupply = _maxSupply;
        flag = true;
    }
    

}

contract TokenHolder {
    function burn(address _burner, uint _amount)
    returns (bool result) 
    { 
        return false;
    }
}

