import React from 'react';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LabeledTextField from '../../../../components/Common/LabeledTextField';
import { MenuItem } from '@mui/material';

const BANKS = [
  "Vietcombank", "Agribank", "BIDV", "Vietinbank", "Techcombank", "MB Bank", "VPBank", "Sacombank"
];

export default function BankInfoSection({ register, errors }) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm mb-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-blue-50/20">
          <AccountBalanceIcon sx={{ fontSize: 20 }} />
        </div>
        <h4 className="text-xl font-bold text-slate-800">Thông tin Tài khoản nhận tiền</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-1">
          <LabeledTextField
            label="NGÂN HÀNG"
            select
            defaultValue="Vietcombank"
            {...register("bankName")}
            error={!!errors.bankName}
            helperText={errors.bankName?.message}
          >
            {BANKS.map((bank) => (
              <MenuItem key={bank} value={bank}>{bank}</MenuItem>
            ))}
          </LabeledTextField>
        </div>
        <div className="md:col-span-1">
          <LabeledTextField
            label="SỐ TÀI KHOẢN"
            placeholder="1023 4567 8901"
            {...register("bankAccountNumber")}
            error={!!errors.bankAccountNumber}
            helperText={errors.bankAccountNumber?.message}
          />
        </div>
        <div className="md:col-span-1">
          <LabeledTextField
            label="CHỦ TÀI KHOẢN"
            placeholder="PHAM MINH HOANG"
            {...register("bankAccountHolder")}
            error={!!errors.bankAccountHolder}
            helperText={errors.bankAccountHolder?.message}
          />
        </div>
        <div className="md:col-span-1">
          <LabeledTextField
            label="CHI NHÁNH"
            placeholder="Chi nhánh Nam Sài Gòn"
            {...register("bankBranch")}
            error={!!errors.bankBranch}
            helperText={errors.bankBranch?.message}
          />
        </div>
      </div>

      <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4 shadow-sm border-l-4 border-l-blue-600">
        <div className="mt-0.5">
          <InfoOutlinedIcon sx={{ fontSize: 18, color: '#2563eb' }} />
        </div>
        <p className="text-xs text-blue-800 leading-relaxed font-medium">
          Mọi khoản thu hộ tiền thuê từ người thuê sẽ được tự động chuyển vào tài khoản này vào ngày 05 hàng tháng. Vui lòng đảm bảo thông tin chính xác để tránh chậm trễ giao dịch.
        </p>
      </div>
    </div>
  );
}
