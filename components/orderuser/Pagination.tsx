"use client";

import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-between items-center mt-6">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ⬅ Prev
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next ➡
      </Button>
    </div>
  );
}
