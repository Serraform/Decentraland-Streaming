import * as React from "react";

const Icon = ({
  size = 20,
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
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

export default Icon;
