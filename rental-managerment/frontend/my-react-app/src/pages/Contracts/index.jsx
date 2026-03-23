import { useState, useEffect } from "react";
import ContractStats from "./components/ContractStats";
import ContractForm from "./components/ContractForm";
import ContractTable from "./components/ContractTable";
import { getContracts, createContract, updateContractApi, deleteContractApi } from "../../api/contract.api";
import "./contracts.css";

export default function Contracts() {
    const [contracts, setContracts] = useState([]);
    const [editingContract, setEditingContract] = useState(null);

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

    const addContract = async (data) => {
        try {
            const res = await createContract(data);
            setContracts(prev => [...prev, res.data]);
        } catch (err) {
            console.error(err);
            alert("Tạo hợp đồng thất bại! Kiểm tra lại dữ liệu.");
        }
    };

    const updateContract = async (id, data) => {
        try {
            await updateContractApi(id, data);
            fetchContracts();
            setEditingContract(null);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteContract = async (id) => {
        try {
            await deleteContractApi(id);
            setContracts(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="contracts-page">

            <h2>Quản lý hợp đồng</h2>

            <ContractStats contracts={contracts} />

            <ContractForm
                addContract={addContract}
                editingContract={editingContract}
                updateContract={updateContract}
                cancelEdit={() => setEditingContract(null)}
            />

            <ContractTable
                contracts={contracts}
                deleteContract={deleteContract}
                onEdit={(contract) => setEditingContract(contract)}
            />

        </div>
    );
}