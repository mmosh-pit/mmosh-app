import React from "react";

interface MintingProps {
    callback: (data: any) => void;
}

export const PreSale = (props: MintingProps) => {
    const { callback } = props;

    const [preSaleDiscount, setPreSaleDiscount] = React.useState(
        [
            {
                amount: "",
                discountPercentage: "",
                label: "1st"
            },
            {
                amount: "",
                discountPercentage: "",
                label: "2nd"
            },
            {
                amount: "",
                discountPercentage: "",
                label: "3rd"
            },
            {
                amount: "",
                discountPercentage: "",
                label: "4th"
            },
        ]
    );

    const [preSale, setPreSale] = React.useState([
        {
            label: "Pre-sale minimum",
            value: "",
            desc: "Minimum amount to raise or funds will be returned",
            key: "pre-sale-minimum",
        },
        {
            label: "Pre-sale maximum",
            value: "",
            desc: "Limit on what can be raised in pre-sale",
            key: "pre-sale-maximum",
        },
        {
            label: "Minimum purchase",
            value: "",
            desc: "What a single person needs to spend",
            key: "minimum-purchase",
        },
        {
            label: "Maximum purchase",
            value: "",
            desc: "What a single person can buy in presale",
            key: "maximum-purchase",
        },
    ]);

    const [preSaleStart, setPreSaleStart] = React.useState({
        date: "",
        time: "",
        timePeriod: "am"
    });

    const [preSalePeriod, setPreSalePeriod] = React.useState([
        {
            key: "month",
            value: ""
        },
        {
            key: "week",
            value: ""
        },
        {
            key: "day",
            value: ""
        },
        {
            key: "hour",
            value: ""
        },
        {
            key: "minute",
            value: ""
        },
    ]);
    const [errors, setErrors] = React.useState({});

    const updatePreSaleDiscount = (event: React.ChangeEvent<HTMLInputElement>, index: number, type: string): void => {
        const discounts = [...preSaleDiscount];
        if (type === "amount") {
            discounts[index].amount = event.target.value.trim();
        } else {
            discounts[index].discountPercentage = event.target.value.trim().replace('%', '').trim();
        }
        setPreSaleDiscount(discounts);
    }

    const updatePreSalePrice = (event: React.ChangeEvent<HTMLInputElement>, item: any): void => {
        const updatedPrices = preSale.map((element) =>
            element.key === item.key
                ? { ...element, value: event.target.value }
                : element
        );
        setPreSale(updatedPrices);
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    }

    const updatePrelookUp = (event: React.ChangeEvent<HTMLInputElement>, key: string): void => {
        const updatedValue = preSalePeriod.map((element) =>
            element.key === key
                ? { ...element, value: event.target.value }
                : element
        );
        setPreSalePeriod(updatedValue);
    };


    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length >= 3 && value.length <= 4) {
            value = value.slice(0, 2) + "/" + value.slice(2);
        } else if (value.length >= 5 && value.length <= 8) {
            value = value.slice(0, 2) + "/" + value.slice(2, 4) + "/" + value.slice(4);
        }
        setPreSaleStart({ ...preSaleStart, date: value });
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");

        if (value.length >= 3) {
            value = value.slice(0, 2) + ":" + value.slice(2);
        }

        setPreSaleStart({ ...preSaleStart, time: value });
    };

    const handleNextAction = () => {
        const discount = [];
        for (let index = 0; index < preSaleDiscount.length; index++) {
            const element = preSaleDiscount[index];
            discount.push({
                amount: element.amount,
                discountPercentage: element.discountPercentage
            })
        }
        const values = {
            discounts: discount,
            presaleDetails: preSale,
            preSalePeriod: preSalePeriod,
            preSaleStart: preSaleStart,
        }
        if (validate(values)) {
            localStorage.setItem("preSaleData", JSON.stringify(values));
            callback(values);
        }
    }

    const getDaysInCurrentMonth = (year: number, month: number, date: Date): number => {
        const now = new Date();
        // new Date(year, month, 0).getDate();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    };

    const validate = (values: any): boolean => {
        console.log("----- VALUES -----", values);
        const newErrors: Record<string, string> = {};

        // ---- Discounts Validation ----
        const discounts = values?.discounts || [];
        let totalDiscountPercentage = 0;
        let previousPercentage = Number(discounts[0]?.discountPercentage || 0);

        for (let i = 0; i < discounts.length; i++) {
            const current = Number(discounts[i].discountPercentage);
            totalDiscountPercentage += current;

            if (i > 0 && previousPercentage < current) {
                newErrors.discount = "Discount percentage order should be higher to lower.";
                break;
            }
            previousPercentage = current;
        }

        if (totalDiscountPercentage > 100) {
            newErrors.discount = "Discount percentage should be less than or equal to 100%.";
        }

        // ---- Presale Details Validation ----
        for (const { key, value, label } of values.presaleDetails || []) {
            if (!/^\d+$/.test(value)) {
                newErrors[key] = `Enter a valid ${label} value.`;
            }
        }

        // ---- Pre-sale Period Validation ----
        const [month, week, day, hour, minute] = values.preSalePeriod || [];

        if (Number(month?.value) > 12) {
            newErrors.preSalePeriod = "Invalid month";
        } else if (Number(week?.value) > 4) {
            newErrors.preSalePeriod = "Invalid week";
        } else if (Number(day?.value) > getDaysInCurrentMonth(new Date().getFullYear(), new Date().getMonth(), new Date())) {
            newErrors.preSalePeriod = "Invalid days";
        } else if (Number(hour?.value) > 12) {
            newErrors.preSalePeriod = "Invalid hour";
        } else if (Number(minute?.value) > 59) {
            newErrors.preSalePeriod = "Invalid minutes";
        }

        // ---- Pre-sale start time Validation ----
        const { date, time, timePeriod } = values.preSaleStart;

        // const startTime = time.split(":");
        // const startDate = date.split("/");
        // if (Number(startDate[2]) < new Date().getFullYear() || Number(startDate[2]) > new Date().getMonth() || startDate[0] > getDaysInCurrentMonth(Number(startDate[2]), Number(startDate[1]), new Date())) {
        //     newErrors.preSalePeriod = "Invalid date";
        // } else if (Number(startTime[0]) > 12) {
        //     newErrors.preSalePeriod = "Invalid hour";
        // } else if (Number(startTime[1]) > 59) {
        //     newErrors.preSalePeriod = "Invalid minutes";
        // } else if (timePeriod !== "am" && timePeriod !== "pm") {
        //     newErrors.preSalePeriod = "Invalid time format";
        // }
        // console.log("----- PRE SALE VALIDATION ERROR -----", newErrors);
        // setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    return (
        <main className="relative py-5 px-5 xl:px-32 lg:px-16 md:px-8 bg-transparent">
            <div className="bg-[#09073A] p-6 max-w-6xl mx-auto text-white rounded-[12px] font-sans">
                <h2 className="text-[14px] font-extrabold text-center mb-4">Pre-sale Discount</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="grid grid-cols-[auto_120px_1fr] items-start gap-x-2">


                        <span className="col-start-2 text-white/70 mb-[20px] text-xs leading-[18px]">Up to this amount in sales.</span>
                        <span className="col-start-3 text-white/70 mb-[20px] text-xs leading-[18px] text-right">Receives this discount.</span>


                        {preSaleDiscount.map((discount: any, index) => (
                            <React.Fragment key={index}>
                                <label className="text-xs text-white/90 py-2 text-right whitespace-nowrap">{discount.label} Tranche</label>

                                <input
                                    type="number"
                                    placeholder="0"
                                    className="w-[120px] h-[40px] bg-[#100E47] border border-[#FFFFFF38] rounded-[8px] px-3 text-white text-sm outline-none" // Removed mr-[50px] from here
                                    value={discount.amount}
                                    onChange={(event) => updatePreSaleDiscount(event, index, "amount")}
                                />
                                {/* <div className="w-[55px] h-[40px] flex items-center justify-center bg-[#00000045] border border-[#FFFFFF38] rounded-[8px] text-sm font-bold ml-[50px]">
                                    {discount.percentage || 0} %
                                </div> */}
                                <input
                                    type="text"
                                    value={discount.discountPercentage ? `${discount.discountPercentage}%` : ""}
                                    placeholder="0 %"
                                    onChange={(event) => updatePreSaleDiscount(event, index, "percentage")}
                                    className="w-[55px] h-[40px] flex items-center justify-center bg-[#00000045] border border-[#FFFFFF38] rounded-[8px] text-sm font-bold ml-[50px]"
                                />
                            </React.Fragment>
                        ))}

                        <p className="col-start-2 col-span-2 text-[10px] text-white/40 mt-1 leading-tight">
                            How much percentage less than the launch price you can buy into the presale
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {preSale.map((item, i) => (
                            <div key={i}>
                                <label className="block text-xs mb-1">{item.label}</label>
                                <input
                                    type="text"
                                    value={item.value}
                                    className="w-[157px] h-[40px] bg-[#100E47] border border-[#FFFFFF38] rounded-[8px] px-3 text-sm"
                                    placeholder="$0"
                                    onChange={(event) => updatePreSalePrice(event, item)}
                                />
                                <div className="text-[10px] text-white/40 leading-tight">{item.desc}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <label className="text-xs mb-1">Pre-sale lock-up period</label>
                        <div className="flex gap-2">
                            {preSalePeriod.map((presaleDate, i) => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <input
                                        type="number"
                                        min={0}
                                        value={presaleDate.value}
                                        onChange={(event) => updatePrelookUp(event, presaleDate.key)}
                                        className="w-[53px] h-[40px] bg-[#100E47] border border-[#FFFFFF38] rounded-[8px] text-center text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="text-[10px] text-white/40 leading-tight mt-2">
                            How long you have to wait after launch before you can sell. Maximum of 12 months, 4 weeks, 7 days, 24 hours and 60 minutes. For longer lockups, use the vesting feature
                        </div>

                        <label className="text-xs mt-2 mb-1">Token pre-sale start date</label>
                        <div className="flex gap-2 items-center mb-1">
                            <input
                                type="text"
                                placeholder="dd/mm/yyyy"
                                className="w-[120px] h-[40px] bg-[#100E47] border border-[#FFFFFF38] rounded-[8px] px-2 text-sm"
                                value={preSaleStart.date}
                                onChange={(event) => handleDateChange(event)}
                                maxLength={10}
                            />
                            <input
                                type="text"
                                placeholder="hr:min"
                                className="w-[120px] h-[40px] bg-[#100E47] border border-[#FFFFFF38] rounded-[8px] px-2 text-sm"
                                value={preSaleStart.time}
                                onChange={(event) => handleTimeChange(event)}
                                maxLength={5}
                            />
                            <div className="flex items-center gap-2 ml-2">
                                <label className="flex items-center gap-1 text-xs">
                                    <input
                                        type="radio"
                                        className="accent-[#E7007A] w-[14px] h-[14px]"
                                        checked={preSaleStart.timePeriod === "am"}
                                        onChange={(event) => setPreSaleStart({ ...preSaleStart, timePeriod: event.target.value === "on" ? "am" : "pm" })}
                                    />
                                    am
                                </label>
                                <label className="flex items-center gap-1 text-xs">
                                    <input
                                        type="radio"
                                        className="accent-[#E7007A] w-[14px] h-[14px]"
                                        checked={preSaleStart.timePeriod === "pm"}
                                        onChange={(event) => setPreSaleStart({ ...preSaleStart, timePeriod: event.target.value === "on" ? "pm" : "am" })}
                                    />
                                    pm
                                </label>
                            </div>
                        </div>
                        <div className="text-[10px] text-white/40 leading-tight">
                            Has to be at least 24 hours before the launch date
                        </div>
                    </div>
                </div>
                <div className="flex justify-center mt-10">
                    <button className="bg-[#FF00B8] hover:bg-[#e100a7] text-white w-[155px] h-[38px] rounded-[8px] transition text-base font-semibold" onClick={handleNextAction}>
                        Next
                    </button>
                </div>
            </div>
        </main>
    );
}