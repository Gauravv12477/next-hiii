// Heading.tsx
"use client"

import React from "react";

const Heading = ({ title, cn }: { title: string; cn?: string }) => {
  return <div className={`text-3xl font-medium ${cn}`}>{title}</div>;
};

export default Heading;
