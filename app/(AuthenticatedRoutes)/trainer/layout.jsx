import TabComponent from "@components/UiComponents/Tabs";

import Sidebar from "@components/TrainerComponents/Sidebar";
export default function TrainerLayout({ children }) {
  return (
    <div className="bg-[#eff2f5] flex flex-col md:h-screen">
      <Sidebar />
      {/* <main className="flex-1 xl:ml-64">{children}</main> */}
      {/* <TabComponent /> */}
      <main className="flex-1 md:mx-6">{children}</main>
    </div>
  );
}
