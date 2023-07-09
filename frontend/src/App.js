import React, { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import contractABI from "./contractABI.json";

function App() {
  const [connected, setConnected] = useState(false);
  const [user, setUser] = useState("");
  const [cont1, setCont1] = useState();
  const [cont2, setCont2] = useState();
  const contractAddress = "0xd4d8bc1E8BF6A36B72CE6c66e0d77b44F16f3C50";

  let provider = typeof window !== "undefined" && window.ethereum;

  const connect = async () => {
    try {
      if (!provider) return alert("Please install Metamask");
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length) {
        setUser(accounts[0]);
        setConnected(true);
      }
    } catch (error) {
      alert(error);
    }
  };

  const getContract = () => {
    try {
      const web3 = new Web3(provider);
      return new web3.eth.Contract(contractABI, contractAddress);
    } catch (error) {
      console.error(error);
    }
  };

  const getContestants = async () => {
    try {
      const contract = getContract();
      const player1 = await contract.methods.candidates(1).call();
      const player2 = await contract.methods.candidates(2).call();

      setCont1(player1);

      setCont2(player2);
      {
        cont1 && console.log(cont1.votesCount, cont2.votesCount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVote = async (id) => {
    let sendVote = false;
    try {
      const contract = getContract();
      const vote = await contract.methods.vote(id).call({
        from: user,
      });
      sendVote = true;
    } catch (error) {
      alert(error);
    }
    if (sendVote) {
      const contract = getContract();
      const vote = await contract.methods.vote(id).send({
        from: user,
      });
    }
  };

  useEffect(() => {
    getContestants();
  }, [handleVote]);

  return (
    <>
      <h1>Voting Dapp</h1>
      <div className="connect" onClick={connect}>
        {connected ? user.slice(0, 4) + "..." + user.slice(38) : "Connect"}
      </div>
      {cont1 && cont2 && (
        <div className="App">
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Votes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{cont1.id.toString()}</td>
                <td>{cont1.name}</td>
                <td>{cont1.votesCount.toString()}</td>
                <td>
                  <button className="btn" onClick={() => handleVote(1)}>
                    Vote
                  </button>
                </td>
              </tr>
              <tr>
                <td>{cont2.id.toString()}</td>
                <td>{cont2.name}</td>
                <td>{cont2.votesCount.toString()}</td>
                <td>
                  <button className="btn" onClick={() => handleVote(2)}>
                    Vote
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <p>One user can only vote once.</p>
    </>
  );
}

export default App;
