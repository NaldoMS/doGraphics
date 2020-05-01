import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import { 
    Jumbotron, 
    Container, 
    Row, 
    Col,
} from "reactstrap";
import logoFbuni from './logoFbuni.png';
import logoDG from './logoSite.png';
import Header from '../header.js'

const Inicio = () =>{
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return(
        <Container fluid className="App">
        <Header/>
        <Row className="Linha">
            <Col xs={12} md={10} className="mx-auto my-4">
                <Jumbotron className="Jumbo">
                    <Row>
                        <Col className="Logos" lg={6}>
                            <img className="LogoDg mx-auto" src={logoDG} alt="Logo"/>
                        </Col>
                        
                        <Col className="Logos" lg={6}>
                            <img className="LogoFb mx-auto" src={logoFbuni} alt="Logo" />
                        </Col>
                    </Row>
                    <Row>
                        <h2 className="mx-auto">Bem vindo ao doGraphics!</h2>
                    </Row>
                    <Row className="mt-12">
                        <p>Lorem Ipsum is simply dummy text of the printing and 
                        typesetting industry. Lorem Ipsum has been the 
                        industry's standard dummy text ever since the 1500s, 
                        when an unknown printer took a galley of type and scrambled 
                        it to make a type specimen book. It has survived not only 
                        five centuries, but also the leap into electronic typesetting, 
                        remaining essentially unchanged. It was popularised in the 
                        1960s with the release of Letraset sheets containing Lorem 
                        Ipsum passages, and more recently with desktop publishing 
                        software like Aldus PageMaker including versions of Lorem Ipsum.</p>

                        <p>Lorem Ipsum is simply dummy text of the printing and 
                        typesetting industry. Lorem Ipsum has been the 
                        industry's standard dummy text ever since the 1500s, 
                        when an unknown printer took a galley of type and scrambled 
                        it to make a type specimen book. It has survived not only 
                        five centuries, but also the leap into electronic typesetting, 
                        remaining essentially unchanged. It was popularised in the 
                        1960s with the release of Letraset sheets containing Lorem 
                        Ipsum passages, and more recently with desktop publishing 
                        software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                    </Row>
                </Jumbotron>
            </Col>
        </Row>
    </Container>
  )
};

export default Inicio;