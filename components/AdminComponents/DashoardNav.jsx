'use client'
import { IoMdNotifications } from "react-icons/io";
import { useSession } from "next-auth/react";
import { MdHome } from "react-icons/md";
import { usePathname } from "next/navigation";
import Image from "next/image";

const DashoardNav = () => {
  const { data: session } = useSession();
  const pathname  = usePathname();

    const startwithCap=(word)=>{
      const first_word =   word.slice(0, 1);
        const last_words = word.slice(1, word.length);
        return first_word.toUpperCase() + last_words;
    }

  return (
    <nav className="flex justify-between fixed z-50 top-0 py-3" style={{ width: 'calc(100% - 18rem)' }}>
    {/* Path indicator */}
    <span className="flex items-center text-gray-500"><MdHome className="text-xl"/> / {startwithCap(pathname.slice(7, pathname.length))} </span>


      <ul className="flex gap-2 items-center justify-end">
        <li>
          <input
            type="text"
            className="border rounded-md p-1"
            placeholder="Search Here"
          />
        </li>
        <li>
          <IoMdNotifications className="text-[#7b809a] text-2xl " />
        </li>
        <Image
          src={
            session?.user.image ? session?.user.image : "/assets/Profile.png"
          }
          width={32}
          height={32}
          className="rounded-full"
          alt="profile"
        />
      </ul>
    </nav>
  );
};

export default DashoardNav;
