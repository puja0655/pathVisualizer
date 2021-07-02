import {getAllNodes,getNodesInShortestPathOrder} from './dijkstra'
export function bellman(grid,startNode,finishNode){
  
  startNode.distance = 0
  const totalNode = 20*50
  for(let i=0;i<totalNode;i++){
      const edges = []
      edges.push(startNode)
      while(edges.length){
          const topNode = edges[0];
          edges.shift();
          const { col, row } = topNode;
          if (row > 0 && !grid[row-1][col].isWall) {
            edges.push(grid[row - 1][col]);
            if(topNode.distance+1<grid[row-1][col]){
                grid[row-1][col].previousNode = topNode
                grid[row-1][col].distance = topNode.distance+1
            }
          }
          if (row < grid.length - 1 && !grid[row + 1][col].isWall){
            edges.push(grid[row + 1][col]);
            if(topNode.distance+1<grid[row+1][col]){
                grid[row+1][col].previousNode = topNode
                grid[row+1][col].distance = topNode.distance+1
            } 
          }
          if (col > 0 && !grid[row][col-1].isWall ){
            edges.push(grid[row][col-1]);
            if(topNode.distance+1<grid[row][col-1]){
                grid[row][col-1].previousNode = topNode
                grid[row][col-1].distance = topNode.distance+1
            } 
          }
          if (col < grid[0].length - 1 && !grid[row][col+1].isWall){
            edges.push(grid[row][col+1]);
            if(topNode.distance+1<grid[row][col+1]){
                grid[row][col+1].previousNode = topNode
                grid[row][col+1].distance = topNode.distance+1
            }   
          }
      }
      
  }
  getNodesInShortestPathOrder(finishNode)
}

