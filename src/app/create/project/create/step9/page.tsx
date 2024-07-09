"use client";

import FilePicker from "@/app/components/FilePicker";
import ImagePicker from "@/app/components/ImagePicker";
import Button from "@/app/components/common/Button";
import Input from "@/app/components/common/Input";
import Radio from "@/app/components/common/Radio";
import Select from "@/app/components/common/Select";
import AddIcon from "@/assets/icons/AddIcon";
import Calender from "@/assets/icons/Calender";
import FileIcon from "@/assets/icons/FileIcon";
import MinusIcon from "@/assets/icons/MinusIcon";
import TimeIcon from "@/assets/icons/TimeIcon";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProjectCreateStep9() {
     const navigate = useRouter();
     const [files, setFiles] = useState<any>([])

     const uploadAction = (fileUri:any, fileType:any) => {
        let data:any = localStorage.getItem("projectstep9");
        let newFiles = localStorage.getItem("projectstep9") ? JSON.parse(data) : [];
        newFiles.push({
            preview: fileUri,
            type: fileType
        })
        setFiles(newFiles);
        localStorage.setItem("projectstep9",JSON.stringify(newFiles));
     }

     const removeFileAction = (deletedIndex:any) => {
        let newFiles = [];
        for (let index = 0; index < files.length; index++) {
            if(deletedIndex == index) {
                continue;
            }
            const element = files[index];
            newFiles.push(element)
        }
        setFiles(newFiles);
        localStorage.setItem("projectstep9",JSON.stringify(newFiles));
     }

     const gotoStep10 = () => {
        navigate.push("/create/project/create/step10");
     }

     const goBack = () => {
        navigate.back()
     }

     React.useEffect(()=>{
        if(localStorage.getItem("projectstep9")) {
          let savedData:any = localStorage.getItem("projectstep9");
          setFiles(JSON.parse(savedData));
        }
      },[])
     

    return (
        <div className="relative background-content">
            <div className="flex flex-col items-center justify-center w-full">
                <div className="relative w-full flex flex-col justify-center items-center pt-5">
                    <div className="max-w-md">
                        <h2 className="text-center text-white font-goudy font-normal text-xl">Launch Your Project</h2>
                        <h3 className="text-center text-white font-goudy text-sub-title-font-size pt-2.5">Step 9</h3>
                        <h3 className="text-center text-white font-goudy font-normal text-sub-title-font-size pt-1.5">Inform our AI Bot</h3>
                        <p className="text-para-font-size light-gray-color text-center para-line-height pt-2.5 text-light-gray leading-4">Upload your white paper and other materials to inform MMOSH Bot about your project. MMOSH Bot will answer questions and inform the community.</p>
                    </div>
                </div>
            </div>
            <div className="py-5 px-5 xl:px-32 lg:px-16 md:px-8">
                <div className="grid grid-cols-12">
                   <div className="col-start-4 col-span-6">
                        <div className="backdrop-container rounded-xl p-5 border border-white border-opacity-20 mb-10 ">
                            <div className="grid grid-cols-3 gap-4">
                                {files.length == 0 &&
                                    <FilePicker file={""} isButton={false} changeFile={(file:any)=>{
                                        const objectUrl = URL.createObjectURL(file);
                                        uploadAction(objectUrl, file.type);
                                    }} />
                                }
                                {files.length > 0 &&
                                   <>
                                    {files.map((fileItem: any, i: any) =>(
                                        <div>
                                            <h5 className="text-header-small-font-size text-while font-poppins text-center font-bold">File {i+1}</h5>
                                            <div className="backdrop-container rounded-xl px-5 py-10 border border-white border-opacity-20 text-center">
                                                <p className="text-para-font-size light-gray-color text-center">File{i+1}.pdf</p>
                                                <div className="w-8 mx-auto"><FileIcon /></div>
                                                <h3 className="flex justify-center mt-2.5">
                                                    <div className="cursor-pointer" onClick={()=>{removeFileAction(i)}}>
                                                        <MinusIcon/>
                                                    </div>
                                                    <span className="text-para-font-size text-while font-poppins p-1.5">Delete</span>
                                            </h3>
                                            </div>
                                        </div>
                                    ))}
                                   </>
                                }
                                <FilePicker file={""} isButton={true} changeFile={(file:any)=>{
                                    const objectUrl = URL.createObjectURL(file);
                                    uploadAction(objectUrl, file.type);
                                }} />
                            </div>
                        </div>
                   </div>

                </div>
                <div className="flex justify-center mt-10">
                    <button className="btn btn-link text-white no-underline" onClick={goBack}>Back</button>
                    <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white" onClick={gotoStep10}>Next</button>
                </div>
            </div>
        </div>
    );
}
