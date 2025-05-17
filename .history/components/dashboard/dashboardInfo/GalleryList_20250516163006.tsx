"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

type Gallery = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  quantity: number;
  soldCount: number;
  status: string;
  images: string[];
};

type GalleryListProps = {
  galleries: Gallery[];
};

const ITEMS_PER_PAGE = 6;

const GalleryList = ({ galleries }: GalleryListProps) => {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return filterStatus === "ALL"
      ? galleries
      : galleries.filter((g) => g.status === filterStatus);
  }, [filterStatus, galleries]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mt-10">
        <h2 className="text-lg font-semibold">🖼️ Your Galleries</h2>
        <div className="flex gap-2 items-center">
          <Link className="button-custom p-2" href={"/dashboard/creategallery"}>
            Create Galleries
          </Link>

          <Select
            value={filterStatus}
            onValueChange={(value) => {
              setFilterStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {paginated.length === 0 ? (
        <p className="text-sm text-muted-foreground">No galleries found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((gallery) => (
            <Card key={gallery.id}>
              <CardContent className="p-4">
                <Image
                  src={gallery.images[0]}
                  alt={gallery.title}
                  width={500}
                  height={300}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="text-md font-bold mt-2">{gallery.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {gallery.description}
                </p>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span>💰 {gallery.price}฿</span>
                  <span>📦 {gallery.quantity} in stock</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sold: {gallery.soldCount} | Status: {gallery.status}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <Button variant="outline" onClick={handlePrev} disabled={page === 1}>
            ← Prev
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={page === totalPages}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
};

export default GalleryList;
