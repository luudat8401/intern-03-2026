import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { roomSchema } from '../../../../schemas/room.schema';

export default function RoomModal({ isOpen, onClose, onSave, roomData, masterId }) {
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(roomSchema),
    defaultValues: {
      roomNumber: '',
      price: '',
      status: 'Trống',
      capacity: 2,
      currentTenants: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (roomData) {
        reset({
          roomNumber: roomData.roomNumber,
          price: roomData.price,
          status: roomData.status,
          capacity: roomData.capacity,
          currentTenants: roomData.currentTenants || 0,
        });
      } else {
        reset({ roomNumber: '', price: '', status: 'Trống', capacity: 2, currentTenants: 0 });
      }
      setImageFile(null);
      setImageError("");
    }
  }, [roomData, isOpen, reset]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
      setImageError("");
    } else {
      setImageFile(null);
    }
  };

  const onSubmit = (data) => {
    if (!roomData && !imageFile) {
      setImageError("Vui lòng chọn ảnh cho phòng (Bắt buộc)");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('roomNumber', data.roomNumber);
    formDataToSubmit.append('price', data.price);
    formDataToSubmit.append('status', data.status);
    formDataToSubmit.append('capacity', data.capacity);
    formDataToSubmit.append('currentTenants', data.currentTenants);
    formDataToSubmit.append('masterId', masterId);

    if (imageFile) {
      formDataToSubmit.append('image', imageFile);
    }
    onSave(formDataToSubmit, roomData ? roomData._id : null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{roomData ? 'Cập nhật phòng' : 'Thêm phòng mới'}</h3>
        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="form-row">
            <div className="form-group-rm">
              <label>Số phòng (Bắt buộc):</label>
              <input type="text" {...register("roomNumber")} placeholder="VD: P.101" />
              {errors.roomNumber && <p style={{ color: "red", fontSize: "0.85rem", margin: "4px 0 0 0" }}>{errors.roomNumber.message}</p>}
            </div>
            <div className="form-group-rm">
              <label>Giá thuê - VNĐ (Bắt buộc):</label>
              <input type="number" {...register("price")} placeholder="VD: 1500000" />
              {errors.price && <p style={{ color: "red", fontSize: "0.85rem", margin: "4px 0 0 0" }}>{errors.price.message}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group-rm">
              <label>Sức chứa (Tối đa):</label>
              <input type="number" {...register("capacity")} placeholder="VD: 2" />
              {errors.capacity && <p style={{ color: "red", fontSize: "0.85rem", margin: "4px 0 0 0" }}>{errors.capacity.message}</p>}
            </div>
            <div className="form-group-rm">
              <label>Người đang ở:</label>
              <input type="number" {...register("currentTenants")} placeholder="VD: 0" />
              {errors.currentTenants && <p style={{ color: "red", fontSize: "0.85rem", margin: "4px 0 0 0" }}>{errors.currentTenants.message}</p>}
            </div>
          </div>

          <div className="form-group-rm">
            <label>Trạng thái kinh doanh:</label>
            <select {...register("status")}>
              <option value="Trống">Trống</option>
              <option value="Đã thuê">Đã thuê</option>
              <option value="Bảo trì">Bảo trì</option>
              <option value="Đang xử lý">Đang xử lý</option>
            </select>
            {errors.status && <p style={{ color: "red", fontSize: "0.85rem", margin: "4px 0 0 0" }}>{errors.status.message}</p>}
          </div>

          <div className="form-group-rm">
            <label>Tải ảnh hiển thị {!roomData ? "(Bắt buộc)" : "(Có thể bỏ qua)"}:</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {imageError && <p style={{ color: "red", fontSize: "0.85rem", margin: "4px 0 0 0" }}>{imageError}</p>}
            {imageFile && <p className="file-name-hint" style={{ fontSize: "0.9rem", color: "#28a745" }}>Đã tải ảnh: {imageFile.name}</p>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Thoát (Hủy)</button>
            <button type="submit" className="btn-submit">Lưu hệ thống</button>
          </div>
        </form>
      </div>
    </div>
  );
}

