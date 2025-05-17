import { DELIVERY_TIMELINE, RETURN_TIMELINE } from "@/data/DataTimelineStatus";
import type {
  DeliveryStatus as PrismaDeliveryStatus,
  ReturnStatus as PrismaReturnStatus,
} from "@prisma/client";
import Image from "next/image";

type TimelineStatusProps = {
  current: PrismaDeliveryStatus | PrismaReturnStatus;
  galleryTitle: string;
  imageUrl: string;
  mode?: "delivery" | "return";
};

const TimelineStatus = ({
  current,
  galleryTitle,
  imageUrl,
  mode = "delivery",
}: TimelineStatusProps) => {
  const steps = mode === "return" ? RETURN_TIMELINE : DELIVERY_TIMELINE;
  const currentIndex = steps.findIndex((s) => s.status === current);

  const isSuccess = current === "DELIVERED" || current === "REFUNDED";
  const isRejected = current === "REJECTED";

  const baseColor = isSuccess
    ? {
        text: "text-green-600",
        bg: "bg-green-100",
        border: "border-green-600",
        line: "bg-green-500",
      }
    : isRejected
    ? {
        text: "text-red-600",
        bg: "bg-red-100",
        border: "border-red-600",
        line: "bg-red-500",
      }
    : {
        text: "text-yellow-600",
        bg: "bg-yellow-100",
        border: "border-yellow-500",
        line: "bg-yellow-400",
      };

  return (
    <div className="border p-4 rounded-xl shadow-sm space-y-4">
      {/* Gallery Info */}
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

      {/* Timeline Bar */}
      <div className="relative flex justify-between items-center mt-4">
        <div className="absolute top-2 left-0 w-full h-1 bg-gray-200 z-0" />

        <div
          className={`absolute top-2 left-0 h-1 z-10 transition-all duration-500 ${baseColor.line}`}
          style={{
            width: `${(currentIndex / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step, idx) => (
          <div
            key={step.status}
            className="relative z-20 flex flex-col items-center text-center w-1/5"
          >
            <div
              className={`rounded-full p-2 border-2 transition-colors duration-300 ${
                idx <= currentIndex
                  ? `${baseColor.bg} ${baseColor.border} ${baseColor.text}`
                  : "bg-gray-200 border-gray-300 text-gray-400"
              }`}
            >
              {step.icon}
            </div>
            <p
              className={`text-xs mt-2 transition-colors ${
                idx <= currentIndex ? baseColor.text : "text-gray-400"
              }`}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineStatus;
