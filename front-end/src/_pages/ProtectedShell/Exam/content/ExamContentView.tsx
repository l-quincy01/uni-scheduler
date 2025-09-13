import MockExam from "@/components/Exam/ExamView/MockExam";

import React, { useRef } from "react";
import { data_mockExam_algebra_claude } from "./examContentData";

export default function ExamContentView() {
  const downloadableContent = useRef(null);

  return (
    <div ref={downloadableContent}>
      <MockExam questions={data_mockExam_algebra_claude} />
    </div>
  );
}
