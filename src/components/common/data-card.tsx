import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface DataCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  headerActions?: ReactNode;
}

export function DataCard({ title, description, children, className, titleClassName, headerActions }: DataCardProps) {
  // Check if the DataCard is intended to be a flex column that fills height
  const isVerticalFlexFill = className?.includes('h-full') && className?.includes('flex-col');

  return (
    <Card className={cn(
      "shadow-md hover:shadow-lg transition-shadow duration-300",
      className // User-provided classes, e.g., "h-full flex flex-col"
    )}>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className={cn("text-xl md:text-2xl", titleClassName)}>{title}</CardTitle>
            {description && <CardDescription className="mt-1">{description}</CardDescription>}
          </div>
          {headerActions && <div className="ml-auto flex-shrink-0">{headerActions}</div>}
        </div>
      </CardHeader>
      <CardContent className={cn(
        "p-6 pt-0", // Default padding from ShadCN
        isVerticalFlexFill ? "flex-1 overflow-hidden" : "" // Allows child (e.g. ScrollArea with h-full) to take space
      )}>
        {children}
      </CardContent>
    </Card>
  );
}
