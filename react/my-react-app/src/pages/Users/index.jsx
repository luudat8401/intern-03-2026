import { useEffect, useState } from "react";
import UserForm from "./components/UserForm";
import UserTable from "./components/UserTable";
import UserStats from "./components/UserStats";
import "./users.css";

export default function Users() {

    const [users, setUsers] = useState(()=>{
        const saved = localStorage.getItem("users");
        return saved ? JSON.parse(saved) : []
    });

    useEffect(()=>{
        localStorage.setItem("users",JSON.stringify(users))
    },  [users])

    const addUser = (user) => {
        setUsers([...users, user]);
    };

    const deleteUser = (id) => {
        setUsers(users.filter(u => u.id !== id));
    };

    return (

        <div className="users-page">

            <h2>Quản lý người thuê</h2>

            <UserStats users={users} />

            <UserForm addUser={addUser} />

            <UserTable users={users} deleteUser={deleteUser} />

        </div>

    );
}