import React, { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { CalendarFold, X } from "lucide-react";

export interface exams {
  title: string;
  date: string;
  time: string;
}
export interface moduleItem {
  category: string;
  exams: exams[];
}

export interface AddScheduleProps {
  modules: moduleItem[];
  heading?: string;
}

export default function AddSchedule({ modules, heading }: AddScheduleProps) {
  const [selectedModules, setSelectedModules] = useState<exams[]>([]);
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [showValidation, setShowValidation] = useState(false);

  const handleSelect = (exam: exams) => {
    if (!selectedModules.find((item) => item.title === exam.title)) {
      setSelectedModules([...selectedModules, exam]);
    }
  };

  const handleRemove = (title: string) => {
    setSelectedModules(selectedModules.filter((exam) => exam.title !== title));
  };

  const handleCreate = async () => {
    setShowValidation(true);

    if (scheduleTitle.trim().length >= 3 && selectedModules.length > 0) {
      try {
        const res = await fetch("http://localhost:4000/api/generate-schedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, //for verifying jwt authorisation
          },
          body: JSON.stringify({
            scheduleTitle,
            selectedModules,
          }),
        });

        const data = await res.json();
        console.log("Saved Schedule:", data);
      } catch (e) {
        console.error("Failed to generate schedule", e);
      }
    }
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="gap-2 flex flex-col w-full">
        <div className="flex flex-row gap-1">
          <Label htmlFor="Schedule Name">Schedule Name</Label>
          {showValidation && scheduleTitle.trim().length < 3 && (
            <span className="text-red-500 text-sm">
              *Schedule name must contain at least 3 characters
            </span>
          )}
        </div>
        <Input
          className="w-1/2"
          id="Schedule Name"
          type="text"
          placeholder="Schedule name"
          onChange={(e) => setScheduleTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-row gap-1 items-center">
        <div className="font-semibold text-sm">
          {heading ?? "Choose Your Modules"}
        </div>

        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select your courses" />
          </SelectTrigger>
          <SelectContent>
            <Command>
              <CommandInput placeholder="Search Modules.." />
              <CommandList className="scrollbar-hide">
                <CommandEmpty>No results found.</CommandEmpty>

                {modules.map((mod, index) => (
                  <>
                    <CommandGroup heading={mod.category}>
                      {mod.exams.map((exam, idx) => (
                        <CommandItem
                          key={idx}
                          onSelect={() => handleSelect(exam)}
                          className="flex flex-col justify-start items-start gap-1 text-[0.7rem] cursor-pointer"
                        >
                          <span className="line-clamp-2 max-w-[16rem] font-semibold">
                            {exam.title}
                          </span>
                          <div className="flex flex-row gap-1 text-muted-foreground">
                            <span>{exam.date}</span>
                            <span>{exam.time}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator />
                  </>
                ))}
              </CommandList>
            </Command>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-row gap-1">
        <div className="text-sm font-semibold text-muted-foreground">
          Modules{" "}
        </div>
        {showValidation && selectedModules.length === 0 && (
          <span className="text-red-500 text-[0.75rem]">
            *Select at least 1 module
          </span>
        )}
      </div>
      {selectedModules.length === 0 ? (
        <span className="text-sm text-muted-foreground self-center">
          Nothing added
        </span>
      ) : (
        <div className="flex flex-wrap gap-2">
          {selectedModules.map((exam) => (
            <Badge
              key={exam.title}
              className="flex items-center gap-1 truncate pr-1"
              variant="secondary"
            >
              {exam.title}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(exam.title);
                }}
                className="ml-1 rounded-sm hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="w-full gap-8 justify-between">
        <Button
          variant="secondary"
          className="flex flex-row gap-1 items-center cursor-pointer"
          onClick={handleCreate}
        >
          <CalendarFold size={14} /> Create Schedule
        </Button>
      </div>
    </div>
  );
}
