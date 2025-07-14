"use server";

import prisma from "@/config/db";
import { auth } from "@clerk/nextjs/server";

type CreatePollInput = {
  content: string;
  questions: {
    question: string;
    options: string[];
  }[];
};

export const createPollPost = async ({
  content,
  questions,
}: CreatePollInput) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // ตรวจสอบว่ามีคำถามอย่างน้อย 1 คำถาม และแต่ละคำถามมีตัวเลือกอย่างน้อย 2 ตัว
  if (
    !questions.length ||
    questions.some((q) => !q.question.trim() || q.options.length < 2)
  ) {
    throw new Error("กรุณาระบุคำถามและตัวเลือกให้ครบ");
  }

  // หา artist profile จาก userId
  const artist = await prisma.artistProfile.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (!artist) throw new Error("ไม่พบโปรไฟล์ศิลปิน");

  // สร้างโพสต์และคำถาม + ตัวเลือก
  await prisma.post.create({
    data: {
      content,
      artistId: artist.id,
      PollQuestion: {
        create: questions.map((q) => ({
          question: q.question,
          options: {
            create: q.options.map((text) => ({ text })),
          },
        })),
      },
    },
  });
};

export const togglePollVote = async (optionId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // หาว่าผู้ใช้เคยโหวตในคำถามนี้หรือยัง
  const option = await prisma.pollOption.findUnique({
    where: { id: optionId },
    include: { question: true },
  });

  if (!option) throw new Error("Option not found");

  const existing = await prisma.pollVote.findFirst({
    where: {
      userId,
      option: {
        questionId: option.questionId,
      },
    },
    include: { option: true },
  });

  if (existing) {
    // ลบโหวตเดิม
    await prisma.pollVote.delete({
      where: { id: existing.id },
    });
  }

  // ถ้าเป็น option เดิม ไม่ต้อง vote ซ้ำ
  if (existing?.optionId !== optionId) {
    await prisma.pollVote.create({
      data: { userId, optionId },
    });
  }

  return { success: true };
};
