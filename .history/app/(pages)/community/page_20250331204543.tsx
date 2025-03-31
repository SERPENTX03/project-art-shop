import CommuMainContainer from "@/components/community/CommuMainContainer";
import { Suspense } from "react";

const CommunityPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CommuMainContainer />
    </Suspense>
  );
};
export default CommunityPage;
