import { useState } from "react";
import exifr from "exifr";
import Compressor from "compressorjs";

import ImageList from "../../components/ImageList";

const One = () => {
  const [images, setImages] = useState([]);
  const [compressedImages, setCompressedImages] = useState([]);

  const [size, setSize] = useState({ normal: 0, compressed: 0 });

  const compressImage = (file, callback) => {
    new Compressor(file, {
      quality: 0.5,
      maxWidth: 1280,
      // height will auto reduce keeping the aspect ratio
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
      // Getting Image location meta data
      const location = await exifr.gps(files[i]);

      // Compressing
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

        // Getting total size
        setSize((s) => ({
          normal: s.normal + files[i].size,
          compressed: s.compressed + myCompressedFile.size,
        }));
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
    <>
      <form>
        <input type="file" multiple onChange={handleFileChange} />
      </form>
      <div className="main__container">
        <ImageList images={images} size={size.normal} />
        <ImageList images={compressedImages} size={size.compressed} />
      </div>
    </>
  );
};

export default One;
