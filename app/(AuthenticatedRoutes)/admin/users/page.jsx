"use client";
import Usertable from "@components/AdminComponents/UserTable";
import { useEffect, useState } from "react";

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
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = isActiveUsers ? activeUserData : userData;
  const currentUsersToShow = currentUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full h-full flex-center flex-col gap-2 text-black sm:flex-row">
      <div className="bg-[#ffffff] rounded-md min-h-full w-full drop-shadow-md overflow-auto">

      {/* Active Button */}
          <h2 className="font-normal text-gray-700 flex items-center gap-2 justify-end px-2 pt-4">
          <span className='font-semibold'>Active</span> <label className="switch">
            <input
            checked={isActiveUsers}
            onChange={handleActiveUsers}
             type="checkbox" />
            <span className="slider"></span>
          </label> </h2>

          {/* Table  */}
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4"></th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <UserdataTableList data={currentUsersToShow} />
        </table>
        <Pagination
          usersPerPage={usersPerPage}
          totalUsers={currentUsers.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>

      <div className="h-full bg-[#ffffff] rounded-md w-64 drop-shadow-md">
        <div className="text-center py-2 font-bold text-xl text-gray-400">
          New User
        </div>
      </div>
    </div>
  );
};

const UserdataTableList = ({ data }) => {
  return (
    <tbody>
      {data?.map((tabledata) => {
        return <Usertable key={tabledata._id} tabledata={tabledata} />;
      })}
    </tbody>
  );
};

// Pagination
const Pagination = ({ usersPerPage, totalUsers, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-4 fixed w-full bottom-2">
      <ul className="flex list-none">
        {pageNumbers.map((number) => (
          <li key={number} className="mx-1">
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-md hover:bg-gray-300 ${
                currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};


export default Users;
