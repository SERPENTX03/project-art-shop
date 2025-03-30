const FetchGalleryById = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">{galleryId.title}</h1>
      <p className="mt-4 text-3xl text-blue-500 font-semibold">
        {galleryId.price}฿
      </p>
      <p className="mt-2 text-muted-foreground">{galleryId.description}</p>
    </div>
  );
};
export default FetchGalleryById;
