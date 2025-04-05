"use client";

import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "@/app/api/api";
import { Button } from "./button";

interface User {
	id: number;
	username: string;
	email: string;
	role: string;
}

interface EditingUser {
	id: number;
	username: string;
	email: string;
	newPassword: string;
}

const UserList: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
	const [search, setSearch] = useState("");
	const [sortField, setSortField] = useState<keyof User>("username");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [newUser, setNewUser] = useState({ username: "", email: "", password_hash: "", role: "viewer" });
	const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const usersPerPage = 5;

	useEffect(() => {
		const timeout = setTimeout(() => {
			fetchUsers();
		}, 2000);
	
		return () => clearTimeout(timeout);
	}, []);

	const fetchUsers = async (page = currentPage) => {
		try {
			const data = await getUsers();
			if (Array.isArray(data)) {
				setUsers(data);
				setFilteredUsers(data);
				setCurrentPage(page);
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

	useEffect(() => {
		const lowercasedSearch = search.toLowerCase();
		setFilteredUsers(
			users.filter((user) => 
				user.username.toLowerCase().includes(lowercasedSearch) || 
				user.email.toLowerCase().includes(lowercasedSearch)
			)
		);
	}, [search, users]);

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

	const indexOfLastUser = currentPage * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;
	const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

	const handleUpdate = async (user: User) => {
		const roles = ["viewer", "creator", "admin"];
		const currentIndex = roles.indexOf(user.role);
		const nextRole = roles[(currentIndex + 1) % roles.length];

		const updatedUser = { ...user, role: nextRole };
		await updateUser(updatedUser);
		fetchUsers(currentPage);
	};

	const handleDelete = async (id: number) => {
		await deleteUser(id);
		fetchUsers(currentPage);
	};

	const handleCreate = async () => {
		if (!newUser.username || !newUser.email || !newUser.password_hash) {
			alert("Please fill in all fields.");
			return;
		}
		await createUser(newUser);
		setNewUser({ username: "", email: "", password_hash: "", role: "viewer" });
		fetchUsers(currentPage);
	};

	const startEditing = (user: User) => {
		setEditingUser({
			id: user.id,
			username: user.username,
			email: user.email,
			newPassword: ""
		});
		setIsEditing(true);
	};

	const cancelEditing = () => {
		setEditingUser(null);
		setIsEditing(false);
	};

	const handleEditSubmit = async () => {
		if (!editingUser) return;
		
		try {
			// Update username and email
			const updatedUser = {
				id: editingUser.id,
				username: editingUser.username,
				email: editingUser.email,
				role: users.find(u => u.id === editingUser.id)?.role || "viewer"
			};
			
			await updateUser(updatedUser);
			
			// Update password if provided
			if (editingUser.newPassword) {
				const token = localStorage.getItem("token");
				if (!token) {
					throw new Error("No authentication token found");
				}
				
				const response = await fetch(`/api/auth/pwchange`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`
					},
					body: JSON.stringify({
						token,
						password: editingUser.newPassword,
						userId: editingUser.id
					})
				});
				
				if (!response.ok) {
					throw new Error("Failed to update password");
				}
			}
			
			setEditingUser(null);
			setIsEditing(false);
			fetchUsers(currentPage);
		} catch (error) {
			console.error("Error updating user:", error);
			alert("Failed to update user. Please try again.");
		}
	};

	const generatePageNumbers = () => {
		const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
		const visiblePages = 7;
		let pageNumbers = [];

		if (totalPages <= 6) {
			pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
		} else {
			if (currentPage <= visiblePages) {
				pageNumbers = [1, 2, 3, "...", totalPages - 1, totalPages];
			} else if (currentPage >= totalPages - visiblePages + 1) {
				pageNumbers = [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
			} else {
				pageNumbers = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
			}
		}

		return pageNumbers;
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-xl font-bold text-white">User Management</h2>
			</div>

			{/* Search Bar */}
			<input
				type="text"
				placeholder="Search by username or email"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>

			{/* Add User Form */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<input
					type="text"
					placeholder="Username"
					value={newUser.username}
					onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
					className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<input
					type="email"
					placeholder="Email"
					value={newUser.email}
					onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
					className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<input
					type="password"
					placeholder="Password"
					value={newUser.password_hash}
					onChange={(e) => setNewUser({ ...newUser, password_hash: e.target.value })}
					className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<Button
					onClick={handleCreate}
					className="bg-green-600 hover:bg-green-700 text-white"
				>
					Add User
				</Button>
			</div>

			{/* Edit User Modal */}
			{isEditing && editingUser && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-gray-900 p-6 rounded-lg border border-gray-700 w-full max-w-md">
						<h3 className="text-xl font-bold text-white mb-4">Edit User</h3>
						<div className="space-y-4">
							<div>
								<label className="block text-gray-300 mb-1">Username</label>
								<input
									type="text"
									value={editingUser.username}
									onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
									className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<label className="block text-gray-300 mb-1">Email</label>
								<input
									type="email"
									value={editingUser.email}
									onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
									className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<label className="block text-gray-300 mb-1">New Password (leave blank to keep current)</label>
								<input
									type="password"
									value={editingUser.newPassword}
									onChange={(e) => setEditingUser({...editingUser, newPassword: e.target.value})}
									className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div className="flex justify-end space-x-2 mt-6">
								<Button
									onClick={cancelEditing}
									className="bg-gray-700 hover:bg-gray-600 text-white"
								>
									Cancel
								</Button>
								<Button
									onClick={handleEditSubmit}
									className="bg-blue-600 hover:bg-blue-700 text-white"
								>
									Save Changes
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* User Table */}
			<div className="overflow-x-auto">
				<table className="min-w-full bg-black border border-gray-700">
					<thead>
						<tr className="bg-gray-900">
							<th
								onClick={() => handleSort("username")}
								className="px-6 py-3 border-b border-gray-700 text-left text-gray-300 cursor-pointer hover:bg-gray-800"
							>
								Username {sortField === "username" && (sortOrder === "asc" ? "▲" : "▼")}
							</th>
							<th
								onClick={() => handleSort("email")}
								className="px-6 py-3 border-b border-gray-700 text-left text-gray-300 cursor-pointer hover:bg-gray-800"
							>
								Email {sortField === "email" && (sortOrder === "asc" ? "▲" : "▼")}
							</th>
							<th
								onClick={() => handleSort("role")}
								className="px-6 py-3 border-b border-gray-700 text-left text-gray-300 cursor-pointer hover:bg-gray-800"
							>
								Role {sortField === "role" && (sortOrder === "asc" ? "▲" : "▼")}
							</th>
							<th className="px-6 py-3 border-b border-gray-700 text-left text-gray-300">Actions</th>
						</tr>
					</thead>
					<tbody>
						{currentUsers.map((user) => (
							<tr key={user.id} className="hover:bg-gray-900 border-b border-gray-700">
								<td className="px-6 py-4 text-gray-300">{user.username}</td>
								<td className="px-6 py-4 text-gray-300">{user.email}</td>
								<td className="px-6 py-4 text-gray-300">{user.role}</td>
								<td className="px-6 py-4">
									<div className="flex space-x-2">
										<Button
											onClick={() => startEditing(user)}
											className="bg-blue-600 hover:bg-blue-700 text-white"
										>
											Edit
										</Button>
										<Button
											onClick={() => handleUpdate(user)}
											className="bg-yellow-600 hover:bg-yellow-700 text-white"
										>
											Toggle Role
										</Button>
										<Button
											onClick={() => handleDelete(user.id)}
											className="bg-red-600 hover:bg-red-700 text-white"
										>
											Delete
										</Button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="flex justify-center space-x-2">
				<Button
					onClick={() => setCurrentPage(1)}
					disabled={currentPage === 1}
					className="bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-800 disabled:cursor-not-allowed"
				>
					« First
				</Button>
				<Button
					onClick={() => setCurrentPage(currentPage - 1)}
					disabled={currentPage === 1}
					className="bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-800 disabled:cursor-not-allowed"
				>
					‹ Prev
				</Button>

				{generatePageNumbers().map((page, index) => (
					<Button
						key={index}
						onClick={() => typeof page === "number" && setCurrentPage(page)}
						disabled={page === "..."}
						className={`${
							page === currentPage
								? "bg-blue-600 hover:bg-blue-700"
								: "bg-gray-700 hover:bg-gray-600"
						} text-white disabled:bg-gray-800 disabled:cursor-not-allowed`}
					>
						{page}
					</Button>
				))}

				<Button
					onClick={() => setCurrentPage(currentPage + 1)}
					disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
					className="bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-800 disabled:cursor-not-allowed"
				>
					Next ›
				</Button>
				<Button
					onClick={() => setCurrentPage(Math.ceil(filteredUsers.length / usersPerPage))}
					disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
					className="bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-800 disabled:cursor-not-allowed"
				>
					Last »
				</Button>
			</div>
		</div>
	);
};

export default UserList;
