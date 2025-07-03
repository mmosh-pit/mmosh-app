import React from "react";

interface MintingProps {
    callback: (data: any) => void;
}

export const Minting = (props: MintingProps) => {
    const { callback } = props;
    const [data, setData] = React.useState({
        name: "",
        symbol: "",
        tokenSupply: "",
        description: "",
        image: {},
    });

    const [errors, setErrors] = React.useState({});

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            // const reader = new FileReader();
            // reader.onloadend = () => {
            //     const base64String = reader.result as string;
            //     setData({ ...data, image: base64String });
            // };
            // reader.readAsDataURL(file);
            const objectUrl = URL.createObjectURL(file);
            let imageObj = {
                preview: objectUrl,
                type: file.type
            }
            setData({ ...data, image: imageObj });
        } else {
            setData({ ...data, image: "" });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!data.name.trim()) {
            newErrors.name = "Name is required";
        } else if (data.name.trim().length > 50) {
            newErrors.name = "Name should be less than or equal to 50 characters.";
        }

        if (!data.symbol.trim()) {
            newErrors.symbol = "Symbol is required";
        } else if (data.symbol.trim().length > 10) {
            newErrors.symbol = "Symbol should be less than or equal to 10 characters.";
        }

        if (!data.description.trim()) {
            newErrors.description = "Description is required";
        } else if (data.description.trim().length > 100) {
            newErrors.description = "Description should be less than or equal to 100 characters.";
        }

        if (!data.tokenSupply.trim()) {
            newErrors.tokenSupply = "Token supply is required";
        } else if (!/^\d+$/.test(data.tokenSupply)) {
            newErrors.tokenSupply = "Supply should be a number.";
        } else if (Number(data.tokenSupply) > 1000000000000) {
            newErrors.tokenSupply = "Symbol should be less than or equal to 1000000000000.";
        }

        // if (!data.image.trim()) {
        //     newErrors.image = "Image is required";
        // }
        console.log("minting validation erros\n", newErrors);

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextAction = () => {
        if (validate()) {
            localStorage.setItem("mintingData", JSON.stringify(data));
            callback(data);
        }
    }

    return (
        <main className="relative py-5 px-5 xl:px-32 lg:px-16 md:px-8 text-white bg-transparent">
            <div className="flex justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-[298px_348px_348px] gap-8 items-start justify-center">
                    <div>
                        <label className="block text-sm mb-2 text-white/60">Image*</label>
                        <div className="w-[298px] h-[298px] rounded-[8px] overflow-hidden border border-[#FFFFFF38]">
                            <img
                                src={"https://imgs.search.brave.com/idB0KZ4-ooD8fMPHEwFw0tvaTvyjAA-WBDUvs11nEiI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9jeWJlci1zaW1p/YW4tbmZ0LXN0cmVl/dHdlYXItbW9ua2V5/XzEwMzc3OTctMTI0/MS5qcGc_c2VtdD1h/aXNfaHlicmlkJnc9/NzQw"}
                                alt="Agent Preview"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <button className="text-xs text-white/80 mt-2 flex items-center gap-2 hover:text-white" onClick={() => document.getElementById("replace-image")?.click()}>
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-white/40 overflow-hidden">
                                <img
                                    src="/images/image-icon.png"
                                    alt="Replace"
                                    className="w-4 h-4 object-contain"
                                />
                            </span>
                            Replace image
                        </button>
                        <input
                            id="replace-image"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            hidden={true}
                        />
                    </div>

                    {/* Name, Symbol, Supply */}
                    <div className="flex flex-col gap-4 mt-8 h-[298px]">
                        {/* Name */}
                        <div>
                            <label className="block text-sm mb-1 text-white/80">Name*</label>
                            <input
                                type="text"
                                placeholder="Name"
                                maxLength={50}
                                className="w-full max-w-[348px] h-[40px] px-3 rounded-[7px] border border-[#FFFFFF38] placeholder-white/30 text-white text-sm bg-black bg-opacity-10 backdrop-blur"
                                onChange={(event) => setData({ ...data, name: event.target.value })}
                                value={data.name}
                            />
                            <p className="text-xs text-white/40 mt-1">
                                Up to 50 characters, can have spaces.
                            </p>
                        </div>
                        {/* Symbol */}
                        <div>
                            <label className="block text-sm mb-1 text-white/80">Symbol*</label>
                            <input
                                type="text"
                                placeholder="Symbol"
                                maxLength={10}
                                className="w-full max-w-[348px] h-[40px] px-3 rounded-[7px] border border-[#FFFFFF38] placeholder-white/30 text-white text-sm bg-black bg-opacity-10 backdrop-blur"
                                onChange={(event) => setData({ ...data, symbol: event.target.value })}
                                value={data.symbol}
                            />
                            <p className="text-xs text-white/40 mt-1">
                                Symbol can only be letters and numbers up to 10 characters.
                            </p>
                        </div>
                        {/* Max supply */}
                        <div>
                            <label className="block text-sm mb-1 text-white/80">
                                Maximum token supply
                            </label>
                            <input
                                type="text"
                                className="w-[186px] h-[40px] px-3 rounded-[7px] border border-[#FFFFFF38] text-white text-sm bg-black bg-opacity-10 backdrop-blur"
                                onChange={(event) => setData({ ...data, tokenSupply: event.target.value })}
                                value={data.tokenSupply}
                                placeholder="0"
                            />
                            <p className="text-xs text-white/40 mt-1 w-[257px]">
                                The maximum number of tokens that can be created.
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="w-full max-w-[348px] h-[298px] flex flex-col mt-8">
                        <label className="block text-sm mb-1 text-white/80">
                            Description*
                        </label>
                        <textarea
                            placeholder="Describe your Agent Coin"
                            className="flex-grow p-3 rounded-[7px] border border-[#FFFFFF38] bg-black bg-opacity-10 placeholder-white/30 text-sm text-white resize-none backdrop-blur"
                            onChange={(event) => setData({ ...data, description: event.target.value })}
                            value={data.description}
                        />
                    </div>
                </div>




            </div>
            {/* Mint button */}
            <div className="flex justify-center mt-10">
                <button className="bg-[#FF00B8] hover:bg-[#e100a7] text-white w-[155px] h-[38px] rounded-[8px] transition text-base font-semibold" onClick={() => handleNextAction()}>
                    Next
                </button>
            </div>

            <div className="flex justify-end mt-10 mr-5">
                <button
                    className="w-[150px] h-[36px] rounded-[30px] text-[9px] flex items-center justify-center gap-2 bg-pink-500/20 backdrop-blur-[3px] text-white hover:bg-pink-500/30 transition"
                >
                    Talk to Kip, the Kinship Bot
                    <img
                        src="/images/chat-bot.png"
                        alt="chat bot"
                        className="w-[18px] h-[18px]"
                    />
                </button>
            </div>
        </main>

    );
}