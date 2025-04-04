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
    <div className="flex items-center justify-between mt-6">
      <Button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        variant="outline"
      >
        ⬅ Prev
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        variant="outline"
      >
        Next ➡
      </Button>
    </div>
  );
}
