import React from 'react';
import SecurityIcon from '@mui/icons-material/Security';
import LabeledTextField from '../../../../components/Common/LabeledTextField';

export default function SecuritySection({ register, errors }) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm mb-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-blue-50/20">
          <SecurityIcon sx={{ fontSize: 20 }} />
        </div>
        <h4 className="text-xl font-bold text-slate-800">Bảo mật & Mật khẩu</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div className="md:col-span-1">
          <LabeledTextField
            label="MẬT KHẨU HIỆN TẠI"
            type="password"
            placeholder="********"
            {...register("oldPassword")}
            error={!!errors.oldPassword}
            helperText={errors.oldPassword?.message}
          />
        </div>
        <div className="md:col-span-1">
          <LabeledTextField
            label="MẬT KHẨU MỚI"
            type="password"
            placeholder="Nhập mật khẩu mới"
            {...register("newPassword")}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />
        </div>
        <div className="md:col-span-1">
          <LabeledTextField
            label="XÁC NHẬN MẬT KHẨU MỚI"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            {...register("confirmNewPassword")}
            error={!!errors.confirmNewPassword}
            helperText={errors.confirmNewPassword?.message}
          />
        </div>
      </div>
      <p className="text-[10px] text-slate-400 font-medium italic mt-2 px-1">
        Để đảm bảo an toàn, mật khẩu nên bao gồm ít nhất 8 ký tự, bao gồm cả chữ hoa, chữ thường và chữ số.
      </p>
    </div>
  );
}
