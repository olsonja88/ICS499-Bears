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
		fetchUsers(currentPage);
	}, []);

	// Fetch Users (Preserve Current Page)
	const fetchUsers = async (page = currentPage) => {
		try {
			const data = await getUsers();
			if (Array.isArray(data)) {
				setUsers(data);
				setFilteredUsers(data);
				setCurrentPage(page); // Preserve page
			} else {
				console.error("Unexpected API response:", data);
				setUsers([]);
				setFilteredUsers([]);
			}
		} catch (error) {
			console.error("Error fetching users:", error);
			setUsers([]);
			setFilteredUsers([]);
		}
	};

	// Handle Search
	useEffect(() => {
		const lowercasedSearch = search.toLowerCase();
		setFilteredUsers(
			users.filter((user) => user.username.toLowerCase().includes(lowercasedSearch) || user.email.toLowerCase().includes(lowercasedSearch))
		);
	}, [search, users]);

	// Handle Sorting (Case-Insensitive)
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

	// Pagination Logic
	const indexOfLastUser = currentPage * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;
	const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

	// Handle Role Update (Preserve Page)
	const handleUpdate = async (user: User) => {
		const roles = ["viewer", "creator", "admin"];
		const currentIndex = roles.indexOf(user.role);
		const nextRole = roles[(currentIndex + 1) % roles.length];

		const updatedUser = { ...user, role: nextRole };
		await updateUser(updatedUser);
		fetchUsers(currentPage); // Preserve current page
	};

	// Handle Delete User (Preserve Page)
	const handleDelete = async (id: number) => {
		await deleteUser(id);
		fetchUsers(currentPage); // Preserve current page
	};

	// Handle Add User
	const handleCreate = async () => {
		if (!newUser.username || !newUser.email || !newUser.password_hash) {
			alert("Please fill in all fields.");
			return;
		}
		await createUser(newUser);
		setNewUser({ username: "", email: "", password_hash: "", role: "viewer" });
		fetchUsers(currentPage); // Preserve page
	};

	const generatePageNumbers = () => {
		const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
		const visiblePages = 7; // Number of visible pages before truncation
		let pageNumbers = [];

		if (totalPages <= 6) {
			// Show all pages if there are 6 or fewer
			pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
		} else {
			if (currentPage <= visiblePages) {
				// If current page is near the beginning
				pageNumbers = [1, 2, 3, "...", totalPages - 1, totalPages];
			} else if (currentPage >= totalPages - visiblePages + 1) {
				// If current page is near the end
				pageNumbers = [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
			} else {
				// If current page is in the middle
				pageNumbers = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
			}
		}

		return pageNumbers;
	};

	return (
		<div className="user-management">
			<h2>User Management</h2>

			{/* Search Bar */}
			<input
				type="text"
				placeholder="Search by username or email"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="search-bar"
			/>

			{/* Add User Form */}
			<div className="user-form">
				<input
					type="text"
					placeholder="Username"
					value={newUser.username}
					onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
				/>
				<input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
				<input
					type="password"
					placeholder="Password"
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
								<th onClick={() => handleSort("email")}>Email {sortField === "email" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
								<th onClick={() => handleSort("role")}>Role {sortField === "role" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
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

			{/* Pagination */}
			<div className="pagination">
				<button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
					« First
				</button>
				<button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
					‹ Prev
				</button>

				{generatePageNumbers().map((page, index) => (
					<button
						key={index}
						onClick={() => typeof page === "number" && setCurrentPage(page)}
						disabled={page === "..."}
						className={page === currentPage ? "active-page" : ""}>
						{page}
					</button>
				))}

				<button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}>
					Next ›
				</button>
				<button
					onClick={() => setCurrentPage(Math.ceil(filteredUsers.length / usersPerPage))}
					disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}>
					Last »
				</button>
			</div>
		</div>
	);
};

export default UserList;
