import AdminNav from "../../Components/AdminNav";
import { FC, useState, useMemo, useEffect } from "react";
import { Pagination } from "flowbite-react";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "sonner";
import { getUsers, toggleUser } from "../../services/adminAuth";
import { users } from "../../types/type";
const Users: FC = () => {
  const [users, setUsers] = useState<users[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.users);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  const handleBlockUnblock = async (id: string) => {
    try {
      confirmAlert({
        title: 'Confirm Alert',
        message: 'Are you sure you want to block/unblock this user?',
        buttons: [
          {
            label: 'Yes',
            onClick: async() => {
              const response = await toggleUser(id);
              if(response.status === 'success'){
                setUsers(
                  users.map((user) =>
                    user._id === id ? { ...user, isActive: !user.isActive } : user
                  )
                );
              }
            }
          },
          {
            label: 'No',
          }
        ]
      });
    } catch (error) {
      console.error("Error toggling user status: ", error);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().startsWith(search.toLowerCase()) ||
      user.email.toLowerCase().startsWith(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <AdminNav />
      <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto">
        <div className="flex flex-col space-y-10 pb-20 md:pb-0">
          <div className="flex justify-between items-center mb-4">
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search by username or email..."
              className="p-2 w-full border border-gray-200 rounded focus:border-green-500 outline-none"
            />
          </div>
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 border-b border-gray-200">Status</th>
                <th className="p-4 border-b border-gray-200">Username</th>
                <th className="p-4 border-b border-gray-200">Email</th>
                <th className="p-4 border-b border-gray-200">Joined</th>
                <th className="p-4 border-b border-gray-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user) => (
                <tr key={user._id} className="hover:bg-gray-100">
                  <td
                    className={`p-4 border-b border-gray-200 font-medium ${
                      user.isActive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </td>

                  <td className="p-4 border-b border-gray-200">
                    @{user.username}
                  </td>
                  <td className="p-4 border-b border-gray-200">{user.email}</td>
                  <td className="p-4 border-b border-gray-200">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="p-4 border-b border-gray-200">
                    <button
                      className="px-2 py-1 bg-gray-900 text-white font-semibold rounded"
                      onClick={() => handleBlockUnblock(user._id)}
                    >
                      {user.isActive ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <Pagination
              layout="table"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showIcons={true}
              className="pagination"
              previousLabel="Previous"
              nextLabel="Next"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
