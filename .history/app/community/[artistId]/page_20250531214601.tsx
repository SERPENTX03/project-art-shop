import { fetchArtistById } from "@/actions/artist";

type Params = Promise<{ artistId: string }>;

const ArtistByParam = async ({ params }: { params: Params }) => {
  const { artistId } = await params;
  const artist = await fetchArtistById(artistId);
  console.log(artist);
  return <div>ArtistByParam</div>;
};
export default ArtistByParam;
