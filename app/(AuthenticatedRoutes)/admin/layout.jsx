import DashoardNav from "@components/AdminComponents/DashoardNav";
import Sidebar from "@components/AdminComponents/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="bg-[#eff2f5] flex h-screen">
      <Sidebar />
      <main className="flex-1 xl:ml-64 md:px-4 mt-0 md:mt-8 xl:mt-14 overflow-auto">
        <DashoardNav />
        {children}
      </main>
    </div>
  );
}
