import React from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
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

const AMENITY_LIST = [
  { id: 'ac', label: 'Điều hòa', icon: <AcUnitIcon fontSize="small" /> },
  { id: 'fridge', label: 'Tủ lạnh', icon: <KitchenIcon fontSize="small" /> },
  { id: 'washing_machine', label: 'Máy giặt', icon: <LocalLaundryServiceIcon fontSize="small" /> },
  { id: 'bed', label: 'Giường & Nệm', icon: <BedIcon fontSize="small" /> },
  { id: 'private_entrance', label: 'Lối đi riêng', icon: <MeetingRoomIcon fontSize="small" /> },
  { id: 'parking', label: 'Bãi đậu xe', icon: <LocalParkingIcon fontSize="small" /> },
  { id: 'smart_lock', label: 'Khóa thông minh', icon: <LockIcon fontSize="small" /> },
  { id: 'camera', label: 'Camera an ninh', icon: <VideocamIcon fontSize="small" /> },
  { id: 'wifi', label: 'Wi-Fi tốc độ cao', icon: <WifiIcon fontSize="small" /> },
  { id: 'kitchen', label: 'Khu vực bếp riêng', icon: <RestaurantIcon fontSize="small" /> },
  { id: 'elevator', label: 'Thang máy', icon: <ElevatorIcon fontSize="small" /> },
  { id: 'cleaning', label: 'Dịch vụ vệ sinh', icon: <CleaningServicesIcon fontSize="small" /> },
];

export default function AmenitiesSection({ currentAmenities, toggleAmenity }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
          <CheckCircleOutlineIcon fontSize="small" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">Tiện ích</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {AMENITY_LIST.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleAmenity(item.id)}
            className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all cursor-pointer group
              ${currentAmenities.includes(item.id)
                ? 'bg-blue-50 border-blue-200 shadow-md shadow-blue-500/5'
                : 'bg-white border-slate-50 hover:border-slate-200 hocus:shadow-lg'}`}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all
              ${currentAmenities.includes(item.id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200 group-hover:border-blue-400'}`}>
              {currentAmenities.includes(item.id) && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            <div className={`${currentAmenities.includes(item.id) ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`}>
              {item.icon}
            </div>
            <span className={`text-sm font-bold transition-all ${currentAmenities.includes(item.id) ? 'text-blue-900' : 'text-slate-600'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
