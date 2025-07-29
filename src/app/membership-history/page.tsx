"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ClaimPage = () => {
    const [history, setHistory] = useState({
        history: [],
        inPool: 0,
        tokenUsage: 0,
        rewards: 0
    });
    React.useEffect(() => {
        console.log("ClaimPage mounted");
        getMembershipHistory();
    }, [])
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
    }

    return (
        <div className="p-4">
            <div className="flex flex-wrap justify-center gap-6 mb-6">
                {/* Box 1 - In Pool */}
                <div className="rounded-xl border border-white p-4 w-60 text-center">
                    <h2 className="text-xl font-bold text-white">In Pool</h2>
                    <p className="text-2xl font-semibold text-white mt-1">${history.inPool}</p>
                </div>

                {/* Box 2 - Token Usage */}
                <div className="rounded-xl border border-white p-4 w-60 text-center">
                    <h2 className="text-xl font-bold text-white">Token Usage</h2>
                    <p className="text-2xl font-semibold text-white mt-1">${history.tokenUsage}</p>
                </div>

                {/* Box 3 - Rewards */}
                <div className="rounded-xl border border-white p-4 w-60 text-center">
                    <h2 className="text-xl font-bold text-white">Rewards</h2>
                    <p className="text-2xl font-semibold text-white mt-1">${history.rewards}</p>
                </div>
            </div>

            <h3 className="text-left pl-[20px]">History</h3>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Wallet</th>
                            <th>Membership</th>
                            <th>Membership Type</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.history.map((item: any, index) => (
                            <tr key={index}>
                                <th>{index + 1}</th>
                                <td>{item.wallet}</td>
                                <td>{item.membership}</td>
                                <td>{item.membershiptype}</td>
                                <td>{item.price}</td>
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
