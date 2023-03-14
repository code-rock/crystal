import {Fragment, memo, useEffect, useState} from "react";
import {Canvas, useCanvasRef } from "@shopify/react-native-skia";
import rotateXYNodes from "../utils/rotateXYNodes";
import { Dimensions, StyleSheet } from "react-native";
import scale from "../utils/scale";
import findAngle from "../utils/findAngle";
import TransitioningPath from "./TransitioningPath";
import createPathes from "../utils/createPathes";
import { useSharedValue } from "react-native-reanimated";
 
export let nodesN = [
  [-1, 2, 1], [1, 2, 1], [1, 2, -1], [-1, 2, -1],
  [-2, 1, 2], [2, 1, 2], [2, 1, -2], [-2, 1, -2], [0,-2,0]
];

const fields = [
  [1,2,6,5], [0,1,5,4], [3,0,4,7], [3,7,6,2], [0,1,2,3], 
  [4,5,8], [5,6,8], [8,6,7], [8,7,4]
];

const { width, height } = Dimensions.get('window');

function Сrystal() {
  const size = Math.min(width, height);
  // @ts-ignore
  const [nodes, setNodes] = useState(scale(nodesN, size / 8, -size / 8, size / 8))
  const [paths, setPaths] = useState(createPathes(nodes,fields, width, height) || [])
  const [angle, setAngle] = useState(0)
  // const [V, setV] = useState(10)
  const startTouch = useSharedValue<{ x: any; y: any; time: number; } | null>(null)
  const ref = useCanvasRef();
  
  useEffect(() => {
      const update = setInterval(() => {
        const nodesNew = rotateXYNodes(nodes, Math.cos(angle)*0.3 ,  Math.sin(angle)*0.3 ); 
        setPaths(createPathes(nodesNew, fields, width, height));
        setNodes(nodesNew)
    }, 100)

    return () => clearInterval(update)
  }, [ref, nodes, angle]);


  const touchStartHandler = (e: any) => {
    startTouch.value = {
      x: e.nativeEvent.locationX, 
      y: e.nativeEvent.locationY,
      time: Date.now()
    }
  }

  const touchEndHandler = (e: any) => {
    if (startTouch && startTouch.value) {
      const angle = findAngle(startTouch.value.x, startTouch.value.y,  e.nativeEvent.locationX, e.nativeEvent.locationY)
      // const S = Math.sqrt(Math.pow(e.nativeEvent.locationX - startTouch.value.x, 2) + Math.pow(e.nativeEvent.locationY - startTouch.value.y, 2))
      // const time = Date.now() - startTouch.value.time
      startTouch.value = null;
      setAngle(angle)
      // setV(S/time)
    }

    startTouch.value = null;
  }

  return (
    <Fragment>
      <Canvas 
        style={styles.canvas} 
        ref={ref} 
        onTouchStart={touchStartHandler} 
        onTouchEnd={touchEndHandler}>
        {paths.length && paths.map((path: any, id: number) => (
          <TransitioningPath
            key={path ? path.toSVGString() : ''}
            path={path}
            color={`rgb(${255 - id* 10}, 10, ${id})`}
            start={0}
            end={1}
          />
        ))}
        
      </Canvas>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1, 
    backgroundColor: 'lightblue'
  },
});

export default memo(Сrystal)