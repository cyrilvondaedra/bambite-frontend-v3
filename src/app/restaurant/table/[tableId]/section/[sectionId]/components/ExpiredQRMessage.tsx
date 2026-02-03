"use client";

interface ExpiredQRMessageProps {
  message: string;
}

export default function ExpiredQRMessage({ message }: ExpiredQRMessageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-background">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-destructive/20 text-destructive mb-5 md:mb-6">
          <svg
            className="w-8 h-8 md:w-10 md:h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-3 leading-tight">
          {message}
        </h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Please ask a staff member for a new QR code to continue ordering.
        </p>
      </div>
    </div>
  );
}
