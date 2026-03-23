export default function UserTable({ users, deleteUser, onEdit }) {
    return (
        <div className="user-table" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <tr>
                        <th style={{ padding: '16px', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '14px' }}>Tên</th>
                        <th style={{ padding: '16px', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '14px' }}>SĐT</th>
                        <th style={{ padding: '16px', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '14px' }}>Phòng</th>
                        <th style={{ padding: '16px', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '14px' }}>Đại diện HĐ</th>
                        <th style={{ padding: '16px', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '14px' }}>Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map(user => (
                        <tr key={user._id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'default' }}>
                            <td style={{ padding: '16px', fontWeight: '500', color: '#0f172a' }}>{user.name}</td>
                            <td style={{ padding: '16px', color: '#475569' }}>{user.phone}</td>
                            
                            {/* Trích xuất chuỗi tên Phòng từ dữ liệu Database đã Populate */}
                            <td style={{ padding: '16px', color: '#3b82f6', fontWeight: '600' }}>
                                {user.roomId ? user.roomId.roomNumber : "Chưa có phòng"}
                            </td>

                            <td style={{ padding: '16px' }}>
                                {user.isRepresentative 
                                    ? <span style={{ padding: '4px 10px', background: '#dcfce3', color: '#166534', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>⭐ Đại diện</span>
                                    : <span style={{ padding: '4px 10px', background: '#f1f5f9', color: '#64748b', borderRadius: '999px', fontSize: '12px' }}>Bạn cùng phòng</span>
                                }
                            </td>

                            <td style={{ padding: '16px' }}>
                                <button
                                    className="btn-edit"
                                    onClick={() => onEdit(user)}
                                    style={{ marginRight: '8px', backgroundColor: '#0ea5e9', color: '#fff', padding: '8px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
                                >
                                    Sửa
                                </button>
                                <button
                                    className="btn-delete"
                                    onClick={() => deleteUser(user._id)}
                                    style={{ backgroundColor: '#ef4444', color: '#fff', padding: '8px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                                Chưa có khách thuê nào.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}