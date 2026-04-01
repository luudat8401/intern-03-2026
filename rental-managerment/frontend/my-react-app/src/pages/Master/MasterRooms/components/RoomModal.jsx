import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { roomSchema } from '../../../../schemas/room.schema';
import FormField from '../../../../components/Common/FormField';

export default function RoomModal({ isOpen, onClose, onSave, roomData, masterId }) {
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(roomSchema),
    defaultValues: {
      title: '',
      city: 'Hồ Chí Minh',
      ward: '',
      district: '',
      location: '',
      area: 20,
      isTrending: false,
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
          title: roomData.title || '',
          city: roomData.city || 'Hồ Chí Minh',
          ward: roomData.ward || '',
          district: roomData.district || '',
          location: roomData.location || '',
          area: roomData.area || 20,
          isTrending: roomData.isTrending || false,
          roomNumber: roomData.roomNumber,
          price: roomData.price,
          status: roomData.status,
          capacity: roomData.capacity,
          currentTenants: roomData.currentTenants || 0,
        });
      } else {
        reset({ title: '', city: 'Hồ Chí Minh', ward: '', district: '', location: '', area: 20, isTrending: false, roomNumber: '', price: '', status: 'Trống', capacity: 2, currentTenants: 0 });
      }
      setImageFile(null);
      setImageError("");
    }
  }, [roomData, isOpen, reset]);

  const selectedCityName = watch("city");
  const selectedDistrictName = watch("district");

  useEffect(() => {
    if (isOpen) {
      fetch("https://provinces.open-api.vn/api/?depth=1")
        .then(res => res.json())
        .then(data => setCities(data))
        .catch(err => console.error("Lỗi lấy danh sách tỉnh/thành:", err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedCityName && cities.length > 0) {
      const city = cities.find(c => c.name === selectedCityName);
      if (city) {
        fetch(`https://provinces.open-api.vn/api/p/${city.code}?depth=2`)
          .then(res => res.json())
          .then(data => setDistricts(data.districts || []))
          .catch(err => console.error("Lỗi lấy danh sách quận/huyện:", err));
      } else {
        setDistricts([]);
      }
    } else {
      setDistricts([]);
    }
  }, [selectedCityName, cities]);

  useEffect(() => {
    if (selectedDistrictName && districts.length > 0) {
      const dist = districts.find(d => d.name === selectedDistrictName);
      if (dist) {
        fetch(`https://provinces.open-api.vn/api/d/${dist.code}?depth=2`)
          .then(res => res.json())
          .then(data => setWards(data.wards || []))
          .catch(err => console.error("Lỗi lấy danh sách phường/xã:", err));
      } else {
        setWards([]);
      }
    } else {
      setWards([]);
    }
  }, [selectedDistrictName, districts]);

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
    Object.keys(data).forEach(key => {
      formDataToSubmit.append(key, data[key]);
    });
    formDataToSubmit.append('masterId', masterId);

    if (imageFile) {
      formDataToSubmit.append('image', imageFile);
    }
    onSave(formDataToSubmit, roomData ? roomData.id : null);
  };

  const statusOptions = [
    { value: 'Trống', label: 'Trống' },
    { value: 'Đã thuê', label: 'Đã thuê' },
    { value: 'Bảo trì', label: 'Bảo trì' },
    { value: 'Đang xử lý', label: 'Đang xử lý' },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{roomData ? 'Cập nhật phòng' : 'Thêm phòng mới'}</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <FormField label="Tên phòng hiển thị:" name="title" register={register} error={errors.title} placeholder="Loại phòng" />
            <FormField
              label="Thành phố:"
              name="city"
              type="select"
              register={register}
              error={errors.city}
              options={[{ value: '', label: '-- Chọn Tỉnh --' }, ...cities.map(c => ({ value: c.name, label: c.name }))]}
            />
          </div>

          <div className="form-row">
            <FormField
              label="Quận/Huyện:"
              name="district"
              type="select"
              register={register}
              error={errors.district}
              disabled={!districts.length}
              options={[{ value: '', label: '-- Chọn Quận --' }, ...districts.map(d => ({ value: d.name, label: d.name }))]}
            />
            <FormField
              label="Phường/Xã:"
              name="ward"
              type="select"
              register={register}
              error={errors.ward}
              disabled={!wards.length}
              options={[{ value: '', label: '-- Chọn Phường --' }, ...wards.map(w => ({ value: w.name, label: w.name }))]}
            />
          </div>

          <FormField label="Địa chỉ cụ thể:" name="location" register={register} error={errors.location} placeholder="VD: 123 Đường Điện Biên Phủ..." />

          <div className="form-row">
            <FormField label="Số phòng (Bắt buộc):" name="roomNumber" register={register} error={errors.roomNumber} placeholder="VD: P.101" />
            <FormField label="Giá thuê (VNĐ):" name="price" type="number" register={register} error={errors.price} placeholder="VD: 1500000" />
          </div>

          <div className="form-row">
            <FormField label="Diện tích (m²):" name="area" type="number" register={register} error={errors.area} placeholder="VD: 25" />
            <div className="form-group-rm" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
              <input type="checkbox" id="isTrending" {...register("isTrending")} style={{ width: 'auto', marginBottom: 0 }} />
              <label htmlFor="isTrending" style={{ margin: 0, fontWeight: 'bold', color: '#3b82f6', cursor: 'pointer' }}>Bật nhãn nổi bật (Trending)</label>
            </div>
          </div>

          <div className="form-row">
            <FormField label="Sức chứa (Tối đa):" name="capacity" type="number" register={register} error={errors.capacity} placeholder="VD: 2" />
            <FormField label="Người đang ở:" name="currentTenants" type="number" register={register} error={errors.currentTenants} placeholder="VD: 0" />
          </div>

          <FormField label="Trạng thái kinh doanh:" name="status" type="select" register={register} error={errors.status} options={statusOptions} />

          <div className="file-upload-section">
            <label className="file-upload-label">Tải ảnh hiển thị {!roomData ? "(Bắt buộc)" : "(Có thể bỏ qua)"}:</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {imageError && <p className="error-text">{imageError}</p>}
            {imageFile && <p className="file-name-hint">Đã tải ảnh: {imageFile.name}</p>}
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

