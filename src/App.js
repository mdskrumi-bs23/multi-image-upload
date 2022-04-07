import { useEffect, useState } from "react";
import exifr from "exifr";
import Compressor from "compressorjs";

import "./App.css";

function App() {
  const [images, setImages] = useState([]);
  const [compressedImages, setCompressedImages] = useState([]);

  const compressImage = (file, callback) => {
    new Compressor(file, {
      quality: 0.5,
      success(result) {
        callback(result);
      },
      error(err) {
        console.log(err.message);
      },
    });
  };

  const handleFileChange = async (evt) => {
    const files = evt.target.files;
    const len = files.length;

    for (let i = 0; i < len; i++) {
      const location = await exifr.gps(files[i]);

      compressImage(files[i], function (myCompressedFile) {
        setCompressedImages((prev) => [
          ...prev,
          {
            name: myCompressedFile.name.substring(
              0,
              files[i].name.indexOf(".")
            ),
            imageFile: myCompressedFile,
            imageUrl: URL.createObjectURL(myCompressedFile),
            location: location ? location : "Unknown",
            size: myCompressedFile.size / 1000000, // MB
          },
        ]);
      });

      setImages((prev) => [
        ...prev,
        {
          name: files[i].name.substring(0, files[i].name.indexOf(".")),
          imageFile: files[i],
          imageUrl: URL.createObjectURL(files[i]),
          location: location ? location : "Unknown",
          size: files[i].size / 1000000, // MB
        },
      ]);
    }
  };

  return (
    <div className="App">
      <form>
        <input type="file" multiple onChange={handleFileChange} />
      </form>
      <div className="main__container">
        <div className="sub__container">
          {images && images.length > 0
            ? images.map((image) => (
                <div key={image.name}>
                  <img src={image.imageUrl} alt={image.name} />
                  <h5>
                    location:{" "}
                    {typeof image.location === "object"
                      ? `Latitude: ${image.location.latitude} Longitude: ${image.location.longitude}`
                      : image.location}
                  </h5>
                  <h5>Size: {Math.ceil(image.size * 100) / 100} MB</h5>
                </div>
              ))
            : null}
        </div>

        <div className="sub__container">
          {compressedImages && compressedImages.length > 0
            ? compressedImages.map((image) => (
                <div key={image.name}>
                  <img src={image.imageUrl} alt={image.name} />
                  <h5>
                    location:{" "}
                    {typeof image.location === "object"
                      ? `Latitude: ${image.location.latitude} Longitude: ${image.location.longitude}`
                      : image.location}
                  </h5>
                  <h5>Size: {Math.ceil(image.size * 100) / 100} MB</h5>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default App;
