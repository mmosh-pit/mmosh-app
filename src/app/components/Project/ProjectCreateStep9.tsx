"use client";

import FilePicker from "@/app/components/FilePicker";
import { init, uploadFile } from "@/app/lib/firebase";
import DownloadIcon from "@/assets/icons/DownloadIcon";
import FileIcon from "@/assets/icons/FileIcon";
import RemoveIcon from "@/assets/icons/RemoveIcon";
import axios from "axios";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function ProjectCreateStep9({ symbol }: { symbol: any }) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<
    {
      preview: string;
      type: string;
      name: string;
      isPrivate: boolean;
      saved: boolean;
    }[]
  >([]);
  const [projectDetail, setProjectDetail] = React.useState<any>(null);

  const [showMsg, setShowMsg] = useState(false);
  const [msgClass, setMsgClass] = useState("");
  const [msgText, setMsgText] = useState("");

  const getProjectMedia = React.useCallback(async () => {
    if (!projectDetail) return;

    const result = await axios.get(
      `/api/project/get-media?project=${projectDetail.project.key}`,
    );

    const files = [];

    for (const item of result.data) {
      files.push({
        preview: item.media.preview,
        type: item.media.type,
        name: item.media.name,
        isPrivate: item.media.isPrivate,
        saved: true,
      });
    }

    setFiles(files);
  }, [projectDetail]);

  const uploadAction = (fileUri: any, fileType: any, fileName: any) => {
    const newFiles = [];
    newFiles.push({
      preview: fileUri,
      type: fileType,
      name: fileName,
      isPrivate: false,
      saved: false,
    });
    setFiles(newFiles);
  };

  const removeFileAction = React.useCallback(
    async (deletedIndex: number) => {
      const name = files[deletedIndex].name;

      const newFiles = [];
      for (let index = 0; index < files.length; index++) {
        if (deletedIndex === index) {
          continue;
        }
        const element = files[index];
        newFiles.push(element);
      }

      setFiles(newFiles);
      await axios.delete(
        `/api/project/delete-media?project=${projectDetail.project.key}&name=${name}`,
      );
      await removeFileByMetadata(name);
    },
    [files, projectDetail],
  );

  const removeFileByMetadata = React.useCallback(
    async (name: string) => {
      const projectKey = projectDetail?.project.key;

      const metadata = JSON.stringify({
        project: projectKey,
        name: name,
      });

      await axios.delete(
        `https://mmoshapi-uodcouqmia-uc.a.run.app/delete_by_metadata?metadata=${metadata}`,
      );
    },
    [projectDetail],
  );

  const onChangePrivacy = React.useCallback(
    async (isPrivate: boolean, documentIndex: number) => {
      const projectKey = projectDetail?.project.key;

      setFiles((files: any) => {
        const newFiles = [...files];

        newFiles[documentIndex].isPrivate = isPrivate;

        return newFiles;
      });

      const preview = files[documentIndex].preview;
      const name = files[documentIndex].name;

      await removeFileByMetadata(name);

      const metadata = JSON.stringify({
        project: projectKey,
        name: name,
      });

      const formData = new FormData();
      formData.append("name", isPrivate ? projectKey : "PUBLIC");
      formData.append("urls", preview);
      formData.append("metadata", metadata);
      formData.append("text", "None");

      await axios.post(
        "https://mmoshapi-uodcouqmia-uc.a.run.app/upload",
        formData,
      );

      await axios.put("/api/project/update-media-privacy", {
        projectkey: projectKey,
        file: {
          name,
          isPrivate,
        },
      });
    },
    [projectDetail, files],
  );

  const gotoStep10 = React.useCallback(async () => {
    if (!projectDetail) return;

    setLoading(true);
    const fileList = [];

    for (let index = 0; index < files.length; index++) {
      const fields = files[index];

      if (fields.saved) continue;

      if (!isValidHttpUrl(fields.preview)) {
        const file = await fetch(fields.preview)
          .then((r) => r.blob())
          .then(
            (blobFile) => new File([blobFile], uuidv4(), { type: fields.type }),
          );
        fields.preview = await uploadFile(file, file.name, "bot");
      }
      fields.isPrivate = false;
      fileList.push(fields);
    }

    const projectKey = projectDetail?.project.key;

    for (const field of fileList) {
      const formData = new FormData();
      formData.append("name", projectKey);
      formData.append("urls", field.preview);

      formData.append("text", "None");

      formData.append(
        "metadata",
        JSON.stringify({
          project: projectKey,
          name: field.name,
        }),
      );

      await axios.post(
        "https://mmoshapi-uodcouqmia-uc.a.run.app/upload",
        formData,
      );
    }

    if (fileList.length > 0) {
      await axios.post("/api/project/save-media", {
        files: fileList,
        projectkey: projectDetail.project.key,
      });
      createMessage("Media uploaded successfully", "success-container");
    }

    setLoading(false);
  }, [files, projectDetail]);

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
  }, [symbol]);

  React.useEffect(() => {
    getProjectMedia();
  }, [projectDetail]);

  const getProjectDetailFromAPI = React.useCallback(async () => {
    try {
      setLoading(true);
      let listResult = await axios.get(`/api/project/detail?symbol=${symbol}`);
      setProjectDetail(listResult.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setProjectDetail(null);
    }
  }, [symbol]);

  const createMessage = React.useCallback((message: any, type: any) => {
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
  }, []);

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
      <div className="background-content flex flex-col items-center">
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
        {files.length === 0 ? (
          <div className="self-center md:w-[75%] w-[90%] mt-4">
            <FilePicker
              file={""}
              isButton={false}
              changeFile={(file: any) => {
                const objectUrl = URL.createObjectURL(file);
                uploadAction(objectUrl, file.type, file.name);
              }}
            />
          </div>
        ) : (
          <div className="py-5 px-5 xl:px-32 lg:px-16 md:px-8">
            <div className="grid grid-cols-12">
              <div className="col-span-12 xl:col-start-4 xl:col-span-6 lg:col-start-4 lg:col-span-6">
                <div className="backdrop-container rounded-xl p-5 border border-white border-opacity-20 mb-10 ">
                  <div className="grid grid-cols-3 gap-4">
                    <>
                      {files.map((fileItem, i: number) => (
                        <div key={i}>
                          <h5 className="text-header-small-font-size text-while font-poppins text-center font-bold">
                            File {i + 1}
                          </h5>
                          <div className="backdrop-container rounded-xl px-5 py-10 border border-white border-opacity-20 text-center">
                            <p className="text-para-font-size light-gray-color text-center break-all max-w-[100%]">
                              {fileItem.name}
                            </p>
                            <div className="w-8 mx-auto">
                              <FileIcon />
                            </div>

                            <div className="flex items-center justify-center w-full mt-4">
                              <p className="text-xs">Public</p>
                              <input
                                type="checkbox"
                                className="toggle border-[#0061FF] bg-[#0061FF] [--tglbg:#1B1B1B] hover:bg-[#0061FF] mx-1"
                                checked={fileItem.isPrivate}
                                onClick={() => {
                                  onChangePrivacy(!fileItem.isPrivate, i);
                                }}
                              />
                              <p className="text-xs">Private</p>
                            </div>

                            <div className="flex justify-center mt-4">
                              <a
                                className="cursor-pointer"
                                href={fileItem.preview}
                                target="_blank"
                              >
                                <DownloadIcon />
                              </a>
                              <div
                                className="cursor-pointer ml-3"
                                onClick={() => {
                                  removeFileAction(i);
                                }}
                              >
                                <RemoveIcon />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
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
        )}
      </div>
    </>
  );
}
