import React,{useState,useEffect,useRef} from "react";
import Tree from "react-d3-tree";
// import Card from "./Card";
import './custom-tree.css';
import axios from '../components/axios'
const containerStyles = {
  width: "100%",
  height: "100vh"
};

const Card = ({ nodeData }) => (
  
  <div>
    <div className="card">
      <div className="card-body">
        <h5 style={{ margin: "5px" }} className="card-title">
          {nodeData.attributes.age}
        </h5>
        <h6 style={{ margin: "5px" }} className="card-subtitle mb-2 text-muted">
          {nodeData.attributes.subtitle}
        </h6>
        <p style={{ margin: "5px" }} className="card-text">
          {nodeData.attributes.text}
        </p>
      </div>
    </div>
  </div>
  );



const CenteredTree = ()=> {
    const [height,setHeight] = useState(80)
    const [width,setWidth] = useState(150)
    const [yOffset,setYoffset] = useState(80)
    const [yClearance,setYclearance] = useState(80)
    const [translate,setTranslate] = useState({ x: 0, y: 0 })
    const [arr,setArr] = useState([])
    const [nodeData,setNodeData] = useState([])
    const treeContainer = useRef(null)

    useEffect(()=>{
      _getAllUser()
      // const dimensions = treeContainer.getBoundingClientRect();
      setTranslate({
          x: treeContainer.current.clientWidth / 2,
          y: yOffset
      })
    },[])


    function list_to_tree(list) {
      var map = {}, node, roots = [], i;
      
      for (i = 0; i < list.length; i += 1) {
      map[list[i].id] = i; // initialize the map
      list[i].children = []; // initialize the children
      }
      
      for (i = 0; i < list.length; i += 1) {
      node = list[i];
      node["attributes"] = {}
      if (node.parent_id !== "0") {
          // if you have dangling branches check that map[node.parentId] exists
          list[map[node.parent_id]].children.push(node);
      } else {
          roots.push(node);
      }
      }
      return roots;
    }


    async function _getAllUser(){
      const {data} = await axios.get('/api/')
      const res = data.data
      res.forEach(object=>{
        object.children = null
        if(object.parent_id === null){
          object.parent_id = "0"
        }
      })
     const results = list_to_tree(res)
     setNodeData(results)
  
    }
    function over(event){
      console.log("hello")
    }

  
    return (
      <div style={containerStyles} ref={treeContainer}>
        
        {nodeData.length !==0 &&
        <Tree
        data={nodeData}
        collapsible={false}
        translate={translate}
        scaleExtent={{ min: 1, max: 3 }}
        allowForeignObjects
        pathFunc="elbow"
        orientation="vertical"
        nodeSvgShape={{ shape: "none" }}
        nodeSize={{ x: 300, y: yClearance }}
        onClick={e => console.log(e)}
        onMouseOver={e => over(e)}
        nodeLabelComponent={{
          render: <Card />,
          foreignObjectWrapper: {
            style: {
              background: "lightblue",
              border: "1px solid black",
              width: width.toString() + "px",
              height: height.toString() + "px",
              x:width / -2,
              y:height / -2
            }
          }
        }}
      />
      }
      </div>
    );
  }



  export default CenteredTree;
