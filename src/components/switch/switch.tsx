import uuidv4 from '../../utils/uuid';

export interface VNode {
  vtag?: string | number | Function;
  vkey?: string | number;
  vtext?: string;
  vchildren?: VNode[];
  vattrs?: any;
  vname?: string;
  ishost?: boolean;
  isSlotFallback?: boolean;
  isSlotReference?: boolean;
}
export interface ComponentProps {
  children?: any[];
  key?: string | number | any;
}
export interface FunctionalUtilities {
  getAttributes: (vnode: VNode) => any;
  replaceAttributes: (vnode: VNode, attributes: any) => void;
}
export interface FunctionalComponent<PropsType> {
  (props?: PropsType & ComponentProps, utils?: FunctionalUtilities): VNode;
}

export interface ComponentProps {
  scrollTopOffset?: number;
}

export const RouterSwitch: FunctionalComponent<ComponentProps> = ({ children, scrollTopOffset }, util) => {

  let group: string;
  if (window.crypto) {
    group = uuidv4();
  } else {
    group = (Math.random() * 10e16).toString();
  }

  const chil = children
    .map((child: VNode, groupIndex: number) => {
      const currentAttributes = util.getAttributes(child);
      util.replaceAttributes(child, {
        ...currentAttributes,
        scrollTopOffset,
        group,
        groupIndex
      });
      return child;
    });

  return (
    <div>
      { chil }
    </div>
  )
};
