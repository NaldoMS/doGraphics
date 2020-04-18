import React from 'react';
import {Card,CardTitle,CardBody,CardText,CardHeader,Table,CardFooter,Row,Col,Button,Collapse} from 'reactstrap';
import ReferencesList from '../ReferencesList'

class SimplexPresentation extends React.Component{
    constructor (props){
        super(props)
        this.state={details:false}
    }

    //Função que, com base no uso de uma variável, retorna uma tabela com os recursos utilizados
    tablaDeRecursosFoot = (cantUsoVar,variableId) => {
        let {restricciones} = this.props;
        let tableBody = restricciones.filter(item => item.descripcion!== '')
        //Realizamos os cálculos
        .map( restri => 
            <tr key={'TdeV'+variableId+'R'+restri.ri}><td>{'R'+restri.ri}</td><td>{cantUsoVar*restri.coeficientes[variableId]}</td>
            <td>{restri.derecha-(cantUsoVar*restri.coeficientes[variableId])}</td></tr>)
        return(<Table size='sm' responsive>
            <thead><tr><th>Recurso</th><th>Usado</th><th>Diferencia</th></tr></thead>
            <tbody>{tableBody}</tbody>
        </Table>)

    }

    mapperAnalisisTable = (result) => {
        //A matriz para qual enviamos os resultados processados
        let tableResult=[];
        //Obtemos o conjunto de resultados com o formato [key,value]
        let resultSetArray =  Object.entries(result.solutionSet);
        //Obtemos a matriz simplex reduzida
        let matrix = result._tableau.matrix;
        //Obtemos os índices de cada coluna
        let indexByCol = result._tableau.varIndexByCol;
        //Obtemos a lista de variáveis de folgas e reais
        let variablesList = result._tableau.variablesPerIndex
        //Obtemos a lista de variáveis Reais
        let variablesRealesList = result._tableau.variablesPerIndex.filter(el => !el.isSlack);
        //Contamos a quantidade de elementos na linha de resultados (eles serão zero porque são simplex reduzidos)
        let itemsinCero = matrix[0].length - 1;
        //Obtemos quais são as variáveis ​​que não estão no conjunto de resultados (elas serão zero)
        let varsEnCero = variablesRealesList.filter( vari => !Object.keys(result.solutionSet).includes(vari.id) )
        //O número de colunas na linha de resultado - o número de variáveis ​​nulas, elas retornam a quantidade de folgas
        let slacksEnCero = itemsinCero - varsEnCero.length;

        //Processamos a INFO

        //Primeiro elemento da tabela, o ótimo.
        tableResult.push({name:'Optimo',item:'',value:result.evaluation});
        //Processamos todos os elementos a serem produzidos (conjunto de resultados)
        resultSetArray.forEach( ([key,value]) => tableResult.push({name:'Producir',item:'X'+key, value}) )
        //Processamos o uso de recursos, ou seja, os elementos extras da Linha de Resultados (Matriz)
        if (resultSetArray.length < matrix.length-1) {
            console.log('hola');
        }

        //Processamos os custos de oportunidade e os valores marginais
        matrix[0].slice(1)
                .forEach( (col,indCol) => {
                    //Criamos um novo item.
                    let item= {name:'',item:'',value:''};
                    //Verificamos se é Variável de folga ou Variável Real
                    if (variablesList[indexByCol[indCol+1]].isSlack){
                        item.name = 'Valor Marginal';
                        item.item = 'R'+indexByCol[indCol+1];
                        item.value = Math.abs(col);
                    }else{
                        item.name = 'Costo de Oportunidad';
                        item.item = 'X'+variablesList[indexByCol[indCol+1]].id;
                        item.value = Math.abs(col);
                    }
                    
                    //Colocamos o item na tabela de resultados
                    tableResult.push(item)})
            
        return tableResult
    }

    cardsVariablesRender = (variables,result) => variables
                                                    .filter(vari => vari.descripcion !== '')
                                                    .map( vari => 
                                                                <Card key={'C-V-'+vari.xi} outline color='secondary' className="w-100 mt-3 mx-auto">
                                                                    <CardHeader><CardTitle>{'Variável: X'+vari.xi}</CardTitle></CardHeader>    
                                                                    <CardBody>
                                                                        <Row><CardText>{
                                                                            result.solutionSet[vari.xi] ? 
                                                                            'Se recomenda produzir '+result.solutionSet[vari.xi]+' unidades':
                                                                            'Não recomendamos a produção'}
                                                                            {' de '+vari.descripcion}</CardText>
                                                                        </Row>
                                                                        <Row></Row> 
                                                            
                                                                    </CardBody>
                                                                    <CardFooter>
                                                                        <CardText>Tabela de Recursos:</CardText>
                                                                        {result.solutionSet[vari.xi] ? 
                                                                        this.tablaDeRecursosFoot(result.solutionSet[vari.xi],vari.xi):'Sem Consumo de Recursos'}
                                                                    </CardFooter>

                                                                </Card>)


    render () {
        //Obtemos o resultado obtido
        //Obtemos as variáves do PROPS
        let {variables, restricciones,result} = this.props;
        
    
        //Obtemos a informação para a tabela de análises
        let itemsTabAnalisis = this.mapperAnalisisTable(result);     
        //Renderizamos a tabela de análises
        let elementosTabAnalisis = itemsTabAnalisis.map( (item, index) => <tr key={'T-A-'+index}><td>{item.name}</td><td>{item.item}</td><td>{item.value}</td></tr>);
        // 
        let resultAnalisisCard = 
                        <Card outline color='secondary' className="w-100 mt-3 mx-auto">
                            <CardHeader><CardTitle><h4>Tabela de Análises</h4></CardTitle></CardHeader>
                            <CardBody>
                                <Table>
                                    <thead><tr><th></th><th>Elemento</th><th>Valor</th></tr></thead>
                                    <tbody>
                                        {elementosTabAnalisis}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>

        let resultDetalleCard = <Card outline color='secondary' className="w-100 mt-3 mx-auto">
                                <CardHeader>
                                    <Row>
                                        <Col className="text-left"><CardTitle><h5>Detalhe das Variáveis e Recursos:</h5></CardTitle></Col>
                                        <Col><Button outline size='sm'
                                            onClick={() => this.setState({details:!this.state.details})} 
                                            color={!this.state.details ? 'success':'danger'}>{!this.state.details ? 'Ver Detalhes':'Ocultar Detalhes'}</Button>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <Collapse isOpen={this.state.details}>
                                    <CardBody>
                                        {this.cardsVariablesRender(variables,result)}
                                    </CardBody>
                                </Collapse>
                            </Card>
        return(
                <CardBody>
                    <Row>{resultAnalisisCard}</Row>
                    <Row><ReferencesList variables={variables} restricciones={restricciones}/></Row>
                    <Row>{resultDetalleCard}</Row>
                </CardBody>)
    }
}

export default SimplexPresentation;