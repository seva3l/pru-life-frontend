import React from 'react'

const Card = ({nodeData}) => {
  return (
  
    <div>
       {console.log("node",nodeData)}
        <div className="card">
            <div className="card-body">
                <h5 style={{ margin: "2px" }} className="card-title">
                {nodeData.attributes.name}
                </h5>
                <h6 style={{ margin: "2px" }} className="card-subtitle mb-2 text-muted">

                </h6>
                <p style={{ margin: "5px" }} className="card-text">
                {nodeData.description}
                </p>
            </div>
        </div>
  </div>
  )
}

export default Card