import Kanban from "@/components/Dashboard/Kanban/Kanban";

export default function DashboardPage() {
  return (
    <div>
      {KanbanData ? (
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
    title: "3rd year Final Exams", // unite with schedule title
    data: [
      {
        id: "001",
        title: "Study: MAM 202 P2 - Linear Algebra", //combine events of the same subject
        colorDot: "bg-blue-600", // unite with event object color
        items: [
          {
            id: 101,
            title: "Study: MAM 202 P2 - Linear Algebra (Session 1)", //unite with event object description
            description: "Preparation for MAM 202 P2 - Linear Algebra",
            type: "Study",
            date: "2025-10-20",
          },
          {
            id: 101,
            title: "Study: MAM 202 P2 - Linear Algebra (Session 2)", //unite with event object description
            description: "Preparation for MAM 202 P2 - Linear Algebra",
            type: "Study",
            date: "2025-10-23",
          },
        ],
      },
    ],
  },
];
