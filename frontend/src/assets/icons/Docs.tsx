import * as React from "react";

const Icon = ({
  size = 24,
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
    <path d="M3 19.003a9 9 0 0 1 9 0 9 9 0 0 1 9 0" />
    <path d="M3 6.003a9 9 0 0 1 9 0 9 9 0 0 1 9 0" />
    <path d="M3 6v13" />
    <path d="M12 6v13" />
    <path d="M21 6v13" />
  </svg>
);

export default Icon;
