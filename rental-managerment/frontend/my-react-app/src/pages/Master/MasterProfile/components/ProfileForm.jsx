import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { masterProfileSchema } from '../../../../schemas/ProfileSchema';
import PersonalInfoSection from '../../../../components/Common/Profile/PersonalInfoSection';
import SecuritySection from '../../../../components/Common/Profile/SecuritySection';
import BankInfoSection from './BankInfoSection';
import { updateMasterApi } from '../../../../api/master.api';
import { changePasswordApi } from '../../../../api/auth.api';
import { useAuth } from '../../../../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';

export default function ProfileForm({ user, onSave, onCancel }) {
  const { updateProfileContext } = useAuth();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(masterProfileSchema),
    defaultValues: {
      name: user?.name,
      phone: user?.phone,
      email: user?.email,
      address: user?.address,
      bankName: user?.bankName || 'Vietcombank',
      bankAccountNumber: user?.bankAccountNumber,
      bankAccountHolder: user?.bankAccountHolder,
      bankBranch: user?.bankBranch,
    },
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setGeneralError("");

      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (!['oldPassword', 'newPassword', 'confirmNewPassword', 'avatar'].includes(key)) {
          formData.append(key, data[key]);
        }
      });

      if (avatarFile) {
        formData.append("image", avatarFile);
      }

      const profileRes = await updateMasterApi(user.id, formData);

      // Update Password if filled
      if (data.oldPassword && data.newPassword) {
        await changePasswordApi({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword
        });
      }

      updateProfileContext(profileRes.data);
      onSave(profileRes.data);

    } catch (err) {
      console.error("Update error:", err);
      setGeneralError(err.response?.data?.error || err.message || "Cập nhật thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-700" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-10 px-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cài đặt Hồ sơ</h2>
        <p className="text-slate-500 font-medium max-w-2xl text-sm leading-relaxed">
          Đảm bảo thông tin cá nhân và tài khoản ngân hàng của bạn luôn chính xác để việc giao dịch được thuận lợi.
        </p>
      </div>

      {generalError && (
        <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl flex items-center gap-3 font-semibold text-xs animate-shake">
          ❌ {generalError}
        </div>
      )}

      {/* Common Personal Info Section - Role Master */}
      <PersonalInfoSection
        register={register}
        errors={errors}
        user={user}
        avatarPreview={avatarPreview}
        onAvatarChange={handleAvatarChange}
        roleLabel="Chủ trọ"
      />

      {/* Master Specific Section */}
      <BankInfoSection register={register} errors={errors} />

      {/* Common Security Section - Role Master */}
      <SecuritySection register={register} errors={errors} accentColor="blue-600" />

      {/* Actions */}
      <div className="flex justify-end items-center gap-4 mt-12 px-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3.5 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-10 py-3.5 bg-blue-600 text-white font-black rounded-xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-3"
        >
          {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}
