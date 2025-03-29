"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface GalleryItem {
  id: string;
  title: string;
  price: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  images: string[];
}

export default function AdminGalleryPage() {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/galleries");
      setGalleries(res.data);
    } catch (err) {
      toast.error("Failed to fetch galleries");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await axios.put(`/api/admin/galleries/${id}`, { status });
      toast.success("Status updated");
      fetchGalleries();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Gallery Approval</h1>
      <Separator className="mb-4" />
      {loading ? (
        <p>Loading...</p>
      ) : galleries.length === 0 ? (
        <p>No pending galleries</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleries.map((gallery) => (
            <Card key={gallery.id} className="p-4">
              <CardContent className="flex flex-col gap-2">
                <Image
                  src={gallery.images[0]}
                  alt={gallery.title}
                  className="w-full h-40 object-cover rounded"
                  width={200}
                  height={200}
                />
                <h2 className="text-lg font-semibold">{gallery.title}</h2>
                <p className="text-sm">Price: ${gallery.price.toFixed(2)}</p>
                <Badge
                  variant={
                    gallery.status === "APPROVED"
                      ? "default"
                      : gallery.status === "REJECTED"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {gallery.status}
                </Badge>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => updateStatus(gallery.id, "APPROVED")}
                    disabled={gallery.status === "APPROVED"}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(gallery.id, "REJECTED")}
                    disabled={gallery.status === "REJECTED"}
                  >
                    Reject
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
