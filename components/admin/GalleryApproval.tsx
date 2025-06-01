"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Pagination from "./Pagination";
import GalleryCard from "./GalleryCard";
import { Gallery } from "@prisma/client";

export default function GalleryApprovalPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState<
    "PENDING" | "APPROVED" | "REJECTED"
  >("PENDING");

  const pageSize = 6;

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const res = await fetch("/api/admin/galleries");
        const data = await res.json();
        setGalleries(data);
      } catch (error) {
        console.error("Failed to fetch galleries:", error);
      }
    };

    fetchGalleries();
  }, []);

  const updateStatus = async (
    id: string,
    status: "APPROVED" | "REJECTED",
    reasons: string[] = []
  ) => {
    try {
      await fetch(`/api/admin/galleries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reasons }),
      });

      setGalleries((prev) =>
        prev.map((g) => (g.id === id ? { ...g, status } : g))
      );
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const filteredByStatus = galleries.filter((g) => g.status === currentTab);
  const paginated = filteredByStatus.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filteredByStatus.length / pageSize);

  return (
    <div className="p-6 space-y-6">
      <Tabs
        defaultValue="PENDING"
        value={currentTab}
        onValueChange={(val) => {
          setCurrentTab(val as typeof currentTab);
          setCurrentPage(1); // Reset page on tab change
        }}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="PENDING">⏳ Pending</TabsTrigger>
          <TabsTrigger value="APPROVED">✅ Approved</TabsTrigger>
          <TabsTrigger value="REJECTED">❌ Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab}>
          <div className="grid  md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginated.map((gallery) => (
              <GalleryCard
                key={gallery.id}
                gallery={gallery}
                updateStatus={updateStatus}
              />
            ))}
          </div>

          {filteredByStatus.length > pageSize && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
