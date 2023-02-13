import {Fragment, useCallback, useEffect, useRef, useState} from "react";
import {Canvas, Image, useCanvasRef, Circle, Skia, Path, vec, useValue, runSpring, Fill, useComputedValue, interpolatePaths, runTiming, Easing, PathProps, AnimatedProps, SkPath} from "@shopify/react-native-skia";
import rotateXYNodes from "../utils/rotateXYNodes";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import scale from "../utils/scale";
import findAngle from "../utils/findAngle";
 
export let nodesN = [
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

function draw(nodes: any, fields: any, width: any, height: any ) {
  return fields.map((field: any) => { 
    const path = Skia.Path.Make();
    const p1 = nodes[field[0]];
    const p2 = nodes[field[1]];
    const p3 = nodes[field[2]];
    const p4 = nodes[field[3]];
    path.moveTo(p1[0], p1[1]);
    path.lineTo(p2[0], p2[1]);
    path.lineTo(p3[0], p3[1]);
    if (p4) path.lineTo(p4[0], p4[1]);
    const m = Skia.Matrix();
    m.translate(width / 2, height / 2);
    path.transform(m);
    path.close();
    return path
  });
  
}

const TransitioningPath = ({
  path,
  start = 0,
  end = 1,
  ...props
}: AnimatedProps<PathProps> & {
  path: SkPath;
}) => {
  const currentPathRef = useRef(path);
  const nextPathRef = useRef(path);

  const progress = useValue(0);

  const animatedPath = useComputedValue(
    () =>
      interpolatePaths(
        progress.current,
        [0, 1],
        [currentPathRef.current, nextPathRef.current]
      ),
    [progress, path]
  );

  useEffect(() => {
    if (!path.isInterpolatable(currentPathRef.current)) {
      console.warn("Paths must have the same length. Skipping interpolation.");
      return;
    }

    currentPathRef.current = animatedPath.current;
    nextPathRef.current = path;
    progress.current = 0;
    runTiming(progress, 1, {
      duration: 750,
      easing: Easing.linear//Easing.inOut(Easing.cubic),
    });
  }, [animatedPath, path, progress]);

  return <Path {...props} path={animatedPath} />;
};

export const Demo = () => {
 
  const width = useWindowDimensions().width || 1000;
  const height = useWindowDimensions().height || 1000;
  const size = Math.min(width, height);
  // @ts-ignore
  const [nodes, setNodes] = useState(scale(nodesN, size / 8, -size / 8, size / 8))
  const [paths, setPaths] = useState(draw(nodes,fields, width, height) || [])
  const [angle, setAngle] = useState(0)
  const [V, setV] = useState(10)
  let startTouch = useRef(null);
  const ref = useCanvasRef();
  
  useEffect(() => {
      const update = setInterval(() => {
      // @ts-ignore
      const nodesNew = rotateXYNodes(nodes, Math.cos(angle)*0.3 ,  Math.sin(angle)*0.3 ); 
      //  @ts-ignore
      
      setPaths(draw(nodesNew, fields, width, height));
      setNodes(nodesNew)
    }, 200)

    return () => clearInterval(update)
  }, [ref, nodes, angle]);

  const touchHandler = (e: any) => {
    // console.log(e, 'event')
  }

  const touchStartHandler = (e: any) => {
    // @ts-ignore
    startTouch.current = {
      x: e.nativeEvent.locationX, 
      y: e.nativeEvent.locationY,
      time: Date.now()
    }
  }

  const touchEndHandler = (e: any) => {
    // @ts-ignore
    
    if (startTouch.current) {
      // @ts-ignore
      const angle =  findAngle(startTouch.current.x, startTouch.current.y,  e.nativeEvent.locationX, e.nativeEvent.locationY)
      console.log(angle, angle)
    
      // @ts-ignore
      const S = Math.sqrt(Math.pow(e.nativeEvent.locationX - startTouch.current.x) + Math.pow(e.nativeEvent.locationY - startTouch.current.y))

      // @ts-ignore
      const time = Date.now() - startTouch.current.time
      console.log(time)
      startTouch.current = null;

      setAngle(angle)
      setV(S/time)
    }

    startTouch.current = null;
  }

  return (
    <Fragment>
      {/* <Text>{paths.map((path:any) => path.toSVGString())}</Text> */}
    <Canvas style={{ flex: 1, backgroundColor: 'lightblue' }} ref={ref} onTouch={touchHandler} onTouchStart={touchStartHandler} onTouchEnd={touchEndHandler}>
      {paths.length && paths.map((path: any, id: number) => (
        <TransitioningPath
          key={path ? path.toSVGString() : ''}
        path={path}
        color={`rgb(${255 - id* 10}, 10, ${id})`}
        start={0}
        end={1}
      />
      ))}
      
    </Canvas></Fragment>
  );
};