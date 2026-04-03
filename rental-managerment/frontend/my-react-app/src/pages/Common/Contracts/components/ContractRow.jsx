import React from 'react';
import StatusBadge from './StatusBadge';

const ContractRow = ({ contract, role, onAction, onView }) => {
  return (
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-50">
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900 leading-none mb-1">
            Phòng {contract.room?.roomNumber}
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
            {contract.room?.title}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-black text-[10px]">
            {role === 'master' ? contract.user?.name?.[0]?.toUpperCase() : contract.master?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-black text-slate-800 tracking-tight leading-none mb-1">
              {role === 'master' ? contract.user?.name : contract.master?.name}
            </p>
            <p className="text-[10px] text-slate-400 font-bold leading-none">
              {role === 'master' ? contract.user?.phone || '090-xxx-xxxx' : contract.master?.phone || 'Chủ trọ tin cậy'}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-xs font-black text-emerald-600 tabular-nums">
          {contract.price?.toLocaleString()} đ
        </div>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={contract.status} />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          {/* Actions for Master (Landlord) */}
          {role === 'master' && contract.status === 0 && (
            <>
              <button
                onClick={() => onAction(contract.id, 1, 'Chấp nhận hợp đồng này?')}
                className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Duyệt
              </button>
              <button
                onClick={() => onAction(contract.id, 2, 'Từ chối hợp đồng này?')}
                className="px-3 py-1.5 bg-white text-rose-600 border border-rose-100 text-[10px] font-black uppercase tracking-widest rounded hover:bg-rose-50 transition-all active:scale-95"
              >
                Từ chối
              </button>
            </>
          )}

          {/* Landlord Cancel Active Contract */}
          {role === 'master' && contract.status === 1 && (
            <button
              onClick={() => onAction(contract.id, null, 'Hủy bỏ hợp đồng đang hiệu lực này? Phòng sẽ được chuyển về trạng thái Trống.')}
              className="px-3 py-1.5 bg-white text-rose-600 border border-rose-100 text-[10px] font-black uppercase tracking-widest rounded hover:bg-rose-50 transition-all active:scale-95"
            >
              Hủy hợp đồng
            </button>
          )}

          {/* Actions for User (Tenant) */}
          {role === 'user' && contract.status === 0 && (
            <button
              onClick={() => onAction(contract.id, null, 'Hủy yêu cầu thuê phòng này?')}
              className="px-3 py-1.5 bg-white text-rose-600 border border-rose-100 text-[10px] font-black uppercase tracking-widest rounded hover:bg-rose-50 transition-all active:scale-95"
            >
              Hủy yêu cầu
            </button>
          )}

          {/* Common View Button */}
          <button
            onClick={() => onView(contract)}
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">Chi tiết</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ContractRow;
