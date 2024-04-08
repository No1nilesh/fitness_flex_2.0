"use client";
import { useEffect, useState } from "react";
import { DataTable } from "../../../../components/UiComponents/data-table";
import { columns } from "./columns";

const Users = () => {
  const [userData, setUserdata] = useState([]);
  const [activeUserData, setActiveUserData] = useState([]);
  const [isActiveUsers, setisActiveUsers] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(7); // Set the number of users per page

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      setUserdata(data);
    };
    fetchUser();
  }, []);

  const handleActiveUsers = () => {
    setisActiveUsers((prevActive) => !prevActive);
    setActiveUserData(activeUsers);
  };

  const activeUsers = userData?.filter((user) => user.isActiveMember === true);

  // Pagination Logic
  // const indexOfLastUser = currentPage * usersPerPage;
  // const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = isActiveUsers ? activeUserData : userData;
  // const currentUsersToShow = currentUsers.slice(
  //   indexOfFirstUser,
  //   indexOfLastUser
  // );

  // Change page
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteSelected = async (selectedIds) => {
    console.log(selectedIds);
    const hasConfirmed = confirm("Are you sure ?");
    if (hasConfirmed) {
      try {
        await Promise.all(
          selectedIds.map(async (id) => {
            const res = await fetch(`/api/admin/users/${id}`, {
              method: "DELETE",
            });

            if (!res.ok) {
              console.error(`failed to delete row with id: ${id}`);
            }

            const updatedUserData = userData.filter(
              (user) => !selectedIds.includes(user._id)
            );
            setUserdata(updatedUserData);
          })
        );
      } catch (error) {
        console.error("Error occurred while deleting rows:", error);
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center  gap-2 max-w-full min-h-full h-full  rounded-md">
      <div className="w-screen md:w-full md:h-full px-2 table-container">
        <DataTable
          columns={columns(handleDeleteSelected)}
          data={currentUsers}
        />
      </div>
      {/* <span className="font-semibold">Active</span>
      <label className="switch absolute">
        <input
          checked={isActiveUsers}
          onChange={handleActiveUsers}
          type="checkbox"
        />
        <span className="slider"></span>
      </label> */}
      <div className="h-full w-1/3   bg-primary-foreground rounded-md text-primary py-2 ">
        <h2 className="text-2xl font-semibold text-center">New Users</h2>
      </div>
      {/* <Pagination
        usersPerPage={usersPerPage}
        totalUsers={currentUsers.length}
        currentPage={currentPage}
        paginate={paginate}
      /> */}
    </div>
  );
};

// const Pagination = ({ usersPerPage, totalUsers, paginate, currentPage }) => {
//   const pageNumbers = [];

//   for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
//     pageNumbers.push(i);
//   }

//   return (
//     <nav className="flex justify-center mt-4 fixed bottom-2 mr-64 ">
//       <ul className="flex list-none">
//         {pageNumbers.map((number) => (
//           <li key={number} className="mx-1">
//             <button
//               onClick={() => paginate(number)}
//               className={`px-3 py-1 rounded-md hover:bg-gray-300 ${
//                 currentPage === number
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 text-gray-700"
//               }`}
//             >
//               {number}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// };

export default Users;
