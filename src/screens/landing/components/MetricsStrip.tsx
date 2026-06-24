const proofPoints = [
  {
    label: "Files",
    value: "PDF, Word, text, Markdown, PNG, and JPG",
  },
  {
    label: "Context",
    value: "Classification and summary before chat",
  },
  {
    label: "Answers",
    value: "Streaming responses with copy and retry actions",
  },
  {
    label: "Memory",
    value: "Previous messages return with the document",
  },
];

export function MetricsStrip() {
  return (
    <section className="border-y border-line bg-ink px-4 py-12 text-inverse sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-inverse/55">
              Product proof
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight">
              The document remains the center of the experience.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-inverse/62">
            Everything visible in the product points back to the selected file:
            its status, its classification, its chat, and its history.
          </p>
        </div>

        <div className="grid border-y border-inverse/15 md:grid-cols-4">
          {proofPoints.map((point, index) => (
            <div
              className="border-b border-inverse/15 py-5 md:border-b-0 md:border-r md:px-5 md:last:border-r-0"
              key={point.label}
            >
              <p className="text-sm font-semibold text-inverse/45">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-lg font-semibold">{point.label}</h3>
              <p className="mt-2 text-sm leading-6 text-inverse/68">
                {point.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
