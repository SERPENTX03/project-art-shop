import { fetchAllArtist } from "@/actions/artist";
import CommuMainContainer from "@/components/community/CommuMainContainer";
import Navbar from "@/components/navbar/Navbar";

const CommunityPage = async () => {
  const artist = await fetchAllArtist();
  return (
    <>
      <Navbar />
      <CommuMainContainer artist={artist} />;
    </>
  );
};
export default CommunityPage;
