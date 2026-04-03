import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { roomSchema } from '../../../schemas/room.schema';
import { getRoomById, createRoom, updateRoomApi } from '../../../api/room.api';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

// Sub-components
import FormHeader from './components/FormHeader';
import RoomVisuals from './components/RoomVisuals';
import RoomBasicDetails from './components/RoomBasicDetails';
import AmenitiesSection from './components/AmenitiesSection';
import DescriptionSection from './components/DescriptionSection';
import FormActions from './components/FormActions';

export default function RoomFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const isEditMode = Boolean(id);

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageError, setImageError] = useState("");

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(roomSchema),
    mode: 'all',
    reValidateMode: 'onBlur',
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
      status: 0,
      capacity: 2,
      currentTenants: 0,
      amenities: [],
      description: '',
    },
  });

  const selectedCityName = watch("city");
  const selectedDistrictName = watch("district");
  const currentAmenities = watch("amenities") || [];

  const toggleAmenity = (amenityId) => {
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter(a => a !== amenityId)
      : [...currentAmenities, amenityId];
    setValue('amenities', newAmenities);
  };

  // Fetch Cities
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=1")
      .then(res => res.json())
      .then(data => setCities(data))
      .catch(err => console.error("Lỗi lấy danh sách tỉnh/thành:", err));
  }, []);

  // Fetch Districts when City changes
  useEffect(() => {
    if (selectedCityName && cities.length > 0) {
      const city = cities.find(c => c.name === selectedCityName);
      if (city) {
        fetch(`https://provinces.open-api.vn/api/p/${city.code}?depth=2`)
          .then(res => res.json())
          .then(data => setDistricts(data.districts || []))
          .catch(err => console.error("Lỗi lấy danh sách quận/huyện:", err));
      }
    }
  }, [selectedCityName, cities]);

  // Fetch Wards when District changes
  useEffect(() => {
    if (selectedDistrictName && districts.length > 0) {
      const dist = districts.find(d => d.name === selectedDistrictName);
      if (dist) {
        fetch(`https://provinces.open-api.vn/api/d/${dist.code}?depth=2`)
          .then(res => res.json())
          .then(data => setWards(data.wards || []))
          .catch(err => console.error("Lỗi lấy danh sách phường/xã:", err));
      }
    }
  }, [selectedDistrictName, districts]);

  // Fetch room data if editing
  useEffect(() => {
    if (isEditMode) {
      const fetchRoom = async () => {
        try {
          const res = await getRoomById(id);
          const roomData = res.data;
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
            amenities: roomData.amenities || [],
            description: roomData.description || '',
          });
          setPreviewUrl(roomData.thumbnail);
        } catch (err) {
          toast.error("Không thể tải thông tin phòng");
          navigate('/master/rooms');
        }
      };
      fetchRoom();
    }
  }, [id, isEditMode, reset, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageError("");
    }
  };

  const onSubmit = async (data) => {
    if (!isEditMode && !imageFile) {
      setImageError("Vui lòng tải ảnh phòng.");
      return;
    }

    try {
      const formDataToSubmit = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'amenities') {
          data[key].forEach(val => formDataToSubmit.append('amenities[]', val));
        } else {
          formDataToSubmit.append(key, data[key]);
        }
      });
      formDataToSubmit.append('masterId', userProfile?.id || '');

      if (imageFile) {
        formDataToSubmit.append('image', imageFile);
      }

      if (isEditMode) {
        await updateRoomApi(id, formDataToSubmit);
        toast.success("Cập nhật thông tin phòng thành công!");
      } else {
        await createRoom(formDataToSubmit);
        toast.success("Đã thêm phòng mới thành công!");
      }
      navigate('/master/rooms');
    } catch (err) {
      toast.error("Lỗi: " + (err.response?.data?.error || err.message));
    }
  };


  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <FormHeader
        isEditMode={isEditMode}
        onBack={() => navigate('/master/rooms')}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {/* Main Info Card */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-12">
              <RoomVisuals
                register={register}
                previewUrl={previewUrl}
                handleFileChange={handleFileChange}
                imageError={imageError}
              />

              <RoomBasicDetails
                register={register}
                errors={errors}
                cities={cities}
                districts={districts}
                wards={wards}
              />
            </div>
          </div>
        </div>

        <AmenitiesSection
          currentAmenities={currentAmenities}
          toggleAmenity={toggleAmenity}
        />

        <DescriptionSection
          register={register}
        />

        <FormActions
          isEditMode={isEditMode}
          isSubmitting={isSubmitting}
          onCancel={() => navigate('/master/rooms')}
        />
      </form>
    </div>
  );
}
