import React from 'react';
import {Link} from 'react-router-dom';
import { Button, Jumbotron, Container, Row, Col } from "reactstrap";

const LinearProgramation = () =>{
    return(
        <Container fluid className="App">
        <Row className="">
            <Col xs={12} md={6} className="mx-auto my-5">
                <Jumbotron>
                    <Row>
                        <h2 className="mx-auto">Ok! Agora escolha uma modalidade de trabalho</h2>
                    </Row>
                    <Row className="mt-3 mx-auto">
                        <Col>
                            <Link to={"/LinearProgramation/InSteps"}>
                                <Button size='lg' outline color="success">Passo-a-passo</Button>
                            </Link>
                                
                        </Col>
                    </Row>
                    <Row className="mt-3 mx-auto">
                        <Col>
                            <Link to={"/LinearProgramation/SinglePage"} >
                                <Button size='lg' outline color="success">Em uma única página</Button>

                            </Link>
                        </Col>
                    </Row>
                </Jumbotron>
            </Col>
        </Row>
    </Container>
  )
};

export default LinearProgramation;