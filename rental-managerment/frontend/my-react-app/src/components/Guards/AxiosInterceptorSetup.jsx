import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";

export const AxiosInterceptor= ({children}) =>{
    const {logout} = useAuth();

    useEffect(()=>{
        const resInterceptor = axiosClient.interceptors.response.use(
            (response) =>response,
            error =>{
                if(error.response && error.response.status  ===401){
                    logout();
                    console.log(`Phien dang nhap da het han hoac tai khoan khong ton tai`)
                }
                return Promise.reject(error);
            }
        )
        return ()=>{
            axiosClient.interceptors.response.eject(resInterceptor)
        }
    },[logout]);
    return children
}