export default function UserTable({ users, deleteUser }) {

    return (

        <div className="user-table">

            <table>

                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>SĐT</th>
                        <th>Phòng</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>

                    {users.map(user => (

                        <tr key={user.id}>

                            <td>{user.name}</td>
                            <td>{user.phone}</td>
                            <td>{user.room}</td>

                            <td>
                                {user.status === "active"
                                    ? "🟢 Đang thuê"
                                    : "⚪ Đã rời"}
                            </td>

                            <td>

                                <button
                                    className="btn-delete"
                                    onClick={() => deleteUser(user.id)}
                                >
                                    Xóa
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}