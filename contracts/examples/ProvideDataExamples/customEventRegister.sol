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
        //Registering Sample Pre-loaded events
        addDataToOracle("deep-fake-providers", "google.com");
        addDataToOracle("deep-fake-providers", "fb.com");
        addDataToOracle("tiananmen-square-reports", "wikipedia.org");
        addDataToOracle("global-warming", "youtube.com");
    }

    // "theEvent" => data[]
    mapping(string => string[]) events;

    // Add new data to Oracle
    function addDataToOracle(string memory _theEvent, string memory _data) public {
        events[_theEvent].push(_data);
    }

    // Get Number of Data Elements of Particular Event
    function getResultSizeFromOracle(string memory _theEvent) public view returns (uint){
        return events[_theEvent].length;
    }

    // Get Specific Data of Event
    function getResultFromOracle(string memory _theEvent, uint _dataIndex) public view returns (string memory){
        return events[_theEvent][_dataIndex];
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