import TabComponent from "@components/UiComponents/Tabs";

import Sidebar from "@components/TrainerComponents/Sidebar";
export default function TrainerLayout({ children }) {
  return (
    <div className="bg-[#eff2f5] w-full h-screen flex flex-col overflow-clip">
      <Sidebar />
      {/* <main className="flex-1 xl:ml-64">{children}</main> */}
      {/* <TabComponent /> */}
      <main className="flex-1 md:mx-6 ">{children}</main>
    </div>
  );
}
