import { Skia } from "@shopify/react-native-skia";

function createPathes(nodes: any, fields: any, width: any, height: any ) {
    return fields.map((field: any) => { 
      const path = Skia.Path.Make();
  
      field.map((value: any, id: any) => {
        const p = nodes[value]
        if (id === 0) path.moveTo(p[0], p[1])
        else path.lineTo(p[0], p[1]);
      })
  
      const m = Skia.Matrix();
      m.translate(width / 2, height / 2);
      path.transform(m);
      path.close();
      return path
    });
}

export default createPathes;
  