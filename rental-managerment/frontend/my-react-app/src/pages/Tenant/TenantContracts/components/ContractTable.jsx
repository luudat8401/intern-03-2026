import React from 'react';
import ContractRow from './ContractRow';

const ContractTable = ({ contracts, onDelete }) => {
  if (contracts.length === 0) {
    return (
      <div className="empty-state">
        <p>Bạn chưa gửi yêu cầu thuê phòng nào.</p>
      </div>
    );
  }

  return (
    <div className="contract-list">
      <table className="contract-table">
        <thead>
          <tr>
            <th>Số phòng</th>
            <th>Chủ trọ</th>
            <th>Thời hạn</th>
            <th>Giá thuê</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <ContractRow 
              key={contract.id} 
              contract={contract} 
              onDelete={onDelete} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractTable;
