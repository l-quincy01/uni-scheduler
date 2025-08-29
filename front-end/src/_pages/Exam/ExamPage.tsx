import Kanban from "@/components/Dashboard/Kanban/Kanban";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentGrid from "@/components/Exam/ContentGrid";

export default function ExamPage() {
  return (
    <div>
      {/* <Tabs defaultValue="Schedule" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="Schedule">Schedule</TabsTrigger>
          <TabsTrigger value="Exams">Exams Content</TabsTrigger>
        </TabsList>
        <TabsContent value="Schedule">
          <Kanban boards={KanbanData} />
        </TabsContent>
        <TabsContent value="Exams">
          <ContentGrid items={contentGridData.assessmentContent} />
        </TabsContent>
      </Tabs> */}
      <Kanban boards={KanbanData} />
    </div>
  );
}

const KanbanData = [
  {
    data: [
      {
        id: "001",
        title: "History",
        colorDot: "bg-purple-600",
        items: [
          {
            id: 101,
            title: "Exam: World War II & Aftermath",
            type: "Exam",
            date: "2025-11-10",
          },
        ],
      },
    ],
  },
];

const contentGridData = {
  assessmentContent: [
    {
      id: "a4",
      title: "Limits and series of functions",
      description: "Intro to study of limits and series of functions",
      date: "Date: 28 Apr 2025",
      author: "Quincy",
    },
  ],
};
