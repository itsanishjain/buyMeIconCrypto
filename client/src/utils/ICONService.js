import IconService from "icon-sdk-js";
const { IconConverter, IconBuilder, IconAmount } = IconService;

const iconService = new IconService(
  new IconService.HttpProvider("https://sejong.net.solidwallet.io/api/v3")
);

// convert to icx
export const convertToICX = (balance) => {
  return IconService.IconAmount.of(balance, IconService.IconAmount.Unit.LOOP)
    .convertUnit(IconService.IconAmount.Unit.ICX)
    .toString();
};

// to get the balance of the current address
export const getBalance = (address) => {
  return iconService
    .getBalance(address || localStorage.getItem("ADDRESS"))
    .execute()
    .then((balance) => {
      return convertToICX(balance);
    });
};

// to get the Info of the current address
export const getAccountInfo = async (_address, setTotalBalance) => {
  try {
    const balance = await getBalance(_address);
    console.log("BALANCE", balance);
    localStorage.setItem("BALANCE", balance.toString());
    setTotalBalance(balance);
  } catch (err) {
    console.log("Error to get info about account", err);
  }
};

// connect to the icon network
export const connectWallet = (
  setIsConnected,
  setCurrentAccount,
  setTotalBalance
) => {
  if (window) {
    const customEvent = new CustomEvent("ICONEX_RELAY_REQUEST", {
      detail: {
        type: "REQUEST_ADDRESS",
      },
    });
    window.dispatchEvent(customEvent);
    const eventHandler = (event) => {
      // payload is selected address
      const { type, payload } = event?.detail;
      // runs after a address is selected
      if (type === "RESPONSE_ADDRESS") {
        localStorage.setItem("ADDRESS", payload);
        getAccountInfo(payload, setTotalBalance);
        setCurrentAccount(localStorage.getItem("ADDRESS"));
        sessionStorage.setItem("isConnected", "connected");
        setIsConnected(true);
      }
    };
    window.addEventListener("ICONEX_RELAY_RESPONSE", eventHandler);
  }
};

// send icx to the address
export const sendTransaction = async (
  addressTo,
  amount,
  keyword,
  message,
  setIsLoading,
  setTotalBalance
) => {
  const fromAddress = localStorage.getItem("ADDRESS");
  try {
    const callTransactionData = new IconBuilder.MessageTransactionBuilder()
      .from(fromAddress)
      .to(addressTo)
      .value(amount * 10 ** 18)
      // to send icx and data set step limit to 10**6
      .stepLimit(IconService.IconConverter.toBigNumber(10 ** 6))
      .nid("0x53")
      .nonce(IconService.IconConverter.toBigNumber(1))
      .version(IconService.IconConverter.toBigNumber(3))
      .timestamp(new Date().getTime() * 1000)
      .data(IconService.IconConverter.fromUtf8(`${keyword}|${message}`))
      .build();

    const transaction = {
      jsonrpc: "2.0",
      method: "icx_sendTransaction",
      params: IconConverter.toRawTransaction(callTransactionData),
      id: 50889,
    };

    window.dispatchEvent(
      new CustomEvent("ICONEX_RELAY_REQUEST", {
        detail: {
          type: "REQUEST_JSON-RPC",
          payload: transaction,
        },
      })
    );
    const eventHandler = (event) => {
      const { type, payload } = event.detail;
      if (type === "RESPONSE_JSON-RPC") {
        console.log("3RD RUN HERE");
        if (payload && payload.result && payload.result.startsWith("0x")) {
          // call the server to save the transaction
          // console.log("calling server to save the transaction");
          setIsLoading(false);
          // getAccountInfo(localStorage.getItem("ADDRESS"), setTotalBalance);
          let remainBalance =
            parseFloat(localStorage.getItem("BALANCE")) - amount;

            console.log('SB',localStorage.getItem("BALANCE"))
            console.log('PARB',parseFloat(localStorage.getItem("BALANCE")))

          
          localStorage.setItem("BALANCE", remainBalance.toString());
          setTotalBalance(remainBalance.toString());
        }
      }
    };
    window.addEventListener("ICONEX_RELAY_RESPONSE", eventHandler);
    console.log("2ND RUN  HERE");
  } catch (error) {
    console.log("Error in sending transaction", error);
  }
};
