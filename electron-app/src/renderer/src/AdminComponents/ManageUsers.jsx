import React, { useEffect, useState } from "react";

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", password: "", role: "user" });

  const fetchUsers = async () => {
    const rows = await window.api.getUsers();
    setUsers(rows);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = async () => {
    await window.api.addUser(form);
    setForm({ username: "", password: "", role: "user" });
    fetchUsers();
  };

  const handleUpdate = async (id, updates) => {
    await window.api.updateUser({ id, ...updates });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await window.api.deleteUser(id);
    fetchUsers();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">User Management</h1>

      {/* Add User Form */}
      <div className="mb-6 flex gap-2">
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Users Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.id}</td>
              <td className="border p-2">{u.username}</td>
              <td className="border p-2">{u.role}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleUpdate(u.id, { role: u.role === "admin" ? "user" : "admin" })}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Toggle Role
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
