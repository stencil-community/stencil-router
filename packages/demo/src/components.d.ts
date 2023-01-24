/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
  interface AppAccount {}
  interface AppRoot {
    logged: boolean;
  }
}
declare global {
  interface HTMLAppAccountElement
    extends Components.AppAccount,
      HTMLStencilElement {}
  var HTMLAppAccountElement: {
    prototype: HTMLAppAccountElement;
    new (): HTMLAppAccountElement;
  };
  interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {}
  var HTMLAppRootElement: {
    prototype: HTMLAppRootElement;
    new (): HTMLAppRootElement;
  };
  interface HTMLElementTagNameMap {
    "app-account": HTMLAppAccountElement;
    "app-root": HTMLAppRootElement;
  }
}
declare namespace LocalJSX {
  interface AppAccount {}
  interface AppRoot {
    logged?: boolean;
  }
  interface IntrinsicElements {
    "app-account": AppAccount;
    "app-root": AppRoot;
  }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      "app-account": LocalJSX.AppAccount &
        JSXBase.HTMLAttributes<HTMLAppAccountElement>;
      "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
    }
  }
}
