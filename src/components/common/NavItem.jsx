'use client';
import Link from 'next/link';

const NavItem = ({ label, href }) => (
  <Link
    href={href}
    className="text-sm px-3 py-2 hover:text-blue-600 transition-colors"
  >
    {label}
  </Link>
);

export default NavItem;
