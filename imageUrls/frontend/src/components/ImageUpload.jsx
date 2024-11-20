import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ImageUpload.css"; // Custom CSS for styling

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all images on initial load
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:5001/images");
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setImageName(file.name);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      setMessage("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5001/images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setMessage("Image uploaded successfully!");
        setImageUrl(response.data.image.imageUrl);
        setImages([...images, response.data.image]);
      }
    } catch (error) {
      setMessage("Error uploading image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-upload-container">
      <h1>Upload an Image</h1>
      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit} className="upload-form">
        <input type="file" onChange={handleFileChange} className="file-input" />
        <button type="submit" className="upload-button" disabled={loading}>
          {loading ? "Uploading..." : "Upload Image"}
        </button>
      </form>

      {imageUrl && (
        <div className="uploaded-image">
          <h3>Uploaded Image:</h3>
          <p>{imageName}</p>
          <img src={imageUrl} alt="Uploaded" className="image-preview" />
        </div>
      )}

      <div className="uploaded-images">
        <h2>Uploaded Images</h2>
        <div className="images-list">
          {images.map((img, index) => (
            <div key={index} className="image-card">
              <img
                src={img.imageUrl}
                alt={img.imageName}
                className="image-thumbnail"
              />
              <p>{img.imageName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
