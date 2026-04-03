import React, { useState, useEffect } from 'react';
import { createContract, updateContractApi } from '../../../api/contract.api';
import toast from 'react-hot-toast';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaymentsIcon from '@mui/icons-material/Payments';
import RoomIcon from '@mui/icons-material/Room';

const ContractModal = ({
  isOpen,
  onClose,
  room,
  contract = null,
  role = 'user',
  onSuccess,
  onAction
}) => {
  const [loading, setLoading] = useState(false);

  // Decide if we are in view mode or edit mode
  // Master is always READ ONLY.
  // User is READ ONLY if contract status is not 0 (Pending).
  const isViewOnly = role === 'master' || (contract && contract.status !== 0);
  const isEditing = !!contract;

  // Initial form state
  const getInitialDates = () => {
    if (contract) {
      return {
        startDate: new Date(contract.startDate).toISOString().split('T')[0],
        endDate: new Date(contract.endDate).toISOString().split('T')[0],
        deposit: contract.deposit || 0,
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const nextYearDate = new Date();
    nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
    return {
      startDate: today,
      endDate: nextYearDate.toISOString().split('T')[0],
      deposit: room?.price || 0,
    };
  };

  const [formData, setFormData] = useState(getInitialDates());

  // Reset form when modal opens or contract changes
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialDates());
    }
  }, [isOpen, contract, room]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewOnly) return;

    setLoading(true);
    try {
      const payload = {
        roomId: room?.id || contract?.roomId,
        price: room?.price || contract?.price,
        startDate: formData.startDate,
        endDate: formData.endDate,
        deposit: parseFloat(formData.deposit),
      };

      if (isEditing) {
        await updateContractApi(contract.id, payload);
        toast.success('Cập nhật hợp đồng thành công!');
      } else {
        await createContract(payload);
        toast.success('Yêu cầu thuê phòng đã được gửi đi!');
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (isViewOnly) return 'Chi tiết hợp đồng';
    if (isEditing) return 'Chỉnh sửa hợp đồng';
    return 'Tạo yêu cầu thuê phòng';
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-emerald-50">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none mb-1">{getTitle()}</h3>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">
              Phòng {room?.roomNumber || contract?.room?.roomNumber} - {room?.title || contract?.room?.title}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-lg text-slate-400 transition-colors">
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CalendarMonthIcon sx={{ fontSize: 14 }} />
                Ngày bắt đầu ở
              </label>
              <input
                type="date"
                required
                disabled={isViewOnly}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CalendarMonthIcon sx={{ fontSize: 14 }} />
                Ngày kết thúc dự kiến
              </label>
              <input
                type="date"
                required
                disabled={isViewOnly}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>

            {/* Deposit */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <PaymentsIcon sx={{ fontSize: 14 }} />
                Tiền cọc (VNĐ)
              </label>
              <input
                type="number"
                required
                disabled={isViewOnly}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
              />
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-bold uppercase text-[9px] tracking-widest">Giá thuê hàng tháng:</span>
              <span className="text-slate-900 font-black">{(room?.price || contract?.price)?.toLocaleString()} đ</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-emerald-100/50">
              <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest">
                {isViewOnly ? 'Tổng số tiền cọc:' : 'Dự kiến tiền cọc:'}
              </span>
              <span className="text-emerald-600 font-black">{parseFloat(formData.deposit || 0).toLocaleString()} đ</span>
            </div>
          </div>

          {/* Additional Info for Master */}
          {role === 'master' && (
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400">
                <RoomIcon fontSize="small" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Yêu cầu từ</p>
                <p className="text-xs font-black text-slate-800 leading-none">{contract?.user?.name} ({contract?.user?.phone})</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all active:scale-95"
            >
              {isViewOnly ? 'Đóng' : 'Hủy bỏ'}
            </button>

            {!isViewOnly && (
              <button
                type="submit"
                disabled={loading}
                className="flex-2 py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
              >
                {loading ? 'Đang xử lý...' : isEditing ? 'Cập nhật ngay' : 'Gửi yêu cầu'}
              </button>
            )}

            {role === 'master' && contract?.status === 0 && (
              <div className="flex flex-1 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onAction?.(contract.id, 1, 'Duyệt hợp đồng này?');
                    onClose();
                  }}
                  className="flex-1 py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all active:scale-95"
                >
                  Duyệt Hợp Đồng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAction?.(contract.id, 2, 'Từ chối hợp đồng này?');
                    onClose();
                  }}
                  className="flex-1 py-4 bg-white text-rose-600 border border-rose-100 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-50 transition-all active:scale-95"
                >
                  Từ chối
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractModal;
