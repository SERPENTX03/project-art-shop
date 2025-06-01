import { fetchArtist } from "@/actions/artist";
import CommuMainContainer from "@/components/community/CommuMainContainer";
import Navbar from "@/components/navbar/Navbar";

const CommunityPage = async () => {
  const artist = await fetchArtist();
  return (
    <>
      <Navbar />
      <CommuMainContainer artist={artist} />;
    </>
  );
};
export default CommunityPage;
