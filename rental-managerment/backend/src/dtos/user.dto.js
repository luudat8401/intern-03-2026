const yup = require("yup");

const userDto = {
  profileSchema: async (data) => {
    const schema = yup.object().shape({
      name: yup.string().nullable(),
      phone: yup.string().matches(/^[0-9]+$/, "Số điện thoại chỉ bao gồm số").nullable(),
      email: yup.string().email("Định dạng email không hợp lệ").nullable(),
      address: yup.string().nullable(),
    }).noUnknown().stripUnknown();

    return await schema.validate(data, { abortEarly: false });
  },
};

module.exports = userDto;
