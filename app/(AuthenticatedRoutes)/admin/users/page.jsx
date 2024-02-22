'use client'
import Image from "next/image";
import { useEffect, useState } from "react";

const Users = () => {
    const [userData, setUserdata] = useState([]);

  useEffect(() => {
    const fetchUser = async ()=>{
     const response = await fetch("/api/admin/users");
     const data = await response.json();
     setUserdata(data)
     console.log(data)
    }
    fetchUser();
     }, [])

  return (
    <div className="w-full h-full flex-center flex-col gap-2   text-black sm:flex-row ">

      <div className=" bg-[#ffffff] rounded-md min-h-full w-full drop-shadow-md">

      <table className="w-full text-sm text-left rtl:text-right ">
        <thead className="text-xs text-gray-700 uppercase   dark:text-gray-400">
            <tr>
                <th scope="col" className="p-4">
                </th>
                <th scope="col" className="px-6 py-3">
                    Name
                </th>
                <th scope="col" className="px-6 py-3">
                    Position
                </th>
                <th scope="col" className="px-6 py-3">
                    Status
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
          {
            userData?.map((tabledata)=> {
              return  <Usertable key={tabledata._id} tabledata={tabledata}/>
            })
          }
        </tbody>
    </table>
      </div>

      <div className="h-full bg-[#ffffff] rounded-md w-64 drop-shadow-md">
       <div className="text-center py-2 font-bold text-xl text-gray-400">
        New User
       </div>
      </div>
    </div>
  )
}


const Usertable=({tabledata})=>{
return <>
  <tr className="border-b">
    <td className="w-4 p-4">
        <div className="flex items-center">
            <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
            <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
        </div>
    </td>
    <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap ">
        <Image width={40} height={40} className="w-10 h-10 rounded-full" src="/assets/Profile.png" alt="Jese image"/>
        <div className="ps-3">
            <div className="text-base font-semibold">{tabledata.name}</div>
            <div className="font-normal text-gray-500">{tabledata.email}</div>
        </div>  
    </th>
    <td className="px-6 py-4">
        {tabledata.role}
    </td>
    <td className="px-6 py-4">
        <div className="flex items-center">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div> Online
        </div>
    </td>
    <td className="px-6 py-4">
        
        <a href="#" type="button" data-modal-target="editUserModal" data-modal-show="editUserModal" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit user</a>
    </td>
</tr>
</>
}

export default Users
