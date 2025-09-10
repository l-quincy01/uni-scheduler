import React, { useState } from "react";
import { FileUpload } from "../ui/file-upload";
import { Input } from "../ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import pdfIcon from "assets/Icons/ContentPanel/pdf_icon.png";
import { Button } from "../ui/button";
import { ArchiveIcon, ChevronDown } from "lucide-react";

export default function AddExamModal() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div className="flex flex-col justify-center gap-4 ">
      <div className="font-semibold text-lg">Add an exam</div>

      <Input type="text" placeholder="Name of exam" />

      <Popover>
        <PopoverTrigger>
          {" "}
          <Button variant="ghost" className="p-0">
            Select Source
            <ChevronDown size={14} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command className="">
            <CommandInput placeholder="Search Content..." />
            <CommandList className=" scrollbar-hide h-sm">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className=" flex flex-col gap-2">
                <CommandItem className="gap-2 p-2">
                  <img src={pdfIcon} className="h-[20px] rounded-sm" />

                  <span className="text-xs">History Lecture 008</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="border rounded-xl ">
        <FileUpload onChange={handleFileUpload} />
      </div>

      <div className="flex flex-row justify-between">
        <Button variant="secondary">Close</Button>
        <Button variant="secondary">Generate Exam</Button>
      </div>
    </div>
  );
}
