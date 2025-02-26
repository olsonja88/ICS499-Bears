"use client";

import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "@/app/api/api";
import "../styles/userlist.css";; // Import the CSS file

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<keyof User>("username");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [newUser, setNewUser] = useState({ username: "", email: "", password_hash: "", role: "viewer" });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const data = await getUsers();
        setUsers(data);
        setFilteredUsers(data); // Initialize filtered list
    };

    // 🔍 Handle Search (Case-Insensitive)
    useEffect(() => {
        const lowercasedSearch = search.toLowerCase();
        setFilteredUsers(
            users.filter(user =>
                user.username.toLowerCase().includes(lowercasedSearch) ||
                user.email.toLowerCase().includes(lowercasedSearch)
            )
        );
    }, [search, users]);

    // 🔄 Handle Sorting (Case-Insensitive)
    const handleSort = (field: keyof User) => {
        const newSortOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(newSortOrder);

        const sortedUsers = [...filteredUsers].sort((a, b) => {
            const aValue = typeof a[field] === "string" ? a[field].toLowerCase() : a[field];
            const bValue = typeof b[field] === "string" ? b[field].toLowerCase() : b[field];

            if (aValue < bValue) return newSortOrder === "asc" ? -1 : 1;
            if (aValue > bValue) return newSortOrder === "asc" ? 1 : -1;
            return 0;
        });

        setFilteredUsers(sortedUsers);
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

            {/* 🔍 Search Bar */}
            <input
                type="text"
                placeholder="Search by username or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-bar"
            />

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

            {/* User Table */}
            {filteredUsers.length > 0 ? (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort("username")}>Username {sortField === "username" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                            <th onClick={() => handleSort("email")}>Email {sortField === "email" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                            <th onClick={() => handleSort("role")}>Role {sortField === "role" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
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
            ) : (
                <p className="no-results">No users found</p>
            )}
        </div>
    );
};

export default UserList;