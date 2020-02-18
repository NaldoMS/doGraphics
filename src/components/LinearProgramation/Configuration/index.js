import React from "react";
import { ButtonGroup, Button, Container, Row, Col, Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { Alert, UncontrolledPopover, PopoverBody, PopoverHeader } from "reactstrap";
import Restrictions from "./Restrictions";
import Variables from "./Variables";

class Configuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = { faltaDescrip: "" };
  }

  //Función que permite validar si se ingresaron todos los cambios correspondientes en la etapa
  isValidated() {
    let { variables, restricciones } = this.props.status;
    let variablesDescriptionsMin = variables.filter(va => va.descripcion !== "");
    let restriccionesDescriptionsMin = restricciones.filter(re => re.descripcion !== "");
    if ((variablesDescriptionsMin.length > 1) & (restriccionesDescriptionsMin.length > 0)) {
      this.props.lastStep(1);
      this.setState({ faltaDescrip: "" });
      return true;
    } else if (variablesDescriptionsMin.length < 2) {
      this.setState({ faltaDescrip: "É necessário no mínimo duas variáveis." });
    } else if (restriccionesDescriptionsMin.length < 1) {
      this.setState({ faltaDescrip: "É necessário no mínimo uma restrição." });
    }
    return false;
  }
  
  //Funcion que se encarga de traspasar los cambios al padre
  handleRestrictions = restricciones => this.props.handleRestricciones(restricciones)
  
  //Funcion que se encarga de traspasar los cambios al padre
  handleVariables = variables => this.props.handleVariables(variables)
  
  //Modelos
  showModels = () => this.props.showModels()

  render() {
    //Obtenemos de las props, las varaibles y restricciones.
    let {variables,restricciones,method } = this.props.status;

    let buttonsMethods = (
      <ButtonGroup id="ButtUtil">
        <Button
          outline
          onClick={ () => this.props.handleMethod("graph")}
          active={this.props.status.method === "graph"}
          color="primary">
          Gráfico
        </Button>
        <Button
          outline
          onClick={ () => this.props.handleMethod("simplex")}
          active={this.props.status.method === "simplex"}
          color="primary">
          Simplex
        </Button>
      </ButtonGroup>
    );
    let buttonsOptType = (
      <ButtonGroup>
        <Button
          outline
          onClick={() => this.props.handleObjective("max")}
          active={this.props.status.objective === "max"}
          color="primary"
        >
          Maximizar
        </Button>
        <Button
          outline
          onClick={() => this.props.handleObjective("min")}
          active={this.props.status.objective === "min"}
          color="primary"
        >
          Minimizar
        </Button>
      </ButtonGroup>
    );

    return (
      <>
        <h3>Começamos configurando nosso modelo</h3>
        <Container>
          <Row>
            <Col>
              <UncontrolledPopover flip={false} trigger="hover" placement="top" target="CardInteger">
                <PopoverBody>Esta função ativa ou desativa a Programação Linear Inteira.</PopoverBody>
              </UncontrolledPopover>
              <Card outline color="secondary" id="CardInteger" className="mt-2 mx-auto">
                <CardHeader>Programação Inteira</CardHeader>
                <CardBody>
                  <Button
                    outline
                    color={this.props.status.integer ? "success" : "danger"}
                    onClick={() => this.props.toggleInteger()}
                  >
                    {this.props.status.integer ? "Ativa" : "Inativa"}
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <UncontrolledPopover flip={false} trigger="hover" placement="top" target="CardUtil">
                <PopoverBody>
                  Aqui selecione o método de cálculo e visualização dos resultados.
                </PopoverBody>
              </UncontrolledPopover>
              <Card outline color="secondary" id="CardUtil" className="mt-3 mx-auto">
                <CardHeader>Método utilizado</CardHeader>
                <CardBody>{buttonsMethods}</CardBody>
              </Card>
            </Col>

            <Col>
              <UncontrolledPopover flip={false} trigger="hover" placement="top" target="CardOpt">
                <PopoverBody>
                  E aqui o tipo de otimização que deseja: se deseja maximizar ou minimizar a
                  função.
                </PopoverBody>
              </UncontrolledPopover>
              <Card outline color="secondary" id="CardOpt" className="mt-3 mx-auto">
                <CardHeader>Tipo de otimização</CardHeader>
                <CardBody>{buttonsOptType}</CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <UncontrolledPopover flip={false} trigger="hover" placement="top" target="CardVariables">
              <PopoverHeader>Variables</PopoverHeader>
              <PopoverBody>
                Aqui você deve informar as variáveis que farão parte do modelo, elas são de carregamento dinâmico.
              </PopoverBody>
            </UncontrolledPopover>
            <Card outline color="secondary" id="CardVariables" className="w-100 mt-3 mx-auto">
              <CardHeader>
                <CardTitle className="text-left">
                  <h4>Variáveis</h4>
                </CardTitle>
              </CardHeader>
              <CardBody><Variables method={method} handleVariables={this.handleVariables} variables={variables}/></CardBody>
            </Card>
          </Row>
          <Row>
            <UncontrolledPopover flip={false} trigger="hover" placement="top" target="CardRestri">
              <PopoverHeader>Restrições</PopoverHeader>
              <PopoverBody>
               Aqui você deve informar as restrições que farão parte do modelo, estas também são de carregamento dinâmico.
              </PopoverBody>
            </UncontrolledPopover>
            <Card outline color="secondary" id="CardRestri" className="w-100 mt-3 mx-auto">
              <CardHeader>
                <CardTitle className="text-left">
                  <h4>Restrições</h4>
                </CardTitle>
              </CardHeader>
              <CardBody><Restrictions handleRestrictions={this.handleRestrictions} restricciones={restricciones}/></CardBody>
            </Card>
          </Row>
          {this.state.faltaDescrip !== "" && (
            <Row className="mt-3">
              <Alert className="mx-auto" color="danger">
                {this.state.faltaDescrip}
              </Alert>
            </Row>
          )}
        </Container>
      </>
    );
  }
}

export default Configuration;
