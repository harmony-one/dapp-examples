pragma solidity ^0.4.22; 

contract Puzzle {
    string internal constant INSUFFICIENT_FUND_MESSAGE = "Insufficient Fund";
    string internal constant RESTRICTED_MESSAGE = "Unauthorized Access";
    string internal constant NOT_IN_GAME = "Player is not in an active game";

    uint constant thresholdLevel = 10;
    mapping(address => uint) playerStake;
    mapping(address => bool) playerSet;

    address public manager;  // The adress of the owner of this contract
    address [] public players;   // All players

    constructor() public payable {
        manager = msg.sender;
    }

    /**
     * @dev The player enters into a new game by
     *      paying at least 20 token.
     */
    function play() public payable {
        require(msg.value >= 20 ether && playerStake[msg.sender] == 0, INSUFFICIENT_FUND_MESSAGE);

        playerStake[msg.sender] = msg.value;
    }


    /**
     * @dev pay the player if they have crossed their last best level.
     */
    function payout(address player, uint level) public restricted {
            require(playerStake[msg.sender] > 20 ether, NOT_IN_GAME);

            uint progress = level - thresholdLevel;
            uint amount = progress*(playerStake[player]/thresholdLevel);
            //if a later transaction for a higher level comes earlier.
            player.transfer(amount);
            playerStake[msg.sender] = 0;
    }


    modifier restricted() {
        require(msg.sender == manager, RESTRICTED_MESSAGE);
        _;
    }

    /**
     * @dev Resets the current session of one player
     */
    function resetPlayer(address player) public restricted {
            delete playerStake[player];
    }
    
    /**
     * @dev Resets the current session by deleting all the players
     */
    function reset() public restricted {
        uint arrayLength = players.length;
        for(uint i=0; i< arrayLength; i++) {
            address player = players[i];
            resetPlayer(player);
        }
        players.length = 0;
    }
    
    /**
     * @dev Returns a list of all players in the current session.
     */
    function getPlayers() public view returns (address [] memory) {
        return players;
    }
}
