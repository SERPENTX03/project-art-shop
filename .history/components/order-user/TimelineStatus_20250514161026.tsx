type DeliveryStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";

const STATUS_ORDER: DeliveryStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

const STATUS_LABEL: Record<DeliveryStatus, string> = {
  PENDING: "Awaiting Payment",
  PROCESSING: "Preparing",
  SHIPPED: "Shipping",
  DELIVERED: "Delivered",
};

const TimelineStatus = ({ current }: { current: DeliveryStatus }) => {
  const currentIndex = STATUS_ORDER.indexOf(current);

  return (
    <div className="flex items-center justify-between w-full max-w-xl mx-auto mt-2">
      {STATUS_ORDER.map((status, idx) => (
        <div key={status} className="flex-1 text-center">
          <div
            className={`w-4 h-4 mx-auto rounded-full ${
              idx <= currentIndex ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          <p
            className={`text-xs mt-1 ${
              idx <= currentIndex
                ? "text-green-600 font-medium"
                : "text-gray-400"
            }`}
          >
            {STATUS_LABEL[status]}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TimelineStatus;
