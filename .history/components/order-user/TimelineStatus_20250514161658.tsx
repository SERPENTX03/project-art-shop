import type { DeliveryStatus as PrismaDeliveryStatus } from "@prisma/client";
import { Clock, Hammer, Truck, CheckCircle } from "lucide-react";
import Image from "next/image";

type TimelineStatusProps = {
  current: PrismaDeliveryStatus;
  galleryTitle: string;
  imageUrl: string;
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
      {/* 🖼 Gallery Title + Image */}
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

      {/* 🔁 Timeline Steps */}
      <div className="relative flex justify-between items-center mt-4">
        {/* เส้น timeline */}
        <div className="absolute top-2 left-0 w-full h-1 bg-gray-200 z-0" />
        <div
          className="absolute top-2 left-0 h-1 bg-green-500 z-10 transition-all duration-500"
          style={{
            width: `${(currentIndex / (TIMELINE_STEPS.length - 1)) * 100}%`,
          }}
        />

        {TIMELINE_STEPS.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const statusColor =
            isDone || isCurrent ? "text-green-600" : "text-gray-400";

          return (
            <div
              key={step.status}
              className="relative z-20 flex flex-col items-center text-center w-1/4"
            >
              <div
                className={`rounded-full p-2 border-2 ${
                  isCurrent
                    ? "bg-green-100 border-green-600"
                    : isDone
                    ? "bg-green-500 border-green-600"
                    : "bg-gray-200 border-gray-300"
                }`}
              >
                {step.icon}
              </div>
              <p className={`text-xs mt-2 ${statusColor}`}>{step.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineStatus;
