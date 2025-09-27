/**
 * ContentGrid Component
 *
 * - Displays a grid of content items in either "Card" or "Thumbnail" format.
 * - Provides click handling for each item via an optional callback.
 * - Supports customizable header text and variant display modes.
 * - Each item includes metadata such as title, description, date, and author.
 *
 * @author Quincy Pitsi
 * @version 1.0.0
 * @exports ContentGrid
 * @constructor
 * @this {React.FC<ContentGridProps>}
 * @param {ContentGridProps} props - Component props.
 * @returns {JSX.Element} A grid layout displaying content items.
 * @throws Will throw if `items` array is undefined or invalid.
 * @see ContentItem
 * @todo
 */

import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EllipsisVertical, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";

type Variant = "Card" | "Thumbnail";

/**
 * Represents an individual content item displayed in the grid.
 *
 * @property {string} id - Unique identifier for the content item.
 * @property {string} title - Title of the content item.
 * @property {string} [description] - Optional description of the content.
 * @property {string} [thumbnailURL] - Optional URL of a thumbnail image.
 * @property {string} date - Date associated with the content.
 * @property {string} author - Author of the content.
 */
export interface ContentItem {
  id: string;

  title: string;

  thumbnailURL?: string;
}

/**
 * Props for the ContentGrid component.
 *
 * @property {ContentItem[]} items - Array of content items to display.
 * @property {(item: ContentItem) => void} [onCardClick] - Optional callback when a card is clicked.
 * @property {string} [headerText] - Optional header text (default: `"14 May 2026"`).
 * @property {Variant} [variant] - Display variant: `"Card"` or `"Thumbnail"` (default: `"Card"`).
 */
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
          <Link to={`${item.id}`}>
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
