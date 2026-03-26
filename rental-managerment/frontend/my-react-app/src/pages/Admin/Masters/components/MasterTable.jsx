export default function MasterTable({ masters, deleteMaster }) {
  return (
    <div className="master-table">
      <h3>Danh sách chủ trọ</h3>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Tên</th>
            <th>SĐT</th>
            <th>Email</th>
            <th>Địa chỉ</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {masters.map((master) => (
            <tr key={master._id}>
              <td>{master.name}</td>
              <td>{master.phone}</td>
              <td>{master.email}</td>
              <td>{master.address}</td>

              <td>
                <button onClick={() => deleteMaster(master._id)} style={{ padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', border: 'none', backgroundColor: '#ef4444', color: '#fff' }}>
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