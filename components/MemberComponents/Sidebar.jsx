"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import {
  CalendarCheck,
  DumbbellIcon,
  LayoutDashboard,
  NotepadText,
  AlignLeft,
  LogOutIcon,
  MonitorPlay,
} from "lucide-react";

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
    { name: "Dashboard", href: "/member/dashboard", icon: LayoutDashboard },
    { name: "Workouts", href: "/member/workouts", icon: DumbbellIcon },
    { name: "Diet Plans", href: "/member/diet_plans", icon: NotepadText },
    { name: "Manage Plan", href: "/member/subscription", icon: CalendarCheck },
    { name: "Live Classes", href: "/member/live_classes", icon: MonitorPlay },
  ];

  const [showSidebar, setShowSidebar] = useState(false);

  const handleLinkClick = () => {
    setShowSidebar(false);
  };

  return (
    <>
      <AlignLeft
        onClick={() => setShowSidebar((prev) => !prev)}
        className="sm:hidden block absolute z-50 top-2 left-2 text-2xl cursor-pointer opacity-80"
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
          {session?.user.isActiveMember ? (
            menu.map((items) => {
              return (
                <Link
                  onClick={handleLinkClick}
                  key={items.name}
                  href={items.href}
                  className={
                    pathname.includes(items.href)
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
            })
          ) : (
            <Link
              onClick={handleLinkClick}
              key={menu[0].name}
              href={menu[0].href}
              className={
                pathname === menu[0].href
                  ? "sidebar_links active"
                  : "sidebar_links"
              }
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard
                  className={
                    pathname === menu[0].href
                      ? "text-purple-800 text-xl transition-all"
                      : "text-purple-400 text-lg transition-all"
                  }
                />
                <li className="text-gray-600">{menu[0].name}</li>
              </span>
            </Link>
          )}
        </ul>
        <button
          className="bottom-2 absolute bg-slate-300 px-4 py-2 grid place-content-center rounded-md hover:bg-slate-200 transition-colors"
          onClick={handleSignOut}
        >
          <LogOutIcon className="text-purple-800 text-xl" />
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
