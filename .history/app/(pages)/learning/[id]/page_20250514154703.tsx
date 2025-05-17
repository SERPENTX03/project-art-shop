import { DataLearning } from "@/data/DataLearning";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const LeaningIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const learning = DataLearning.find((l) => l.id === parseInt(id));

  if (!learning) {
    return (
      <div className="text-center mt-20 text-red-500 text-xl">
        ไม่พบข้อมูล Learning
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <Breadcrumb className="mb-20 ">
        <BreadcrumbList className="text-lg">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/learning">Learning</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{learning.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row items-center gap-8 ">
        {/* Image Section */}
        <div className={`${learning.widthImage} flex justify-center`}>
          <Image
            src={learning.img}
            alt="Learning Image"
            width={500}
            height={500}
            // width={learning.imgWidth}
            // height={learning.imgHeight}
            className="rounded-xl shadow-lg"
          />
        </div>

        {/* Description Section */}
        <div
          className={`flex justify-center ${learning.widthDescription} text-lg whitespace-pre-line ${learning.lineHeight} text-gray-700`}
        >
          {learning.description}
        </div>
      </div>
    </div>
  );
};

export default LeaningIdPage;
