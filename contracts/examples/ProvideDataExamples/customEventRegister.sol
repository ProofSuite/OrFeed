//Mainnet example: https://etherscan.io/address/0x1b104fe869ddca5b9fb0f09dfc75b9bce308a5ab#code
pragma solidity ^0.5.0;

contract registeredoracleExample {

    address owner; 
    modifier onlyOwner() {
    if (msg.sender != owner) {
            revert();
        }
            _;
    }
        
    constructor() public payable {
        owner = msg.sender;
        
        createNewEvent("");
        addDataToEventOfOracle(0, "")
    }
    
    struct Event {
        string EventName;
        string[] data;
    }
    
    Event[] public events;
    
    function createNewEvent(string memory _eventName) public returns(uint){
        string[] memory temp;
        events.push(Event({EventName: _eventName, data: temp}));
        return events.length;
    }
    
    function addDataToEventOfOracle(uint _eventIndex, string memory _data) public {
        events[_eventIndex].data.push(_data);
    }
    
    function getResultSizeFromOracle(uint _eventIndex) public view returns (uint){  
        return events[_eventIndex].data.length;
    }

    function getResultFromOracle(uint _eventIndex, uint _dataIndex) public view returns (string memory){  
        return events[_eventIndex].data[_dataIndex];
    }

    function compare(string memory _a, string memory _b) public pure returns (int) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        uint minLength = a.length;
        if (b.length < minLength) minLength = b.length;
        //@todo unroll the loop into increments of 32 and do full 32 byte comparisons
        for (uint i = 0; i < minLength; i ++)
            if (a[i] < b[i])
                return -1;
            else if (a[i] > b[i])
                return 1;
        if (a.length < b.length)
            return -1;
        else if (a.length > b.length)
            return 1;
        else
            return 0;
    }

    function changeOwner(address newOwner) public onlyOwner returns(bool){
        owner = newOwner;
        return true;
    }
      
    function withdrawBalance() public onlyOwner returns(bool) {
        uint amount = address(this).balance;
        msg.sender.transfer(amount);
        return true;
    }
}