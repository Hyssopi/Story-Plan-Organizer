import { UUID, randomUUID } from 'crypto';

/**
 * Point.
 */
type Point = {
  /**
   * X coordinate.
   */
  x: number;
  /**
   * Y coordinate.
   */
  y: number;
};

type Node = {
  id: UUID;
  location: Point;
  type: NodeType;
};

type Character = Node & {
  age: number;
};

type Location = Node & {
  description: string;
};

type Organization = Node & {
  description: string;
};

type Plot = Node & {
  text: string;
};

type Relation = Node & {
  description: string;
};

type Link = {
  nodeFromId: UUID;
  nodeToId: UUID;
};

/**
 * Node Type.
 */
enum NodeType {
  Character,
  Location,
  Organization,
  Plot,
  Relation,
}

const create_node = (type: NodeType, nodes: Node[], links: Link[], linesCached: HTMLDivElement[]): void => {
  const id: UUID = randomUUID();
  const location: Point = { x: 0, y: 0 };

  let node: Node | undefined;
  switch (type) {
    case NodeType.Character:
      node = {
        id,
        location,
        type: NodeType.Character,
        age: 0,
      } as Character;
      break;
    case NodeType.Location:
      node = {
        id,
        location,
        type: NodeType.Character,
        description: '',
      } as Location;
      break;
    case NodeType.Organization:
      node = {
        id,
        location,
        type: NodeType.Character,
        description: '',
      } as Organization;
      break;
    case NodeType.Plot:
      node = {
        id,
        location,
        type: NodeType.Character,
        text: '',
      } as Plot;
      break;
    case NodeType.Relation:
      node = {
        id,
        location,
        type: NodeType.Character,
        description: '',
      } as Relation;
      break;
    default:
      break;
  }

  if (node) {
    nodes.push(node);
    create_node_element(node, nodes, links, linesCached);
  }
};

const create_node_element = (node: Node, nodes: Node[], links: Link[], linesCached: HTMLDivElement[]): void => {
  const newElement: HTMLDivElement = document.createElement('div');
  const newNodeElement: HTMLDivElement = document.body.appendChild(newElement);
  newNodeElement.id = node.id;
  newNodeElement.className = 'node';
  newNodeElement.style.top = node.location.y + 'px';
  newNodeElement.style.left = node.location.x + 'px';

  switch (node.type) {
    case NodeType.Character:
      newNodeElement.innerHTML = `
        <div class='move'></div>
        <input class='name'></input>
        <p>${node.id}</p>
        <p>this</p>
        <p>DIV</p>
      `;
      break;
    case NodeType.Location:
      newNodeElement.innerHTML = `
        <div class='move'></div>
        <input class='name'></input>
        <p>${node.id}</p>
        <p>this</p>
        <p>DIV</p>
      `;
      break;
    case NodeType.Organization:
      newNodeElement.innerHTML = `
        <div class='move'></div>
        <input class='name'></input>
        <p>${node.id}</p>
        <p>this</p>
        <p>DIV</p>
      `;
      break;
    case NodeType.Plot:
      newNodeElement.innerHTML = `
        <div class='move'></div>
        <input class='name'></input>
        <p>${node.id}</p>
        <p>this</p>
        <p>DIV</p>
      `;
      break;
    case NodeType.Relation:
      newNodeElement.innerHTML = `
        <div class='move'></div>
        <input class='name'></input>
        <p>${node.id}</p>
        <p>this</p>
        <p>DIV</p>
      `;
      break;
    default:
      break;
  }

  drag_node_element(newElement, nodes, links, linesCached);
};

const drag_node_element = (
  element: HTMLDivElement,
  nodes: Node[],
  links: Link[],
  linesCached: HTMLDivElement[],
): void => {
  let pos1: number = 0;
  let pos2: number = 0;
  let pos3: number = 0;
  let pos4: number = 0;

  const moveElement: HTMLDivElement = element.getElementsByClassName('move')[0] as HTMLDivElement;
  moveElement.onmousedown = dragMouseDown;
  moveElement.addEventListener('mouseup', (event: MouseEvent) => {
    if (event.button === 2) {
      // Right mouse button
      if (element.id && createOngoingLinkId) {
        create_link(element.id as UUID, createOngoingLinkId, nodes, links, linesCached);
      }
      createOngoingLinkId = null;
    }
  });

  /**
   *
   * @param event
   */
  function dragMouseDown(event: MouseEvent): void {
    event = event || window.event;
    event.preventDefault();

    if (event.button === 0) {
      // Left mouse button
      if (deleting) {
        delete_node(element, nodes, links, linesCached);
        return;
      }

      if (element !== selectedNodeElement) {
        if (selectedNodeElement) {
          selectedNodeElement.classList.remove('node-selected');
        }
        selectedNodeElement = element;
        selectedNodeElement.classList.add('node-selected');
      }

      pos3 = event.clientX;
      pos4 = event.clientY;
      document.onmouseup = closeDragElement;

      document.onmousemove = elementDrag;
    } else if (event.button === 2) {
      // Right mouse button
      createOngoingLinkId = element.id as UUID;
    }
  }

  /**
   *
   * @param event
   */
  function elementDrag(event: MouseEvent): void {
    event = event || window.event;
    event.preventDefault();

    pos1 = pos3 - event.clientX;
    pos2 = pos4 - event.clientY;
    pos3 = event.clientX;
    pos4 = event.clientY;

    const node: Node | undefined = get_node(element.id as UUID, nodes);
    if (node) {
      node.location.x = element.offsetLeft - pos1;
      node.location.y = element.offsetTop - pos2;

      element.style.top = node.location.y + 'px';
      element.style.left = node.location.x + 'px';

      redraw_lines(nodes, links, linesCached);
    }
  }

  /**
   *
   */
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
};

const get_node = (id: UUID, nodes: Node[]): Node | undefined => {
  let foundNode;
  for (const node of nodes) {
    if (node.id === id) {
      foundNode = node;
      break;
    }
  }
  return foundNode;
};

const get_node_element = (id: UUID): HTMLDivElement | null => {
  const htmlElement: HTMLElement | null = document.getElementById(id);
  return htmlElement ? (htmlElement as HTMLDivElement) : null;
};

type NodePositionResults = {
  top: number;
  bottom: number;
  left: number;
  right: number;
  topLeft: Point;
  topRight: Point;
  bottomLeft: Point;
  bottomRight: Point;
};

const calculate_element_positions = (node: Node): NodePositionResults | undefined => {
  const element = get_node_element(node.id);
  if (element) {
    const top = node.location.y;
    const bottom = node.location.y + element.offsetHeight;
    const left = node.location.x;
    const right = node.location.x + element.offsetWidth;

    const topLeft = { x: node.location.x, y: node.location.y };
    const topRight = { x: node.location.x + element.offsetWidth, y: node.location.y };
    const bottomLeft = { x: node.location.x, y: node.location.y + element.offsetHeight };
    const bottomRight = { x: node.location.x + element.offsetWidth, y: node.location.y + element.offsetHeight };

    return { top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight };
  } else {
    return undefined;
  }
};

const calculate_distance = (point1: Point, point2: Point): number => {
  const a = point1.x - point2.x;
  const b = point1.y - point2.y;
  return Math.sqrt(a * a + b * b);
};

const calculate_shortest_distance_2 = (point: Point, node2: Node): { point: Point; distance: number } => {
  const currentShortestPoint = { point: { x: 0, y: 0 }, distance: 999999999999 };

  const nodePositions2: NodePositionResults | undefined = calculate_element_positions(node2);
  if (nodePositions2) {
    // 1. Sweep TopLeft to TopRight
    for (let x = nodePositions2.left; x < nodePositions2.right; x = x + CALCULATION_INCREMENT) {
      const tempPoint = { x: x, y: nodePositions2.top };
      const distance = calculate_distance(point, tempPoint);
      if (distance < currentShortestPoint.distance) {
        currentShortestPoint.point = tempPoint;
        currentShortestPoint.distance = distance;
      }
    }
    // 2. Sweep TopRight to BottomRight
    for (let y = nodePositions2.top; y < nodePositions2.bottom; y = y + CALCULATION_INCREMENT) {
      const tempPoint = { x: nodePositions2.right, y: y };
      const distance = calculate_distance(point, tempPoint);
      if (distance < currentShortestPoint.distance) {
        currentShortestPoint.point = tempPoint;
        currentShortestPoint.distance = distance;
      }
    }
    // 3. Sweep BottomLeft to BottomRight
    for (let x = nodePositions2.left; x < nodePositions2.right; x = x + CALCULATION_INCREMENT) {
      const tempPoint = { x: x, y: nodePositions2.bottom };
      const distance = calculate_distance(point, tempPoint);
      if (distance < currentShortestPoint.distance) {
        currentShortestPoint.point = tempPoint;
        currentShortestPoint.distance = distance;
      }
    }
    // 4. Sweep TopLeft to BottomLeft
    for (let y = nodePositions2.top; y < nodePositions2.bottom; y = y + CALCULATION_INCREMENT) {
      const tempPoint = { x: nodePositions2.left, y: y };
      const distance = calculate_distance(point, tempPoint);
      if (distance < currentShortestPoint.distance) {
        currentShortestPoint.point = tempPoint;
        currentShortestPoint.distance = distance;
      }
    }
  }

  return currentShortestPoint;
};

const calculate_shortest_distance = (node1: Node, node2: Node): { point1: Point; point2: Point } => {
  const currentShortestPoints = { point1: { x: 0, y: 0 }, point2: { x: 0, y: 0 }, distance: 999999999999 };

  const nodePositions1: NodePositionResults | undefined = calculate_element_positions(node1);
  if (nodePositions1) {
    // 1. Sweep TopLeft to TopRight
    for (let x = nodePositions1.left; x < nodePositions1.right; x = x + CALCULATION_INCREMENT) {
      const tempPoint = { x: x, y: nodePositions1.top };
      const result: { point: Point; distance: number } = calculate_shortest_distance_2(tempPoint, node2);
      if (result.distance < currentShortestPoints.distance) {
        currentShortestPoints.point1 = tempPoint;
        currentShortestPoints.point2 = result.point;
        currentShortestPoints.distance = result.distance;
      }
    }
    // 2. Sweep TopRight to BottomRight
    for (let y = nodePositions1.top; y < nodePositions1.bottom; y = y + CALCULATION_INCREMENT) {
      const tempPoint = { x: nodePositions1.right, y: y };
      const result: { point: Point; distance: number } = calculate_shortest_distance_2(tempPoint, node2);
      if (result.distance < currentShortestPoints.distance) {
        currentShortestPoints.point1 = tempPoint;
        currentShortestPoints.point2 = result.point;
        currentShortestPoints.distance = result.distance;
      }
    }
    // 3. Sweep BottomLeft to BottomRight
    for (let x = nodePositions1.left; x < nodePositions1.right; x = x + CALCULATION_INCREMENT) {
      const tempPoint = { x: x, y: nodePositions1.bottom };
      const result: { point: Point; distance: number } = calculate_shortest_distance_2(tempPoint, node2);
      if (result.distance < currentShortestPoints.distance) {
        currentShortestPoints.point1 = tempPoint;
        currentShortestPoints.point2 = result.point;
        currentShortestPoints.distance = result.distance;
      }
    }
    // 4. Sweep TopLeft to BottomLeft
    for (let y = nodePositions1.top; y < nodePositions1.bottom; y = y + CALCULATION_INCREMENT) {
      const tempPoint = { x: nodePositions1.left, y: y };
      const result: { point: Point; distance: number } = calculate_shortest_distance_2(tempPoint, node2);
      if (result.distance < currentShortestPoints.distance) {
        currentShortestPoints.point1 = tempPoint;
        currentShortestPoints.point2 = result.point;
        currentShortestPoints.distance = result.distance;
      }
    }
  }

  return { point1: currentShortestPoints.point1, point2: currentShortestPoints.point2 };
};

const create_line = (
  nodeId1: UUID,
  nodeId2: UUID,
  nodes: Node[],
  links: Link[],
  linesCached: HTMLDivElement[],
): void => {
  const node1 = get_node(nodeId1, nodes);
  const node2 = get_node(nodeId2, nodes);
  if (node1 && node2) {
    const newElement: HTMLDivElement = document.createElement('div');
    const newLine: HTMLDivElement = document.body.appendChild(newElement);
    newLine.className = 'line';

    const points: { point1: Point; point2: Point } = calculate_shortest_distance(node1, node2);
    newLine.innerHTML = `
      <svg width='9999' height='9999'>
        <line x1='${points.point1.x}' y1='${points.point1.y}' x2='${points.point2.x}' y2='${points.point2.y}' style='pointer-events: all; stroke: red; stroke-width: 12;'/>
      </svg>
    `;

    linesCached.push(newElement);

    if (newLine.firstElementChild && newLine.firstElementChild.firstElementChild) {
      newLine.firstElementChild.firstElementChild.addEventListener('click', () => {
        if (deleting) {
          delete_link(nodeId1, nodeId2, nodes, links, linesCached);
        }
      });
    }
  }
};

const redraw_lines = (nodes: Node[], links: Link[], linesCached: HTMLDivElement[]): void => {
  for (const line of linesCached) {
    line.remove();
  }

  for (const link of links) {
    create_line(link.nodeFromId, link.nodeToId, nodes, links, linesCached);
  }
};

const create_link = (
  nodeId1: UUID,
  nodeId2: UUID,
  nodes: Node[],
  links: Link[],
  linesCached: HTMLDivElement[],
): void => {
  if (nodeId1 && nodeId2 && !does_link_exist(nodeId1, nodeId2, links)) {
    links.push({ nodeFromId: nodeId1, nodeToId: nodeId2 });
    redraw_lines(nodes, links, linesCached);
  }
};

const does_link_exist = (nodeId1: UUID, nodeId2: UUID, links: Link[]): boolean => {
  for (const link of links) {
    if (
      (nodeId1 === link.nodeFromId && nodeId2 === link.nodeToId) ||
      (nodeId2 === link.nodeFromId && nodeId1 === link.nodeToId)
    ) {
      return true;
    }
  }
  return false;
};

const delete_link = (
  nodeId1: UUID,
  nodeId2: UUID,
  nodes: Node[],
  links: Link[],
  linesCached: HTMLDivElement[],
): void => {
  for (let i = links.length - 1; i >= 0; i--) {
    const link: Link = links[i];
    if (
      (nodeId1 === link.nodeFromId && nodeId2 === link.nodeToId) ||
      (nodeId2 === link.nodeFromId && nodeId1 === link.nodeToId)
    ) {
      links.splice(i, 1);
    }
  }
  redraw_lines(nodes, links, linesCached);
};

const delete_node = (
  nodeElement: HTMLDivElement,
  nodes: Node[],
  links: Link[],
  linesCached: HTMLDivElement[],
): void => {
  if (nodeElement) {
    const nodeFound: Node | undefined = get_node(nodeElement.id as UUID, nodes);
    if (nodeFound) {
      const index = nodes.indexOf(nodeFound);
      if (index !== -1) {
        nodes.splice(index, 1);
        for (let i = links.length - 1; i >= 0; i--) {
          const link: Link = links[i];
          if (nodeElement.id === link.nodeFromId || nodeElement.id === link.nodeToId) {
            links.splice(i, 1);
          }
        }
        nodeElement.remove();
      }
    }
  }
  clear(nodes, links, linesCached);
  redraw_lines(nodes, links, linesCached);
};

const clear = (nodes: Node[], links: Link[], linesCached: HTMLDivElement[]): void => {
  if (selectedNodeElement) {
    selectedNodeElement.classList.remove('node-selected');
  }
  selectedNodeElement = null;

  for (const node of nodes) {
    if (node.location.x < 0) {
      node.location.x = 0;
      const nodeElement: HTMLDivElement | null = get_node_element(node.id);
      if (nodeElement) {
        nodeElement.style.left = node.location.x.toString();
      }
    }
    if (node.location.y < 0) {
      node.location.y = 0;
      const nodeElement: HTMLDivElement | null = get_node_element(node.id);
      if (nodeElement) {
        nodeElement.style.top = node.location.y.toString();
      }
    }
  }
  redraw_lines(nodes, links, linesCached);
};

const nodes: Node[] = [];
const links: Link[] = [];
const linesCached: HTMLDivElement[] = [];
let selectedNodeElement: HTMLDivElement | null = null;
let createOngoingLinkId: UUID | null = null;
let deleting: boolean = false;
const CALCULATION_INCREMENT: number = 10;

nodes.push(
  {
    id: 'dc4090ef-6c95-4c24-ac57-ff4126811365',
    location: {
      x: 100,
      y: 200,
    },
    type: NodeType.Character,
    age: 18,
  } as Character,
  {
    id: 'f6f06d09-986e-43fb-a28c-eb0c1b9d3394',
    location: {
      x: 300,
      y: 800,
    },
    type: NodeType.Location,
    description: 'This is a description.',
  } as Location,
  {
    id: 'dc7d4b9b-cec0-48a5-af38-f025d96e088d',
    location: {
      x: 300,
      y: 900,
    },
    type: NodeType.Organization,
    description: 'This is a description.',
  } as Organization,
  {
    id: '53b21444-da1e-43a1-a83a-fdf4ba93f0ad',
    location: {
      x: 300,
      y: 1000,
    },
    type: NodeType.Plot,
    text: 'This is a description.',
  } as Plot,
  {
    id: '22903bda-eedf-406e-b4c4-e857d289f5d9',
    location: {
      x: 300,
      y: 1100,
    },
    type: NodeType.Relation,
    description: 'This is a description.',
  } as Relation,
);

for (const node of nodes) {
  create_node_element(node, nodes, links, linesCached);
}

links.push({ nodeFromId: 'f6f06d09-986e-43fb-a28c-eb0c1b9d3394', nodeToId: 'dc4090ef-6c95-4c24-ac57-ff4126811365' });
links.push({ nodeFromId: '53b21444-da1e-43a1-a83a-fdf4ba93f0ad', nodeToId: '22903bda-eedf-406e-b4c4-e857d289f5d9' });
links.push({ nodeFromId: 'dc7d4b9b-cec0-48a5-af38-f025d96e088d', nodeToId: '22903bda-eedf-406e-b4c4-e857d289f5d9' });
links.push({ nodeFromId: 'dc7d4b9b-cec0-48a5-af38-f025d96e088d', nodeToId: 'dc4090ef-6c95-4c24-ac57-ff4126811365' });

redraw_lines(nodes, links, linesCached);

document.addEventListener('contextmenu', (event) => event.preventDefault());
window.addEventListener('keydown', (event) => keydownResponse(event, nodes, links, linesCached), false);
window.addEventListener('keyup', keyupResponse, false);

/**
 *
 * @param {KeyboardEvent} event
 * @param {Node[]} nodes Array of all the nodes.
 * @param {Link[]} links Array of all the links.
 * @param {HTMLDivElement[]} linesCached Array of HTML elements of lines.
 */
function keydownResponse(event: KeyboardEvent, nodes: Node[], links: Link[], linesCached: HTMLDivElement[]): void {
  if (event.key === 'Escape') {
    clear(nodes, links, linesCached);
  }
  if (event.key === 'd') {
    deleting = true;
  }
}

/**
 *
 * @param event
 */
function keyupResponse(event: KeyboardEvent): void {
  if (event.key === 'd') {
    deleting = false;
  }
}

const createNodeButton_Character: HTMLButtonElement = document.getElementById(
  'create-node-character',
) as HTMLButtonElement;
createNodeButton_Character.addEventListener('click', (event: Event) => {
  console.log(event);
  create_node(NodeType.Character, nodes, links, linesCached);
});

/*
const inputImportFileElement = document.getElementById('input-import-file');
if (inputImportFileElement)
{
  inputImportFileElement.onchange = importFile;
}

function importFile(event: Event): void
{
  const files = this.files;
  console.log(files);
  // TODO: Cache this as save location

  const reader = new FileReader();
  reader.onload = onReaderLoad;
  if (event.target)
  {
    reader.readAsText(event.target.files[0]);
  }

  function onReaderLoad(event: ProgressEvent<FileReader>): void
  {
    console.log(event.target.result);
    var obj = JSON.parse(event.target.result);
    console.log(obj);
  }
}
*/
