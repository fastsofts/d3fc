import * as React from "react";
import ShortestDistanceNode from "./ShortestDistance";

interface graph{
    [index:number]:any
}

interface shortestpath{
    graph:graph;
    startNode:any;
    endNode:any;
}


const ShortestPath:  React.FC<shortestpath> = ({graph,startNode, endNode})  => {
      let distances:any = {};
      distances[endNode] = "Infinity";
      distances = Object.assign(distances, graph[startNode]);
      let parents:any = { endNode: null };
      for (let child in graph[startNode]) {
           parents[child] = startNode;
      }
      let visited:any = [];
      let node:any = ShortestDistanceNode(distances, visited);
      while (node) {
          let distance = distances[node];
          let children = graph[node]; 
          for (let child in children) {
               if (String(child) === String(startNode)) {
                   continue;
               } else {
                   let newdistance = distance + children[child];
                   if (!distances[child] || distances[child] > newdistance) {
                       distances[child] = newdistance;
                       parents[child] = node;
                   } 
               }
          }  
          visited.push(node);
          node = ShortestDistanceNode(distances, visited);
      }
      let shortestPath = [endNode];
      let parent = parents[endNode];
      while (parent) {
         shortestPath.push(parent);
         parent = parents[parent];
      }
      shortestPath.reverse();
      let results:any = {
         distance: distances[endNode],
         path: shortestPath,
      };
      return results;
};

export default ShortestPath;