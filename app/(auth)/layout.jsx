import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
    <div className="h-dvh max-h-dvh w-full flex justify-center items-start">
      <div className="flex-1 h-full border-r hidden xl:block relative">
        <div className="h-full w-full bg-[rgba(0,0,0,0.3)] absolute top-0 left-0" />
        {/* <p className="absolute text-primary-foreground bottom-2 left-2 ">
          Login With Password
        </p> */}

        <Image
          width={1920}
          height={1280}
          className="w-full h-full object-cover "
          src={"/assets/lock.jpg"}
        />
      </div>
      <div className="flex-1 flex px-2 justify-center items-start  mt-20 ">
        {children}
      </div>
    </div>
  );
}
