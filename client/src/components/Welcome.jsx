import React, { useContext, useState, useEffect } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { shortenAddress } from "../utils/shortenAddress";
import { Loader } from ".";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { connectWallet, sendTransaction } from "../utils/ICONService";

const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const Welcome = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [totalBalance, setTotalBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setformData] = useState({ addressTo: "", amount: "", message: "" });


  useEffect(() => {
    setCurrentAccount(localStorage.getItem("ADDRESS"));
    setTotalBalance(localStorage.getItem("BALANCE"));
  }, []);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    const { addressTo, amount, message } = formData;
    e.preventDefault();
    if (!addressTo || !amount || !message) {
      notify("All fields are required")
      return;
    }
    setIsLoading(true)
    sendTransaction(addressTo, amount, message, setIsLoading, setTotalBalance);
    console.log("1ST RUn ALREADY RUNNE END HERE")
  };

  const notify = (message) => toast(message);

  return (
    <div className="flex w-full justify-center items-center">
      <ToastContainer />
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            Get your audience support with <br /> Crypto
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            With BuyMeIconCrypto your audience can support you with cryptocurrency
          </p>
          <button
            type="button"
            onClick={() => connectWallet(setIsConnected, setCurrentAccount, setTotalBalance)}
            className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
          >
            <AiFillPlayCircle className="text-white mr-2" />
            <p className="bg-[#2952e3]  px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd] text-white mr-2">
              Connect Your Wallet
            </p>
          </button>

          <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
            <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
              Reliability
            </div>
            <div className={companyCommonStyles}>Security</div>
            <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>
              ICON
            </div>
            <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>
              Web 3.0
            </div>
            <div className={companyCommonStyles}>Low Fees</div>
            <div className={`rounded-br-2xl ${companyCommonStyles}`}>
              Blockchain
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div>
                <p className="text-white font-light text-sm">
                  {currentAccount && shortenAddress(currentAccount)}
                </p>
                <p className="text-white font-light text-sm">
                  {totalBalance && `${totalBalance} ICX`}
                </p>
                <br />
                <p className="text-black font-bold text-sm">
                  {currentAccount && <a href={`https://sejong.tracker.solidwallet.io/address/${currentAccount}`}>Your Transaction history visit <span className="text-white-500">here- </span></a>}
                </p>
                <p className="text-white font-semibold text-lg mt-1">
                  Icon
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
            <Input placeholder="Address To" name="addressTo" type="text" handleChange={handleChange} />
            <Input placeholder="Amount (ICX)" name="amount" type="number" handleChange={handleChange} />
            <Input placeholder="Enter Message" name="message" type="text" handleChange={handleChange} />

            <div className="h-[1px] w-full bg-gray-400 my-2" />

            {isLoading
              ? <Loader />
              : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                  Send now
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
