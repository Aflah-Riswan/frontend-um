// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { adminService, type BackendUser } from "../services/admin.service";

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // States for the inline inline-editing mode parameters
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editEmail, setEditEmail] = useState<string>("");
  const [editRole, setEditRole] = useState<'user' | 'admin'>("user");

  // Load database rows on mount
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.fetchAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load user database lists.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Trigger Block / Unblock Event
  const handleToggleBlock = async (user: BackendUser) => {
    // Standard normalized check across tinyint(1) numeric definitions or standard booleans
    const currentStatus = user.isBlocked === 1 || user.isBlocked === true;
    const nextStatus = !currentStatus;

    try {
      await adminService.toggleBlockStatus(user.id, nextStatus);
      // Synchronize frontend UI state layout array instantly
      setUsers(users.map(u => u.id === user.id ? { ...u, isBlocked: nextStatus } : u));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to adjust user block permissions.");
    }
  };

  //  Trigger Permanent Account Deletion
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you absolutely sure you want to permanently delete this user account record?")) return;

    try {
      await adminService.deleteUserAccount(id);
      setUsers(users.filter(u => u.id !== id)); // Strip out from UI view immediately
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete account mapping.");
    }
  };

  //  Open Row Editing Mode
  const startEditing = (user: BackendUser) => {
    setEditingId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  // Save Updated Fields down to Database
  const handleSaveUpdate = async (id: string) => {
    try {
      await adminService.updateUserData(id, { name: editName, email: editEmail, role: editRole });
      setUsers(users.map(u => u.id === id ? { ...u, name: editName, email: editEmail, role: editRole } : u));
      setEditingId(null); // Close edit view mode row
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update profile parameters.");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>Loading management console data pools...</div>;
  if (error) return <div style={{ color: "red", textAlign: "center", padding: "2rem" }}>{error}</div>;

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.header}>
        <h2>Administrative User Management</h2>
        <button onClick={loadUsers} style={styles.refreshBtn}>Refresh List</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr style={styles.thRow}>
            <th style={styles.th}>Full Name</th>
            <th style={styles.th}>Email Context</th>
            <th style={styles.th}>Role Classification</th>
            <th style={styles.th}>Account Status</th>
            <th style={styles.th}>Actions Console</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isEditing = editingId === user.id;
            const isUserBlocked = user.isBlocked === 1 || user.isBlocked === true;

            return (
              <tr key={user.id} style={styles.tr}>
                {/* Name Grid Element */}
                <td style={styles.td}>
                  {isEditing ? (
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={styles.inlineInput} />
                  ) : (
                    user.name
                  )}
                </td>

                {/* Email Grid Element */}
                <td style={styles.td}>
                  {isEditing ? (
                    <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} style={styles.inlineInput} />
                  ) : (
                    user.email
                  )}
                </td>

                {/* Role Status Selection Element */}
                <td style={styles.td}>
                  {isEditing ? (
                    <select value={editRole} onChange={(e) => setEditRole(e.target.value as any)} style={styles.inlineSelect}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span style={{ ...styles.badge, backgroundColor: user.role === "admin" ? "#fed7d7" : "#e2e8f0", color: user.role === "admin" ? "#9b2c2c" : "#4a5568" }}>
                      {user.role.toUpperCase()}
                    </span>
                  )}
                </td>

                {/* Account Block Parameter Badges */}
                <td style={styles.td}>
                  <span style={{ ...styles.badge, backgroundColor: isUserBlocked ? "#feebc8" : "#c6f6d5", color: isUserBlocked ? "#c05621" : "#22543d" }}>
                    {isUserBlocked ? "🛑 BLOCKED" : "🟢 ACTIVE"}
                  </span>
                </td>

                {/* Core Control Buttons Trigger Lanes */}
                <td style={styles.td}>
                  <div style={styles.actionGroup}>
                    {isEditing ? (
                      <>
                        <button onClick={() => handleSaveUpdate(user.id)} style={styles.saveBtn}>Save</button>
                        <button onClick={() => setEditingId(null)} style={styles.cancelBtn}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditing(user)} style={styles.editBtn}>Edit</button>
                        <button onClick={() => handleToggleBlock(user)} style={styles.blockBtn}>
                          {isUserBlocked ? "Unblock" : "Block"}
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} style={styles.deleteBtn}>Delete</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// UI Element Design Rules Configuration Objects
const styles = {
  dashboardContainer: { width: "100%", maxWidth: "1000px", margin: "0 auto", padding: "1rem", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" },
  refreshBtn: { padding: "0.5rem 1rem", backgroundColor: "#4a5568", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" as const, textAlign: "left" as const, fontFamily: "sans-serif" },
  thRow: { backgroundColor: "#f7fafc", borderBottom: "2px solid #e2e8f0" },
  th: { padding: "0.75rem 1rem", fontWeight: "bold" as const, color: "#4a5568" },
  tr: { borderBottom: "1px solid #edf2f7", transition: "background 0.2s" },
  td: { padding: "1rem" },
  badge: { padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold" as const },
  actionGroup: { display: "flex", gap: "0.5rem" },
  inlineInput: { padding: "0.3rem", fontSize: "0.9rem", borderRadius: "4px", border: "1px solid #cbd5e0", width: "90%" },
  inlineSelect: { padding: "0.3rem", borderRadius: "4px", border: "1px solid #cbd5e0" },
  editBtn: { padding: "0.3rem 0.6rem", backgroundColor: "#3182ce", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  blockBtn: { padding: "0.3rem 0.6rem", backgroundColor: "#dd6b20", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  deleteBtn: { padding: "0.3rem 0.6rem", backgroundColor: "#e53e3e", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  saveBtn: { padding: "0.3rem 0.6rem", backgroundColor: "#38a169", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  cancelBtn: { padding: "0.3rem 0.6rem", backgroundColor: "#718096", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }
};