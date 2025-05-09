import { CirclePlus, Home, ClockArrowUp } from "lucide-react";

export const items = [
  {
    title: "Dashbord",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Create Gallery",
    url: "/dashboard/creategallery",
    icon: CirclePlus,
  },
  {
    title: "Order",
    url: "/dashboard/orders",
    icon: ClockArrowUp,
  },

  {
    title: "Back to Home",
    url: "/",
    icon: Home,
  },
];
export const adminNav = [
  {
    title: "Dashbord",
    url: "/admin/galleries",
    icon: Home,
  },
  {
    title: "Payout",
    url: "/admin/payout",
    icon: ClockArrowUp,
  },
];
