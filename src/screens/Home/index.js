import React,{useState,useEffect} from 'react'
import CenteredTree from '../components/CenteredTree'
import {Button,Modal,Form,FormControl,Toast,Card,ToastContainer} from 'react-bootstrap'
import styles from './_styles'
import axios from '../components/axios'

const Home = () => {

    //add modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //view modal
    const [viewShow, setViewShow] = useState(false);
    const viewHandleClose = () => setViewShow(false);
    const viewHandleShow = () => setViewShow(true);
    //edit modal
    const [editShow, setEditShow] = useState(false);
    const editHandleClose = () => setViewShow(false);
    const editHandleShow = () => setEditShow(true);

    //toast
    const [toastShow,setToastShow] = useState(false)
    const [name,setName] = useState("")
    const [age,setAge] = useState(0)
    const [description,setDescription] = useState("")
    const [isParent,setIsParent] = useState(false)
    const [parents,setParents] = useState([])
    const [parentId,setParentId] = useState(0)
    const [data,setData] = useState([])
    const [user,setUser] = useState({})

    useEffect(()=>{
        _getData()
    },[])

    //get all data
    async function _getData(){
        const {data} = await axios.get('/api/')
        const res = data.data
        setData(res)
        const parents = res.filter(val=>val.isParent === 1)
        setParents(parents)

    }

    //get one user
    async function _getOneUser(id){
        setViewShow(false)
        const {data} = await axios.get(`/api/${id}`)
        console.log(data.user)
        setUser(data.user)
        setEditShow(true)
    }

    //create new record
    async function _createUser(){
        setShow(false)
        let params = {
            name,
            description,
            age,
            isParent,
            parent_id: parentId
        }
        console.log(params)
        const res = await axios.post("/api/",params)
        setToastShow(true)
        _getData()
    }

    async function _deleteUser(id){
        const res = await axios.delete(`/api/${id}`)
        console.log(res)
        _getData()
        setToastShow(true)
    }

    async function _updateUser(){
        
        let params = {
            name: user.name,
            age: user.age,
            description: user.description
        }
        const res = await axios.put(`/api/${user.id}`,params)
        console.log(res)
        setEditShow(false)
        setToastShow(true)
    }

    function _toast(){
        return(
        <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setToastShow(false)} show={toastShow} delay={2000} autohide bg="success">
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">PRU LIFE</strong>
          </Toast.Header>
          <Toast.Body>Success</Toast.Body>
        </Toast>
        </ToastContainer>
        )
    }
    function _addModal(){
        return(
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>  
                <Modal.Title>Create New Record</Modal.Title>
                </Modal.Header>
                <Form style={styles.form}>
                    <Form.Select aria-label="Default select example" onChange={e=>setParentId(e.target.value)} >
                        <option>Choose Parents</option>
                        {parents.map(val=>(
                            <option value={val.id}>{val.name}</option>
                        ))}
                    </Form.Select>
                    <Form.Group className="mb-3" controlId="formBasicText">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" onChange={e=>setName(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicText">
                        <Form.Label>Age</Form.Label>
                        <Form.Control type="text" placeholder="Age" onChange={e=>setAge(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicText">
                        <Form.Label>Description</Form.Label>
                        <FormControl as="textarea" aria-label="With textarea" onChange={e=>setDescription(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check checked={isParent} onClick={()=>setIsParent(!isParent)} type="checkbox" label="Are you a Parent?" />
                    </Form.Group>
                </Form>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={()=>_createUser()}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    function _editModal(){
        return(
            <Modal show={editShow} onHide={()=>setEditShow(false)}>
                <Modal.Header closeButton>  
                <Modal.Title>Update</Modal.Title>
                </Modal.Header>
                <Form style={styles.form}>
                    <Form.Group className="mb-3" controlId="formBasicText">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder={user.name}  onChange={e=>setUser(user=>({
                            ...user,
                            ...{name:e.target.value}
                        }))} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicText">
                        <Form.Label>Age</Form.Label>
                        <Form.Control type="text" placeholder={user.age} onChange={e=>setUser(user=>({
                            ...user,
                            ...{age:e.target.value}
                        }))} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicText">
                        <Form.Label>Description</Form.Label>
                        <FormControl as="textarea" aria-label="With textarea" placeholder={user.description}  onChange={e=>setUser(user=>({
                            ...user,
                            ...{description:e.target.value}
                        }))} />
                    </Form.Group>
                </Form>
                <Modal.Footer>
                <Button variant="secondary" onClick={()=>setEditShow(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={()=>_updateUser()}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    function _viewModal(){
        return(
            <Modal show={viewShow} onHide={viewHandleClose}>
                <Modal.Header closeButton>  
                <Modal.Title>Data</Modal.Title>
                </Modal.Header>     
                <Modal.Body className="show-grid">
                    <div>
                        {data.length !== 0 &&
                        data.map(val=>(
                            <Card style={{marginBottom:10}} key={val.id}>
                                <Card.Body>
                                    <Card.Title>{val.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{val.age}</Card.Subtitle>
                                    <Card.Text>
                                    {val.description}   
                                    </Card.Text>
                                    <Button variant="secondary" onClick={()=>_getOneUser(val.id)}>
                                        Edit
                                    </Button>
                                    <Button style={{marginLeft:10}} variant="danger" onClick={()=>_deleteUser(val.id)}>
                                        Delete
                                    </Button>
                                </Card.Body>
                            </Card>
                        ))
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={viewHandleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={()=>_createUser()}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    return (
        <div style={styles.main}>
            <Button variant="primary" onClick={handleShow}>
                Add data
            </Button>
            <Button style={{marginLeft:10}} variant="success" onClick={viewHandleShow}>
                View Data
            </Button>
            {_addModal()}
            {_viewModal()}
            {_editModal()}
            {_toast()}
            <CenteredTree/>
        </div>
    )
}

export default Home;