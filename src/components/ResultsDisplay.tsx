import React from "react";

interface ResultsDisplayProps {
  issues: {
    type: string;
    remedy: string;
    application: string;
    duration: string;
  }[];
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ issues }) => {
  if (!issues?.length) {
    return (
      <div className="mx-auto w-full max-w-lg rounded-xl border border-yellow-300/40 bg-yellow-50/80 p-4 text-center text-yellow-900 shadow-sm backdrop-blur-lg">
        No specific skin issues detected.
      </div>
    );
  }

  return (
    <section
      className="mx-auto w-full max-w-7xl
             grid [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]
             gap-6 auto-rows-fr"
    >
      {issues.map((issue, idx) => (
        <article
          key={idx}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-lg backdrop-blur-md transition
                     hover:scale-[1.03] hover:shadow-xl"
        >
          {/* gradient wash */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-teal-100/40 via-transparent to-emerald-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <h3 className="mb-4 text-2xl font-semibold tracking-tight text-slate-800">
            {issue.type}
          </h3>

          <ul className="space-y-2 text-[15px] leading-6 text-slate-700">
            <li>
              <span className="font-medium">Remedy:</span> {issue.remedy}
            </li>
            <li>
              <span className="font-medium">How to apply:</span>{" "}
              {issue.application}
            </li>
            <li>
              <span className="font-medium">Duration:</span> {issue.duration}
            </li>
          </ul>
        </article>
      ))}
    </section>
  );
};
