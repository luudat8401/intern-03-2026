import React from 'react';
import StatusBadge from './StatusBadge';

const ContractRow = ({ contract, onAction }) => {
  return (
    <tr>
      <td>
        <div className="font-bold">{contract.userId?.name}</div>
        <div className="text-muted">{contract.userId?.phone}</div>
      </td>
      <td><strong>Phòng {contract.roomId?.roomNumber}</strong></td>
      <td>
        <div>{new Date(contract.startDate).toLocaleDateString('vi-VN')}</div>
        <div className="text-arrow">↓</div>
        <div>{new Date(contract.endDate).toLocaleDateString('vi-VN')}</div>
      </td>
      <td>
        <div>Thuê: {contract.price?.toLocaleString()} VNĐ</div>
        <div className="text-muted">Cọc: {contract.deposit?.toLocaleString()} VNĐ</div>
      </td>
      <td>
        <StatusBadge status={contract.status} />
      </td>
      <td>
        <div className="action-buttons">
          {contract.status === 'pending' && (
            <>
              <button 
                className="btn-approve"
                onClick={() => onAction(contract.id, 'active', 'Bạn có chắc muốn duyêt hợp đồng này thành Active?')}
              >
                Duyệt
              </button>
              <button 
                className="btn-decline"
                onClick={() => onAction(contract.id, 'decline', 'Bạn có chắc muốn từ chối yêu cầu này?')}
              >
                Từ chối
              </button>
            </>
          )}
          {contract.status === 'active' && (
            <button 
              className="btn-cancel-contract"
              onClick={() => onAction(contract.id, 'cancelled', 'Bạn có chắc muốn hủy hợp đồng này? Phòng sẽ quay về trạng thái Trống.')}
            >
              Hủy HĐ
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ContractRow;
