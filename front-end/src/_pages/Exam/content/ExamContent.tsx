import ContentGrid from "@/components/Exam/ContentGrid";
import React from "react";

export default function ExamContent() {
  return (
    <div>
      <ContentGrid
        variant="Thumbnail"
        items={contentGridData.assessmentContent}
      />
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
