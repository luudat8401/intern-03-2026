import { useState, useEffect } from "react";
import ContractTable from "./components/ContractTable";
import { getContracts, deleteContractApi } from "../../../api/contract.api";
import "./contracts.css";

export default function Contracts() {
    const [contracts, setContracts] = useState([]);
    const fetchContracts = async () => {
        try {
            const res = await getContracts();
            setContracts(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchContracts();
    }, []);
    const deleteContract = async (id) => {
        try {
            await deleteContractApi(id);
            setContracts(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className="contracts-page">
            <h2>Quản lý hợp đồng</h2>
            <ContractTable
                contracts={contracts}
                deleteContract={deleteContract}
            />
        </div>
    );
}
