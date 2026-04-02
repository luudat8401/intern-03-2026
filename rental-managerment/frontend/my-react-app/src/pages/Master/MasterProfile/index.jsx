import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { updateMasterApi } from "../../../api/master.api";
import ProfileView from '../MasterDashboard/components/ProfileView';
import { getMaster } from "../../../api/master.api";
import ProfileForm from '../MasterDashboard/components/ProfileForm';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Toast from "../../../components/Common/Toast";

export default function MasterProfile() {
  const { userProfile: user, loading, errorCtx: error, updateProfileContext } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const handleSave = (updatedMaster) => {
    setSuccessOpen(true);
    setIsEditing(false);
  };

  return (
    <div className="animate-in fade-in duration-1000">
      <Toast
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        message="Cập nhật thông tin hồ sơ thành công!"
      />

      {error && (
        <div className="bg-rose-50 border-2 border-rose-100 p-8 rounded text-rose-600 font-bold text-center mb-10 shadow-lg shadow-rose-500/10 max-w-2xl mx-auto">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl mb-2">Đã xảy ra lỗi</h3>
          <p className="opacity-80 font-medium">{error}</p>
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
            />
          )}
        </React.Fragment>
      )}
    </div>
  );
}
