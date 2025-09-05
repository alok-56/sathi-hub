import { API_BASE_URL, getAuthToken } from "./api";

export const SingleFileUpload = async (file: any) => {
  const token = getAuthToken();

  try {
    const formData = new FormData();
    formData.append("Image", file);

    const response = await fetch(`${API_BASE_URL}/file/single`, {
      method: "POST",
      body: formData,
      headers: {
        token: token,
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Upload failed:", error);
    return { error: error.message };
  }
};

export const DeleteFileUpload = async (fileUrl: any) => {
  const token = getAuthToken();

  try {
    const response = await fetch(
      `${API_BASE_URL}/file/delete?imageUrl=${encodeURIComponent(fileUrl)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Delete failed:", error);
    return { error: error.message };
  }
};
