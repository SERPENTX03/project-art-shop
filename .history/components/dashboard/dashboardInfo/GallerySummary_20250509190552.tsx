import { Card, CardContent } from "@/components/ui/card";

type Gallery = {
  status: string;
};

type GallerySummaryProps = {
  totalStock: number;
  totalSold: number;
  galleries: Gallery[];
};

const GallerySummary = ({
  totalStock,
  totalSold,
  galleries,
}: GallerySummaryProps) => {
  const pendingCount = galleries.filter((g) => g.status === "PENDING").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border">
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Total Items in Stock</p>
          <h2 className="text-xl font-bold text-green-600">{totalStock}</h2>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Total Sold</p>
          <h2 className="text-xl font-bold text-blue-500">{totalSold}</h2>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Pending Approvals</p>
          <h2 className="text-xl font-bold text-yellow-600">{pendingCount}</h2>
        </CardContent>
      </Card>
    </div>
  );
};

export default GallerySummary;
