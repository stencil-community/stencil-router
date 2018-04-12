import { VNode } from "@stencil/core/dist/declarations";
import uuidv4 from '../../utils/uuid';

export const RouterSwitch = ({ children }: { [key: string]: any}) => {
  const groupId = uuidv4();

  const chil = children.map((child: VNode, index: number) => {
    child.vattrs.group = groupId;
    child.vattrs.groupIndex = index;
    return child;
  });

  return (
    <div>
      { chil }
    </div>
  )
};
