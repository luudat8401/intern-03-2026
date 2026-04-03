import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoomById, getRandomRooms } from '../../../api/room.api';
import toast from 'react-hot-toast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Sub-components
import RoomHero from './components/RoomHero';
import RoomHeader from './components/RoomHeader';
import RoomAttributes from './components/RoomAttributes';
import RoomAmenities from './components/RoomAmenities';
import RoomDescription from './components/RoomDescription';
import RoomRecommendations from './components/RoomRecommendations';
import ContractModal from '../../../components/Common/Contracts/ContractModal';

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async (city, excludeId) => {
      if (!city) return;
      try {
        const recRes = await getRandomRooms({
          city,
          excludeId
        });
        setRecommendations(recRes.data || []);
      } catch (recErr) {
        console.error("Failed to load recommendations:", recErr);
      }
    };

    const fetchRoomData = async () => {
      setLoading(true);
      try {
        const res = await getRoomById(id);
        const roomData = res.data;
        setRoom(roomData);

        // Fetch recommendations SEPARATELY
        fetchRecommendations(roomData.city, id);
      } catch (err) {
        console.error("Main fetch error:", err);
        toast.error("Không thể tải thông tin phòng");
        navigate('/user/rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const openModal = () => {
    console.log("🟢 [RoomDetail] Opening Rental Modal for ID:", id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("🔴 [RoomDetail] Closing Rental Modal");
    setIsModalOpen(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Đang tải dữ liệu...</p>
      </div>
    </div>
  );

  if (!room) return null;

  return (
    <div className="max-w-[1400px] mx-auto pb-20 animate-in fade-in duration-700">
      {/* Back Button */}
      <button
        onClick={() => navigate('/user/rooms')}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-all group"
      >
        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all">
          <ArrowBackIcon fontSize="small" />
        </div>
        <span className="text-xs uppercase tracking-widest leading-none">Danh sách phòng</span>
      </button>

      {/* 1. Hero Section (Image + Pricing Card) */}
      <RoomHero
        room={room}
        onRentClick={openModal}
      />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 pt-10 animate-in slide-in-from-bottom duration-1000">

        {/* Left Column */}
        <div className="space-y-12">
          {/* 2. Title & Location Header */}
          <RoomHeader room={room} />

          {/* 3. Common Attributes (Area, Capacity, etc.) */}
          <RoomAttributes room={room} />

          {/* 4. Detailed Amenities Grid */}
          <RoomAmenities amenities={room.amenities} />

          {/* 5. Detailed Description Box */}
          <RoomDescription description={room.description} />

          {/* 6. Live Recommendations */}
          <RoomRecommendations recommendations={recommendations} cityName={room.city} />
        </div>

        {/* Empty Right Column (Layout Alignment) */}
        <div className="hidden lg:block"></div>
      </div>

      {/* Modal Popup Component */}
      <ContractModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        room={room}
        role="user"
        onSuccess={() => navigate('/user/contracts')}
      />
    </div>
  );
}
