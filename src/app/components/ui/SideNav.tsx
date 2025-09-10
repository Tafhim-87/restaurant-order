"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, HomeIcon, NotebookText, CookingPot, CircleDollarSign, PrinterCheck } from "lucide-react";


const navItems = [
  { name: "Dashboard", path: "/pos", icon: <HomeIcon size={20} /> },
  { name: "Orders", path: "/pos/orders", icon: <NotebookText size={20} /> },
  { name: "Menu", path: "/pos/menu", icon: <CookingPot size={20} /> },
  { name: "Payments", path: "/pos/payments", icon: <CircleDollarSign size={20} /> },
  { name: "Print_Bill", path: "/pos/print-bill", icon: <PrinterCheck size={20} /> },
];

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h1 className="text-lg font-bold text-white">POS System</h1>
          <button
            className="md:hidden text-gray-400 hover:text-gray-200"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <nav className="mt-4 space-y-2 px-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition 
                ${
                  pathname === item.path
                    ? "bg-[#006769] text-white shadow"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              onClick={() => setOpen(false)}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* add copyright */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Tafhim Hasan
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        className={`fixed top-4 left-4 z-50 p-2 bg-gray-900 text-gray-200 shadow rounded-md md:hidden ${open ? "hidden" : ""
          }`}
        aria-label="Open sidebar" 
        onClick={() => setOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Overlay on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6">{children}</main>
    </div>
  );
}
