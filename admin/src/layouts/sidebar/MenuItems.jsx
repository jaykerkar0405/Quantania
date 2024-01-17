import {
  DashboardOutlined,
  ContactMailOutlined,
  AdminPanelSettingsOutlined,
  CategoryOutlined,
  ShoppingBasketOutlined,
  AddBoxOutlined,
  ViewCarouselOutlined,
} from "@material-ui/icons";

const MenuItems = [
  {
    title: "Dashboard",
    icon: DashboardOutlined,
    href: "/admin_panel/dashboard",
  },
  {
    title: "Order",
    icon: ShoppingBasketOutlined,
    href: "/admin_panel/order",
  },
  {
    title: "Product",
    icon: AddBoxOutlined,
    href: "/admin_panel/product",
  },
  {
    title: "Category",
    icon: CategoryOutlined,
    href: "/admin_panel/category",
  },
  {
    title: "Administrator",
    icon: AdminPanelSettingsOutlined,
    href: "/admin_panel/administrator",
  },
  {
    title: "Banner",
    icon: ViewCarouselOutlined,
    href: "/admin_panel/banner",
  },
  {
    title: "Contact",
    icon: ContactMailOutlined,
    href: "/admin_panel/contact",
  },
];

export default MenuItems;
