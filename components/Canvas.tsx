import React, { memo, useCallback } from 'react';
import { useWindowDimensions } from 'react-native'
import Canvas from 'react-native-canvas';
import { TNodes } from '../types/nodes';
import rotateXYNodes from '../utils/rotateXYNodes';
import scale from '../utils/scale';

export let nodes = [
  [-1, 2, 1], [1, 2, 1], [1, 2, -1], [-1, 2, -1],
  [-2, 1, 2], [2, 1, 2], [2, 1, -2], [-2, 1, -2], [0,-2,0]
];

const edges = [
  [0, 1], [1, 2], [2, 3], [3, 0], [5,6], [6,7], [7, 4], 
  [4, 5], [5, 1],  [2, 6], [3, 7], [0, 4],[8,5], [8,6], 
  [8, 7], [8,4]
];
 
const fields = [
  [1,2,6,5], [0,1,5,4], [3,0,4,7], [3,7,6,2], [0,1,2,3], 
  [4,5,8], [5,6,8], [8,6,7], [8,7,4]
];

function drawRidge(nodes:TNodes, canvas: any, width: number, height: number) {
  canvas.save();
  canvas.clearRect(0, 0, width, height);
  canvas.translate(width / 2, height / 2);
  canvas.strokeStyle = "#000000";
  canvas.beginPath();

  edges.forEach((edge) => {
     const p1 = nodes[edge[0]];
     const p2 = nodes[edge[1]];
     canvas.moveTo(p1[0], p1[1]);
     canvas.fillText(edge[0], p1[0], p1[1]);
     canvas.lineTo(p2[0], p2[1]);
  });

  canvas.closePath();
  canvas.stroke();
  canvas.restore();
};


function drawCrystal(nodes:TNodes, ctx: any, width: number, height: number) {
  ctx.save();
  ctx.clearRect(0, 0, width,height);
  ctx.translate(width / 2, height / 2);
  ctx.strokeStyle = "#420617";
  fields.forEach((field, id) => {
    ctx.beginPath();
    ctx.fillStyle = `rgb(${560 / id}%, ${160 / id}%, ${100 / id}%, ${1- (1 / id)})`;
     const p1 = nodes[field[0]];
     const p2 = nodes[field[1]];
     const p3 = nodes[field[2]];
     const p4 = nodes[field[3]];
     ctx.moveTo(p1[0], p1[1]);
     ctx.lineTo(p2[0], p2[1]);
     ctx.lineTo(p3[0], p3[1]);
     if (p4) ctx.lineTo(p4[0], p4[1]);
     ctx.closePath();
     ctx.fill();
     ctx.stroke();
  });
  ctx.restore();
}

function Main() {
  const width = useWindowDimensions().width || 1000;
  const height = useWindowDimensions().height || 1000;
 
  const handleCanvas = useCallback((canvas: any) => {
    if (canvas) {
      canvas.height = height;
      canvas.width = width;
      const size = Math.min(canvas.width, canvas.height);
      const ctx = canvas.getContext("2d");
      
      ctx.fillStyle = 'lightblue';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // @ts-ignore
      nodes = scale(nodes, size / 8, -size / 8, size / 8);
      setInterval(() => {
        // @ts-ignore
          nodes = rotateXYNodes(nodes, Math.PI / 90, Math.PI / 240); 
          // @ts-ignore
          drawRidge(nodes, ctx, canvas.width, canvas.height);
          // @ts-ignore
          // drawCrystal(nodes, ctx, canvas.width, canvas.height);
          
      }, 20);
    }
  }, [])
  
  return (
      <Canvas ref={handleCanvas} style={{backgroundColor: 'lightblue' }} />
  )
}

export default memo(Main);