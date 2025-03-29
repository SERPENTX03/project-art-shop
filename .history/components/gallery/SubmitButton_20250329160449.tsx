"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="button-custom w-full py-3"
    >
      {pending ? "...Creating Gallery" : "Create Gallery"}
    </button>
  );
}
