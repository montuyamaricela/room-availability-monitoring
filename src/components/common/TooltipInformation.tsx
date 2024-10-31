import React, { type ReactNode } from "react";
import Image from "next/image";
import icon from "/public/images/icon/image.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type TooltipInformationProps = {
    children: ReactNode;
  };
  type TooltipProps = {
    icons: ReactNode;
    children: ReactNode;
  };

export function TooltipInformation({ children }: TooltipInformationProps) {
  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Image
                    src={icon}
                    alt="Information"
                    className="cursor-pointer"
                    width={15}
                />
            </TooltipTrigger>
            <TooltipContent className="text-xs font-normal">
                {children}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  );
}

export function Tooltips({ icons, children }: TooltipProps) {
    return (
      <TooltipProvider>
          <Tooltip>
              <TooltipTrigger asChild>
                  {icons}
              </TooltipTrigger>
              <TooltipContent className="text-xs font-normal">
                  {children}
              </TooltipContent>
          </Tooltip>
      </TooltipProvider>
    );
  }