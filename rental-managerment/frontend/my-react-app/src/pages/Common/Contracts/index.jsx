import React, { useEffect, useState } from 'react';
import { getContracts, updateContractApi, deleteContractApi } from '../../../api/contract.api';
import ContractTable from './components/ContractTable';
import toast from 'react-hot-toast';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteConfirmModal from '../../../components/Common/DeleteConfirmModal';
import ContractModal from '../../../components/Common/Contracts/ContractModal';

export default function SharedContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [viewerModal, setViewerModal] = useState({
    isOpen: false,
    contract: null
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    id: null,
    status: null,
    title: '',
    message: ''
  });

  // Get user role from local storage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
      } catch (e) {
        console.error("Error parsing user role", e);
      }
    }
  }, []);

  const fetchContracts = async () => {
    try {
      const res = await getContracts();
      setContracts(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải danh sách hợp đồng');
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [userRole]);

  const handleAction = (id, status, message) => {
    setConfirmModal({
      isOpen: true,
      id,
      status,
      title: status === null ? 'Hủy yêu cầu thuê?' : status === 2 ? 'Từ chối hợp đồng?' : 'Xác nhận xử lý?',
      message: message
    });
  };

  const executeAction = async () => {
    const { id, status } = confirmModal;
    try {
      if (status === null) {
        await deleteContractApi(id);
        toast.success('Đã hủy yêu cầu thuê phòng');
      } else {
        await updateContractApi(id, { status });
        const successMsg = status === 1 ? 'Hợp đồng đã được kích hoạt!' : 'Đã từ chối hợp đồng';
        toast.success(successMsg);
      }
      fetchContracts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Lỗi khi cập nhật hợp đồng');
    } finally {
      setConfirmModal({ ...confirmModal, isOpen: false });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-10 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
              <AssignmentIcon />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none mb-1">
                Quản lý Hợp đồng
              </h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] leading-none">
                {userRole === 'master' ? 'XÉT DUYỆT CÁC YÊU CẦU THUÊ PHÒNG' : 'THEO DÕI CÁC HỢP ĐỒNG HIỆN CÓ'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {(
        <ContractTable
          contracts={contracts}
          role={userRole}
          onAction={handleAction}
          onView={(contract) => setViewerModal({ isOpen: true, contract })}
        />
      )}

      {/* Contract Detail Modal (Shared) */}
      <ContractModal
        isOpen={viewerModal.isOpen}
        onClose={() => setViewerModal({ ...viewerModal, isOpen: false })}
        contract={viewerModal.contract}
        role={userRole}
        onAction={handleAction}
        onSuccess={() => {
          fetchContracts();
          setViewerModal({ ...viewerModal, isOpen: false });
        }}
      />

      {/* Shared Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={executeAction}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </div>
  );
}
