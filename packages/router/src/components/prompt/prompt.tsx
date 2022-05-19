import {
  Component,
  Prop,
  Element,
  ComponentInterface,
  Watch,
  State,
} from "@stencil/core";
import { RouterHistory, Prompt } from "../../global/interfaces";
import ActiveRouter from "../../global/active-router";

@Component({
  tag: "stencil-router-prompt",
})
export class StencilRouterPrompt implements ComponentInterface {
  @Element() el!: HTMLStencilRouterPromptElement;
  @Prop() when = true;
  @Prop() message: string | Prompt = "";
  @Prop() history?: RouterHistory;

  @State() unblock?: () => void;

  enable(message: string | Prompt) {
    if (this.unblock) {
      this.unblock();
    }
    if (this.history) {
      this.unblock = this.history.block(message);
    }
  }

  disable() {
    if (this.unblock) {
      this.unblock();
      this.unblock = undefined;
    }
  }

  componentWillLoad() {
    if (this.when) {
      this.enable(this.message);
    }
  }

  updateMessage(newMessage: string, prevMessage: string): void; // `message` updated
  updateMessage(newMessage: boolean, prevMessage: boolean): void; // `when` updated

  @Watch("message")
  @Watch("when")
  updateMessage<T extends string | boolean>(newMessage: T, prevMessage: T) {
    if (!this.when) {
      this.disable();
    } else if (prevMessage !== newMessage) {
      this.enable(this.message);
    }
  }

  componentDidUnload() {
    this.disable();
  }

  render() {
    return null;
  }
}

ActiveRouter.injectProps(StencilRouterPrompt, ["history"]);
