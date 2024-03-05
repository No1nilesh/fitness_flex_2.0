import Sidebar from "@components/member/Sidebar";


export default function Memberlayout({ children }) {
  return <>
  <Sidebar/>
  <main className="flex-grow sm:ml-64 px-4 mr-4 h-full">
      {children}
      </main>
  </>;
}
