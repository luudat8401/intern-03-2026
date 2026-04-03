import React from 'react';

// Amenity Icons Mapping
import AcUnitIcon from '@mui/icons-material/AcUnit';
import KitchenIcon from '@mui/icons-material/Kitchen';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import BedIcon from '@mui/icons-material/Bed';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import LockIcon from '@mui/icons-material/Lock';
import VideocamIcon from '@mui/icons-material/Videocam';
import WifiIcon from '@mui/icons-material/Wifi';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ElevatorIcon from '@mui/icons-material/Elevator';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

const AMENITY_ICONS = {
  ac: { label: 'Điều hòa', icon: <AcUnitIcon fontSize="small" /> },
  fridge: { label: 'Tủ lạnh', icon: <KitchenIcon fontSize="small" /> },
  washing_machine: { label: 'Máy giặt', icon: <LocalLaundryServiceIcon fontSize="small" /> },
  bed: { label: 'Giường & Nệm', icon: <BedIcon fontSize="small" /> },
  private_entrance: { label: 'Lối đi riêng', icon: <MeetingRoomIcon fontSize="small" /> },
  parking: { label: 'Bãi đậu xe', icon: <LocalParkingIcon fontSize="small" /> },
  smart_lock: { label: 'Khóa thông minh', icon: <LockIcon fontSize="small" /> },
  camera: { label: 'Camera an ninh', icon: <VideocamIcon fontSize="small" /> },
  wifi: { label: 'Wi-Fi tốc độ cao', icon: <WifiIcon fontSize="small" /> },
  kitchen: { label: 'Khu vực bếp riêng', icon: <RestaurantIcon fontSize="small" /> },
  elevator: { label: 'Thang máy', icon: <ElevatorIcon fontSize="small" /> },
  cleaning: { label: 'Dịch vụ vệ sinh', icon: <CleaningServicesIcon fontSize="small" /> },
};

const RoomAmenities = ({ amenities = [] }) => {
  return (
    <div className="space-y-8 bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-50 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Tiện ích phòng trọ</h3>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          {amenities?.length || 0} / {Object.keys(AMENITY_ICONS).length}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
        {Object.keys(AMENITY_ICONS).map(key => {
          const item = AMENITY_ICONS[key];
          const hasAmenity = amenities && amenities.includes(key);
          return (
            <div
              key={key}
              className={`flex items-center gap-4 transition-all duration-300 ${hasAmenity ? 'opacity-100' : 'opacity-20'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hasAmenity ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-300'}`}>
                {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
              </div>
              <span className={`text-[13px] font-bold ${!hasAmenity && 'line-through'}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomAmenities;
