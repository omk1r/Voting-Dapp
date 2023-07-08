//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint32 id;
        string name;
        uint32 votesCount;
    }

    mapping(uint32 => Candidate) public candidates;
    mapping(address => bool) public Voters;

    event Voted(uint32 indexed candidateId);

    uint32 public candidateCount;

    function addCandidate(string memory _name) private {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount,_name,0);
    }

    function election() public {
        addCandidate("Elon");
        addCandidate("Mark");
    }

    function vote(uint32 _id) public {
        require(!Voters[msg.sender],"You can only vote once");
        require(_id > 0 && _id <= candidateCount,"Please enter valid Candidate Id");
        Voters[msg.sender] = true;
        candidates[_id].votesCount++;
        emit Voted(_id);
    }
}