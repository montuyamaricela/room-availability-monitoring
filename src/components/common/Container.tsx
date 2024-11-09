import React from "react";

export function Container({
  id,
  children,
  // backgroundImage = "",
  position,
  styling = {},
  className = "",
}: {
  id?: string;
  children?: React.ReactNode;
  // backgroundImage?: string;
  styling?: object;
  position?: string;
  className?: string;
}) {
  let style: object = {
    // backgroundImage: `url('${backgroundImage}')`,
    backgroundPosition: position ?? "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };

  if (styling) {
    // combine the styling
    style = { ...style, ...styling };
  }

  return (
    <div className={`relative ${className}`} style={style} id={id ? id : ""}>
      <div className="container m-auto px-5 py-10 text-black sm:py-16">
        {children}
      </div>
    </div>
  );
}
