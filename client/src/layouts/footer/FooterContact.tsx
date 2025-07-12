import React from "react";

const FooterContact: React.FC = () => (
  <div>
    <h3 className="font-semibold mb-2 text-cyan-700">Contact</h3>
    <ul className="space-y-2 text-gray-500 text-sm">
      <li>
        <span className="font-medium">Email:</span> info@sevsea.com
      </li>
      <li>
        <span className="font-medium">Phone:</span> +1 (555) 123-4567
      </li>
      <li>
        <span className="font-medium">Address:</span> 123 Ocean Drive, Beach City
      </li>
    </ul>
  </div>
);

export default FooterContact; 