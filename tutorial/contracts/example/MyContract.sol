pragma solidity ^0.5.1;


contract MyContract {
    function print() public returns(uint256 myNumber, string memory myString) {
        return (23456, "Hello!%");
    }

    function add(uint256 a, uint256 b) public returns(uint256) {
        return a + b;
    }
}