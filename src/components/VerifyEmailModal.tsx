import { Mail } from "lucide-react";

interface VerifyEmailProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  formData: { email: string };
  isSubmitting: boolean;
  handleVerifyEmail: () => void;
}

export default function VerifyEmail({
  open,
  setOpen,
  formData,
  isSubmitting,
  handleVerifyEmail,
}: VerifyEmailProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => setOpen(false)} // clicking on overlay closes modal
    >
      <div
        className="bg-white rounded-xl shadow-lg max-w-125 p-6 relative"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Mail className="h-6 w-6 text-(--color-body)" />
        </div>

        {/* Title */}
        <h2 className="text-center font-serif text-2xl text-(--color-body) font-light mb-4">
          Verify Your Email
        </h2>

        {/* Description */}
        <p className="text-center text-(--color-body) mb-4 text-sm">
          We&apos;ll send a verification link to{" "}
          <span className="text-(--color-body) italic font-bold">
            {formData.email}
          </span>
        </p>

        <p className="text-center text-(--color-body) mb-6 text-sm">
          Please check your inbox and click the link to confirm your order.
        </p>

        {/* Action Button */}
        <button
          onClick={handleVerifyEmail}
          disabled={isSubmitting}
          className="w-full bg-(--color-primary) text-(--color-header1) py-3 rounded-3xl font-medium uppercase hover:opacity-90 transition-all"
        >
          {isSubmitting ? "Sending..." : "Send Verification Link"}
        </button>

        {/* Cancel */}
        <button
          onClick={() => setOpen(false)}
          className="mt-4 w-full text-sm text-muted-foreground underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
