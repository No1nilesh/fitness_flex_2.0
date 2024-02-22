import DashoardNav from "@components/AdminComponents/DashoardNav";
import Sidebar from "@components/AdminComponents/Sidebar";

export default function AdminLayout({children}){
return(
    <div className="w-full h-full bg-[#eff2f5]  flex overflow-auto">
      <Sidebar />
      <main className="flex-grow sm:ml-64 px-4 pt-14 mr-4">
      <DashoardNav/>
      {children}
      </main>
    </div>
)
}