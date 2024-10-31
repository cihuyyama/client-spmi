import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Telescope,
  ListTodo,
  UserCog,
  Library,
  Wallet,
  ToyBrick,
  Pocket
} from "lucide-react";


type Submenu = {
  href: string;
  label: string;
  active: boolean;
  role: string
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon
  role: string
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          role: 'All',
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Master",
      menus: [
        {
          href: "/mata-anggaran",
          label: "Mata Anggaran",
          active: pathname.includes("/mata-anggaran"),
          icon: Library,
          role: 'All',
          submenus: []
        },
        {
          href: "",
          label: "Mata Rekening",
          active: pathname.includes("/mata-rekening") || pathname.includes("/jenis-rekening"),
          icon: Wallet,
          role: 'All',
          submenus: [
            {
              href: "/mata-rekening",
              label: "Rekening",
              active: pathname.includes("/mata-rekening"),
              role: 'All'
            },
            {
              href: "/jenis-rekening",
              label: "Jenis Rekening",
              active: pathname.includes("/jenis-rekening"),
              role: 'All'
            },
          ]
        },
      ]
    },
    {
      groupLabel: "Penyusunan Anggaran",
      menus: [
        {
          href: "/visi-misi",
          label: "Visi Misi",
          active: pathname.includes("/visi-misi"),
          icon: Telescope,
          role: 'All',
          submenus: []
        },
        {
          href: "/indicator",
          label: "Indikator Kinerja",
          active: pathname.includes("/indicator"),
          icon: ListTodo,
          role: 'All',
          submenus: []
        },
      ]
    },
    // {
    //   groupLabel: "Contents",
    //   menus: [
    //     {
    //       href: "",
    //       label: "Posts",
    //       active: pathname.includes("/posts"),
    //       icon: SquarePen,
    //       role: 'All',
    //       submenus: [
    //         {
    //           href: "/posts",
    //           label: "All Posts",
    //           active: pathname === "/posts",
    //           role: 'All'
    //         },
    //         {
    //           href: "/posts/new",
    //           label: "New Post",
    //           active: pathname === "/posts/new",
    //           role: 'All'
    //         }
    //       ]
    //     },
    //     {
    //       href: "/categories",
    //       label: "Categories",
    //       active: pathname.includes("/categories"),
    //       icon: Bookmark,
    //       submenus: []
    //     },
    //     {
    //       href: "/tags",
    //       label: "Tags",
    //       active: pathname.includes("/tags"),
    //       icon: Tag,
    //       submenus: []
    //     }
    //   ]
    // },
    {
      groupLabel: "Data",
      menus: [
        {
          href: "/roles",
          label: "Roles",
          active: pathname.includes("/roles"),
          icon: UserCog,
          role: 'All',
          submenus: []
        },
        {
          href: "/bidang",
          label: "Bidang Unit",
          active: pathname.includes("/bidang"),
          icon: ToyBrick,
          role: 'All',
          submenus: []
        },
        {
          href: "/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          role: 'All',
          submenus: []
        },
        {
          href: "",
          label: "Data Universitas",
          active: pathname.includes("/univ-data"),
          icon: Settings,
          role: 'All',
          submenus: [
            {
              href: "/univ-data/faculty",
              label: "Unit / Suporting Unit",
              active: pathname === "/univ-data/faculty",
              role: 'All'
            },
            {
              href: "/univ-data/department",
              label: "Sub Unit",
              active: pathname === "/univ-data/department",
              role: 'All'
            }
          ]
        }
      ]
    }
  ];
}
