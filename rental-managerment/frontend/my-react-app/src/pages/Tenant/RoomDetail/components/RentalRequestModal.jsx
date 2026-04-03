import React, { useState } from 'react';
import { createContract } from '../../../../api/contract.api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaymentsIcon from '@mui/icons-material/Payments';

const RentalRequestModal = ({ isOpen, onClose, room }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Default dates: start today, end in 1 year
  const today = new Date().toISOString().split('T')[0];
  const nextYearDate = new Date();
  nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
  const nextYear = nextYearDate.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    startDate: today,
    endDate: nextYear,
    deposit: room?.price || 0,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        roomId: room.id,
        price: room.price,
        startDate: formData.startDate,
        endDate: formData.endDate,
        deposit: parseFloat(formData.deposit),
      };

      await createContract(payload);
      toast.success('Yêu cầu thuê phòng đã được gửi đi!');
      onClose();
      navigate('/user/contracts');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Không thể gủi yêu cầu thuê phòng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-emerald-50">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none mb-1">Xác nhận thuê phòng</h3>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Phòng {room?.roomNumber} - {room?.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-lg text-slate-400 transition-colors">
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Form */}
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
                min={today}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
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
                min={formData.startDate}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>

            {/* Deposit */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <PaymentsIcon sx={{ fontSize: 14 }} />
                Tiền cọc dự kiến (VNĐ)
              </label>
              <input
                type="number"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
              />
              <p className="text-[10px] text-slate-400 font-bold italic">Mặc định là 1 tháng tiền nhà</p>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-bold">Giá thuê hàng tháng:</span>
              <span className="text-slate-900 font-black">{room?.price?.toLocaleString()} đ</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-emerald-100/50">
              <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Tổng cộng cọc:</span>
              <span className="text-emerald-600 font-black">{parseFloat(formData.deposit || 0).toLocaleString()} đ</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all active:scale-95"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-2 py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              Gửi yêu cầu thuê phòng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RentalRequestModal;
