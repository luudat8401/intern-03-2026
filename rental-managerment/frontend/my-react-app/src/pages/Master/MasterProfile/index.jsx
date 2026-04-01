import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { updateMasterApi } from "../../../api/master.api";
import ProfileView from '../MasterDashboard/components/ProfileView';
import { getMaster } from "../../../api/master.api";
import ProfileForm from '../MasterDashboard/components/ProfileForm';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function MasterProfile() {
  const { userProfile: user, loading, errorCtx: error, updateProfileContext } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (updatedData) => {
    try {
      await updateMasterApi(user.id, updatedData);
      updateProfileContext(updatedData);
      setIsEditing(false);
    } catch (err) {
      alert("Cập nhật thông tin thất bại: " + (err.response?.data?.error || err.message));
    }
  };

  const handleGetMaster = async () => {
    try {
      const master = await getMaster(user);
      console.log(master);
    } catch {
      console.log("Error fetching master")
    }
  }

  return (
    <div className="bg-white p-12 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/40 max-w-4xl mx-auto animate-in zoom-in duration-500">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <AccountCircleIcon />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Hồ sơ chủ trọ</h2>
        </div>
      </div>

      {loading && (
        <div className="py-20 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest text-center">Đang tải hồ sơ từ máy chủ...</p>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl text-rose-600 font-bold text-sm text-center mb-8">
          ❌ {error}
        </div>
      )}

      {!loading && !error && user && (
        <React.Fragment>
          {isEditing ? (
            <ProfileForm
              user={user}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ProfileView
              user={user}
              onEdit={() => setIsEditing(true)}
              onGetMaster={handleGetMaster}
            />
          )}
        </React.Fragment>
      )}
    </div>
  );
}
