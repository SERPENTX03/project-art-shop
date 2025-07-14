type Props = {
  pending: boolean;
};

export default function SubmitButton({ pending }: Props) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="button-custom w-full py-3 mt-4 disabled:opacity-60"
    >
      {pending ? "Creating..." : "Create Gallery"}
    </button>
  );
}
