const ImageList = (props) => {
  const { images, size } = props;
  return (
    <div className="sub__container">
      <h2>Total Size: {size / 1000000} MB</h2>
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
  );
};

export default ImageList;
