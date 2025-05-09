"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import NavItem from "./NavItem";
import UserProfileMenu from "./ProfileMenu";
import Image from "next/image";

const Header = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const isInProject =
    pathSegments[0] === "workspace" && pathSegments[2] !== undefined;

  const hideOnRoutes = [
    "/login",
    "/register",
    "/reset-password",
    "update-password",
  ];
  if (hideOnRoutes.includes(pathname)) return null;

  const navItems = [
    { label: "Backlog", href: `${pathname}/backlog` },
    { label: "Board", href: `${pathname}/board` },
    { label: "Reports", href: `${pathname}/reports` },
  ];

  return (
    <header className="w-full sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b bg-white backdrop-blur bg-opacity-90">
      {/* Logo */}
      <Link href="/">
        <Image
          src={"/images/nipralo_logo.png"}
          width={200}
          height={100}
          alt="Nipralo Logo"
        />
      </Link>

      {/* Nav Items (only on project page) */}
      {isInProject && (
        <nav className="flex items-center gap-4">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>
      )}

      {/* Profile */}
      <UserProfileMenu />
    </header>
  );
};

export default Header;
