import React from 'react';
import StatusBadge from './StatusBadge';

const ContractRow = ({ contract, onDelete }) => {
  return (
    <tr>
      <td><strong>Phòng {contract.roomId?.roomNumber}</strong></td>
      <td>
        <div>{contract.masterId?.name}</div>
        <div className="text-muted">{contract.masterId?.phone}</div>
      </td>
      <td>
        <div>{new Date(contract.startDate).toLocaleDateString('vi-VN')}</div>
        <div className="text-arrow">↓</div>
        <div>{new Date(contract.endDate).toLocaleDateString('vi-VN')}</div>
      </td>
      <td>{contract.price?.toLocaleString()} VNĐ</td>
      <td>
        <StatusBadge status={contract.status} />
      </td>
      <td>
        {contract.status === 'pending' && (
          <button 
            className="btn-text-danger" 
            onClick={() => onDelete(contract.id)}
          >
            Hủy yêu cầu
          </button>
        )}
      </td>
    </tr>
  );
};

export default ContractRow;
