"use client";
import useWallet from "@/utils/wallet";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ClaimPage = () => {
    const wallet = useWallet();
    const [history, setHistory] = useState({
        history: [],
        inPool: 0,
        tokenUsage: 0,
        rewards: 0
    });

    const [filter, setFilter] = useState("all");
    const [projectId, setProjectId] = useState("");
    const [projects, setProjects] = useState([]);
    const [reward, setReward] = useState(0);

    useEffect(() => {
        if (wallet) {
            console.log("ClaimPage mounted");
            getMembershipHistory();
            getAgentInfo();
        }
    }, [wallet]);
    useEffect(() => {
        if (projectId) {
            getRewardInfo();
        }
    }, [projectId]);

    const getRewardInfo = async () => {
        const token = localStorage.getItem("token") || "";
        const response = await axios.get(`/api/membership/get-reward?agentId=${projectId}`, {
            headers: {
                'authorization': `Bearer ${token}`,
            }
        });
        console.log("Reward Info:", response.data);
        setReward(response.data.result);
    }

    const getAgentInfo = async () => {
        const token = localStorage.getItem("token") || "";
        const response = await axios.get(`/api/membership/get-agent-by-user?creator=${wallet?.publicKey.toString()}`, {
            headers: {
                'authorization': `Bearer ${token}`,
            }
        });
        console.log("Agent History:", response.data);
        setProjects(response.data.result);
        if (response.data.result[0]) {
            setProjectId(response.data.result[0].key);
        }
    }

    const getMembershipHistory = async () => {
        try {
            const token = localStorage.getItem("token") || "";
            const response = await axios.get('/api/membership/get-history', {
                headers: {
                    'authorization': `Bearer ${token}`,
                }
            });
            console.log("Membership History:", response.data);
            setHistory(response.data.result);
        } catch (error) {
            console.error("Error fetching history", error);
            setHistory({
                history: [],
                inPool: 0,
                tokenUsage: 0,
                rewards: 0
            });
        }
    };

    const getDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <div className="p-4">
            {/* Dropdown Filter */}
            <div className="flex justify-center mb-4">
                <select
                    className="text-white border border-white rounded-lg px-4 py-2 focus:outline-none bg-transparent"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                >
                    {projects.map((project: any, index) => (
                        <option key={index} value={project.key} className="text-black">{project.name}</option>
                    ))}
                </select>
            </div>

            {/* Stat Boxes */}
            <div className="flex flex-wrap justify-center gap-6 mb-6">
                {/* Box 1 - In Pool */}
                <div className="rounded-xl border border-white p-4 w-60 text-center">
                    <h2 className="text-xl font-bold text-white">In Pool</h2>
                    <p className="text-2xl font-semibold text-white mt-1">{history.inPool}</p>
                </div>

                {/* Box 2 - Token Usage */}
                <div className="rounded-xl border border-white p-4 w-60 text-center">
                    <h2 className="text-xl font-bold text-white">Token Usage</h2>
                    <p className="text-2xl font-semibold text-white mt-1">{history.tokenUsage}</p>
                </div>

                {/* Box 3 - Rewards */}
                <div className="rounded-xl border border-white p-4 w-60 text-center">
                    <h2 className="text-xl font-bold text-white">Rewards</h2>
                    <p className="text-2xl font-semibold text-white mt-1">{reward}</p>
                </div>
                {/* Box 3 - Rewards */}
                <div className="rounded-xl border border-white p-4 w-60 text-center">
                    <h2 className="text-xl font-bold text-white">Withdrawal</h2>
                    <p className="text-2xl font-semibold text-white mt-1">{reward}</p>
                </div>
            </div>

            {/* History Table */}
            <h3 className="text-left pl-[20px] text-white text-lg mb-2">History</h3>
            <div className="overflow-x-auto">
                <table className="table text-white">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Wallet</th>
                            <th>Membership</th>
                            <th>Membership Type</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.history
                            .filter((item: any) => filter === "all" || item.membership === filter)
                            .map((item: any, index: number) => (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>{item.wallet}</td>
                                    <td>{item.membership}</td>
                                    <td>{item.membershiptype}</td>
                                    <td>{formatAmount(item.price)}</td>
                                    <td>{getDate(item.created_date)}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClaimPage;
