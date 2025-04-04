"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

interface DownloadDropdownProps {
  imageUrl: string;
  title: string;
}

const imageFormats = [
  { label: "📄 PNG", value: "png" },
  { label: "🖼 JPG", value: "jpg" },
  { label: "🌐 WebP", value: "webp" },
  { label: "📥 Original", value: "original" },
];

export default function DownloadDropdown({
  imageUrl,
  title,
}: DownloadDropdownProps) {
  const downloadImage = async (url: string, title: string, format: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);

    const fileExtension =
      format === "original" ? blob.type.split("/")[1] : format;

    const link = document.createElement("a");
    link.href = objectURL;
    link.download = `${title}.${fileExtension}`;
    link.click();

    URL.revokeObjectURL(objectURL);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <DownloadIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {imageFormats.map((format) => (
          <DropdownMenuItem
            key={format.value}
            onClick={() => downloadImage(imageUrl, title, format.value)}
          >
            {format.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
