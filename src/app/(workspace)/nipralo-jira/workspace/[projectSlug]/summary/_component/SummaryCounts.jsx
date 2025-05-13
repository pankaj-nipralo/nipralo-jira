"use client";

import CountCard from "./CountCard";

const SummaryCounts = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((card, index) => (
        <CountCard key={index} card={card} />
      ))}
    </div>
  );
};

export default SummaryCounts;
