"use client";

import { useParams } from "next/navigation";
import { TableOrderProvider } from "@/contexts/TableOrderContext";

export default function TableOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const tableId = params.tableId as string;
  const sectionId = params.sectionId as string;

  if (!tableId || !sectionId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <p className="text-muted-foreground">Invalid table or section.</p>
      </div>
    );
  }

  return (
    <TableOrderProvider tableId={tableId} sectionId={sectionId}>
      {children}
    </TableOrderProvider>
  );
}
