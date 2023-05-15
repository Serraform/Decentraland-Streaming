import * as React from "react";

const Icon = ({
  size = 26,
  strokeWidth = 2,
  color = "currentColor",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path  d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <path  d="M8.5 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z" />
    <path  d="M20 8v6" />
    <path  d="M23 11h-6" />
  </svg>
);

export default Icon;
