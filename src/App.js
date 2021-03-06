import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;


  

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #E10F0F;
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 40%;
  position: relative;
  top: 0px;
  @media (min-width: 767px) {
    flex-direction: column;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    flex: 1;
    width: 1500px;
    height: 250px;
    resizeMode: contain;
    
    
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;
export const Styledicon = styled.img`
  
@media (min-width: 767px) {
  
  Height: 100px;
  Width: 100px; 
  position: absolute;
  right: 0;
}
`;

export const Styledicon1 = styled.img`
  
@media (min-width: 767px) {
  
  Height: 100px;
  Width: 100px; 
  position: absolute;
  right: 100px;
}
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: #E10F0F;
  text-decoration: none;
`;




function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`WHAT THE HELL ARE YOU WAITING FOR.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    TOTAL_FREE: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = gasLimit;
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`MINTING YOUR HELL DEMON...`);
    setClaimingNft(true);

    if(Number(data.totalSupply) < CONFIG.TOTAL_FREE)
    {
    totalCostWei = 0;
    blockchain.smartContract.methods
      .Mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("1 FREE MINT PER WALLET, 5 PER TXN ONCE FREE RUNS OUT, DO IT RIGHT FUCKER");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `CONGRATS FUCKER YOU HAVE YOUR IMPS, NOW GO UNLEASH HELL ON ALL THE RACES!`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
    }
    else
    {
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("1 FREE MINT PER WALLET, 5 PER TXN ONCE FREE RUNS OUT, DO IT RIGHT FUCKER");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `CONGRATS FUCKER YOU HAVE YOUR IMP, NOW GO UNLEASH HELL ON ALL THE RACES!`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
    }
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 5) {
      newMintAmount = 5;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);



  return (
    <s.Screen>
      <s.Container
        
        flex={1}
        ai={"center"} //to change logo//
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        { <a href={"https://opensea.io/collection/imptown-wtf"} target="_blank">
          <Styledicon1 alt={"logo"} src={"/config/images/Icon1.png"} />
        </a> }

        <a href={"https://twitter.com/_imptownwtf"} target="_blank">
          <Styledicon alt={"logo"} src={"/config/images/icon2.png"} />
        </a>

        {/* <a href={CONFIG.MARKETPLACE_LINK}>
          <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
        </a> */}
        
    
        
        

        <s.SpacerSmall />
        <ResponsiveWrapper flex={2} style={{ padding: 60 }} test>
          <s.Container flex={2} jc={"center"} ai={"center"}>
  
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={0.1}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "black",
              padding: 1,
              borderRadius: 24,
              border: "4px double red",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,1.5)",
              
              
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {isConnected ? (data.totalSupply + "/" + CONFIG.MAX_SUPPLY) : ""}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <span
              style={{
                textAlign: "center",
              }}
            >
              

            </span>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 IMP costs {Number(data.totalSupply) < CONFIG.TOTAL_FREE ? "0" : "0.007"}  {" "} 
                  {CONFIG.NETWORK.SYMBOL}{" + GAS...WTF?"}.
                </s.TextTitle>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  5000 FREE
                </s.TextTitle>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 FREE PER WALLET DON'T BE GREEDY
                </s.TextTitle>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  5 PER TXN AFTER FREE RUNS OUT
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                        setIsConnected(true);
                      }}
                    >
                      Connect
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "SUMMONING IMP..." : "MINT FUCKER"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "40%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
           
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;