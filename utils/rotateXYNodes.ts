import { TNodes } from "../types/nodes";

export default function rotateXYNodes(nodes: TNodes, angleX: number, angleY: number): TNodes { 
   const sinX = Math.sin(angleX);
   const cosX = Math.cos(angleX);
   const sinY = Math.sin(angleY);
   const cosY = Math.cos(angleY);

   return nodes.map((node) => {
     let [x, y, z] = node; 
    
     let x_n = x * cosX + z * sinX;
     let z_p = z * cosX - x * sinX;
     
     let y_n = y * cosY + z_p * sinY;
     let z_n = z_p * cosY - y * sinY;
    
     return [x_n, y_n, z_n]
  });
}