"use client";

import React from "react";
import { History } from "lucide-react";

const CountCard = ({ card }) => {
  const Icon = card.icon || History;

  return (
    <article className="p-4 rounded-2xl justify-self-center border border-gray-200 bg-white shadow-sm hover:shadow-md transition w-full max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <Icon className="text-green-600 w-5 h-5" />
        <p className="text-xs text-gray-400">Last 7 days</p>
      </div>
      <h3 className="text-3xl font-bold text-gray-800">{card.number}</h3>
      <p className="text-sm text-gray-600 mt-1">{card.title}</p>
    </article>
  );
};

export default CountCard;
