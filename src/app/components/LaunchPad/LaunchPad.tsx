import * as React from "react";

interface LaunchPadProps {
  presaleDetails: any[],
  getCountDownValues: any;
  creator: string
  buyToken: any
}
export const LaunchPad = (props: LaunchPadProps) => {
  const { presaleDetails, getCountDownValues, creator, buyToken } = props;
  const [timerData, setTimerData] = React.useState<any[]>([
    { value: "13", label: "Days" },
    { value: "03", label: "Hours" },
    { value: "12", label: "Minutes" },
    { value: "48", label: "Seconds" },
  ])
  const [trancheData, setTrancheData] = React.useState({
    available: "100",
    purchased: "0",
    discount: "10%",
    maxSupply: "100000 new token",
    launchPrice: "1 USDC",
    marketCap: "10000 USDC",
  })
  const [groupedCards, setGroupedCards] = React.useState<any[]>([])
  // const [cardData, setCardData] = React.useState(Array.from({ length: 11 }, (_, i) => ({ id: i })))
  const [cardData, setCardData] = React.useState(presaleDetails);
  const [amount, setAmount] = React.useState("");
  const [token, setToken] = React.useState(0);

  React.useEffect(() => {
    const data = [];
    let i = 0;
    while (i < cardData.length) {
      if (i === 0) {
        data.push([cardData[i]]);
        i += 1;
      } else {
        data.push(cardData.slice(i, i + 3));
        i += 3;
      }
    }
    console.log("===== DATA =====", data);
    setGroupedCards(data);
  }, [])
  const handleAmount = (event: React.ChangeEvent<HTMLInputElement>, tokenInfo: any) => {
    setAmount(event.target.value);
    setToken(Number(event.target.value) / tokenInfo.presaleDetail.launchPrice);
  }
  const getTrancheLabel = (index: number) => {
    const labels = ["1st Tranche", "2nd Tranche", "3rd Tranche", "4th Tranche"];
    return labels[index];
  };
  const renderTranche = (data: any) => {
    let available: number = 0;
    for (let index = 0; index < data.presaleDetail.discount.length; index++) {
      const element = data.presaleDetail.discount[index];
      available = Number(element.value);
      if (available - data.presaleDetail.totalSold > 0) {
        return (
          <div className="w-[269px] flex flex-col items-start justify-center ml-[10px] text-white font-['Avenir LT Std',sans-serif]">
            <div className="font-black text-[12px] leading-[1] mb-[8px] tracking-[-0.04em]">
              {getTrancheLabel(index)}
            </div>
            <div className="flex gap-[10px] mb-[6px]">
              <div key={index} className="w-[50px] h-[27px] rounded-[4px] bg-[#3C39BE33] border-b border-[#fff3] flex flex-col items-center justify-center">
                <div className="text-[9px] font-bold">Available</div>
                <div className="text-[8px] font-light">{available - data.presaleDetail.totalSold}</div>
              </div>
              <div key={index} className="w-[50px] h-[27px] rounded-[4px] bg-[#3C39BE33] border-b border-[#fff3] flex flex-col items-center justify-center">
                <div className="text-[9px] font-bold">Purchased</div>
                <div className="text-[8px] font-light">{Number(element.value) - (available - data.presaleDetail.totalSold)}</div>
              </div>
              <div key={index} className="w-[50px] h-[27px] rounded-[4px] bg-[#3C39BE33] border-b border-[#fff3] flex flex-col items-center justify-center">
                <div className="text-[9px] font-bold">Discount</div>
                <div className="text-[8px] font-light">{element.percentage}%</div>
              </div>
            </div>
            <div className="flex gap-[5px]">
              <div key={index} className="w-[85px] h-[27px] rounded-[4px] bg-[#3C39BE33] border-b border-[#fff3] flex flex-col items-center justify-center text-center px-1">
                <div className="text-[8.5px] font-bold leading-tight">Max Supply</div>
                <div className="text-[8px] font-light">{data.coinDetail.supply} {data.coinDetail.symbol}</div>
              </div>
              <div key={index} className="w-[85px] h-[27px] rounded-[4px] bg-[#3C39BE33] border-b border-[#fff3] flex flex-col items-center justify-center text-center px-1">
                <div className="text-[8.5px] font-bold leading-tight">Launch Price</div>
                <div className="text-[8px] font-light">{data.presaleDetail.launchPrice} USDC</div>
              </div>
              <div key={index} className="w-[85px] h-[27px] rounded-[4px] bg-[#3C39BE33] border-b border-[#fff3] flex flex-col items-center justify-center text-center px-1">
                <div className="text-[8.5px] font-bold leading-tight">Market Cap</div>
                <div className="text-[8px] font-light">{data.presaleDetail.launchMarketCap} USDC</div>
              </div>
            </div>
          </div>
        )
      }
    }
  }
  return (
    <div className="min-h-screen bg-[#010117] py-10 px-4">
      {groupedCards.map((group, groupIdx) => (
        <div
          key={groupIdx}
          className={`flex flex-wrap justify-center gap-6 mb-8`}
        >
          {group.map((presale: any, index: number) => (
            <div key={index} className="relative">
              {/* Header */}
              <div className="h-[40px] w-[392px] bg-[#0A34C4] rounded-t-[14px] pl-[80px] pr-3 flex items-center justify-between relative">
                <div className="flex flex-col font-poppins">
                  <div className="text-[10px] font-medium underline whitespace-nowrap text-ellipsis overflow-hidden">
                    {presale.coinDetail.name} <span className="text-[#C2C2C2]">• {presale.coinDetail.symbol}</span>
                  </div>
                  <div className="text-[9px] text-[#3C99FF] underline cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden">
                    {creator}
                  </div>
                </div>
                <div className="flex gap-3">
                  {timerData.map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="text-base font-bold text-white">{getCountDownValues(new Date(presale.presaleDetail.lockPeriod).getTime() - new Date().getTime(), item.label)}</div>
                      <div className="text-[9px] text-white/70">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="w-[392px] h-[173px] bg-[#1A184D] border border-[#5a84ff] rounded-b-[14px] flex p-1 font-poppins">
                {/* Left Side */}
                <div className="w-[135px] flex flex-col pt-[40px] pr-3 relative">
                  <div className="absolute top-[-35px] left-[5px] z-10">
                    <div className="w-[75px] h-[75px] rounded-full border-[2px] border-[#040432] overflow-hidden bg-white shadow-md">
                      <img
                        src={presale.coinDetail.image}
                        alt="Token"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <label className="text-[9px] font-extrabold mb-[2px] leading-none tracking-tight text-white">
                    Amount
                  </label>
                  <div className="flex items-center mb-[5px]">
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-[70px] h-[24px] px-2 rounded-[4px] border border-[#FF8FE7] bg-[rgba(255,143,231,0.08)] text-white text-[10px] font-normal outline-none pr-1 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      value={amount}
                      onChange={(event) => handleAmount(event, presale)}
                    />
                    <span className="ml-[4px] text-[7px] text-white">USDC</span>
                  </div>

                  <div className="flex items-right text-white text-[10px] font-normal mb-[3px]">
                    <span className="text-grey">{token}</span>
                    <span className="ml-[34px] text-[#CFCFCF] text-[8px]">{presale.coinDetail.symbol}</span>
                  </div>

                  <div className="text-[#CFCFCF] text-[5.4px] leading-[110%] mb-[2px]">
                    Minimum: {presale.presaleDetail.purchaseMinimum} USDC<br />
                    Maximum: {presale.presaleDetail.purchaseMaximum} USDC
                  </div>
                  <button className="w-[70px] h-[21px] bg-[#FF00AE]/70 hover:bg-[#FF00AE] text-white rounded-[3px] text-[10px] font-bold0" onClick={() => buyToken(presale)}>
                    Buy
                  </button>

                  <p className="text-[6px] text-white mt-1 leading-[1.2]">
                    Plus a small amount of SOL for gas fees
                  </p>
                </div>

                {/* Right Side */}
                {renderTranche(presale)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}