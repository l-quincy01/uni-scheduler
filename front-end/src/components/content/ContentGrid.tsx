import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
// import TopBarNavigation from "@/src/components/Course/CourseResources/TopBarNavigation";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ContentItem } from "./Contentitem";
import ContentGrid from "./Contentitem";

type QuickAction = {
  icon: React.FC;
  tooltipDescription: string;
  onClickFunction: () => void;
};

interface SectionScaffoldProps {
  title?: string;
  tabPage?: "Summary" | "Canvas";
  headerText?: string;
  items: ContentItem[];
  variant?: "Card" | "Thumbnail";
  Form?: React.FC;
  quickActions?: QuickAction[];
  Dialogs?: React.ReactNode;
  renderDetail: (item: ContentItem) => React.ReactNode;
  contentTitle?: React.ReactNode;
  detailHeaderActions?: React.ReactNode;
  className?: string;
  onBack?: () => void;
}

export default function SectionScaffold({
  headerText,
  items,
  variant = "Card",

  renderDetail,
  contentTitle,
  detailHeaderActions,
  className,
  onBack,
}: SectionScaffoldProps) {
  const [selected, setSelected] = useState<ContentItem | null>(null);

  return selected ? (
    <div
      className={`flex flex-col items-center  gap-0 space-y-0 ${
        className ?? ""
      }`}
    >
      <div className="flex flex-row  justify-between w-full ">
        <div className="w-fit flex flex-row items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={() => {
                  onBack?.();
                  setSelected(null);
                }}
                className="py-1 pr-4 pl-0 m-0 rounded-2xl inline-flex  text-xs hover:bg-accent"
              >
                <ChevronLeft size={16} strokeWidth={2} />
                Back
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go Back</p>
            </TooltipContent>
          </Tooltip>
          {contentTitle ? <div className="w-fit">{contentTitle}</div> : null}
        </div>

        {detailHeaderActions ? (
          <div className="w-fit">{detailHeaderActions}</div>
        ) : null}
      </div>

      <div className="pt-2 h-[80vh] overflow-auto scrollbar-hide">
        {renderDetail(selected)}
      </div>
    </div>
  ) : (
    <div className={`flex flex-col ${className ?? ""}`}>
      <ContentGrid
        items={items}
        variant={variant}
        onCardClick={(item) => setSelected(item)}
        headerText={headerText}
      />
    </div>
  );
}
