import React from "react";
import { Container, Row, Card, CardBody, CardHeader, CardTitle, Alert } from "reactstrap";
import Restriccion from "./Restriccion";
import FuncionObj from "./FuncionObj";
import ReferencesList from "../ReferencesList";

class Processing extends React.Component {
  constructor(props) {
    super(props);
    this.state = { faltaCoe: "" };
  }

  isValidated() {
    //Verificando se os coeficientes das variables y das restrições não são nulos
    let verifQty = this.props.status.variables
      .filter(va => va.descripcion !== "")
      .every(va => va.coeficiente !== "");
    let veriResQty = this.props.status.restricciones
      .filter(re => re.descripcion !== "")
      .every(re => re.coeficientes.every(co => co !== "") && re.derecha !== "");
    if (verifQty && veriResQty) {
      console.log(verifQty+'dff:'+veriResQty);
      
      this.props.lastStep(2);
      this.setState({ faltaCoe: "" });
      return true;
    } else {
      let faltaCoe;
      faltaCoe = veriResQty
        ? "Falta algum coeficiente da Função"
        : "Falta algum coeficiente nas Restrições";
      this.setState({ faltaCoe });
      return false;
    }
  }

  //No próximo handler, o coeficiente é obtido da entrada de uma variável específica.
  handleCoefVar = event => {
    let { value, name } = event.target;
    if (value) {
      let { variables } = this.props.status;
      variables[name].coeficiente = parseInt(value);
      this.props.handleVariables(variables);
      console.log(this.props.status.variables);
    }
  };

  handleCoefRes = (event, ri) => {
    let { name, value } = event.target;
    let { restricciones } = this.props.status;
    console.log("Na Res:" + ri + ", no campo:" + name + ",com o valor:" + value);

    switch (name) {
      case "derecha":
        restricciones[ri].derecha = Number(value);
        break;
      case "eq":
        restricciones[ri].eq = value;
        break;
      default:
        restricciones[ri].coeficientes[name] = Number(value);
        break;
    }
    console.log(restricciones);
    this.props.handleRestricciones(restricciones);
  };

  render() {
    //Temos as propriedades do Super
    let { variables } = this.props.status;
    let { restricciones } = this.props.status;
    let varsOperativas = variables.filter(va => va.descripcion !== "").length;

    //Geramos a renderização para cada um dos elementos dos arranjos obtidos anteriormente.

    let restriccionesInput = restricciones
      .filter(item => item.descripcion !== "")
      .map((restriccion, index) => (
        <Restriccion
          className="mt-1"
          key={"R" + index}
          handleCoefRes={this.handleCoefRes}
          cantVariables={varsOperativas}
          restriccion={restriccion}
        />
      ));

    return (
      <>
        <h3>Carregamos os dados do nosso modelo</h3>
        <Container>
          <Row>
            <ReferencesList variables={variables} restricciones={restricciones} />
          </Row>
          <Row>
            <Card outline color="secondary" className="w-100 mt-3">
              <CardHeader>
                <CardTitle className="text-left">
                  <h4>Função objetivo</h4>
                </CardTitle>
              </CardHeader>
              <CardBody className="mx-auto">
                <FuncionObj
                  variables={variables}
                  handleCoefVar={this.handleCoefVar}
                  objective={this.props.status.objective}
                />
              </CardBody>
            </Card>
          </Row>
          <Row>
            <Card outline color="secondary" className="w-100 mt-3">
              <CardHeader>
                <CardTitle className="text-left">
                  <h4>Restrições</h4>
                </CardTitle>
              </CardHeader>
              <CardBody>{restriccionesInput}</CardBody>
            </Card>
          </Row>
          {this.state.faltaCoe !== "" && (
            <Row className="mt-3">
              <Alert className="mx-auto" color="danger">
                {this.state.faltaCoe}
              </Alert>
            </Row>
          )}
        </Container>
      </>
    );
  }
}

export default Processing;
