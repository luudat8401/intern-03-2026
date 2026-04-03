import React from 'react';
import ContractRow from './ContractRow';

const ContractTable = ({ contracts = [], role, onAction, onView }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-2xl shadow-emerald-500/5 overflow-hidden">
      <div className="overflow-x-auto overflow-y-auto max-h-[650px]">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thông tin phòng</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {role === 'master' ? 'Người thuê' : 'Chủ trọ'}
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá thuê</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {contracts.length > 0 ? (
              contracts.map(contract => (
                <ContractRow 
                  key={contract.id} 
                  contract={contract} 
                  role={role}
                  onAction={onAction}
                  onView={onView}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="space-y-2">
                    <p className="text-slate-900 font-extrabold text-sm uppercase">Trống</p>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-none">Chưa có hợp đồng nào được tạo.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractTable;
