import { useNavigate, Link } from "react-router-dom";
import { login as loginUser } from "../../service/authService";
import { useAuth } from "../../context/AuthContext";
import "./auth.css";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormField from "../../components/Common/FormField";
import { useState } from "react";

const schema = yup.object({
  username: yup.
    string().
    required('Vui lòng nhập tên đăng nhập').
    trim().
    matches(/^\S+$/, 'Tên đăng nhập không được chứa khoảng trắng').
    min(6, 'Tên đăng nhập ít nhất 6 ký tự').
    max(20, 'Tên đăng nhập nhiều nhất 20 ký tự'),
  password: yup.
    string().
    required('Vui lòng nhập mật khẩu').
    trim().
    matches(/^\S+$/, 'Mật khẩu không được chứa khoảng trắng').
    min(6, 'Mật khẩu ít nhất 6 ký tự').
    max(20, 'Mật khẩu nhiều nhất 20 ký tự'),
}).required();

export default function Login() {
  const [generalError, setGeneralError] = useState("");
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const { loginContext } = useAuth();

  const onInvalid = (errors) => {
    setGeneralError("Wrong username/email or password");
    Object.keys(errors).forEach((field) => {
      setValue(field, "");
    });
  };

  const onSubmit = async (data) => {
    try {
      setGeneralError("");
      const resp = await loginUser(data.username, data.password);
      await loginContext(resp);
      navigate("/");
    } catch (error) {
      setGeneralError("Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Đăng nhập</h2>
        {generalError && <div className="form-general-error">{generalError}</div>}
        <form className="auth-form" onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <FormField
            name="username"
            placeholder="Tên người dùng hoặc email"
            register={register}
            error={errors.username}
          />
          <FormField
            name="password"
            type="password"
            placeholder="Mật khẩu"
            register={register}
            error={errors.password}
          />
          <button className="auth-button" type="submit">
            Đăng nhập
          </button>
        </form>
        <p className="auth-link">
          Chưa có tài khoản? <Link to="/register">Tạo tài khoản</Link>
        </p>
      </div>
    </div>
  );
}