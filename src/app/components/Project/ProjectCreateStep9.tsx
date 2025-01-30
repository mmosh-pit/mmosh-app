"use client";

import FilePicker from "@/app/components/FilePicker";
import { init, uploadFile } from "@/app/lib/firebase";
import FileIcon from "@/assets/icons/FileIcon";
import MinusIcon from "@/assets/icons/MinusIcon";
import axios from "axios";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function ProjectCreateStep9({ symbol }: { symbol: any }) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<any>([]);
  const [projectDetail, setProjectDetail] = React.useState<any>(null);

  const [showMsg, setShowMsg] = useState(false);
  const [msgClass, setMsgClass] = useState("");
  const [msgText, setMsgText] = useState("");

  const uploadAction = (fileUri: any, fileType: any, fileName: any) => {
    const newFiles = [];
    newFiles.push({
      preview: fileUri,
      type: fileType,
      name: fileName,
    });
    setFiles(newFiles);
  };

  const removeFileAction = (deletedIndex: any) => {
    let newFiles = [];
    for (let index = 0; index < files.length; index++) {
      if (deletedIndex == index) {
        continue;
      }
      const element = files[index];
      newFiles.push(element);
    }
    setFiles(newFiles);
  };

  const gotoStep10 = async () => {
    if (!projectDetail) return;

    setLoading(true);
    const fileList = [];

    for (let index = 0; index < files.length; index++) {
      const fields = files[index];

      if (!isValidHttpUrl(fields.preview)) {
        const file = await fetch(fields.preview)
          .then((r) => r.blob())
          .then(
            (blobFile) => new File([blobFile], uuidv4(), { type: fields.type }),
          );
        fields.preview = await uploadFile(file, file.name, "bot");
      }
      fileList.push(fields);
    }

    const projectKey = projectDetail?.project.key;

    const formData = new FormData();
    formData.append("name", projectKey);

    for (const field of fileList) {
      formData.append("urls", field.preview);
    }
    formData.append("text", "None");

    formData.append(
      "metadata",
      JSON.stringify({
        address: projectKey,
      }),
    );

    await axios.post(
      "https://mmoshapi-uodcouqmia-uc.a.run.app/upload",
      formData,
    );

    if (fileList.length > 0) {
      await axios.post("/api/project/save-media", {
        files: fileList,
        projectkey: projectDetail.project.key,
      });
      createMessage("Media uploaded successfully", "success-container");
    }

    setLoading(false);
  };

  const isValidHttpUrl = (url: any) => {
    try {
      const newUrl = new URL(url);
      return newUrl.protocol === "http:" || newUrl.protocol === "https:";
    } catch (err) {
      return false;
    }
  };

  React.useEffect(() => {
    init();
    getProjectDetailFromAPI();
  }, []);

  const getProjectDetailFromAPI = async () => {
    try {
      setLoading(true);
      let listResult = await axios.get(`/api/project/detail?symbol=${symbol}`);
      setProjectDetail(listResult.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setProjectDetail(null);
    }
  };

  const createMessage = (message: any, type: any) => {
    window.scrollTo(0, 0);
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    setLoading(false);
    if (type == "success-container") {
      setTimeout(() => {
        setShowMsg(false);
      }, 4000);
    } else {
      setTimeout(() => {
        setShowMsg(false);
      }, 4000);
    }
  };

  return (
    <>
      {showMsg && (
        <div
          className={
            "message-container text-white text-center text-header-small-font-size py-5 px-3.5 " +
            msgClass
          }
        >
          {msgText}
        </div>
      )}
      <div className="background-content">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="relative w-full flex flex-col justify-center items-center pt-5">
            <div className="max-w-md">
              <p className="text-para-font-size light-gray-color text-center para-line-height pt-2.5 text-light-gray leading-4">
                Upload your white paper and other materials to inform MMOSH Bot
                about your project. MMOSH Bot will answer questions and inform
                the community.
              </p>
            </div>
          </div>
        </div>
        <div className="py-5 px-5 xl:px-32 lg:px-16 md:px-8">
          <div className="grid grid-cols-12">
            <div className="col-span-12 xl:col-start-4 xl:col-span-6 lg:col-start-4 lg:col-span-6">
              <div className="backdrop-container rounded-xl p-5 border border-white border-opacity-20 mb-10 ">
                <div className="grid grid-cols-3 gap-4">
                  {files.length == 0 && (
                    <FilePicker
                      file={""}
                      isButton={false}
                      changeFile={(file: any) => {
                        const objectUrl = URL.createObjectURL(file);
                        uploadAction(objectUrl, file.type, file.name);
                      }}
                    />
                  )}
                  {files.length > 0 && (
                    <>
                      {files.map((fileItem: any, i: number) => (
                        <div key={i}>
                          <h5 className="text-header-small-font-size text-while font-poppins text-center font-bold">
                            File {i + 1}
                          </h5>
                          <div className="backdrop-container rounded-xl px-5 py-10 border border-white border-opacity-20 text-center">
                            <p className="text-para-font-size light-gray-color text-center">
                              {fileItem.name}
                            </p>
                            <div className="w-8 mx-auto">
                              <FileIcon />
                            </div>
                            <h3 className="flex justify-center mt-2.5">
                              <div
                                className="cursor-pointer"
                                onClick={() => {
                                  removeFileAction(i);
                                }}
                              >
                                <MinusIcon />
                              </div>
                              <span className="text-para-font-size text-while font-poppins p-1.5">
                                Delete
                              </span>
                            </h3>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  <FilePicker
                    file={""}
                    isButton={true}
                    changeFile={(file: any) => {
                      const objectUrl = URL.createObjectURL(file);
                      uploadAction(objectUrl, file.type, file.name);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            {!loading && (
              <button
                className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white"
                onClick={gotoStep10}
              >
                Submit
              </button>
            )}
            {loading && (
              <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white">
                Loading...
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
