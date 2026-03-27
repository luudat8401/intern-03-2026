import React from "react";

const FormField = ({ label, name, type = "text", register, error, options, placeholder }) => {
  return (
    <div className="input-group">
      {label && <label htmlFor={name}>{label}</label>}
      {type === "select" ? (
        <select id={name} className={`auth-input ${error ? "input-error" : ""}`} {...register(name)}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          className={`auth-input ${error ? "input-error" : ""}`}
          placeholder={placeholder}
          {...register(name)}
        />
      )}
      {error && <span className="error-text">{error.message}</span>}
    </div>
  );
};

export default FormField;
