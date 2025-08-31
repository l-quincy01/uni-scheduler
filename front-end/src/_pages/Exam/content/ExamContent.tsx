import ContentGrid from "@/components/Exam/ContentGrid";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import pdfIcon from "@/assets/Icons/ContentPanel/pdf_icon.png";
import { Tabs } from "@/components/ui/vercel-tabs";

export default function ExamContent() {
  const [activeTab, setActiveTab] = useState("content");

  const tabs = [
    { id: "scope", label: "Scope" },
    { id: "past", label: "Past Papers" },
  ];

  return (
    <div className="grid grid-cols-2">
      <ContentGrid
        variant="Thumbnail"
        items={contentGridData.assessmentContent}
      />
      <div className="border  rounded-lg px-4 py-3 w-fit flex flex-col gap-4">
        <Tabs tabs={tabs} onTabChange={(tabId) => setActiveTab(tabId)} />

        {activeTab === "scope" && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <span className="text-muted-foreground text-sm">
                Study scope you've added
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 items-center ">
                <img src={pdfIcon} className="h-[20px] rounded-sm" />
                <div className="flex flex-col text-xs ">
                  <span>History Lecture 008</span>
                  <span className="text-muted-foreground">PDF</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "past" && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <span className="text-muted-foreground text-sm">
                Past papers you've added.
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 items-center ">
                <img src={pdfIcon} className="h-[20px] rounded-sm" />
                <div className="flex flex-col text-xs ">
                  <span>History Lecture 008</span>
                  <span className="text-muted-foreground">PDF</span>
                </div>
              </div>
            </div>
          </div>
        )}
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
