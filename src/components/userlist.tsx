"use client";

import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "@/app/api/api";
import "../styles/userlist.css"; // Import the CSS file


interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState({ username: "", email: "", password_hash: "", role: "viewer" });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const data = await getUsers();
        setUsers(data);
    };

    const handleCreate = async () => {
        if (!newUser.username || !newUser.email || !newUser.password_hash) {
            alert("Please fill in all fields.");
            return;
        }
        await createUser(newUser);
        setNewUser({ username: "", email: "", password_hash: "", role: "viewer" });
        fetchUsers();
    };

    const handleUpdate = async (user: User) => {
        const roles = ["viewer", "creator", "admin"];
        const currentIndex = roles.indexOf(user.role);
        const nextRole = roles[(currentIndex + 1) % roles.length];

        const updatedUser = { ...user, role: nextRole };
        await updateUser(updatedUser);
        fetchUsers();
    };

    const handleDelete = async (id: number) => {
        await deleteUser(id);
        fetchUsers();
    };

    return (
        <div className="user-management">
            <h2>User Management</h2>

            {/* Create User Form */}
            <div className="user-form">
                <input 
                    type="text" placeholder="Username" 
                    value={newUser.username} 
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} 
                />
                <input 
                    type="email" placeholder="Email" 
                    value={newUser.email} 
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
                />
                <input 
                    type="password" placeholder="Password" 
                    value={newUser.password_hash} 
                    onChange={(e) => setNewUser({ ...newUser, password_hash: e.target.value })} 
                />
                <button onClick={handleCreate}>Add User</button>
            </div>

            {/* Display Users */}
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td className="action-buttons">
                                <button onClick={() => handleUpdate(user)} className="toggle-role">
                                    Toggle Role
                                </button>
                                <button onClick={() => handleDelete(user.id)} className="delete-user">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
