import React from 'react';
import ContractRow from './ContractRow';

const ContractTable = ({ contracts, onAction }) => {
  if (contracts.length === 0) {
    return (
      <div className="empty-state">
        <p>Chưa có yêu cầu thuê phòng nào gửi tới bạn.</p>
      </div>
    );
  }

  return (
    <div className="contract-list">
      <table className="contract-table">
        <thead>
          <tr>
            <th>Người thuê</th>
            <th>Phòng</th>
            <th>Thời hạn</th>
            <th>Giá & Cọc</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <ContractRow 
              key={contract.id} 
              contract={contract} 
              onAction={onAction} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractTable;
