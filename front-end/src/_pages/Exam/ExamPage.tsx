import Kanban from "@/components/Dashboard/Kanban/Kanban";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ExamPage() {
  return (
    <div>
      <Tabs defaultValue="Schedule" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="Schedule">Schedule</TabsTrigger>
          <TabsTrigger value="Exams">Exams Content</TabsTrigger>
        </TabsList>
        <TabsContent value="Schedule">
          <Kanban boards={KanbanData} />
        </TabsContent>
        <TabsContent value="Exams"></TabsContent>
      </Tabs>
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
