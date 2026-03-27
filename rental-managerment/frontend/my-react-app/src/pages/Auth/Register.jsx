import { useNavigate, Link } from "react-router-dom";
import { register as registerUser } from "../../service/authService";
import "./auth.css";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormField from "../../components/Common/FormField";
import { useState } from "react";

const schema = yup.object({
  username: yup.string().required('Vui lòng nhập tên').trim().matches(/^\S+$/, 'Tên không được chứa khoảng trắng').min(6, 'Tên ít nhất 6 ký tự').max(20, 'Tên nhiều nhất 20 ký tự'),
  password: yup.string().required('Vui lòng nhập mật khẩu').trim().matches(/^\S+$/, 'Mật khẩu không được chứa khoảng trắng').min(6, 'Mật khẩu ít nhất 6 ký tự').max(20, 'Mật khẩu nhiều nhất 20 ký tự'),
  role: yup.string().required('Vui lòng chọn vai trò'),
}).required();

export default function Register() {
  const [generalError, setGeneralError] = useState("");
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
      role: "user",
    },
  });
  const navigate = useNavigate();

  const onInvalid = (errors) => {
    setGeneralError("Thông tin đăng ký không hợp lệ.");
    // Chỉ reset giá trị của các trường bị lỗi
    Object.keys(errors).forEach((field) => {
      setValue(field, ""); // Xóa trắng nội dung của ô bị lỗi
    });
  };

  const onSubmit = async (data) => {
    try {
      setGeneralError("");
      await registerUser(data.username, data.password, data.role);
      alert("Đăng ký thành công! Vui lòng Đăng nhập.");
      navigate("/login");
    } catch (error) {
      setGeneralError("Đăng ký thất bại! Tên đăng nhập có thể đã tồn tại.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Tạo tài khoản</h2>
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

          <FormField
            name="role"
            type="select"
            register={register}
            error={errors.role}
            options={[
              { value: "user", label: "Khách thuê phòng" },
              { value: "master", label: "Chủ nhà trọ" }
            ]}
          />

          <button className="auth-button" type="submit">
            Tạo tài khoản
          </button>
        </form>
        <p className="auth-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
