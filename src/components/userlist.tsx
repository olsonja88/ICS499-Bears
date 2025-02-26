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
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<keyof User>("username");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5; // Number of users per page

    // New User State
    const [newUser, setNewUser] = useState({ username: "", email: "", password_hash: "", role: "viewer" });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const data = await getUsers();
        setUsers(data);
        setFilteredUsers(data);
    };

    // 🔍 Handle Search
    useEffect(() => {
        const lowercasedSearch = search.toLowerCase();
        setFilteredUsers(
            users.filter(user =>
                user.username.toLowerCase().includes(lowercasedSearch) ||
                user.email.toLowerCase().includes(lowercasedSearch)
            )
        );
        setCurrentPage(1); // Reset to first page on search
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
        setCurrentPage(1); // Reset to first page after sorting
    };

    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const nextPage = () => {
        if (currentPage < Math.ceil(filteredUsers.length / usersPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // 🔄 Handle Role Update (Cycle Through Roles)
    const handleUpdate = async (user: User) => {
        const roles = ["viewer", "creator", "admin"];
        const currentIndex = roles.indexOf(user.role);
        const nextRole = roles[(currentIndex + 1) % roles.length];

        const updatedUser = { ...user, role: nextRole };
        await updateUser(updatedUser);
        fetchUsers();
    };

    // 🗑️ Handle Delete User
    const handleDelete = async (id: number) => {
        await deleteUser(id);
        fetchUsers();
    };

    // ➕ Handle Add User
    const handleCreate = async () => {
        if (!newUser.username || !newUser.email || !newUser.password_hash) {
            alert("Please fill in all fields.");
            return;
        }
        await createUser(newUser);
        setNewUser({ username: "", email: "", password_hash: "", role: "viewer" });
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

            {/* 🆕 Add User Form */}
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
            <div className="user-table">
                {currentUsers.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort("username")}>
                                    Username {sortField === "username" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                                </th>
                                <th onClick={() => handleSort("email")}>
                                    Email {sortField === "email" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                                </th>
                                <th onClick={() => handleSort("role")}>
                                    Role {sortField === "role" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user) => (
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

            {/* Pagination Buttons */}
            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>
                    ◀ Previous
                </button>
                <span>Page {currentPage} of {Math.ceil(filteredUsers.length / usersPerPage)}</span>
                <button onClick={nextPage} disabled={currentPage >= Math.ceil(filteredUsers.length / usersPerPage)}>
                    Next ▶
                </button>
            </div>
        </div>
    );
};

export default UserList;
