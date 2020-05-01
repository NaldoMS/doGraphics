import React from 'react';
import {Link} from 'react-router-dom';
import { Button, Jumbotron, Container, Row, Col } from "reactstrap";
import Header from '../header.js';

const Evaluete = () =>{
    return(
        <Container fluid className="App">
        <Header/>
        <Row className="">
            <Col xs={12} md={6} className="mx-auto my-5">
                <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfwTDRd2pQQ8NuwyAx6rbHSY6Xyasfg9s6n4Cue05QPFEdg2A/viewform?embedded=true" width="640" height="2583" frameborder="0" marginheight="0" marginwidth="0">Carregando…</iframe>
            </Col>
        </Row>
    </Container>
  )
};

export default Evaluete;