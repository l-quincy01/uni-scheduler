import type { ExamSummary } from "@/types/exam.types";
import { Link } from "react-router";

type Variant = "Card" | "Thumbnail";

export interface ContentItem {
  id: string;

  title: string;

  thumbnailURL?: string;
}

interface ContentGridProps {
  items: ExamSummary[];
  onCardClick?: (item: ContentItem) => void;

  variant?: Variant;
}

export default function ContentGrid({
  items,
  onCardClick,

  variant = "Card",
}: ContentGridProps) {
  const renderVariant = () => {
    switch (variant) {
      case "Card":
        return items.map((item, index) => (
          <div
            key={index}
            onClick={() => onCardClick?.(item)}
            className=" max-h-[260px]   aspect-square p-2  dark:bg-muted/70 border hover:border-blue-300/30 hover:bg-muted  rounded-md cursor-pointer flex flex-col gap-2 justify-between"
          >
            <div className="font-semibold line-clamp-2 mb-2">{item.title}</div>
          </div>
        ));

      case "Thumbnail":
        return items.map((item, index) => (
          <Link to={`${item.id}/`}>
            <div
              key={index}
              onClick={() => onCardClick?.(item)}
              className="max-w-[12vw] flex flex-col gap-2 items-center rounded-md overflow-hidden hover:bg-accent border hover:border-blue-300/30  mb-2  dark:bg-muted/70  "
            >
              <img
                src="https://youlearn-content-uploads.s3.amazonaws.com/thumbnails/pdf/x6R0LzzLtedX069.png"
                alt="preview"
                className=" w-full rounded-sm  object-contain h-[10%]"
              />
              <div className="w-full flex flex-col items-start justify-start  p-2 border-t ">
                <div className="text-xs truncate max-w-[8rem]">
                  {item.title}
                </div>
              </div>
            </div>
          </Link>
        ));
    }
  };

  return (
    <div className=" overflow-auto scrollbar-hide">
      <div className=" grid gap-4 grid-cols-2  md:grid-cols-3  lg:grid-cols-5 ">
        {renderVariant()}
      </div>
    </div>
  );
}
