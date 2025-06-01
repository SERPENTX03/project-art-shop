"use server";
import prisma from "@/config/db";
import { auth } from "@clerk/nextjs/server";
import cloudinary from "@/lib/cloudinary";

export const createPost = async (formData: FormData) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const artist = await prisma.artistProfile.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (!artist) throw new Error("Artist profile not found");

  const content = formData.get("content") as string;
  const files = formData.getAll("images") as File[];

  const urls: string[] = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "artist-posts",
              transformation: [{ width: 800, crop: "limit" }],
            },
            (err, result) => {
              if (err || !result) return reject(err);
              resolve(result as { secure_url: string });
            }
          )
          .end(buffer);
      }
    );

    urls.push(result.secure_url);
  }

  await prisma.post.create({
    data: {
      content,
      images: urls,
      artistId: artist.id,
    },
  });

  return { success: true, message: "สร้างโพสต์สำเร็จ" };
};
export const fetchPostsByArtist = async (artistId: string) => {
  return await prisma.post.findMany({
    where: { artistId },
    orderBy: { createdAt: "asc" },
    include: {
      Reaction: {
        select: {
          emoji: true,
        },
      },
      PollQuestion: {
        include: {
          options: {
            include: {
              votes: true, // รวมคนโหวตทั้งหมดในแต่ละ option
            },
          },
        },
      },
    },
  });
};

export const getPostsByArtist = async (artistId: string) => {
  const artist = await prisma.artistProfile.findUnique({
    where: { id: artistId },
    include: {
      Post: {
        orderBy: { createdAt: "asc" },
        include: {
          Reaction: { select: { emoji: true } },
          PollQuestion: {
            include: {
              options: {
                include: {
                  votes: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return artist?.Post ?? [];
};
