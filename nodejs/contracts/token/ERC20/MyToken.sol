pragma solidity ^0.5.2;

import "./ERC20.sol";
import "./ERC20Detailed.sol";

contract MyToken is ERC20, ERC20Detailed {
    uint256 public constant INITIAL_SUPPLY = 10000000000 * (10 ** uint256(18));
    constructor () public ERC20Detailed("HMY_TOKEN", "HMY", 18) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}