/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router";

type KanbanColumnProps = {
  title: string;
  colorDot?: string;
  count?: number;
  examForeignKey?: any;
  children: React.ReactNode;
};

export function KanbanColumn({
  title,
  colorDot,
  count,
  examForeignKey,
  children,
}: KanbanColumnProps) {
  const { pathname } = useLocation();

  return (
    <div
      className="flex flex-col rounded-xl  bg-accent border border-neutral-200 dark:border-neutral-800 shadow-sm min-w-[15rem] max-w-[15rem] "
      role="region"
    >
      <header className="sticky top-0 z-10 flex items-center gap-2 w-full border-b  pl-4 pr-3 py-2  backdrop-blur rounded-t-xl">
        <span
          className={`inline-block rounded-full ${colorDot} w-2 h-2`}
          aria-hidden="true"
        />
        <h3 className="text-sm font-semibold tracking-tight line-clamp-1">
          {title}
        </h3>
        {typeof count === "number" && (
          <span className="ml-auto text-xs text-neutral-500 dark:text-neutral-400">
            {count} item{count !== 1 && "s"}
          </span>
        )}
        {pathname === "/" ? (
          <></>
        ) : (
          <Link to={`${pathname}/${examForeignKey}`}>
            <Button
              variant="outline"
              className="w-fit h-fit py-1 px-1 cursor-pointer"
            >
              Practice
            </Button>
          </Link>
        )}
      </header>
      <ul
        className="flex flex-col gap-3 mt-3 px-3 pb-3 max-h-72 overflow-y-auto scroll-smooth"
        role="list"
      >
        {children}
      </ul>
    </div>
  );
}
