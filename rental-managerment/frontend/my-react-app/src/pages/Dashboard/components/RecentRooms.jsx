export default function RecentRooms() {
  return (
    <div className="recent-box">
      <h3>Phòng mới thêm</h3>

      <table>
        <thead>
          <tr>
            <th>Tên phòng</th>
            <th>Giá</th>
            <th>Tình trạng</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Phòng A1</td>
            <td>3.000.000</td>
            <td>Còn trống</td>
          </tr>

          <tr>
            <td>Phòng B2</td>
            <td>2.800.000</td>
            <td>Đã thuê</td>
          </tr>

          <tr>
            <td>Phòng C3</td>
            <td>3.200.000</td>
            <td>Còn trống</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}