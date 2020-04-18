import React from "react";
import { Card, CardTitle, CardHeader } from "reactstrap";
import solver from "javascript-lp-solver";
import SimplexPresentation from "./SimplexPresentation";
import GraphicPresentation from "./GraphicPresentation";

let convertAppToModelForSolverPrimal = datosApp => {
  //Obtemos os dados da aplicação
  let { restricciones, variables, objective, integer } = datosApp;
  variables = variables.filter(item => item.descripcion !== "");
  restricciones = restricciones.filter(item => item.descripcion !== "");
  //Pré carregamos o modelo
  let model = { optimize: "coeficiente", opType: "", constraints: {}, variables: {}, ints: {} };

  //Tratamos o objetivo
  model.opType = objective;

  //Verificamos se é um PL inteiro
  if (integer) {
    variables.forEach(vari => (model.ints[vari.xi] = 1));
  }
  //Tratamos as variáveis
  variables.forEach(vari => {
    //Geramos uma nova variável
    let newVari = {};
    newVari.coeficiente = vari.coeficiente;
    restricciones.forEach(restri => (newVari["r" + restri.ri] = restri.coeficientes[vari.xi]));
    // console.log(newVari);
    model.variables[vari.xi] = newVari;
  });
  //Tratamos as restrições
  restricciones.forEach(restri => {
    if (restri.eq === ">=") {
      let res = {};
      res.min = restri.derecha;
      model.constraints["r" + restri.ri] = res;
    } else {
      let res = {};
      res.max = restri.derecha;
      model.constraints["r" + restri.ri] = res;
    }
  });

  return model;
};

class Presentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { result: false , details: false };
  }

  componentDidMount() {
    let result = false ;
    if ( this.validateCoeficientes(this.props) ){
      console.log('Validado..');
      result = this.calculateResults();
    }
    console.log(result);
    this.setState({ result })
  }

  componentWillReceiveProps(futureProps) {
    if (this.props !== futureProps) {
      let result = false ;
      if ( this.validateCoeficientes(futureProps) ){
        console.log('Validado..');
        result = this.calculateResults();
      }
      console.log(result);
      this.setState({ result })
    }
  }

   //Função que valida se é possível operar com os dados inseridos
   validateCoeficientes = props => {
    console.log('Validando..');
    let {variables, restricciones } = props.status;
    //Verificando se os coeficientes das variáveis e das restrições não são nulos
    let varsOperatives = variables.filter(va => va.descripcion !== "");
    let verifQty = varsOperatives.length ? varsOperatives.every(va => va.coeficiente !== "") : false; 
    let restOperatives = restricciones.filter(re => re.descripcion !== "");
    let veriResQty = restOperatives.length ? restOperatives.every(re => re.coeficientes.every(co => co !== "") && re.derecha !== ""):false;
    return (verifQty && veriResQty) ? true : false;
  };

  //Função do cálculo do modelo
  calculateResults = () => {
    console.log('Calculating..');  
    //Convertemos o problema para o modelo do Solver.JS
    let model = convertAppToModelForSolverPrimal(this.props.status);

    //solver.js soluciona e nos devolve
    return solver.Solve(model, false, true);
  };

  render() {
    //Obtemos o resultado fornecido
    let { result } = this.state;
    let printResults;
    console.log('Factible?:'+result.feasible);
    if ( result.feasible ) {
      //Obtemos as variáveis do props
      let { variables, restricciones, method } = this.props.status;
      if (method === "simplex") {
        if (result.bounded) {
            printResults = <SimplexPresentation variables={variables} restricciones={restricciones} result={result} />
          } 
      }else{
            printResults = <GraphicPresentation
                variables={variables}
                restricciones={restricciones}
                graph={result.feasible}
                result={ result.bounded ? result.solutionSet : {} }
              />
        }
      }
      
    return (
      <>
        <Card outline color="info" className="w-100 mt-3 mx-auto">
          <CardHeader>
            <CardTitle>
              <h3>
                {result.feasible
                  ? result.bounded ? "O resultado ótimo da função objetivo é: " + result.evaluation
                    : "Solução ilimitada"
                  : "Solução não Factível" }
              </h3>
            </CardTitle>
          </CardHeader>
          {result.feasible && printResults}
        </Card>
      </>
    );
  }
}

export default Presentation;
