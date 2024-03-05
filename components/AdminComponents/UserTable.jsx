import Image from "next/image"
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
            <Image width={40} height={40} className="rounded-full" src={tabledata.image ? tabledata.image : "/assets/Profile.png"} alt="Jese image"/>
            <div className="ps-3">
                <div className="text-base font-semibold">{tabledata.name}</div>
                <div className="font-normal text-gray-500">{tabledata.email}</div>
            </div>  
        </th>
        <td className="px-6 py-4">
            {tabledata.role}
        </td>
      
        <td className="px-6 py-4">
            
            <a href="#" type="button" data-modal-target="editUserModal" data-modal-show="editUserModal" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit user</a>
        </td>
    </tr>
    </>
    }
    
    export default Usertable