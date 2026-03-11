import { useEffect, useState } from "react";
import MasterForm from "./components/MasterForm";
import MasterTable from "./components/MasterTable";
import "./master.css";

export default function Masters() {

  const [masters, setMasters] = useState(() => {
    const saved = localStorage.getItem("masters");
    return saved ? JSON.parse(saved) : []
  })
  useEffect(()=>{
    localStorage.setItem("masters",JSON.stringify(masters))
  }, [masters])

  const addMaster = (master) => {
    setMasters([...masters, master]);
  };

  const deleteMaster = (id) => {
    setMasters(masters.filter((m) => m.id !== id));
  };

  return (
    <div>

      <h2>Quản lý chủ trọ</h2>

      <MasterForm addMaster={addMaster} />

      <MasterTable masters={masters} deleteMaster={deleteMaster} />

    </div>
  );
}