import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { ListNetworkProps } from "../types/type";
import pfp from "../assets/pfp.jpeg";

const ListNetwork: FC<ListNetworkProps> = ({
  isOpen,
  onClose,
  followers,
  following,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Determine which list to use based on the data provided
  const listToUse = followers.length > 0 ? followers : following;

  // Filter the list only if there is a search term
  const filteredList = searchTerm
    ? listToUse.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : listToUse;

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isOpen ? "block" : "hidden"
      } bg-gray-800 bg-opacity-50 flex items-center justify-center`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 mb-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ul>
          {filteredList.length > 0 ? (
            filteredList.map((user) => (
              <Link to={`/profile/${user._id}`}>
                <li key={user._id} className="flex items-center border-b py-3">
                  <img
                    src={user.dp || pfp}
                    alt={`${user.username}'s profile`}
                    className="w-10 h-10 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-gray-600">{user.name}</p>
                  </div>
                </li>
              </Link>
            ))
          ) : (
            <li className="text-center py-3">No users found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ListNetwork;