import { useEffect, useState } from "react";
import MasterTable from "./components/MasterTable";
import "./master.css";

import { getMasters, deleteMaster as deleteMasterApi } from "../../../api/master.api";

export default function Masters() {
  const [masters, setMasters] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMasters();
        setMasters(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);
  const deleteMaster = async (id) => {
    try {
      await deleteMasterApi(id);
      setMasters((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <h2>Quản lý chủ trọ</h2>
      <MasterTable
        masters={masters}
        deleteMaster={deleteMaster}
        onEdit={(master) => setEditingMaster(master)}
      />
    </div>
  );
}