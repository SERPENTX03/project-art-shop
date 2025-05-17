import type { DeliveryStatus as PrismaDeliveryStatus } from "@prisma/client";
import { Clock, Hammer, Truck, CheckCircle } from "lucide-react";
import Image from "next/image";

type TimelineStatusProps = {
  current: PrismaDeliveryStatus;
  galleryTitle: string;
  imageUrl: string;
};

// 🌈 สีตามสถานะ
const STATUS_COLORS: Record<PrismaDeliveryStatus, string> = {
  PENDING: "text-yellow-500 bg-yellow-100 border-yellow-500",
  PROCESSING: "text-blue-500 bg-blue-100 border-blue-500",
  SHIPPED: "text-purple-500 bg-purple-100 border-purple-500",
  DELIVERED: "text-green-600 bg-green-100 border-green-600",
  CANCELLED: "text-red-500 bg-red-100 border-red-500",
  RETURNED: "text-orange-500 bg-orange-100 border-orange-500",
  RETURN_REQUESTED: "text-pink-500 bg-pink-100 border-pink-500",
};

const TIMELINE_STEPS: {
  status: PrismaDeliveryStatus;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    status: "PENDING",
    label: "Awaiting Payment",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    status: "PROCESSING",
    label: "Preparing",
    icon: <Hammer className="w-5 h-5" />,
  },
  {
    status: "SHIPPED",
    label: "Shipping",
    icon: <Truck className="w-5 h-5" />,
  },
  {
    status: "DELIVERED",
    label: "Delivered",
    icon: <CheckCircle className="w-5 h-5" />,
  },
];

const TimelineStatus = ({
  current,
  galleryTitle,
  imageUrl,
}: TimelineStatusProps) => {
  const currentIndex = TIMELINE_STEPS.findIndex((s) => s.status === current);

  return (
    <div className="border p-4 rounded-xl shadow-sm space-y-4">
      {/* 🖼 Gallery */}
      <div className="flex gap-4 items-center">
        <Image
          src={imageUrl}
          alt={galleryTitle}
          width={64}
          height={64}
          className="rounded-md object-cover border"
        />
        <h3 className="text-lg font-semibold">{galleryTitle}</h3>
      </div>

      {/* 🔁 Timeline */}
      <div className="relative flex justify-between items-center mt-4">
        <div className="absolute top-2 left-0 w-full h-1 bg-gray-200 z-0" />
        <div
          className="absolute top-2 left-0 h-1 z-10 transition-all duration-500"
          style={{
            width: `${(currentIndex / (TIMELINE_STEPS.length - 1)) * 100}%`,
            backgroundColor: "#22c55e", // green-500
          }}
        />

        {TIMELINE_STEPS.map((step, idx) => {
          const isCurrent = step.status === current;
          const isDone = idx < currentIndex;
          const baseColor =
            STATUS_COLORS[step.status as PrismaDeliveryStatus] || "";

          return (
            <div
              key={step.status}
              className="relative z-20 flex flex-col items-center text-center w-1/4"
            >
              <div
                className={`rounded-full p-2 border-2 transition-colors duration-300 ${
                  isCurrent || isDone
                    ? baseColor
                    : "bg-gray-200 border-gray-300 text-gray-400"
                }`}
              >
                {step.icon}
              </div>
              <p
                className={`text-xs mt-2 transition-colors ${
                  isCurrent || isDone
                    ? baseColor
                        .split(" ")
                        .find((cls) => cls.startsWith("text-"))
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineStatus;
