import { createGallery, FormState } from "@/actions/gallery";
import { useActionState } from "react";
import CreateGalleryClient from "./CreateGalleryClient";

export default function CreateGalleryForm() {
  const initialState: FormState = { success: false };
  const [state, formAction] = useActionState(createGallery, initialState);

  return (
    <form
      action={formAction}
      className="mt-16 space-y-6 p-6 max-w-xl mx-auto bg-white rounded-xl shadow"
    >
      <CreateGalleryClient serverState={state} />
    </form>
  );
}
