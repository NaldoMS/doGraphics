import React from "react";
import { Container, Col, Row, Jumbotron} from "reactstrap";
import ModalModels from "../../Models"
import Configuration from "../Configuration";
import Processing from "../Processing";
import Presentation from "../Presentation";
import Header from '../../header.js';

class SinglePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model:{
        variables: [{ xi: 0, descripcion: "", coeficiente: "" }, { xi: 1, descripcion: "", coeficiente: "" }],
        restricciones: [{ ri: 0, descripcion: "", coeficientes: [], eq: ">=", derecha: "" }],
        method: "graph",
        objective: "max",
        integer: false
      },
      result: true,
      modelsOpen:false
    };
  }

  //Esta função lida com a alteração nas restrições
  handleRestricciones = restricciones => {
    let { model } = this.state;
    model.restricciones = restricciones;
    this.setState({ model, changes: true });
  };
  //Esta função lida com a mudança nas variáveis
  handleVariables = variables => {
    let { model } = this.state;
    model.variables = variables;
    this.setState({ model, changes: true });
  };
  //Esta função lida com a troca de métodos
  handleMethod = method => {
    let { model } = this.state;
    model.method = method;
    this.setState({ model, changes: true });
  };
  //Esta função lida com a alteração do objetivo de otimização
  handleObjective = objective => {
    let { model } = this.state;
    model.objective = objective;
    this.setState({ model, changes: true });
  };
  toggleInteger = () => {
    let { model } = this.state;
    model.integer = !model.integer;
    this.setState({ model, changes: true });

  }
  //Esta função salva o resultado (não utilizado no momento)
  handleResult = result => this.setState({ result });
  //Esta função permite o cálculo na última etapa
  lastStep = step => console.log('Changes')
  
  finishButtonClick = result => console.log("Em algum momento irá imprimir os resultados!");

  showModels = () => this.setState({modelsOpen:!this.state.modelsOpen});

  setModel = model => this.setState({ model, changes:true });

  render() {
    let { modelsOpen, model, result } = this.state
    console.log('Apresentação:'+result);
    
    return (
      <Container fluid className="App">
      <Header/>
        <Row className="Linha">
            <Col xs={12} md={10} className="mx-auto my-4">
            <Row className="Linha">
                <Jumbotron className='w-100'>
                    <Configuration   status={model}
                    handleMethod={this.handleMethod}
                    handleVariables={this.handleVariables}
                    handleRestricciones={this.handleRestricciones}
                    lastStep={this.lastStep}
                    toggleInteger={this.toggleInteger}
                    handleObjective={this.handleObjective}
                    showModels={this.showModels}/>
                </Jumbotron>  
            </Row>

            <Row>
                <Jumbotron className='w-100'>
                    <Processing status={model} handleVariables={this.handleVariables}
                    handleRestricciones={this.handleRestricciones} lastStep={this.lastStep}/>
                </Jumbotron>
                
            </Row>

            <Row>
                <Jumbotron className='w-100'>
                    <Presentation status={model} handleResult={this.handleResult} lastStep={this.lastStep}/>
                </Jumbotron>
            </Row>
          
          </Col>
        </Row>
        <Row><ModalModels open={modelsOpen} model={model} setModel={this.setModel} handleClose={this.showModels}/></Row>
      </Container>
    );
  }
}

export default SinglePage;
