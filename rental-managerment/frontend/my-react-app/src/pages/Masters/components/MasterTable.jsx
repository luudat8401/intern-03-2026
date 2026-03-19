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
            <tr key={master.id}>

              <td>{master.name}</td>
              <td>{master.phone}</td>
              <td>{master.email}</td>
              <td>{master.address}</td>

              <td>
                <button onClick={() => deleteMaster(master.id)}>
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