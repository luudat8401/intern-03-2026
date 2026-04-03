import React from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const RoomHeader = ({ room }) => {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase">
        Phòng {room.roomNumber} - {room.title}
      </h1>
      <div className="flex items-center gap-2 text-slate-500">
        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
          <LocationOnIcon fontSize="small" />
        </div>
        <span className="text-sm font-bold tracking-tight">
          {room.location}, {room.ward}, {room.district}, {room.city}
        </span>
      </div>
    </div>
  );
};

export default RoomHeader;
