export default function ContractTable({ contracts, deleteContract }) {

    return (

        <div className="contract-table">

            <table>

                <thead>
                    <tr>
                        <th>Người thuê</th>
                        <th>Phòng</th>
                        <th>Giá</th>
                        <th>Bắt đầu</th>
                        <th>Kết thúc</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>

                    {contracts.map(contract => (

                        <tr key={contract.id}>

                            <td>{contract.user}</td>
                            <td>{contract.room}</td>
                            <td>{contract.price}</td>
                            <td>{contract.startDate}</td>
                            <td>{contract.endDate}</td>

                            <td>
                                {contract.status === "active"
                                    ? "🟢 Hiệu lực"
                                    : "⚪ Hết hạn"}
                            </td>

                            <td>

                                <button
                                    className="btn-delete"
                                    onClick={() => deleteContract(contract.id)}
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