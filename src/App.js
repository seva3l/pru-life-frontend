import React from 'react'
import Home from "./screens/Home"
import 'bootstrap/dist/css/bootstrap.min.css';
const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

function App() {
  return (
    <div style={styles}>
      <Home/>
    </div>
  )
}

export default App