interface PostHeaderCardProps {
  title: string;
  coverUrl: string | null;
}

export default function PostHeaderCard({ title, coverUrl }: PostHeaderCardProps) {
  const hasCover = !!coverUrl;

  return (
    <div className="mb-8">
      <div
        className={[
          "relative w-full overflow-hidden rounded-2xl",
          "py-16 px-6 sm:py-20 sm:px-10",
          hasCover
            ? "bg-black"
            : "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
        ].join(" ")}
      >
        {hasCover && (
          <>
            <img
              src={coverUrl!}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
          </>
        )}

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}

