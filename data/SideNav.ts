import { ListTodo, Home, ClockArrowUp, Package, Undo2, DollarSign } from "lucide-react";

export const items = [
  {
    title: "Dashbord",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Gallery List",
    url: "/dashboard/gallery-list",
    icon: ListTodo,
  },
  {
    title: "Total Sales",
    url: "/dashboard/orders",
    icon: DollarSign,
  },
  {
    title: "Order Return",
    url: "/dashboard/order-return",
    icon: Undo2,
  },
  {
    title: "Order Management",
    url: "/dashboard/order-management",
    icon: Package,
  },
  {
    title: "Order Graph",
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
  {
    title: "Total Sales",
    url: "/admin/total-sales",
    icon: DollarSign,
  },
];
