"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { BiSolidDashboard } from "react-icons/bi";
import { CgGym } from "react-icons/cg";
import { BiTask } from "react-icons/bi";
import { LuAlignLeft } from "react-icons/lu";
import { LogOutIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    { name: "Dashboard", href: "/trainer/dashboard", icon: BiSolidDashboard },
    { name: "Workouts", href: "/trainer/workouts", icon: CgGym },
    { name: "Diet Plans", href: "/trainer/diet_plans", icon: BiTask },
    { name: "Meetings", href: "/trainer/meetings", icon: BiTask },
  ];

  const [showSidebar, setShowSidebar] = useState(false);

  const handleLinkClick = () => {
    setShowSidebar(false);
  };

  return (
    <>
      <LuAlignLeft
        onClick={() => setShowSidebar((prev) => !prev)}
        className="md:hidden block fixed z-50 top-2 left-2 text-2xl cursor-pointer opacity-80"
      />

      {/* Sidebar */}

      {/* mobile view */}
      <aside
        className={
          //
          `md:hidden  ${
            showSidebar ? "aside translate-x-0" : "aside -translate-x-full"
          }`
        }
        aria-label="Sidebar"
      >
        <div className="rounded-md bg-slate-100 p-2  text-center text-lg flex items-center gap-3 mx-2 drop-shadow-md">
          <Image
            src={
              session?.user.image ? session?.user.image : "/assets/Profile.png"
            }
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
            alt="profile"
          />
          <span className="text-gray-800 font-semibold">
            {session?.user.name}
          </span>
        </div>
        <ul className="py-4  md:flex  gap-2" role="none">
          {session?.user.verified ? (
            menu.map((items) => {
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
                <BiSolidDashboard
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

      {/* desktop view */}
      <aside
        className={
          //
          `hidden md:flex md:flex-row-reverse items-center justify-between md:px-10 border-y`
        }
        aria-label="Sidebar"
      >
        {/* dropdown menu */}

        <DropdownMenu>
          <DropdownMenuTrigger className="border-none outline-none hover:outline-none">
            <div className="rounded-md text-center text-lg flex items-center gap-3 mx-2">
              <Image
                src={
                  session?.user.image
                    ? session?.user.image
                    : "/assets/Profile.png"
                }
                width={40}
                height={40}
                className="rounded-full cursor-pointer"
                alt="profile"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel> {session?.user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="flex justify-center items-center gap-2"
                onClick={handleSignOut}
              >
                <span className=" transition-all hover:text-purple-800">
                  Sign Out
                </span>
                {/* <LogOutIcon className="text-purple-800 text-lg transition-all hover:text-xl" /> */}
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* <span className="text-gray-800 font-semibold">
           
          </span> */}

        <ul className="py-4  md:flex  gap-2" role="none">
          {session?.user.verified ? (
            menu.map((items) => {
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
                <BiSolidDashboard
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
      </aside>
    </>
  );
};

export default Sidebar;
