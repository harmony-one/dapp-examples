pragma solidity ^0.5.2;


contract MyContract {
    uint256 fireNumber;

    address public manager;  // The adress of the owner of this contract
    // address payable[] public players;  // The players of current session

    constructor() public {
        manager = msg.sender;
    }
    
    function print() public pure returns(uint256 myNumber, string memory myString) {
        return (23456, "Hello!%");
    }

    function add(uint256 a, uint256 b) public pure returns(uint256) {
        return a + b;
    }

    event DemoEvent(uint256 num);

    function fireEvent(uint256 num) public returns(uint256) {
        fireNumber = num;
        emit DemoEvent(num);
        return num;
    }
}