const { cloudinary } = require("../config/cloudinary");

const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return;
  try {
    const arr = imageUrl.split("/");
    const uploadIndex = arr.indexOf("upload");
    if (uploadIndex !== -1) {
      const pathArr = arr.slice(uploadIndex + 2);
      const fullPath = pathArr.join("/");
      const publicId = fullPath.substring(0, fullPath.lastIndexOf("."));

      await cloudinary.uploader.destroy(publicId);
      console.log(`[Cloudinary Helper] Đã xóa ảnh: ${publicId}`);
    }
  } catch (err) {
    console.error("[Cloudinary Helper Error] Lỗi dọn rác ảnh:", err.message);
  }
};

module.exports = {
  deleteImageFromCloudinary,
};
