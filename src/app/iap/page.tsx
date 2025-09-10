'use client'
import { useState } from "react";
// import { Shield, CreditCard, Clock, DollarSign, Search } from "lucide-react";

export default function Iap() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [activeTab, setActiveTab] = useState("Category");

  const earningsData = [
    { id: 1, type: "Airdrop", staked: "$1095", available: "$559", unlocks: "Unlocks in 65 days, 12 hours 43 minutes" },
    { id: 2, type: "Referrals", staked: "$1095", available: "$559", unlocks: "Unlocks in 65 days, 12 hours 43 minutes" },
    { id: 3, type: "Royalties", staked: "-", available: "$559", unlocks: "Unlocks in 65 days, 12 hours 43 minutes" },
    { id: 4, type: "Coins", staked: "$1095", available: "$559", unlocks: "Unlocks in 65 days, 12 hours 43 minutes" },
    { id: 5, type: "Airdrop", staked: "$1095", available: "$559", unlocks: "Unlocks in 65 days, 12 hours 43 minutes" },
    { id: 6, type: "Referrals", staked: "$1095", available: "$559", unlocks: "Unlocks in 65 days, 12 hours 43 minutes" },
    { id: 7, type: "Royalties", staked: "-", available: "$559", unlocks: "Unlocks in 65 days, 12 hours 43 minutes" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Balance */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">$134.23</h1>
          <div className="flex justify-center items-center gap-4 text-sm">
            <span className="text-green-400">+$21.43</span>
            <span className="text-green-400">+$21.43</span>
          </div>
          <p className="text-gray-400 text-xs mt-1">vincekgr4gtly_x16</p>
        </div>

        {/* Navigation Icons */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center mb-2 border border-gray-700/50">
              {/* <Shield className="w-5 h-5 text-gray-300" /> */}
            </div>
            <span className="text-gray-300 text-xs">Vault</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center mb-2 border border-gray-700/50">
              {/* <CreditCard className="w-5 h-5 text-gray-300" /> */}
            </div>
            <span className="text-gray-300 text-xs">Ramps</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center mb-2 border border-gray-700/50">
              {/* <Clock className="w-5 h-5 text-gray-300" /> */}
            </div>
            <span className="text-gray-300 text-xs">History</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center mb-2 border border-gray-700/50">
              {/* <DollarSign className="w-5 h-5 text-gray-300" /> */}
            </div>
            <span className="text-gray-300 text-xs">Earnings</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <p className="text-gray-400 text-xs mb-1">Total Amount Earned</p>
            <p className="text-white text-xl font-bold">$1059</p>
          </div>
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <p className="text-gray-400 text-xs mb-1">Available Tokens</p>
            <p className="text-white text-xl font-bold">$850</p>
          </div>
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <p className="text-gray-400 text-xs mb-1">Staked Tokens</p>
            <p className="text-white text-xl font-bold">$410</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative">
            <select 
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2 text-gray-300 text-sm appearance-none pr-8 focus:outline-none focus:border-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option>All Categories</option>
              <option>Airdrop</option>
              <option>Referrals</option>
              <option>Royalties</option>
              <option>Coins</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="relative flex-1">
            {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
            <input
              type="text"
              placeholder="Type your search terms"
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-10 pr-4 py-2 text-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-1 mb-6 border border-gray-700/50">
          <div className="grid grid-cols-3 gap-1">
            {["Category", "Staked", "Unstaked"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Earnings List */}
        <div className="space-y-3">
          {earningsData.map((item) => (
            <div key={item.id} className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-white font-medium">{item.type}</span>
                    <span className="text-gray-300">{item.staked}</span>
                    <span className="text-white font-medium">{item.available}</span>
                  </div>
                  <p className="text-gray-400 text-xs">{item.unlocks}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="bg-gray-700/50 hover:bg-gray-700 text-gray-300 px-4 py-1 rounded-lg text-sm border border-gray-600/50 transition-colors">
                    Trade
                  </button>
                  <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-1 rounded-lg text-sm transition-all">
                    Redeem
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}