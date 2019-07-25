pragma solidity >=0.4.22;

contract Faucet {
    string internal constant INSUFFICIENT_FUND_MESSAGE = "Insufficient Fund";

    mapping(address => bool) processed;
    uint quota = 1 ether;
    address owner;
    constructor() public payable {
        owner = msg.sender;
    }
    function request(address payable requestor) public {
        require(msg.sender == owner);
        require(quota <= address(this).balance);
        require(!processed[requestor]);
        processed[requestor] = true;
        requestor.transfer(quota);
	}
    function money() public view returns(uint) {
        return address(this).balance;
	}

    function donate() public payable {
        require(msg.value > 0 ether, INSUFFICIENT_FUND_MESSAGE);
    }
}