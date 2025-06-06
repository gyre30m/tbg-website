"use client";
import React, { useEffect } from "react";

interface HubspotFormProps {
  region: string;
  portalId: string;
  formId: string;
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
interface WindowWithHbspt extends Window {
  hbspt: any;
}

const HubspotForm: React.FC<HubspotFormProps> = ({
  region,
  portalId,
  formId,
}) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/shell.js";
    document.body.appendChild(script);

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    script.addEventListener("load", () => {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      if ((window as unknown as WindowWithHbspt).hbspt) {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        (window as unknown as WindowWithHbspt).hbspt.forms.create({
          region: region,
          portalId: portalId,
          formId: formId,
          target: "#hubspotForm",
        });
      }
    });

    return () => {
      document.body.removeChild(script);
    };
  }, [region, portalId, formId]);

  return <div id="hubspotForm"></div>;
};

export default HubspotForm;
