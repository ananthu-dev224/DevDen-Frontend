import { FC, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import {toast} from 'sonner'
import { searchUsers } from "../../services/network";
import pfp from '../../assets/pfp.jpeg'

const Explore: FC = () => {
    const [search, setSearch] = useState<string>("");
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch()

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearch(query);

        if (query.length > 2 && query.trim().length > 2) { // Only search if query length is more than 2 characters
            setLoading(true);
            const res = await searchUsers(query,dispatch)
            if(res.status === 'success'){
                setUsers(res.users)
            }
            setLoading(false)
        } else {
            setUsers([]);
        }
    };

    return (
        <div className="flex bg-gray-200 min-h-screen">
            <Navbar />
            <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto">
                <div className="flex flex-col space-y-10 pb-20 md:pb-0">
                    <div className="flex justify-between items-center mb-4">
                        <input
                            value={search}
                            onChange={handleSearch}
                            placeholder="Search people..."
                            className="p-2 w-full border border-gray-200 rounded focus:border-green-500 outline-none"
                        />
                    </div>
                    {loading && <div>Searching...</div>}
                    <div className="space-y-4">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <Link to={`/profile/${user._id}`} >
                                <div key={user._id} className="flex items-center border-b border-gray-300 p-2">
                                    <img
                                        src={user.dp ? user.dp : pfp}
                                        alt={user.username}
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div className="flex-1">
                                        <div className="font-bold">{user.username}</div>
                                        <div className="text-gray-500">{user.name}</div>
                                    </div>
                                </div>
                                </Link>
                            ))
                        ) : (
                            search.length > 2 && <div>No users found</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Explore;