import * as React from "react";
import BigNumber from 'bignumber.js';

interface LaunchPadProps {
  getCountDownValues: any;
  creator: string;
  buyToken: any;
  presale: any;
  isBuying: boolean;
}
export const LaunchPad = (props: LaunchPadProps) => {
  const { getCountDownValues, creator, buyToken, presale, isBuying } = props;
  const [timerData] = React.useState<any[]>([
    { label: "Days" },
    { label: "Hours" },
    { label: "Minutes" },
    { label: "Seconds" },
  ])
  const [amount, setAmount] = React.useState("");
  const [token, setToken] = React.useState(0);
  const [currentTranche, setCurrentTranche] = React.useState(0);

  const handleAmount = (event: React.ChangeEvent<HTMLInputElement>, tokenInfo: any) => {
    setAmount(event.target.value);
    const calculatedToken = ((Number(event.target.value) / tokenInfo.presaleDetail.launchPrice) + Number(event.target.value) * Number(tokenInfo.presaleDetail.discount[currentTranche].percentage) / 100).toFixed(9)
    setToken(Number(calculatedToken));
  }
  const getTrancheLabel = (index: number) => {
    const labels = ["1st Tranche", "2nd Tranche", "3rd Tranche", "4th Tranche"];
    if (currentTranche !== index) {
      setCurrentTranche(index);
    }
    return labels[index];
  };
  const renderTranche = (data: any) => {
    let available: number = 0;
    for (let index = 0; index < data.presaleDetail.discount.length; index++) {
      const element = data.presaleDetail.discount[index];
      available += Number(element.value);
      if (available - data.presaleDetail.totalSold > 0) {
       return (
  <div className="w-full flex flex-col items-start mt-8 text-white font-['Avenir LT Std',sans-serif]">
    {/* Tranche Label */}
    <div className="font-black text-[12px] sm:text-[13px] md:text-[14px] leading-[1] mb-[8px] tracking-[-0.04em]">
      {getTrancheLabel(index)}
    </div>

    {/* Available / Purchased / Discount */}
    <div className="flex flex-wrap gap-[10px] mb-[6px]">
      <div
        key={index}
        className="w-[46px] sm:w-[60px] md:w-[70px] h-[27px] sm:h-[32px] rounded-[4px] 
                   bg-[#3C39BE33] border-b border-[#fff3] flex flex-col items-center justify-center"
      >
        <div className="text-[9px] sm:text-[10px] font-bold">Available</div>
        <div className="text-[8px] sm:text-[9px] font-light">
          {available - data.presaleDetail.totalSold}
        </div>
      </div>

      <div
        key={index}
        className="w-[51px] sm:w-[65px] md:w-[75px] h-[27px] sm:h-[32px] rounded-[4px] 
                   bg-[#3C39BE33] border-b border-[#fff3] flex flex-col items-center justify-center"
      >
        <div className="text-[9px] sm:text-[10px] font-bold">Purchased</div>
        <div className="text-[8px] sm:text-[9px] font-light">
          {new BigNumber(Number(element.value))
            .minus(new BigNumber(available - data.presaleDetail.totalSold))
            .toString()}
        </div>
      </div>

      <div
        key={index}
        className="w-[45px] sm:w-[60px] md:w-[70px] h-[27px] sm:h-[32px] rounded-[4px] 
                   bg-[#3C39BE33] border-b border-[#fff3] flex flex-col items-center justify-center"
      >
        <div className="text-[9px] sm:text-[10px] font-bold">Discount</div>
        <div className="text-[8px] sm:text-[9px] font-light">
          {element.percentage}%
        </div>
      </div>
    </div>

    {/* Max Supply / Launch Price / Market Cap */}
    <div className="flex flex-wrap gap-[5px]">
      <div
        key={index}
        className="w-[85px] sm:w-[110px] md:w-[130px] h-[27px] sm:h-[32px] rounded-[4px] 
                   bg-[#3C39BE33] border-b border-[#fff3] flex flex-col items-center 
                   justify-center text-center px-1"
      >
        <div className="text-[8.5px] sm:text-[10px] font-bold leading-tight">
          Max Supply
        </div>
        <div className="text-[8px] sm:text-[9px] font-light">
          {data.coinDetail.supply} {data.coinDetail.symbol}
        </div>
      </div>

      <div
        key={index}
        className="w-[85px] sm:w-[110px] md:w-[130px] h-[27px] sm:h-[32px] rounded-[4px] 
                   bg-[#3C39BE33] border-b border-[#fff3] flex flex-col items-center 
                   justify-center text-center px-1"
      >
        <div className="text-[8.5px] sm:text-[10px] font-bold leading-tight">
          Launch Price
        </div>
        <div className="text-[8px] sm:text-[9px] font-light">
          {data.presaleDetail.launchPrice} USDC
        </div>
      </div>

      <div
        key={index}
        className="w-[85px] sm:w-[110px] md:w-[130px] h-[27px] sm:h-[32px] rounded-[4px] 
                   bg-[#3C39BE33] border-b border-[#fff3] flex flex-col items-center 
                   justify-center text-center px-1"
      >
        <div className="text-[8.5px] sm:text-[10px] font-bold leading-tight">
          Market Cap
        </div>
        <div className="text-[8px] sm:text-[9px] font-light">
          {data.presaleDetail.launchMarketCap} USDC
        </div>
      </div>
    </div>
  </div>
);

      }
    }
  }
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 9,
    }).format(amount);
  };
return (
  <>
    <div className="relative max-w-5xl mx-auto font-poppins">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-blue-900 rounded-t-xl px-4 sm:px-6 py-3 relative">
        
    
        <div className="flex sm:block items-center sm:absolute sm:top-10 sm:left-4">
          <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-blue-950 overflow-hidden shadow-lg">
            <img
              src={presale.coinDetail.image}
              alt="Token"
              className="w-full h-full object-cover"
            />
          </div>

          
          <div className="ml-3 sm:hidden flex flex-col min-w-0">
            <div className="text-sm font-medium underline truncate text-white">
              {presale.coinDetail.name}{" "}
              <span className="text-gray-300">• {presale.coinDetail.symbol}</span>
            </div>
            <div className="text-xs text-sky-400 underline cursor-pointer truncate">
              {creator}
            </div>
          </div>
        </div>

       
        <div className="hidden sm:flex flex-col ml-28 min-w-0">
          <div className="text-sm md:text-base font-medium underline truncate text-white">
            {presale.coinDetail.name}{" "}
            <span className="text-gray-300">• {presale.coinDetail.symbol}</span>
          </div>
          <div className="text-xs md:text-sm text-sky-400 underline cursor-pointer truncate">
            {creator}
          </div>
        </div>

       
        <div className="flex justify-center sm:justify-end space-x-3 sm:space-x-4 mt-3 sm:mt-0 w-full sm:w-auto flex-shrink-0">
          {timerData.map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-sm sm:text-base font-bold text-white">
                {getCountDownValues(
                  new Date(presale.presaleDetail.lockPeriod).getTime() -
                    new Date().getTime(),
                  item.label
                )}
              </div>
              <div className="text-[9px] sm:text-[10px] md:text-xs text-white/70">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col sm:flex-row bg-indigo-950 border border-indigo-400 rounded-b-xl p-3 sm:p-4">
        {/* Left Side */}
        <div className="flex flex-col w-full sm:w-[130px] relative mt-4 sm:mt-8 sm:ml-4 sm:mr-8 flex-shrink-0">
          <label className="text-[9px] sm:text-[10px] md:text-xs font-bold text-white">
            Amount
          </label>
          <div className="flex items-center mb-1">
            <input
              type="number"
              placeholder="0.00"
              className="flex-grow min-w-[80px] sm:min-w-[100px] max-w-[200px] h-6 px-2 rounded border border-pink-400 bg-pink-200/10 text-white text-[9px] sm:text-[10px] md:text-xs outline-none text-right"
              value={amount}
              onChange={(event) => handleAmount(event, presale)}
            />
            <span className="ml-1 text-[8px] sm:text-[9px] md:text-xs text-white">
              USDC
            </span>
          </div>

          <div className="flex items-center text-white text-[9px] sm:text-[10px] mb-1">
            <span className="text-grey">
              {formatAmount(token)
                .replace(/[$,]/g, "")
                .replace(/\.00$/, "")}
            </span>
            <span className="ml-3 sm:ml-4 text-gray-400 text-[8px] sm:text-[9px]">
              {presale.coinDetail.symbol}
            </span>
          </div>

          <div className="text-gray-400 text-[7px] sm:text-[8px] md:text-[9px] leading-tight mb-1">
            Minimum: {presale.presaleDetail.purchaseMinimum} USDC
            <br />
            Maximum: {presale.presaleDetail.purchaseMaximum} USDC
          </div>
          <button
            className="w-[80px] sm:w-[90px] h-6 bg-[#FF00AE] mt-1 text-white rounded text-[10px] sm:text-xs font-bold"
            onClick={() => buyToken(amount, token)}
          >
            {isBuying ? "Buying" : "Buy"}
          </button>

          <p className="text-[6px] sm:text-[7px] md:text-[8px] text-gray-300 mt-1">
            Plus a small amount of SOL for gas fees
          </p>
        </div>

        
        <div className="flex-1 overflow-x-auto mt-4 sm:mt-0">
          <div className="min-w-[280px] sm:min-w-0">{renderTranche(presale)}</div>
        </div>
      </div>
    </div>
  </>
);

}