"use client";

import { Social } from "@components/AuthComponents/social";
import Link from "next/link";
import { usePathname } from "next/navigation";
export const CardWrapper = ({ children, showSocial }) => {
  const pathname = usePathname();

  return (
    <div className=" xl:py-3 rounded-md w-[350px] xl:w-[450px] relative">
      {children}

      {showSocial && (
        <div className="pt-2">
          <span className="flex justify-center items-center p-2">
            <hr className="w-64 h-px  bg-gray-200 border-0 dark:bg-gray-500" />{" "}
            <span className="block text-center text-lg  w-full">Or With</span>{" "}
            <hr className="w-64 h-px  bg-gray-200 border-0 dark:bg-gray-500" />
          </span>
          <Social />
        </div>
      )}

      {pathname === "/login" || pathname === "/signup" ? (
        <div className="flex-center mt-2">
          {pathname === "/login" ? (
            <Link className="hover:text-blue-500" href={"/signup"}>
              New user? Create an account.
            </Link>
          ) : (
            <Link className="hover:text-blue-500" href={"/login"}>
              Already have an account?
            </Link>
          )}
        </div>
      ) : null}
    </div>
  );
};
