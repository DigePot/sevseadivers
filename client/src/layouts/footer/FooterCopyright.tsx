import React from "react";

const FooterCopyright: React.FC = () => (
  <div className="text-center text-gray-500 text-sm">
    &copy; {new Date().getFullYear()} Sevsea Divers. All rights reserved.
  </div>
);

export default FooterCopyright; 