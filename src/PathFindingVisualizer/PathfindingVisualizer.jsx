import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import {bellman} from '../algorithms/bellmanFord'
import { Button } from "reactstrap";

import "./PathfindingVisualizer.css";

let START_NODE_ROW;
let START_NODE_COL;
let FINISH_NODE_ROW;
let FINISH_NODE_COL;
var x = 0;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    let newGrid;
    if (x === 0) {
      newGrid = getNewGridWithStart(this.state.grid, row, col);
      START_NODE_ROW = row;
      START_NODE_COL = col;
    } else if (x === 1) {
      newGrid = getNewGridWithFinish(this.state.grid, row, col);
      FINISH_NODE_ROW = row;
      FINISH_NODE_COL = col;
    } else {
      newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    }
    this.setState({ grid: newGrid, mouseIsPressed: true });
    x++;
  }
  // to handle click and glide
  handleMouseEnter(row, col) {
    if (x <= 2) return;
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  visualizeBellman() {
    console.log("bellman");
    const { grid } = this.state;
    if (
      START_NODE_COL === undefined ||
      START_NODE_ROW === undefined ||
      FINISH_NODE_ROW === undefined ||
      FINISH_NODE_COL === undefined
    ) {
      alert("Select start node and end node");
      return;
    }

    // const startNode = grid[START_NODE_ROW][START_NODE_COL];
    // const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    //  bellman(grid, startNode, finishNode);
    //  const visitedNodesInOrder =[]
    // const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    // this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    if (
      START_NODE_COL === undefined ||
      START_NODE_ROW === undefined ||
      FINISH_NODE_ROW === undefined ||
      FINISH_NODE_COL === undefined
    ) {
      alert("Select start node and end node");
      return;
    }
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  
  render() {
    const { grid, mouseIsPressed } = this.state;
     
    return (
      <>
        <br />
        <br />
        <br />
        <Button onClick={() => this.visualizeDijkstra()} color="secondary">
          Visualize Dijkstra's Algorithm
        </Button>
        <Button onClick={()=>this.visualizeBellman()} color="primary">
           Visualize Bellman Ford's Algorithm
        </Button>
        <div></div>
        <div className="grid">
          
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}
// grid is an 2d array of objects
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

// returns an object with coordinate row and col
const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: false,
    isFinish: false,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice(); // as we have to change wall property so new copy of grid is created and returned after change
  const node = newGrid[row][col]; //return node with wall
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithStart = (grid, row, col) => {
  const newGrid = grid.slice(); // as we have to change wall property so new copy of grid is created and returned after change
  const node = newGrid[row][col]; //return node with wall

  const newNode = {
    ...node,
    isStart: !node.isStart,
  };
  newGrid[row][col] = newNode;

  return newGrid;
};

const getNewGridWithFinish = (grid, row, col) => {
  const newGrid = grid.slice(); // as we have to change wall property so new copy of grid is created and returned after change
  const node = newGrid[row][col]; //return node with wall
  const newNode = {
    ...node,
    isFinish: !node.isFinish,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
