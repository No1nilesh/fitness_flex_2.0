"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { BiSolidDashboard } from "react-icons/bi";
import { CgGym } from "react-icons/cg";
import { FaRupeeSign } from "react-icons/fa";
import { MdCardMembership } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { LuAlignLeft } from "react-icons/lu";
import { TbLogout2 } from "react-icons/tb";

const Sidebar = () => {
  //session
  const { data: session } = useSession();
  const router = useRouter();
  // checks url pathname
  const pathname = usePathname();
  //logout function redirect to home.
  const handleSignOut = () => {
    signOut({ redirect: false }).then(() => router.replace("/"));
  };

  // nav links options
  const menu = [
    { name: "Dashboard", href: "/admin/dashboard", icon: BiSolidDashboard },
    { name: "Trainers", href: "/admin/trainer", icon: CgGym },
    { name: "Earnings", href: "/admin/earnings", icon: FaRupeeSign },
    {
      name: "MemberShips Plans",
      href: "/admin/membership_plans",
      icon: MdCardMembership,
    },
    { name: "Users", href: "/admin/users", icon: FaUsers },
  ];

  const [showSidebar, setShowSidebar] = useState(false);

  const handleLinkClick = () => {
    setShowSidebar(false);
  };

  return (
    <>
      <LuAlignLeft
        onClick={() => setShowSidebar((prev) => !prev)}
        className="xl:hidden block fixed z-50 top-4 left-2 text-2xl cursor-pointer opacity-80"
      />

      {/* Sidebar */}
      <aside
        className={
          showSidebar ? "aside translate-x-0" : "aside -translate-x-full"
        }
        aria-label="Sidebar"
      >
        <div className="pl-4 py-3 bg-[#e8ebee] rounded-md text-center text-lg flex items-center gap-3 mx-2 drop-shadow-md">
          <Image
            src={
              session?.user.image ? session?.user.image : "/assets/Profile.png"
            }
            width={40}
            height={40}
            className="rounded-full"
            alt="profile"
          />
          <span className="text-gray-800 font-semibold">
            {session?.user.name}
          </span>
        </div>

        <ul className="py-4 flex flex-col gap-2" role="none">
          {menu.map((items) => {
            return (
              <Link
                onClick={handleLinkClick}
                key={items.name}
                href={items.href}
                className={
                  pathname === items.href
                    ? "sidebar_links active"
                    : "sidebar_links"
                }
              >
                <span className="flex items-center gap-2">
                  <items.icon
                    className={
                      pathname === items.href
                        ? "text-purple-800 text-xl transition-all"
                        : "text-purple-400 text-lg transition-all"
                    }
                  />
                  <li className="text-gray-600">{items.name}</li>
                </span>
              </Link>
            );
          })}
        </ul>
        <button
          className="bottom-2 absolute flex justify-center items-center gap-2"
          onClick={handleSignOut}
        >
          <span className=" transition-all hover:text-purple-800">
            Sign Out
          </span>
          <TbLogout2 className="text-purple-800 text-lg transition-all hover:text-xl" />
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
