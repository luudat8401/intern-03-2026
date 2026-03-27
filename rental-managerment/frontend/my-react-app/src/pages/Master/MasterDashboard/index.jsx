import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { updateMasterApi } from "../../../api/master.api";
import ProfileView from './components/ProfileView';
import { getMasterById, getMaster } from "../../../api/master.api";
import ProfileForm from './components/ProfileForm';
import './master-info.css';

export default function MasterDashboard() {
  // Nhờ Context API, code gọi dữ liệu đã biến mất, chỉ cần bốc từ trên trời xuống
  const { userProfile: user, loading, errorCtx: error, updateProfileContext } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (updatedData) => {
    try {
      await updateMasterApi(user._id, updatedData);
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
    }
    catch {
      console.log("Error fetching master")
    }
  }
  return (
    <div className="master-info-container">
      <h2 className="master-heading">Thông tin Quản lý</h2>
      <p className="master-subheading">Xem và quản lý hồ sơ cá nhân Quản lý / Chủ trọ.</p>

      {loading && <div style={{ marginTop: '20px' }}>⏳ Đang đồng bộ dữ liệu...</div>}
      {error && <div style={{ color: '#d90429', marginTop: '20px', fontWeight: 'bold' }}>{error}</div>}

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
