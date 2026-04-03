import React from 'react';
import { Box, Avatar, Typography, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LabeledTextField from '../../../../components/Common/LabeledTextField';

export default function PersonalInfoSection({ register, errors, user, avatarPreview, onAvatarChange }) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm mb-6">
      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-50">
        <div className="relative group">
          <Avatar
            src={avatarPreview || user?.avatar}
            sx={{ width: 100, height: 100, borderRadius: '24px', bgcolor: '#f1f5f9', color: '#64748b' }}
          >
            {user?.name?.charAt(0)}
          </Avatar>
          <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 transition-colors border-4 border-white">
            <EditIcon sx={{ fontSize: 16 }} />
            <input type="file" hidden accept="image/*" onChange={onAvatarChange} />
          </label>
        </div>
        <div>
          <h4 className="text-xl font-bold text-slate-900 mb-1">Ảnh đại diện</h4>
          <p className="text-sm text-slate-400 font-medium">Tải lên ảnh chân dung chuyên nghiệp (JPG, PNG, tối đa 5MB).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <LabeledTextField
            label="HỌ VÀ TÊN"
            placeholder="Phạm Minh Hoàng"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </div>
        <div className="md:col-span-1">
          <LabeledTextField
            label="EMAIL LIÊN HỆ"
            placeholder="hoang.pham@luxrentals.vn"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </div>
        <div className="md:col-span-1">
          <LabeledTextField
            label="SỐ ĐIỆN THOẠI"
            placeholder="+84 901 234 567"
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            labelRight={
               <span className="px-2 py-0.5 bg-emerald-50 text-[10px] font-bold text-emerald-600 rounded-md border border-emerald-100 flex items-center gap-1">
                 VERIFIED
               </span>
            }
          />
        </div>
        <div className="md:col-span-1">
          <LabeledTextField
            label="ĐỊA CHỈ THƯỜNG TRÚ"
            placeholder="128 Phan Xích Long, Phường 2, Phú Nhuận..."
            {...register("address")}
            error={!!errors.address}
            helperText={errors.address?.message}
          />
        </div>
      </div>
    </div>
  );
}
