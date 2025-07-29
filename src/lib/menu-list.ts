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
  Pocket,
  CircleDollarSign,
  Proportions,
  FileText,
  ScrollText
} from "lucide-react";
import path from "path";


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
  jadwal?: string
};

type Group = {
  groupLabel: string;
  role: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    // {
    //   groupLabel: "",
    //   menus: [
        // {
        //   href: "/dashboard",
        //   label: "Dashboard",
        //   active: pathname.includes("/dashboard"),
        //   icon: LayoutGrid,
        //   role: 'All',
        //   submenus: []
        // },
    //   ]
    // },
    {
      groupLabel: "Admin Perencanaan",
      role: 'ADMIN_PERENCANAAN',
      menus: [
        {
          href: "",
          label: "Unit",
          active: pathname.includes("unit") || pathname.includes("category-unt"),
          icon: Settings,
          role: 'All',
          submenus: [
            {
              href: "/category-unt",
              label: "Kategori Unit",
              active: pathname.includes("category-unt"),
              role: 'All'
            },
            {
              href: "/unit",
              label: "Unit",
              active: pathname.includes("unit"),
              role: 'All'
            },
          ]
        },
        {
          href: "/roles",
          label: "Roles",
          active: pathname.includes("/roles"),
          icon: UserCog,
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
          href: "/jadwal",
          label: "Jadwal",
          active: pathname.includes("/jadwal"),
          icon: LayoutGrid,
          role: 'All',
          submenus: []
        },
        // {
        //   href: "/jadwal-laporan",
        //   label: "Jadwal Laporan",
        //   active: pathname.includes("/jadwal-laporan"),
        //   icon: LayoutGrid,
        //   role: 'All',
        //   submenus: [],
        // },
        {
          href: "/bidang",
          label: "Bidang",
          active: pathname.includes("/bidang"),
          icon: ToyBrick,
          role: 'All',
          submenus: []
        },
        {
          href: "/admin-indicator",
          label: "Indikator Kinerja",
          active: pathname.includes("/admin-indicator"),
          icon: ListTodo,
          role: 'All',
          submenus: []
        },
        {
          href: "/mata-anggaran",
          label: "Mata Anggaran",
          active: pathname.includes("/mata-anggaran"),
          icon: Library,
          role: 'All',
          submenus: []
        },
        {
          href: "/pagu",
          label: "Pagu Anggaran",
          active: pathname.includes("/pagu"),
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
              href: "/jenis-rekening",
              label: "Jenis Rekening",
              active: pathname.includes("/jenis-rekening"),
              role: 'All'
            },
            {
              href: "/mata-rekening",
              label: "Rekening",
              active: pathname.includes("/mata-rekening"),
              role: 'All'
            },
          ]
        },
        {
          href: "/review",
          label: "Review Program Kerja",
          active: pathname.includes("/review"),
          icon: Telescope,
          role: 'All',
          submenus: []
        },
        // {
        //   href: "/pagu",
        //   label: "Pagu Anggaran",
        //   active: pathname.includes("/pagu"),
        //   icon: LayoutGrid,
        //   role: 'All',
        //   submenus: []
        // },
      ]
    },
    {
      groupLabel: "Aktivitas",
      role: 'ADMIN_UNIT',
      menus: [
        // {
        //   href: "/visi-misi",
        //   label: "Visi Misi",
        //   active: pathname.includes("/visi-misi"),
        //   icon: Telescope,
        //   role: 'All',
        //   submenus: []
        // },
        {
          href: "/indicator",
          label: "Program kerja",
          active: pathname.includes("/indicator"),
          icon: ListTodo,
          role: 'All',
          submenus: [],
          jadwal: "penyusunan"
        },
        {
          href: "/review",
          label: "Review Program kerja",
          active: pathname.includes("/indicator"),
          icon: ListTodo,
          role: 'All',
          submenus: [],
          jadwal: "review"
        },
        {
          href: "/spp",
          label: "SPP",
          active: pathname.includes("/spp"),
          icon: ListTodo,
          role: 'All',
          submenus: [],
          jadwal: "pencairan"
        },
        {
          href: "/spmu",
          label: "SPMU",
          active: pathname.includes("/SPMU"),
          icon: ListTodo,
          role: 'All',
          submenus: [],
          jadwal: "pencairan"
        },
        {
          href: "/spj/progres",
          label: "Entry Progres Kegiatan",
          active: pathname.includes("/progres"),
          icon: ListTodo,
          role: 'All',
          submenus: [],
          jadwal: "pencairan"
        },
        {
          href: "/spj/entry-spj",
          label: "Entry SPJ",
          active: pathname.includes("/entry-spj"),
          icon: ListTodo,
          role: 'All',
          submenus: [],
          jadwal: "pencairan"
        },
        {
          href: "/laporan",
          label: "Formulir Laporan",
          active: pathname.includes("/laporan"),
          icon: Proportions,
          role: 'All',
          submenus: [],
          jadwal: "pelaporan"
        },
        {
          href: "/laporan-audit",
          label: "Laporan Audit",
          active: pathname.includes("/laporan-audit"),
          icon: Proportions,
          role: 'All',
          submenus: [],
          jadwal: "pelaporan"
        },
      ]
    },
    {
      groupLabel: "Review",
      role: 'REVIEWER',
      menus: [
        {
          href: "/review",
          label: "Review Program Kerja",
          active: pathname.includes("/review"),
          icon: Telescope,
          role: 'All',
          submenus: []
        },
      ]
    },
    {
      groupLabel: "Admin Keuangan",
      role: 'ADMIN_KEUANGAN',
      menus: [
        {
          href: "/jadwal-pencairan",
          label: "Jadwal Pencairan",
          active: pathname.includes("/jadwal-pencairan"),
          icon: LayoutGrid,
          role: 'ADMIN_KEUANGAN',
          submenus: []
        },
      ]
    },
    {
      groupLabel: "Laporan",
      role: 'ASSESOR_AUDIT',
      menus: [
        {
          href: "/laporan",
          label: "Formulir Laporan",
          active: pathname === "/laporan",
          icon: FileText,
          role: 'All',
          submenus: []
        },
        {
          href: "/laporan-audit",
          label: "Laporan Audit",
          active: pathname.includes("/laporan-audit"),
          icon: ScrollText,
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
    // {
    //   groupLabel: "Data",
    //   menus: [
    //     {
    //       href: "/roles",
    //       label: "Roles",
    //       active: pathname.includes("/roles"),
    //       icon: UserCog,
    //       role: 'All',
    //       submenus: []
    //     },
    //     {
    //       href: "/bidang",
    //       label: "Bidang Unit",
    //       active: pathname.includes("/bidang"),
    //       icon: ToyBrick,
    //       role: 'All',
    //       submenus: []
    //     },
    //     {
    //       href: "/users",
    //       label: "Users",
    //       active: pathname.includes("/users"),
    //       icon: Users,
    //       role: 'All',
    //       submenus: []
    //     },
    //     {
    //       href: "",
    //       label: "Data Universitas",
    //       active: pathname.includes("/univ-data"),
    //       icon: Settings,
    //       role: 'All',
    //       submenus: [
    //         {
    //           href: "/univ-data/faculty",
    //           label: "Unit / Suporting Unit",
    //           active: pathname === "/univ-data/faculty",
    //           role: 'All'
    //         },
    //         {
    //           href: "/univ-data/department",
    //           label: "Sub Unit",
    //           active: pathname === "/univ-data/department",
    //           role: 'All'
    //         }
    //       ]
    //     }
    //   ]
    // }
  ];
}
