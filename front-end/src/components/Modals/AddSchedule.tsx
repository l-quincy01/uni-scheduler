import React from "react";
import {
  Command,
  CommandDialog,
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
  return (
    <div>
      <div className="font-semibold text-xl">
        {heading ?? "Choose Your Modules"}
      </div>

      <Select>
        <SelectTrigger className="">
          <SelectValue placeholder="Select your courses" />
        </SelectTrigger>
        <SelectContent>
          <Command>
            <CommandInput placeholder="Search Modules.." />
            <CommandList className="scrollbar-hide">
              <CommandEmpty>No results found.</CommandEmpty>

              {modules.map((mod, index) => (
                <>
                  <CommandGroup key={index} heading={mod.category}>
                    {mod.exams.map((exam, index) => (
                      <CommandItem
                        key={index}
                        className="flex flex-col justify-start items-start gap-1 text-[0.5rem] "
                      >
                        <span className="line-clamp-2 max-w-[16rem]">
                          {exam.title}
                        </span>
                        <span className="font-semibold">{exam.date}</span>
                        <span className="font-semibold">{exam.time}</span>
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
  );
}
