import { AIDocument } from "@/app/models/AIDocument";
import DocumentIcon from "@/assets/icons/DocumentIcon";
import DownloadIcon from "@/assets/icons/DownloadIcon";
import GlobeIcon from "@/assets/icons/GlobeIcon";
import LockIcon from "@/assets/icons/LockIcon";
import MovieIcon from "@/assets/icons/MovieIcon";
import PictureIcon from "@/assets/icons/PictureIcon";
import RemoveIcon from "@/assets/icons/RemoveIcon";
import * as React from "react";

type Props = {
  aiDocument: AIDocument;
  onDelete: (id: string) => void;
};

const InformDocument = ({ aiDocument, onDelete }: Props) => {
  const { isPrivate, name: documentName, url, id } = aiDocument;

  const [isDocPrivate, setIsDocPrivate] = React.useState(isPrivate);

  const getIconByFileType = React.useCallback(() => {
    const extension = url.split(".")[1];

    if (extension === "png") {
      return <PictureIcon />;
    }

    if (extension === "mp4") {
      return <MovieIcon />;
    }

    return <DocumentIcon />;
  }, []);

  const downloadURI = () => {
    const link = document.createElement("a");

    link.setAttribute("download", documentName);
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        {getIconByFileType()}
        <div className="w-[0.1vmax]" />
        {documentName}
      </div>

      <div className="flex items-center">
        <div className="flex items-center">
          <GlobeIcon />
          <div className="w-[0.1vmax]" />
          <input
            type="checkbox"
            className="toggle border-[#9F9F9F38] bg-[#9A9A9A12] [--tglbg:#9A9A9A12] hover:bg-[#F0F0F0]"
            checked={isDocPrivate}
            onClick={() => {
              setIsDocPrivate(!isDocPrivate);
            }}
          />
          <div className="w-[0.1vmax]" />
          <LockIcon />
        </div>

        <div className="w-[0.3vmax]" />

        <div className="flex items-center">
          <button onClick={downloadURI}>
            <DownloadIcon />
          </button>

          <div className="w-[0.1vmax]" />

          <button onClick={() => onDelete(id)}>
            <RemoveIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InformDocument;
