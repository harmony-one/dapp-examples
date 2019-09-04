pragma solidity ^0.4.22; 

contract Puzzle {
    string internal constant RESTRICTED_MESSAGE = "Unauthorized Access";
    string internal constant LEVEL_LIMIT = "Not Reach Level Limit";

    uint constant thresholdLevel = 10;
    mapping(address => uint) playerLevel;
    mapping(address => string) playerSequence;

    address public manager;  // The adress of the owner of this contract

    constructor() public payable {
        manager = msg.sender;
    }

    function payout(address player, uint level, string sequence) public restricted {
        require(level > thresholdLevel, LEVEL_LIMIT);
        if (playerLevel[player] < level) {
            playerLevel[player] = level;
            playerSequence[player] = sequence;
        }
    }

    modifier restricted() {
        require(msg.sender == manager, RESTRICTED_MESSAGE);
        _;
    }

    function getSequence(address player) public restricted view returns (string) {
        return playerSequence[player];
    }

    function getLevel(address player) public restricted view returns (uint) {
        return playerLevel[player];
    }
}
