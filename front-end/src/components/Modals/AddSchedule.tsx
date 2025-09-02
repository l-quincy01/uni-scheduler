import React from "react";
import { FileUpload } from "../ui/file-upload";

export default function AddSchedule() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div>
      <div className="font-semibold text-xl">Upload Content</div>

      <FileUpload onChange={handleFileUpload} />
    </div>
  );
}
