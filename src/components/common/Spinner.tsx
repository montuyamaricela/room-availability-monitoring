const Spinner = () => (
  <div className="flex h-[90vh] items-center justify-center">
    <div
      style={{
        width: "3rem",
        height: "3rem",
        border: "5px solid rgba(0, 0, 0, 0.1)",
        borderTop: "5px solid #1B5E30",
        borderRadius: "50%",
        animation: "spin 0.9s linear infinite",
      }}
    ></div>
  </div>
);

export default Spinner;
