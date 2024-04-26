import React, { useEffect, useState } from "react";

export function Dashboard() {
  const [userList, setUserList] = useState([]);
  const [balance, setBalance] = useState(0);
  const [display, setDisplay] = useState(false);
  const [sendMoney, setSendMoney] = useState({
    to: "",
    amount: 0,
  });

  const handleSendMoney = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8001/api/v1/account/transfer", {
        method: "POST",
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
          "Content-type": "application/json",
        },
        body: JSON.stringify(sendMoney),
      });
      const resJson = await res.json();
      if (resJson?.success) {
        console.log(resJson);
      }
    } catch (e) {

    }finally{
      setDisplay(false)
    }
  };

  const fetchUser = async (e = { target: { value: "" } }) => {
    try {
      const res = await fetch(
        "http://localhost:8001/api/v1/user/bulk?filter=" + e.target.value,
        {
          headers: {
            "Content-type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const resJson = await res.json();
      if (resJson?.success) {
        setUserList(() => resJson.data);
      }
    } catch (e) {}
  };

  const fetchUserBalance = async () => {
    try {
      const res = await fetch("http://localhost:8001/api/v1/account/balance", {
        headers: {
          "Content-type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const resJson = await res.json();
      if (resJson?.success) {
        setBalance(() => resJson.data.balance);
      }
    } catch (e) {}
  };
  useEffect(() => {
    fetchUserBalance();
    fetchUser();
  }, []);
  return (
    <div>
      <dialog open={display} className="">
        Send money
        <form onSubmit={handleSendMoney}>
          <div>
            <label htmlFor="to">To</label>
            <input
              onChange={(e) =>
                setSendMoney((prev) => ({ ...prev, to: e.target.value }))
              }
              type="text"
              name="to"
              id="to"
            />
          </div>
          <div>
            <label htmlFor="amount">Amount</label>
            <input
              onChange={(e) =>
                setSendMoney((prev) => ({
                  ...prev,
                  amount: Number(e.target.value),
                }))
              }
              type="number"
              name="amount"
              id="amount"
            />
          </div>
          <button>Send money</button>
        </form>
      </dialog>
      <h1>Your balance: {balance}</h1>
      <input type="text" onChange={fetchUser} />
      <div>
        {userList?.map((user) => (
          <div>
            <p>{user.firstName + user.lastName}</p>
            <button onClick={() => setDisplay(true)}>Send money</button>
          </div>
        ))}
      </div>
    </div>
  );
}
