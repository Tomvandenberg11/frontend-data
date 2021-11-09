import React from 'react'
import ReactDOM from 'react-dom'
import './style.css'
import TestSVG from "./Components/TestSVG";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`

const Main = () => {
  return (
    <Wrapper>
      <TestSVG/>
    </Wrapper>
  )
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);