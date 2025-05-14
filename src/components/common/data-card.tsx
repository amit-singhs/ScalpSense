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
  return (
    <Card className={cn("shadow-md hover:shadow-lg transition-shadow duration-300", className)}>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className={cn("text-xl md:text-2xl", titleClassName)}>{title}</CardTitle>
            {description && <CardDescription className="mt-1">{description}</CardDescription>}
          </div>
          {headerActions && <div className="ml-auto flex-shrink-0">{headerActions}</div>}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
