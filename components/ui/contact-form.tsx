/**
 * The HubSpotForm component is a React component that creates a HubSpot form and renders it in a
 * specified target element.
 *
 * The portalId and formId can be obtained from the form embed code within hubspot.
 *
 * @returns The component is returning a `<div>` element with the id "hubspotForm" and the className
 * "hubspotForm".
 */
import { useEffect } from "react";

export default function HSContactForm() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/v2.js";
    // script.src = "https://js-na2.hsforms.net/forms/embed/242272349.js";
    document.body.appendChild(script);

    script.addEventListener("load", () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId: "242272349",
          formId: "162605ae-c2b0-4771-ab7c-13bbd5917469",
          target: "#hubspotForm",
        });
      }
    });
  }, []);

  return <div id="hubspotForm" className="hubspotForm"></div>;
}
