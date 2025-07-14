"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createPollPost } from "@/actions/poll";
import { Button } from "@/components/ui/button";

export default function CreatePollDialog() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", ""],
    },
  ]);
  const router = useRouter();

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { question: "", options: ["", ""] }]);
  };

  const updateQuestion = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    try {
      await createPollPost({ content, questions });
      toast.success("สร้างโพสต์โหวตสำเร็จ");
      setOpen(false);
      setContent("");
      setQuestions([{ question: "", options: ["", ""] }]);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="">โพสต์แบบโหวต</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <div className="space-y-4">
          <DialogTitle className="text-xl font-semibold">
            สร้างโพสต์แบบโหวต
          </DialogTitle>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="เนื้อหาหลักของโพสต์ (optional)"
            className="w-full border p-2 rounded"
          />

          {questions.map((q, qi) => (
            <div key={qi} className="space-y-2">
              <input
                value={q.question}
                onChange={(e) => updateQuestion(qi, e.target.value)}
                placeholder={`คำถามที่ ${qi + 1}`}
                className="w-full border p-2 rounded"
              />
              {q.options.map((opt, oi) => (
                <input
                  key={oi}
                  value={opt}
                  onChange={(e) => updateOption(qi, oi, e.target.value)}
                  placeholder={`ตัวเลือกที่ ${oi + 1}`}
                  className="w-full border p-2 rounded"
                />
              ))}
              <button
                onClick={() => addOption(qi)}
                className="text-sm text-blue-500 hover:underline"
              >
                + เพิ่มตัวเลือก
              </button>
            </div>
          ))}

          <button
            onClick={addQuestion}
            className="text-sm text-primary hover:underline"
          >
            + เพิ่มคำถาม
          </button>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-primary text-white px-4 py-1 rounded"
            >
              สร้างโพสต์
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
