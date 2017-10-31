import { RouterHistory, MatchResults } from '../../global/interfaces';

export interface RenderProps {
  match: MatchResults,
  history: RouterHistory
}

export type ChildFunction = (props: RenderProps) => JSX.Element[];

export interface Props {
  children?: (JSX.Element | ChildFunction)[];
}

const RouterDetails = (props: Props) => {
  return <stencil-route routeRender={props.children[0]} />
}

export default RouterDetails;
