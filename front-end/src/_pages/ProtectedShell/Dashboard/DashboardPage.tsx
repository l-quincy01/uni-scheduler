import Kanban from "@/components/Dashboard/Kanban/Kanban";

export default function DashboardPage() {
  return (
    <div>
      {!KanbanData ? (
        <Kanban boards={KanbanData} />
      ) : (
        <div className="flex flex-col items-center">
          <span className="text-xl font-semibold">No Schedule Added.</span>
          <span className="text-md text-muted-foreground">
            Click Add Schedule Button To Start
          </span>
        </div>
      )}
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
