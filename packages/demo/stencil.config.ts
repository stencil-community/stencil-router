import { Config } from "@stencil/core";

export const config: Config = {
  namespace: "router-demo",
  outputTargets: [
    {
      type: "www",
      serviceWorker: null,
      baseUrl: "https://example.com",
    },
  ],
};
