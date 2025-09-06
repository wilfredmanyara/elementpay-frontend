"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="flex-shrink-0">
        <Link href="/" className="cursor-pointer">
          <h1 className="text-xl md:text-2xl font-bold text-gradient">
            EquiPay
          </h1>
        </Link>
      </div>

      <div className="flex-1 justify-center hidden md:flex">
        <div className="flex space-x-8">
          <Link
            href="/orders"
            className={`inline-flex items-center px-4 py-2 rounded-sm text-sm font-medium transition-all ${
              pathname === "/orders"
                ? "text-dark-200 border-b-2 border-blue-600"
                : "text-dark-200 hover:gradient-hover"
            }`}
          >
            Orders
          </Link>
          <Link
            href="/wallet"
            className={`inline-flex items-center px-4 py-2 rounded-sm text-sm font-medium transition-all ${
              pathname === "/wallet"
                ? "text-dark-200 border-b-2 border-blue-600"
                : "text-dark-200 hover:gradient-hover"
            }`}
          >
            Wallet
          </Link>
        </div>
      </div>

      <div className="flex-shrink-0">
        <div className="hidden lg:block">
          <ConnectButton />
        </div>
        <div className="block lg:hidden">
          <ConnectButton
            showBalance={false}
            accountStatus="avatar"
            chainStatus="none"
          />
        </div>
      </div>
    </nav>
  );
}
