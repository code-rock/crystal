import { TNodes } from "../types/nodes";

export default function scale(nodes: TNodes, sx: number, sy: number, sz: number): TNodes {
  return nodes.map((node) => [ node[0]*sx, node[1]*sy, node[2]*sz ]);
}