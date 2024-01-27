interface distances{
    [index:number]: string
}

interface shortestdistance{
    distances:distances;
    visited:string[];
}

const ShortestDistanceNode:React.FC<shortestdistance> = ({distances,visited}) => {
    let shortest:any = null;
    for (let node in distances) {
         let currentIsShortest = shortest === null || distances[node] < distances[shortest];
         if (currentIsShortest && !visited.includes(node)) {
             shortest = node;
         }
    }
    return shortest;
};
export default ShortestDistanceNode;