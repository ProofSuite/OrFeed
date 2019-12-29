pragma solidity >=0.4.21 <0.6.0;

contract Ownable {
  address public owner;

  event OwnershipRenounced(address indexed previousOwner);
  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   * @notice Renouncing to ownership will leave the contract without an owner.
   * It will not be possible to call the functions with the `onlyOwner`
   * modifier anymore.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipRenounced(owner);
    owner = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function transferOwnership(address _newOwner) public onlyOwner {
    _transferOwnership(_newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function _transferOwnership(address _newOwner) internal {
    require(_newOwner != address(0));
    emit OwnershipTransferred(owner, _newOwner);
    owner = _newOwner;
  }
}

interface IERC20 {
    function totalSupply() external view returns(uint supply);

    function balanceOf(address _owner) external view returns(uint balance);

    function transfer(address _to, uint _value) external returns(bool success);

    function transferFrom(address _from, address _to, uint _value) external returns(bool success);

    function approve(address _spender, uint _value) external returns(bool success);

    function allowance(address _owner, address _spender) external view returns(uint remaining);

    function decimals() external view returns(uint digits);
    event Approval(address indexed _owner, address indexed _spender, uint _value);
}

contract AugurProxy is Ownable {
    address public owner;
    address _repTokenAddress;
    mapping(address => uint256) public repTokenBalance;

	constructor(address repTokenAddress) public Ownable() {
	  owner = msg.sender;
	  _repTokenAddress = repTokenAddress;
  }
	// deposit allows users to deposit rep tokens to the contract after approval
	function deposit(uint256 amount) public {
	    IERC20 repToken = IERC20(_repTokenAddress);
      string memory errorMsg = "Unable to deposit tokens, please make sure this contract is approved for the deposit";
	    require(repToken.transferFrom(msg.sender, address(this), amount), errorMsg);
	    repTokenBalance[msg.sender] += amount;
	}

	// get the balance of rep tokens for a user
	function getBalance() external view returns(uint256){
	   return repTokenBalance[msg.sender];
	}

	// withdraw allows the owner to withdraw any extra REP Tokens on the contract
	function withdrawRepTokens() external {
	    require(msg.sender == owner, "Only owner can withdraw the extra REP tokens");
	    IERC20 repTokens = IERC20(_repTokenAddress);
	    require(repTokens.transfer(msg.sender, repTokens.balanceOf(address(this))), "Unable to withdraw rep tokens");
	}

	function requestEventResult(string calldata eventName, string calldata source) external returns(string memory) {
		require(repTokenBalance[msg.sender] > 0, "Please deposit rep tokens into this contract to continue");
		return "";
	}

	function getRequestedEventResult(string calldata eventName, string calldata source, string calldata referenceId)
  external view returns(string memory) {
	   return "";
	}
}