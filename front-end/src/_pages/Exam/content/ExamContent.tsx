import ContentGrid from "@/components/Exam/ContentGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import pdfIcon from "@/assets/Icons/ContentPanel/pdf_icon.png";

export default function ExamContent() {
  return (
    <div className="grid grid-cols-2">
      <ContentGrid
        variant="Thumbnail"
        items={contentGridData.assessmentContent}
      />
      <div className="border  rounded-lg px-4 py-3 w-fit">
        <Tabs defaultValue="Content" className="">
          <TabsList>
            <TabsTrigger value="Content">Content</TabsTrigger>
            <TabsTrigger value="Past">Past Papers</TabsTrigger>
          </TabsList>
          <TabsContent value="Content">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 items-center ">
                <img src={pdfIcon} className="h-[20px] rounded-sm" />
                <div className="flex flex-col text-xs ">
                  <span>History Lecture 008</span>
                  <span className="text-muted-foreground">PDF</span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="Past">
            <div></div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const contentGridData = {
  assessmentContent: [
    {
      id: "a4",
      title: "Limits and series of functions",
      url: "history101",
      description: "Intro to study of limits and series of functions",
      date: "Date: 28 Apr 2025",
      author: "Quincy",
    },
  ],
};
