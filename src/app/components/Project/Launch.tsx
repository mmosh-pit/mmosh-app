export const Launch = () => {
    return (
        <div className="min-h-screen bg-[#0B063E] text-white p-4 flex flex-col items-center justify-center">
            {/* Launch content grid */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Market Cap, Deadline, Launch Price */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-base mb-1 text-white/80">
                            Set the Market Cap for when it goes to DEX *
                        </label>
                        <input
                            type="text"
                            placeholder="$10,000"
                            defaultValue="10000"
                            className="w-full h-[48px] bg-transparent text-white px-4 py-2 rounded-[7px] border border-[#FFFFFF38] placeholder-white/40 focus:outline-none"
                        />
                        <p className="text-xs text-white/40 mt-1">
                            Minimum is $10K - Maximum of $1M
                        </p>
                    </div>

                    <div>
                        <label className="block text-base mb-1 text-white/80">
                            Deadline to reach Market Cap *
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                className="w-1/2 h-[48px] bg-transparent text-white px-4 py-2 rounded-[7px] border border-[#FFFFFF38] focus:outline-none"
                            />
                            <input
                                type="time"
                                className="w-1/2 h-[48px] bg-transparent text-white px-4 py-2 rounded-[7px] border border-[#FFFFFF38] focus:outline-none"
                            />
                        </div>
                        <p className="text-xs text-white/40 mt-1">
                            If it doesn’t reach the market cap by the deadline, funds are
                            distributed by the bonding curve (all Agent Coins are burned, all
                            trading pair is sent to buyers)
                        </p>
                    </div>

                    <div>
                        <label className="block text-base mb-1 text-white/80">
                            Launch Price
                        </label>
                        <input
                            type="text"
                            placeholder="$0.001"
                            defaultValue="0.001"
                            className="w-full h-[48px] bg-transparent text-white px-4 py-2 rounded-[7px] border border-[#FFFFFF38] placeholder-white/40 focus:outline-none"
                        />
                        <p className="text-xs text-white/40 mt-1">
                            The price where the bonding curve will start
                        </p>
                    </div>
                </div>

                {/* Coin selection, Bonding Curve */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-base mb-1 text-white/80">
                            Select a Free Agent Coin to pair
                        </label>
                        <div className="w-full flex items-center gap-2 px-4 py-3 border border-[#FFFFFF38] rounded-[8px] bg-[#1B175F] text-white">
                            <img
                                src="https://cdn.pixabay.com/photo/2022/09/11/04/28/monkey-7446118_960_720.png"
                                alt="MMOSH"
                                className="w-6 h-6 rounded-full"
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-white">MMOSH</p>
                                <p className="text-xs text-white/50">The Stoked Token</p>
                            </div>
                            <span className="text-xs text-white/40">1,489,903</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-base mb-1 text-white/80">
                            Choose a Bonding Curve for your Coin.
                        </label>
                        <select className="w-full h-[48px] px-4 py-2 rounded-[8px] border border-[#FFFFFF38] bg-[#1B175F] text-white focus:outline-none">
                            <option>Exponential</option>
                            <option>Linear</option>
                            <option>Quadratic</option>
                        </select>
                    </div>

                    <div>
                        <div className="bg-[#1B175F] rounded-[8px] p-4 border border-[#FFFFFF38]">
                            <p className="text-xs text-white/50 mb-2">Chart for reference only.</p>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-white/50">Y = Price</span>
                                <span className="text-xs text-white/50">X = Supply</span>
                            </div>
                            <div className="h-32 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-[4px]"></div>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-white/50">Adjust the slope for your Bonding Curve by changing the exponent.</p>
                                <input
                                    type="number"
                                    defaultValue="2"
                                    className="w-[60px] h-[32px] text-center rounded-[6px] bg-transparent border border-[#FFFFFF38] text-white placeholder-white/40"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}