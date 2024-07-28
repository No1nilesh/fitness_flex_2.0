import Sidebar from "@components/MemberComponents/Sidebar";

export default function MemberLayout({ children }) {
  return (
    <>
      <div className="w-full h-dvh bg-[#eff2f5]   flex ">
        <Sidebar />
        <main className="flex-1 xl:ml-64">{children}</main>
      </div>
    </>
  );
}
