import { useEffect, useState } from "react";
import UserTable from "./components/UserTable";
import "./users.css";
import { getUsers, deleteUserApi } from "../../../api/user.api";
export default function Users() {
    const [users, setUsers] = useState([]);
    const fetchUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getUsers();
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);
    const deleteUser = async (id) => {
        try {
            await deleteUserApi(id);
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className="users-page">
            <h2>Quản lý người thuê</h2>
            <UserTable
                users={users}
                deleteUser={deleteUser}
                onEdit={(user) => setEditingUser(user)}
            />
        </div>
    );
}