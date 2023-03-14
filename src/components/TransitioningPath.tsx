import { AnimatedProps, Easing, interpolatePaths, Path, PathProps, runTiming, SkPath, useComputedValue, useValue } from "@shopify/react-native-skia";
import { memo, useEffect, useRef } from "react";

function TransitioningPath({
    path,
    start = 0,
    end = 1,
    ...props
  }: AnimatedProps<PathProps> & {
    path: SkPath;
  }) {
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
        console.warn("Пути должны иметь одинаковую длину. Пропуск интерполяции.");
        return;
      }
  
      currentPathRef.current = animatedPath.current;
      nextPathRef.current = path;
      progress.current = 0;
      runTiming(progress, 1, {
        duration: 200,
        easing: Easing.linear //Easing.inOut(Easing.cubic), 
      });
    }, [animatedPath, path, progress]);
  
    return <Path {...props} path={animatedPath} />;
  };
  
  export default memo(TransitioningPath);