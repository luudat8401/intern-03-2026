import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { login as loginUser, loginWithGoogle } from "../../service/authService";
import { useAuth } from "../../context/AuthContext";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema as schema } from '../../schemas/auth.schema';

export default function Login() {
  const [generalError, setGeneralError] = useState("");
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    reValidateMode: 'onBlur',
    defaultValues: { username: "", password: "", role: "master" },
  });
  const selectedRole = watch("role");
  const navigate = useNavigate();
  const { loginContext } = useAuth();

  const onSubmit = async (data) => {
    try {
      setGeneralError("");
      const resp = await loginUser(data.username, data.password, data.role);
      await loginContext(resp);
      navigate("/");
    } catch (error) {
      setGeneralError("Sai tài khoản hoặc mật khẩu");
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      setGeneralError("");
      const credential = response.credential;
      const resp = await loginWithGoogle(credential);
      await loginContext(resp);
      navigate("/");
    } catch (error) {
      setGeneralError(error.response?.data?.error || "Đăng nhập bằng Google bị từ chối.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* LEFT PANEL - Hidden on mobile */}
      <div
        className="hidden md:flex flex-1 flex-col justify-center px-12 lg:px-24 text-white relative bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.4)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80')` }}
      >
        <div className="max-w-xl animate-in slide-in-from-left duration-1000">
          <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase mb-6 leading-tight">
            RENTAL <span className="text-emerald-500 decoration-8">HUB</span>
          </h1>
          <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-md">
            Hệ sinh thái thông minh kết nối chủ nhà và người thuê, mang lại sự minh bạch, an toàn và tiện lợi trong mọi giao dịch quản lý trọ.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - Login Form */}
      <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center relative p-8">
        <div className="w-full max-w-[400px] animate-in zoom-in duration-700">

          <div className="mb-10">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Xin Chào !!!</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest opacity-60 italic">Quản lý thuê và cho thuê trọ trực tuyến</p>
          </div>

          {generalError && (
            <div className="bg-rose-500/10 border border-rose-500 text-rose-500 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest mb-6">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Vai trò đăng nhập</label>
              <select
                {...register("role")}
                className={`w-full bg-slate-900 border ${errors.role ? 'border-rose-500' : 'border-slate-800 focus:border-emerald-500'} rounded-2xl py-4 px-6 text-white text-sm font-bold outline-none transition-all appearance-none cursor-pointer`}
              >
                <option value="user" className="bg-slate-950">Người Thuê Phòng</option>
                <option value="master" className="bg-slate-950">Chủ Nhà (Master)</option>
                <option value="admin" className="bg-slate-950">Quản Trị Viên (Admin)</option>
              </select>
              {errors.role && <p className="text-rose-500 text-[9px] font-black uppercase tracking-widest ml-1 mt-1">{errors.role.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tên đăng nhập</label>
              <input
                {...register("username")}
                className={`w-full bg-slate-900 border ${errors.username ? 'border-rose-500' : 'border-slate-800 focus:border-emerald-500'} rounded-2xl py-4 px-6 text-white text-sm font-bold outline-none transition-all placeholder:text-slate-600`}
                placeholder="Số điện thoại hoặc Username"
              />
              {errors.username && <p className="text-rose-500 text-[9px] font-black uppercase tracking-widest ml-1 mt-1">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mật khẩu</label>
              <input
                {...register("password")}
                type="password"
                className={`w-full bg-slate-900 border ${errors.password ? 'border-rose-500' : 'border-slate-800 focus:border-emerald-500'} rounded-2xl py-4 px-6 text-white text-sm font-bold outline-none transition-all placeholder:text-slate-600`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-rose-500 text-[9px] font-black uppercase tracking-widest ml-1 mt-1">{errors.password.message}</p>}
            </div>

            <button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Đăng nhập ngay
            </button>

            {/* <div className="flex items-center gap-4 my-8">
              <div className="h-px bg-slate-800 flex-1"></div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Hoặc với</span>
              <div className="h-px bg-slate-800 flex-1"></div>
            </div> */}

            {/* <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setGeneralError('Lỗi kết nối tới Server của Google.')}
                theme="filled_black"
                shape="rectangular"
                width="100%"
              />
            </div> */}

            <div className="text-center text-slate-400 font-bold text-xs mt-10 flex flex-col gap-2">
              <span>
                Bạn chưa có tài khoản?{" "}
                <RouterLink to="/register" className="text-emerald-500 hover:underline">Đăng ký ngay</RouterLink>
              </span>
              <RouterLink to="#" className="text-slate-600 hover:text-emerald-500 transition-colors">
                Quên mật khẩu?
              </RouterLink>
            </div>
          </form>
        </div>

        {/* Footer info absolute */}
        <div className="absolute bottom-8 flex gap-6 text-[9px] font-black text-slate-600 uppercase tracking-widest">
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Trợ giúp</span>
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Điều khoản</span>
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Bảo mật</span>
        </div>
      </div>
    </div>
  );
}