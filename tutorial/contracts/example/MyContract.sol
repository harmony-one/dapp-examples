pragma solidity ^0.5.1;


contract MyContract {
    function print() public pure returns(uint256 myNumber, string memory myString) {
        return (23456, "Hello!%");
    }

    function add(uint256 a, uint256 b) public pure returns(uint256) {
        return a + b;
    }

    event DemoEvent(uint256 num);
    function fireEvent(uint256 num) public returns(uint256){
        emit DemoEvent(num);
        return num;
    }
}