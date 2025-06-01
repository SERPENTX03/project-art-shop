type Params = Promise<{ artistId: string }>;

const ArtistByParam = async ({ params }: { params: Params }) => {
  const { artistId } = await params;
  console.log(artistId);
  return <div>ArtistByParam</div>;
};
export default ArtistByParam;
