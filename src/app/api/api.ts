const API_URL = "/api/users"; // Calls Next.js API directly

export const getUsers = async () => {
    const response = await fetch(API_URL);
    return response.json();
};

export const createUser = async (user: { username: string; email: string; password_hash: string; role?: string }) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    return response.json();
};

export const updateUser = async (user: { id: number; username: string; email: string; role: string }) => {
    const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    return response.json();
};

export const deleteUser = async (id: number) => {
    const response = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    });
    return response.json();
};
