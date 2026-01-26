export default function SearchHeroSection({ query }: { query: string }) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80')`,
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-(--color-header2) mb-6 tracking-wide text-balance font-semibold">
          {`Search Results for: ${query}`}
        </h1>
      </div>
    </section>
  );
}
