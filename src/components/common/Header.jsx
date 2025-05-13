"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import NavItem from "./NavItem";
import UserProfileMenu from "./ProfileMenu";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const pathname = usePathname();
  const [isAuthPage, setIsAuthPage] = useState(false);
  const [isInProject, setIsInProject] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const url = "http://localhost:3000/nipralo-jira/";

  useEffect(() => {
    const hideOnRoutes = [
      "/login",
      "/register",
      "/reset-password",
      "/update-password",
      "/",
    ];
    setIsAuthPage(hideOnRoutes.includes(pathname));

    const navHide = [
      ...hideOnRoutes,
    ];
    setIsInProject(!navHide.includes(pathname));

    // No need to check for client detail page anymore
  }, [pathname]);

  // Main navigation items - these are the only ones we want to show
  const navItems = [
    { label: "Home", href: `${url}workspace` },
    { label: "Summary", href: `${url}summary` },
    { label: "Reports", href: `${url}reports` },
    { label: "Client", href: `${url}client` },
  ];

  return (
    <header className="w-full sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 py-3 border-b bg-white backdrop-blur bg-opacity-90">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src={"/images/nipralo_logo.png"}
          width={140}
          height={40}
          alt="Nipralo Logo"
          className="object-contain"
        />
      </Link>

      {/* Mobile Menu Button */}
      {isInProject && (
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Nav Items (Desktop) */}
      {isInProject && (
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>
      )}

      {/* Profile */}
      {!isAuthPage && <UserProfileMenu />}

      {/* Mobile Menu */}
      {mobileMenuOpen && isInProject && (
        <div className="absolute top-full left-0 w-full bg-white border-t shadow-md md:hidden flex flex-col items-start px-6 py-4 gap-4">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
