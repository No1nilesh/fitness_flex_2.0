import Sidebar from "@components/MemberComponents/Sidebar";

export default function MemberLayout({ children }) {
  return (
    <>
      <div className="w-full h-full bg-[#eff2f5]   flex ">
        <Sidebar />
        <main className="flex-grow xl:ml-64">{children}</main>
      </div>
    </>
  );
}
