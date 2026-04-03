import React from 'react';

export default function RoomBasicDetails({ register, errors, cities, districts, wards }) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6 items-start">
      <div className="col-span-2">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block font-black text-[10px]">Tiêu đề quảng bá</label>
        <input
          {...register("title")}
          placeholder="VD: Phòng Studio cao cấp Landmark 81..."
          className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none border-transparent focus:border-blue-500 shadow-inner"
        />
        {errors.title && <p className="text-rose-500 text-[10px] font-bold mt-1.5 ml-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block font-black text-[10px]">Số phòng / Mã phòng</label>
        <input
          {...register("roomNumber")}
          placeholder="P.123"
          className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none border-transparent focus:border-blue-500 shadow-inner"
        />
        {errors.roomNumber && <p className="text-rose-500 text-[10px] font-bold mt-1.5 ml-1">{errors.roomNumber.message}</p>}
      </div>

      <div>
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block font-black text-[10px]">Giá thuê (VNĐ / Tháng)</label>
        <input
          type="number"
          {...register("price")}
          placeholder="0.000"
          className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-xl text-sm font-bold text-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none border-transparent focus:border-blue-500 shadow-inner"
        />
        {errors.price && <p className="text-rose-500 text-[10px] font-bold mt-1.5 ml-1">{errors.price.message}</p>}
      </div>

      <div>
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block font-black text-[10px]">Diện tích (m²)</label>
        <input
          type="number"
          {...register("area")}
          className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none border-transparent focus:border-blue-500 shadow-inner"
        />
        {errors.area && <p className="text-rose-500 text-[10px] font-bold mt-1.5 ml-1">{errors.area.message}</p>}
      </div>

      <div>
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block font-black text-[10px]">Sức chứa tối đa</label>
        <input
          type="number"
          {...register("capacity")}
          className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none border-transparent focus:border-blue-500 shadow-inner"
        />
        {errors.capacity && <p className="text-rose-500 text-[10px] font-bold mt-1.5 ml-1">{errors.capacity.message}</p>}
      </div>

      <div className="col-span-2 grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tỉnh/Thành phố</label>
          <select {...register("city")} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all shadow-sm">
            <option value="">Chọn</option>
            {cities.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
          </select>
          {errors.city && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errors.city.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quận/Huyện</label>
          <select {...register("district")} disabled={!districts.length} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all disabled:opacity-40 shadow-sm">
            <option value="">Chọn</option>
            {districts.map(d => <option key={d.code} value={d.name}>{d.name}</option>)}
          </select>
          {errors.district && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errors.district.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phường/Xã</label>
          <select {...register("ward")} disabled={!wards.length} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all disabled:opacity-40 shadow-sm">
            <option value="">Chọn</option>
            {wards.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
          </select>
          {errors.ward && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{errors.ward.message}</p>}
        </div>
      </div>

      <div className="col-span-2">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block font-black text-[10px]">Địa chỉ chi tiết (Số nhà, Đường...)</label>
        <input
          {...register("location")}
          placeholder="VD: 123 Võ Văn Kiệt"
          className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none border-transparent focus:border-blue-500 shadow-inner"
        />
        {errors.location && <p className="text-rose-500 text-[10px] font-bold mt-1.5 ml-1">{errors.location.message}</p>}
      </div>
    </div>
  );
}
