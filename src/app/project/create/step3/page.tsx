"use client";

import ImagePicker from "@/app/components/ImagePicker";
import Button from "@/app/components/common/Button";
import Input from "@/app/components/common/Input";
import Radio from "@/app/components/common/Radio";
import React from "react";

export default function ProjectCreateStep3() {
    const [image, setImage] = React.useState<File | null>(null);
    const [preview, setPreview] = React.useState("");

    React.useEffect(() => {
        if (!image) return;
        const objectUrl = URL.createObjectURL(image);
        setPreview(objectUrl);
    }, [image]);

    const onRadioChange = () => {
    }


     const gotoStep4 = () => {

     }

     const goBack = () => {
        
     }

    return (
        <div className="relative background-content">
            <div className="flex flex-col items-center justify-center w-full">
                <div className="relative w-full flex flex-col justify-center items-center pt-5">
                    <div className="max-w-md">
                        <h2 className="text-center text-white font-goudy font-normal text-xl">Launch Your Project</h2>
                        <h3 className="text-center text-white font-goudy text-sub-title-font-size pt-2.5">Step 3</h3>
                        <h3 className="text-center text-white font-goudy font-normal text-sub-title-font-size pt-1.5">Design Your Community Coin</h3>
                        <p className="text-para-font-size light-gray-color text-center para-line-height pt-2.5 text-light-gray leading-4">The design of your Community Coin should reflect the culture of your community and the power of your project.</p>
                    </div>
                </div>
            </div>
            <div className="py-5 px-5 xl:px-32 lg:px-16 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                           <ImagePicker changeImage={setImage} image={preview} />
                        </div>
                        <div>
                            <div className="form-element pt-2.5">
                                <Input
                                    type="text"
                                    title="Name"
                                    required
                                    helperText=""
                                    placeholder="Name"
                                    value={""}
                                    onChange={(e) => {}}
                                />
                            </div>
                            <div className="form-element pt-2.5">
                                <Input
                                    type="text"
                                    title="Symbol"
                                    required
                                    helperText=""
                                    placeholder="Symbol"
                                    value={""}
                                    onChange={(e) => {}}
                                />
                            </div>
                            <div className="form-element pt-2.5">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="form-element col-span-5">
                                        <Input
                                            type="text"
                                            title="Supply"
                                            required
                                            helperText=""
                                            placeholder="Supply"
                                            value={""}
                                            onChange={(e) => {}}
                                        />
                                    </div>
                                    <div className="form-element col-span-5">
                                        <Input
                                            type="text"
                                            title="Listing Price"
                                            required
                                            helperText=""
                                            placeholder="Listing Price"
                                            value={""}
                                            onChange={(e) => {}}
                                        />
                                    </div>
                                    <div className="col-span-2 mt-8 text-white text-header-small-font-size">USD</div>
                                </div>
                            </div>
                            <div className="form-element pt-6">
                                <div className="flex">
                                    <label className="text-white text-xs pr-2.5">
                                       Fully Diluted Value (FDV)
                                    </label>
                                    <span>___</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="form-element h-full">
                                <Input
                                    textarea
                                    type="text"
                                    title="Description"
                                    required
                                    helperText=""
                                    placeholder="Describe your Community Coin and associated project and protocol."
                                    value={""}
                                    onChange={(e) => {}}
                                />
                            </div>
                        </div>
                </div>
                <div className="flex justify-center mt-10">
                    <button className="btn btn-link text-white no-underline" onClick={goBack}>Back</button>
                    <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white" onClick={gotoStep4}>Next</button>
                </div>
            </div>
        </div>
    );
}
