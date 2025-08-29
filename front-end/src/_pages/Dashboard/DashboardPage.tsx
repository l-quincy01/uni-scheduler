import Kanban from "@/components/Dashboard/Kanban/Kanban";

export default function DashboardPage() {
  return (
    <div>
      <div>
        <Kanban boards={KanbanData} />
      </div>
    </div>
  );
}

export const KanbanData = [
  {
    title: "Final year exams",
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
