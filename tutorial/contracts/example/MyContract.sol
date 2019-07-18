pragma solidity ^0.5.1;


contract MyContract {
    function myFunction() public returns(uint256 myNumber, string memory myString) {
        return (23456, "Hello!%");
    }

    function inputFunction(uint256 inputNumber, string memory inputString) public returns(uint256 outputNumber, string memory outputString) {
        return (inputNumber, inputString);
    }
    
}