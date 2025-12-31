import React from "react";

import { Badge } from "../ui/badge";
import { Link, useLocation } from "react-router";

type Variant = "Card" | "Thumbnail";

export interface ContentItem {
  id: string;
  title: string;
  date: string;
  author?: string;
}

interface ContentGridProps {
  items: ContentItem[];
  onCardClick?: (item: ContentItem) => void;
  headerText?: string;
  variant?: Variant;
}

export default function ContentGrid({
  items,
  onCardClick,
  headerText = "14 May 2026",
  variant = "Card",
}: ContentGridProps) {
  const { pathname } = useLocation();

  const renderVariant = () => {
    switch (variant) {
      case "Card":
        return items.map((item, index) => (
          <Link
            to={`${pathname}/${item.id}`}
            key={index}
            className=" max-h-[260px]   aspect-square p-2  dark:bg-muted/70 border hover:border-blue-300/30 hover:bg-muted  rounded-md cursor-pointer flex flex-col gap-2 justify-between"
          >
            <div className="font-semibold line-clamp-2 mb-2">{item.title}</div>
            {/* 
            <div className="flex flex-col gap-4">
              <div className="line-clamp-3">{item.description}</div>
            </div> */}

            <div className="flex flex-row justify-between">
              <div className="text-stone-400 text-sm">{item.date}</div>
              <Badge variant="secondary">Mock Exam</Badge>
            </div>
          </Link>
        ));

      case "Thumbnail":
        return items.map((item, index) => (
          <div
            key={index}
            onClick={() => onCardClick?.(item)}
            className="flex flex-col  min-w-[8rem] max-w-[14rem]  rounded-xl shadow-sm hover:shadow-md border  transition-all cursor-pointer"
          >
            <div className="w-full aspect-[16/10] overflow-hidden rounded-t-xl">
              <img
                src={
                  "https://youlearn-content-uploads.s3.amazonaws.com/thumbnails/pdf/x6R0LzzLtedX069.png"
                }
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-3 flex flex-col">
              <div className="text-sm font-medium line-clamp-1">
                {item.title}
              </div>
              <div className="text-xs text-muted-foreground">{item.date}</div>
            </div>
          </div>
        ));
    }
  };

  return (
    <div className=" h-[80vh] overflow-auto scrollbar-hide @container ">
      <div className=" flex flex-row gap-3 flex-wrap justify-center  @lg:justify-start ">
        {renderVariant()}
      </div>
    </div>
  );
}
