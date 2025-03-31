import { Card, CardContent } from "@/components/ui/card";

type InfoDashboardProps = {
  shop?: {
    name?: string;
    phone?: string;
  };

  totalGallery: number;
};

const InfoDashboard = ({ shop, totalGallery }: InfoDashboardProps) => {
  return (
    <>
      {/* Shop Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Shop Name</p>
            <h2 className="text-xl font-bold">
              {shop?.name || "Unnamed Shop"}
            </h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Phone Number</p>
            <h2 className="text-xl font-bold">{shop?.phone || "N/A"}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Galleries</p>
            <h2 className="text-xl font-bold">{totalGallery}</h2>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
export default InfoDashboard;
