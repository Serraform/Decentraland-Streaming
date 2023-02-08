const Question = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      
    >
      <path
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16.001A8 8 0 0 1 12 20Z"
        className="question-icon"
      ></path>
      <path
        d="M12 6a3.5 3.5 0 0 0-3.5 3.5 1 1 0 0 0 2 0A1.5 1.5 0 1 1 12 11a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-1.16A3.49 3.49 0 0 0 12 6Z"
        className="question-icon"
      ></path>
      <path
        d="M12 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        className="question-icon"
      ></path>
    </svg>
  );
};

export default Question;
