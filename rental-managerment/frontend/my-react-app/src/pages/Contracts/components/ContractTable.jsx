export default function ContractTable({ contracts, deleteContract, onEdit }) {
    return (
        <div className="contract-table">
            <table>
                <thead>
                    <tr>
                        <th>Người thuê</th>
                        <th>Phòng</th>
                        <th>Giá (VNĐ)</th>
                        <th>Tiền cọc</th>
                        <th>Bắt đầu</th>
                        <th>Kết thúc</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {contracts.map(contract => (
                        <tr key={contract._id}>
                            {/* Nhờ populate, userId đã là object { name, phone } */}
                            <td>{contract.userId?.name || "-"}</td>
                            <td>{contract.roomId?.roomNumber || "-"}</td>
                            <td>{contract.price?.toLocaleString()}</td>
                            <td>{contract.deposit ? contract.deposit.toLocaleString() : "-"}</td>
                            <td>{contract.startDate?.slice(0, 10)}</td>
                            <td>{contract.endDate?.slice(0, 10)}</td>
                            <td>
                                {contract.status === "active"
                                    ? "🟢 Hiệu lực"
                                    : contract.status === "expired"
                                        ? "⚪ Hết hạn"
                                        : "🔴 Đã hủy"}
                            </td>
                            <td>
                                <button
                                    onClick={() => onEdit(contract)}
                                    style={{ marginRight: '8px', backgroundColor: '#0ea5e9', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Sửa
                                </button>
                                <button
                                    className="btn-delete"
                                    onClick={() => deleteContract(contract._id)}
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