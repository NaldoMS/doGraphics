import React from "react";
import {
  Row,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Button,
  Col,
  Collapse,
  ListGroup,
  ListGroupItem,
  Badge
} from "reactstrap";

class ReferencesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { references: false };
  }

  listDescriptionsVarItems = array =>
    array
      .filter(item => item.descripcion !== "")
      .map(item => (
        <ListGroupItem key={"DLGIV" + item.xi} className="text-left">
          <Badge>{"X" + (item.xi+1)}</Badge>
          {" " + item.descripcion}
          <Badge className='float-right'>{'C: '+item.coeficiente}</Badge>
        </ListGroupItem>
      ));

  listDescriptionsResItems = array =>
    array
      .filter(item => item.descripcion !== "")
      .map(item => (
        <ListGroupItem key={"DLGIR" + item.ri} className="text-left">
          <Badge>{"R" + (item.ri+1)}</Badge>
          {" " + item.descripcion}
          <Badge className='float-right'>{item.coeficientes.map((co,indx) => co+' X'+(indx+1)+' ') + ' '+item.eq+' '+item.derecha}</Badge>
        </ListGroupItem>
      ));

  render() {
    //Obtendo as propriedades do pai
    let { variables } = this.props;
    let { restricciones } = this.props;

    return (
      <Card outline color="secondary" className="w-100 mt-3">
        <CardHeader>
          <Row>
            <Col className="text-left">
              <CardTitle>
                <h4>Referências</h4>
              </CardTitle>
            </Col>
            <Col>
              <Button
                outline
                size="sm"
                onClick={() => this.setState({ references: !this.state.references })}
                color={!this.state.references ? "success" : "danger"}
              >
                {!this.state.references ? "Ver referências" : "Ocultar referências"}
              </Button>
            </Col>
          </Row>
        </CardHeader>
        <Collapse isOpen={this.state.references}>
          <CardBody>
            <h5 className="text-center">Variáveis:</h5>
            <ListGroup>{this.listDescriptionsVarItems(variables)}</ListGroup>
            <h5 className="text-center mt-5">Restrições:</h5>
            <ListGroup>{this.listDescriptionsResItems(restricciones)}</ListGroup>
          </CardBody>
        </Collapse>
      </Card>
    );
  }
}

export default ReferencesList;
