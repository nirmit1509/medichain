// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract MediChain {
    
    enum Permission { noPermission, viewOnly, editor }
    
    struct Record {
        uint8 recordId;
        string fileName;
        string ipfsHash;
        address owner;
        mapping(address => Permission) permissions;
    }
    
    uint8 public recordCount = 0;
    
    mapping(uint8 => Record) public records;
    
    function createRecord (string memory _hash, string memory _fileName) 
    public {
        require(bytes(_hash).length > 0, "Invalid document IPFS hash");
        require(bytes(_fileName).length > 0, "Invalid document name");
        recordCount ++;
        Record storage r = records[recordCount];
        r.recordId = recordCount;
        r.ipfsHash = _hash;
        r.fileName = _fileName;
        r.owner = msg.sender;
        r.permissions[r.owner] = Permission.editor;
    }
    
    function getPermission (uint8 _id, address _address) public view returns (Permission) {
        require(_id<=recordCount, "Invalid Record ID.");
        Record storage r = records[_id];
        return r.permissions[_address];
    }
    
    function changePermission (uint8 _id, address _address, uint8 _permission) public {
        require(_id<=recordCount, "Invalid Record ID.");
        require(_permission<=2, "Invalid permssion requested.");
        Record storage r = records[_id];
        require(r.permissions[msg.sender]==Permission.editor, "You have no permssion to change access");
        if(_permission == 0)
            r.permissions[_address] = Permission.noPermission;
        if(_permission == 1)
            r.permissions[_address] = Permission.viewOnly;
        if(_permission == 2)
            r.permissions[_address] = Permission.editor;
    }
    
    function viewFile (uint8 _id) public view returns (string memory) {
        require(_id<=recordCount, "Invalid Record ID.");
        Record storage r = records[_id];
        require(
            r.permissions[msg.sender]==Permission.viewOnly || r.permissions[msg.sender]==Permission.editor, 
            "You have no permssion to view this File"
        );
        return r.ipfsHash;
    }
    
    function editFile (uint8 _id, string memory _hash) public {
        require(_id<=recordCount, "Invalid Record ID.");
        require(bytes(_hash).length > 0, "Invalid document IPFS hash");
        Record storage r = records[_id];
        require(r.permissions[msg.sender]==Permission.editor, "You have no permssion to edit this File");
        r.ipfsHash = _hash;
    }

}