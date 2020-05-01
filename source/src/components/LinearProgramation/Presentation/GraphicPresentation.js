import React from 'react';
import {CardBody, Card, CardHeader,CardFooter,Table,Row,Col,CardTitle,Button} from 'reactstrap';
import {XYPlot, XAxis, YAxis, HorizontalGridLines,LineSeries, AreaSeries, VerticalGridLines,MarkSeries,DiscreteColorLegend,Hint} from 'react-vis';
import {Expression, Equation,Fraction} from 'algebra.js';
import ReferencesList from '../ReferencesList';
var randomColor = require('randomcolor');

class GraphicPresentation extends React.Component{
    constructor (props){
        super(props)
        this.state={lineFunctional:[],convexPoints:[],tableResult:'',optimMark:[],points:[],lines:[],referencias:[],value:null,areaGraph:false}
    }

    componentDidMount() {
        if ( this.props.graph ){
            this.updateState()
        }
    }

    componentDidUpdate(prevProps){
        if ( prevProps !== this.props ){
            if ( this.props.graph ){
                this.updateState()
            }
        }
    }

    updateState = () =>{
        let {variables,restricciones,result} = this.props
        //Filttramos as restrições e variáveis que não foram filtradas antes.
        restricciones = restricciones.filter(elem => elem.descripcion!=='');
        variables = variables.filter(elem => elem.descripcion!=='');
        //Obtemos os coeficientes a avaliar em Z
        let coefToValueZ = this.getCoeficientesToEv(variables)
        //Obtemos a paleta de cores.
        let referencias = this.getColorList(restricciones);
        //Obtemos as linhas e as Expressões
        let {lines,expresiones,highestValueX,highestValueY} = this.getLinesAndExpressions(restricciones);
        //Obtemos os pontos de marca geral
        let {points,convexPoints} = this.getPoints(restricciones,expresiones,result,highestValueX,highestValueY)    
        //Obtemos o Ponto ótimo
        let optimMark = []
        if( Object.entries(result).length ){ optimMark = [this.getOptimPoint(result)]}
        //Obtemos a Reta da função.
        let lineFunctional = this.getObjectiveFunctionLine(variables,optimMark[0],highestValueX,highestValueY);
        //Obtemos a tabela de resultados.
        let tableResult = this.getTableResult(optimMark.concat(points),coefToValueZ,restricciones)
        //Armazenamos o Estado.
        this.setState({referencias,lines,points,optimMark,convexPoints,lineFunctional,tableResult});
    }

    getCoeficientesToEv =  variables => {
        let coef={x:0,y:0};
        coef.x = variables[0].coeficiente;
        coef.y = variables[1].coeficiente;
        return coef
    }


    getLinesAndExpressions = restricciones => {
        const getFrac = real => new Fraction(Math.pow(10,(real - real.toFixed()).toString().length - 2)*real, Math.pow(10,(real - real.toFixed()).toString().length - 2)) 
        //Tipos de espressões: 0: Constante em X; 1: Constante em Y; 2: Reta com pendente.
        let expresiones = [];
        let arrayDeRestriccionesConLosDosCoef =  restricciones.filter(el=> ( el.coeficientes[0] > 0 && el.coeficientes[1] > 0) )
        let highestValueY = Math.max.apply(Math,arrayDeRestriccionesConLosDosCoef.map( restri => (restri.derecha / restri.coeficientes[1])));
        let highestValueX = Math.max.apply(Math,arrayDeRestriccionesConLosDosCoef.map( restri => (restri.derecha / restri.coeficientes[0])));
        
        let lines = restricciones.map( restri => {
      

            let xNum = !Number.isInteger(Number(restri.coeficientes[0])) ? getFrac(Number(restri.coeficientes[0])):Number(restri.coeficientes[0]);

            let yNum = !Number.isInteger(Number(restri.coeficientes[1])) ? getFrac(Number(restri.coeficientes[1])):Number(restri.coeficientes[1]);
 
            //Se possue ambos coeficientes então é uma reta com pendente.
            if ( xNum !== 0  &&  yNum!== 0) {
                let x = new Expression('x').multiply(xNum);
                let y = new Expression('y').multiply(yNum);
                let expressRestri = new Expression().add(x).add(y);  
                let restriEquation = new Equation(expressRestri,restri.derecha)
                expresiones.push({restriEquation,tipo:2})
                let yEqu = (new Equation(restriEquation.solveFor('x'),0)).solveFor('y');
                let xEqu = (new Equation(restriEquation.solveFor('y'),0)).solveFor('x');
                //Analisamos pendentes positivas e negativas
                if (xEqu >= 0 && yEqu >= 0) {
                    //Se é Pendente negativa temos que cortar nos pontos +x y +y
                    if (restri.eq === '>=') {
                        return([{x:0,y:yEqu,y0:highestValueY},{x:xEqu,y:0,y0:highestValueY},{x:highestValueX,y:0,y0:highestValueY}])
                    }else{
                        return([{x:0,y:yEqu},{x:xEqu,y:0}])
                    }
                    
                }else{
                    //Se é pendente positiva corta apenas em +x ou em +y
                    if(yEqu >= 0){
                        //Se corta em +y , então calculamos o punto para o grafico em +x
                        let relation = Math.abs(yEqu/xEqu)
                        let valY = yEqu+highestValueX*relation
                        //Se o valor calculado para Y for menor que o máximo, nós o levamos para lá e atualizamos o Xmax
                        if (valY < highestValueY){
                            valY = highestValueY
                            highestValueX = (highestValueY-yEqu)/relation
                        }else{
                            highestValueY = valY            
                        }
                        return([{x:0,y:yEqu},{x:highestValueX,y:valY}])
                    }else{
                        if (xEqu >= 0) {
                            //Se cortar em + x, calcularemos o ponto do gráfico em + 
                            let relation = Math.abs(xEqu/yEqu)
                            let valX = xEqu+highestValueY*relation
                            //Se o valor calculado para Y for menor que o máximo, levaremos para lá e atualizaremos o YMax
                            if (valX < highestValueX){
                                valX = highestValueX
                                highestValueY = (highestValueX-xEqu)/relation
                            }else{
                                highestValueX = valX
                            }
                            return([{x:xEqu,y:0},{x:valX,y:highestValueY}])
                        }
                    }
                }
            }else {
                //Caso contrário, é uma constante.
                if (xNum !== 0) {
                    //Constante em X
                    let x = new Expression('x').multiply(xNum);
                    let restriEquation = new Equation(x,restri.derecha)
                    expresiones.push({restriEquation,tipo:0})
                    let xEqu = restriEquation.solveFor('x');
                    if (xEqu >= 0 ){
                        return([{x:xEqu,y:0},{x:xEqu,y:highestValueY}])
                    }
                }else {
                    //Constante em Y
                    let y = new Expression('y').multiply(yNum);
                    let restriEquation = new Equation(y,restri.derecha)
                    expresiones.push({restriEquation,tipo:1})
                    let yEqu = restriEquation.solveFor('y')
                    if ( yEqu >= 0) {
                        return([{x:0,y:yEqu},{x:highestValueX,y:yEqu}])
                    }               
                } 
            }
        })
        
        return { lines,expresiones,highestValueX,highestValueY }
    }

    getColorList = restricciones => restricciones.map( restri => Object({title: 'R'+restri.ri+' Tipo:'+restri.eq, color: randomColor({hue: 'random',luminosity: 'ligth'})}))

    getOptimPoint = solSet => {
        console.log('Gerando o ponto ótimo');
        //Analisamos o Ponto ótimo.
        if ( solSet['0'] && solSet['1'] ) {return{x:Number(solSet['0']).toFixed(2),y:Number(solSet['1']).toFixed(2),P:'0 - ÓTIMO'}
        }else if ( solSet['0'] ) {return{x:Number(solSet['0']).toFixed(2),y:(0).toFixed(2),P:'0 - ÓTIMO'}
        }else { return{x:(0).toFixed(2),y:Number(solSet['1']).toFixed(2),P:'0 - ÓTIMO'}}
    }

    getObjectiveFunctionLine = (variables,optimPoint,xMax,yMax) => {
        console.log('Obtendo a linha');
        //Função que devolve uma Fração de Algebra.js a partir de um numero real.
        const getFrac = real => new Fraction(Math.pow(10,(real - real.toFixed()).toString().length - 2)*real, Math.pow(10,(real - real.toFixed()).toString().length - 2)) 
        if (optimPoint){
            try {
                if (variables[0].coeficiente !== 0  && variables[1].coeficiente !== 0) {

                    let xPoint = !Number.isInteger(Number(optimPoint.x)) ? getFrac(Number(optimPoint.x)):Number(optimPoint.x);

                    let yPoint = !Number.isInteger(Number(optimPoint.y)) ? getFrac(Number(optimPoint.y)):Number(optimPoint.y);
               
                    let xExp = new Expression('x').subtract(xPoint).multiply(variables[0].coeficiente);
                    let yExp = new Expression('y').subtract(yPoint).multiply(variables[1].coeficiente);
                    
                    let expFunObj = new Equation(new Expression().add(xExp).add(yExp),0);  
          
                    let xEqu = (new Equation(expFunObj.solveFor('y'),0)).solveFor('x');

                    let yEqu = (new Equation(expFunObj.solveFor('x'),0)).solveFor('y');
        
                    //Analisamos pendentes positivas e negativas
                    //Analisamos os pontos
                    if (xEqu >= 0 && yEqu >=0){
                        
                            if (xEqu > xMax && yEqu > yMax) {
                                let yRelation = (xEqu/yEqu)
                                let xRelation = (yEqu/xEqu)
                                let xVal = xEqu - yMax/xRelation
                                let yVal = yEqu - xMax/yRelation
                                return [{x:xMax,y:yVal},{x:xVal,y:yMax}]
                            }else if (xEqu <= xMax && yEqu <= yMax) {
                                return [{x:xEqu,y:0},{x:0,y:yEqu}]
                            }else if (xEqu > xMax){
                                    let yRelation = (xEqu/yEqu)
                                    let yVal = yEqu - xMax/yRelation
                                    return [{x:xMax,y:yVal},{x:0,y:yEqu}]
                                }else{
                                    let xRelation = (yEqu/xEqu)
                                    let xVal = xEqu - yMax/xRelation
                                    return [{x:xEqu,y:0},{x:xVal,y:yMax}]
                                }
                    }else if ( xEqu < 0 && yEqu < 0 ) {
                        return [{x:xEqu,y:0},{x:0,y:yEqu}]
                    }else if ( xEqu >= 0 ) {
                        if (xEqu > xMax){
                            let yRelation = (xEqu/yEqu)
                            let yVal = yEqu - xMax/yRelation
                            return [{x:xMax,y:yVal},{x:0,y:yEqu}]
                        }else{
                            let xRelation = (yEqu/xEqu)
                            let xVal = xEqu - yMax/xRelation
                            if (xVal > xMax){
                                
                                let xRelation = Math.abs(yEqu/xEqu)
                                let yVal = xMax*xRelation + yEqu
                                return [{x:xEqu,y:0},{x:xMax,y:yVal}]
                            }else{            
                                return [{x:xEqu,y:0},{x:xVal,y:yMax}]
                            }    
                        }
                    }else{
                        if (yEqu > yMax){
                            console.log('Caso esteja pendente de desenvolvimento, o que fazemos? Damos mais altura para mostrar a linha?');
                            return []
                        }else{
                            let yRelation = Math.abs(yEqu/xEqu)
                            let xVal = yRelation * (yMax - yEqu)
                            if (xVal > xMax){
                                console.log('Caso pendente de Verificação XVal > xMAx');
                                let xRelation = Math.abs(xEqu/yEqu)
                                let yVal = xMax*xRelation + yEqu
                                return [{x:xEqu,y:0},{x:xMax,y:yVal}]
                            }else{      
                                return [{x:0,y:yEqu},{x:xVal,y:yMax}]
                            }    
                        }
                    }
                }else if( variables[0].coeficiente !== 0) {
                    //Constante em X
                    
                    let xPoint = !Number.isInteger(Number(optimPoint.x)) ? getFrac(Number(optimPoint.x)):Number(optimPoint.x);
                    let xExp = new Expression('x').subtract(xPoint).multiply(variables[0].coeficiente);   
                    let xEqu = (new Equation(xExp,0)).solveFor('x');
                   
                    if (xEqu >= 0 ){
                        return([{x:xEqu,y:0},{x:xEqu,y:yMax}])
                    }     
                }else{
                    //Constante em Y
                    let yPoint = !Number.isInteger(Number(optimPoint.y)) ? getFrac(Number(optimPoint.y)):Number(optimPoint.y);
                    let yExp = new Expression('y').subtract(yPoint).multiply(variables[1].coeficiente);
                    let yEqu = (new Equation(yExp,0)).solveFor('y');
                    if (yEqu >= 0 ){
                        return([{x:0,y:yEqu},{x:xMax,y:yEqu}])
                    }     
                }
                
            } catch (error) {
                console.log(error);
                return [] 
            }

        }else return []      
    }

    getPoints = (restricciones,expresiones,solSet,xMax,yMax) => {
        console.log('Conseguindo os pontos');
        //Definimos as funções necessárias para o bom funcionamento dessa função.

        const getAreaPointsForConvex = points => {
            //Função que calcula o ângulo entre dois pontos.
            const calcAng = (point,p) => Math.atan2(point.y - p.y, point.x - p.x) * 180 / Math.PI + 180;
            //Nós pré-carregamos pontos que podem definir o convexo.
            let possiblePoints = [{x:0,y:0},{x:xMax,y:yMax},{x:Number(points[0].x),y:0},{x:0,y:Number(points[0].y)},{x:xMax,y:Number(points[0].y)},{x:Number(points[0].x),y:xMax}]            
            //Obtemos a lista de pontos
            let pointsList = [...points];
            //Verificamos os pontos que poderíam definir o convexo.
            possiblePoints.forEach( p => (verifyPoint(p,restricciones,points)) && pointsList.push(p) ) 
            //Asseguramo-nos de que estamos no ponto mais à direita.
            pointsList.sort((a,b) => a.x<b.x ? 1:-1);
            //Criamos nossa saída
            let orderedPoints = [];
            let point = pointsList[0];
            orderedPoints.push(point)
            pointsList.splice(0,1) 
            while ( pointsList.length ) {
                //Encontra o ponto que tem o angulo mínimo
                let minAngle = pointsList.reduce( (min,p) => calcAng(point,p) < min ? calcAng(point,p) : min, 361);
                if (minAngle < 361) {
                    let indNewPoint = pointsList.findIndex(p => calcAng(point,p) === minAngle);
                    point = pointsList[indNewPoint]
                    orderedPoints.push(point)
                    pointsList.splice(indNewPoint,1)           
                } else { 
                    console.log('Nenhum angulo encontrado');
                    break}
            }
            orderedPoints.push(orderedPoints[0])
            return orderedPoints
        }
        
        //Função responsável pela realização das verificações correspondentes para adicionar ou não um ponto.
        const verifyPoint = (point, restricciones, points) => {
            if (point.x >= 0 && point.y >= 0 ){
                if ( !verifyPointInPoints(point,points) ) {
                    if ( verifyPointInRestrictions(point,restricciones) ) { return true } else return false
                }else return false
            }else return false
        }

        //Função encarregada de verificar se um ponto já está na lista de pontos (ou já foi verificado antes).
        const verifyPointInPoints = (point,points) => points.some( pointL => (pointL.x === point.x.toFixed(2) && pointL.y === point.y.toFixed(2)) )
        
        //Função encarregada de verificar se um ponto está em conformidade com todas as restrições.
        const verifyPointInRestrictions = (point,restricciones) => restricciones.every( restri => {
                    let calIzq = (restri.coeficientes[0]*point.x + restri.coeficientes[1]*point.y);
                    if( restri.eq === '>=' ) {
                        return ( calIzq >= restri.derecha ) 
                    }else { 
                        return ( calIzq <= restri.derecha )} 
                })
        //Função que retorna um ponto verificado e corta um eixo.
        const getPointAxFromExpCenX = ( exp ) => {       
            //Obtemos o Corte sobre o eixo-Y
            let expResultX = Number((new Equation(exp.solveFor('y'),0)).solveFor('x'));
            if ( expResultX >= 0 ) {
                //Geramos o Ponto em X
                let point = {x:expResultX,y:0,P:points.length}
                //Verificamos o ponto em X com as restrições.
                if (verifyPoint(point,restricciones,points)){
                    point.x=point.x.toFixed(2)
                    point.y=point.y.toFixed(2)
                    return point} 
            }
        };
        //Função que retorna um ponto verificado e corta um eixo.
        const getPointAxFromExpCenY = ( exp ) => {       
            //Obtemos o Corte sobre o eixo-Y
            let expResultY = Number((new Equation(exp.solveFor('x'),0)).solveFor('y'));
            if ( expResultY >= 0 ) {
                //Geramos o Ponto em Y
                let point = {x:0,y:expResultY,P:points.length}
                //Verificamos o ponto em Y com as restrições.
                if (verifyPoint(point,restricciones,points)){
                    point.x=point.x.toFixed(2)
                    point.y=point.y.toFixed(2)
                    return point} 
            }   
        };
        const getPointAxFromExpY = ( expY ) => {
            //Obtemos o Corte sobre o eixo-Y
            let expResultY = Number(expY.solveFor('y'));
            if ( expResultY >= 0 ) {
                //Geramos o Ponto em Y
                let point = {x:0,y:expResultY,P:points.length}
                //Verificamos o ponto em Y com as restrições.
                if (verifyPoint(point,restricciones,points)){
                    point.x=point.x.toFixed(2)
                    point.y=point.y.toFixed(2)
                    return point} 
            }
            
        };
        const getPointAxFromExpX = (expX) => {
            //Obtemos o Corte sobre o eixo-X
            let expResultX = Number(expX.solveFor('x'));
            if ( expResultX >= 0 ) {
                //Geramos o Ponto em X
                let point = {x:expResultX,y:0,P:points.length}
                //Verificamos o ponto em X com as restrições.
                if (verifyPoint(point,restricciones,points)){
                    point.x=point.x.toFixed(2)
                    point.y=point.y.toFixed(2)
                    return point} 
            } 
        }
        //Função que retorna um ponto verificado com uma expressão em X e outra em Y
        const getPointFromExpXExpY = ( expX,expY ) => {
            let xRes = Number(expX.solveFor('x'));
            let yRes = Number(expY.solveFor('y'));
            //Verificamos que eles não são cortados em nenhum outro quadrante além do quadrante de análise.
            if ( xRes >= 0  && yRes >= 0 ) {
                //Geramos o ponto.
                let point = {x:xRes,y:yRes,P:points.length}
                //Verificamos o ponto.
                if (verifyPoint(point,restricciones,points)){
                    point.x=point.x.toFixed(2)
                    point.y=point.y.toFixed(2)
                    return point} 
            }
        };
        //Função que retorna um ponto verificado com uma Expressão Completa e outro em Y
        const getPointFromExpCExpY = ( expC,expY ) => {
            let expResultY = Number(expY.solveFor('y'));
            let expResultX = Number((new Equation(expC.solveFor('y'),expY.solveFor('y'))).solveFor('x'));
            //Verificamos que eles não são cortados em nenhum outro quadrante além do quadrante de análise.
            if ( expResultX >= 0  && expResultY >= 0 ) {
                //Geramos o ponto.
                let point = {x:expResultX,y:expResultY,P:points.length}
                //Verificamos o ponto.
                if (verifyPoint(point,restricciones,points)){
                    point.x=point.x.toFixed(2)
                    point.y=point.y.toFixed(2)
                    return point} 
            }
        };
        //Função que retorna um ponto verificado com uma Expressão Completa em x e outro em Y
        const getPointFromExpCExpX = ( expC,expX ) => {
            let expResultX = Number(expX.solveFor('x'));
            let expResultY = Number((new Equation(expC.solveFor('x'),expX.solveFor('x'))).solveFor('y'));
            //Verificamos que eles não são cortados em nenhum outro quadrante além do quadrante de análise.
            if ( expResultX >= 0  && expResultY >= 0 ) {
                //Geramos o ponto.
                let point = {x:expResultX,y:expResultY,P:points.length}
                //Verificamos o ponto.
                if (verifyPoint(point,restricciones,points)){
                    point.x=point.x.toFixed(2)
                    point.y=point.y.toFixed(2)
                    return point}
            } 
        };
        //Função que devolve um ponto verificado com duas Expressões Completas.
        const getPointFromTwoExpC = (exp1,exp2) => {
            let expResultX = Number((new Equation(exp1.restriEquation.solveFor('y'),exp2.restriEquation.solveFor('y'))).solveFor('x'));
            let expResultY = Number((new Equation(exp1.restriEquation.solveFor('x'),exp2.restriEquation.solveFor('x'))).solveFor('y'));
            //Verificamos que eles não são cortados em nenhum outro quadrante além do quadrante de análise.
            if ( expResultX >= 0  && expResultY >= 0 ) {
                //Geramos o ponto.
                let point = {x:expResultX,y:expResultY,P:points.length}
                //Verificamos o ponto.
                if (verifyPoint(point,restricciones,points)){
                    point.x=point.x.toFixed(2)
                    point.y=point.y.toFixed(2)
                    return point}
                } 
        };
        //Função que devolve Um ponto de Duas expressões
        const getPointFromTwoExp = (exp1,exp2) => {
            try {
                //Verificamos os Tipos
                if ( exp1.tipo === 2 && exp2.tipo === 2 ) {
                    //Caso sejam duas linhas completas
                    return getPointFromTwoExpC(exp1,exp2)  
                }else if( exp1.tipo === 2){
                    //O primeiro é uma linha reta completa e o outro é apenas X ou apenas Y
                    if( exp2.tipo === 0) { return getPointFromExpCExpX(exp1.restriEquation,exp2.restriEquation) 
                    }else return getPointFromExpCExpY(exp1.restriEquation,exp2.restriEquation)
                }else if( exp2.tipo === 2 ){
                    //O segundo é o Straight completo, de modo que o outro é apenas X ou Y
                    if( exp1.tipo === 0) { return getPointFromExpCExpX(exp2.restriEquation,exp1.restriEquation)
                    }else return getPointFromExpCExpY(exp2.restriEquation,exp1.restriEquation)
                }else if (exp1.tipo === 0){
                    //Se o primeiro é uma linha Solo de X e o outro pode ser de Y
                    if( exp2.tipo === 1) { return getPointFromExpXExpY(exp1.restriEquation,exp2.restriEquation) }
                }else{
                    //Se o primeiro for uma linha apenas de Y e o outro puder ser de X
                    if( exp2.tipo === 0) { return getPointFromExpXExpY(exp2.restriEquation,exp1.restriEquation) }
                }  
            } catch (error) {
                console.log(error);     
            }
            
        };
        
        //Limpamos nosso array de pontos
        let points = [];
        
        //O primeiro ponto que obtemos é o ótimo, pois queremos que não seja repetido.
        if ( Object.entries(solSet).length ){ points.push(this.getOptimPoint(solSet)) }
        

        //Analisamos as linhas retas que cortam os eixos ou as linhas retas sem pendentes.
        expresiones.forEach( exp => {
            if (exp.tipo === 2) {
                //Se pe completa corta nos dois eixos
                let pointX = getPointAxFromExpCenX(exp.restriEquation);
                if (pointX) { points.push(pointX) }
                let pointY = getPointAxFromExpCenY(exp.restriEquation)
                if (pointY) { points.push(pointY) }
            }else if(exp.tipo === 0){
                //Corta apenas em X
                let point = getPointAxFromExpX(exp.restriEquation);
                if (point) { points.push(point) }

            }else{
                //Corta apenas em Y
                let point = getPointAxFromExpY(exp.restriEquation);
                if (point) { points.push(point) }
            }
        })

        //Analisamos os cortes das linhas de restrição.
        expresiones.forEach( exp1 => {
            //Nós validamos cada uma das linhas retas com as outras.
            expresiones.forEach( exp2 => {
                //Verificamos que não é a mesma linha.
                if( exp1 !== exp2 ) {
                    let point = getPointFromTwoExp(exp1,exp2);
                    if (point) {points.push(point)}
                } 
            })
        });

        //Obtemos a sequência de pontos que define nosso Convexo.
        let convexPoints = getAreaPointsForConvex(points);
        //Precisamos eliminar o ponto ideal para que ele não imprima nas marcas simples.
        if( Object.entries(solSet).length ){ points.shift() }
        return {points,convexPoints}
    }

    //Função responsável por retornar a tabela.
    getTableResult = (points,coeficientes,restricciones) =>{
        console.log('Desenhando a tabela de resultados');    
        const calcSlacksValue = point => {
            return restricciones.map( restri => <td key={'S-C-'+point.P+'-'+restri.ri}>{(Math.abs(restri.coeficientes[0]*point.x+restri.coeficientes[1]*point.y - restri.derecha)).toFixed(2)}</td>)
        }
        const calcResult = point =>{return (Math.abs(coeficientes.x*point.x + coeficientes.y*point.y)).toFixed(2)}
        let slacksTitles = restricciones.map(restri => <th key={'S-T-'+restri.ri}>{'S'+restri.ri}</th>)
        return( <Table>
                    <thead><tr><th>Punto</th><th>Resultado</th><th>X0</th><th>X1</th>{slacksTitles}</tr></thead>
                    <tbody>{points.map(point => <tr key={'T-P-'+point.P}><td>P:{point.P}</td><td>{calcResult(point)}</td><td>{point.x}</td><td>{point.y}</td>{calcSlacksValue(point)}</tr>)}</tbody>
                </Table>)
    }
       
     
    //Função responsável por ocultar a descrição do ponto.  
    hidePoint = () => this.setState({value: null})

    //Função responsável por exibir a descrição do ponto.
    showPoint = value => this.setState({ value })


    mapperAreaSeries = (lines,referencias) => 
        lines.map((data,index) => <AreaSeries key={'L-S-A'+index} opacity={0.3} color={referencias.length > 0 ?referencias[index].color:'red'} data={data}/>)
    
    mapperLinesSeries = (lines,referencias) => 
    lines.map((data,index) => <LineSeries key={'L-S-L'+index} color={referencias.length > 0 ?referencias[index].color:'red'} data={data}/>)


    render () {
        let {variables,restricciones} = this.props
        let {referencias,lines,value,points,optimMark,convexPoints,lineFunctional,areaGraph,tableResult} = this.state;
        return( 
        <CardBody>
            <Card outline color='secondary'>
                <CardHeader>
                    <Row>
                        <Col className="text-left"><CardTitle><h4>Grafico:</h4></CardTitle></Col>
                        <Col><Button outline size='sm'
                            onClick={() => this.setState({areaGraph:!this.state.areaGraph})} 
                            color={!this.state.areaGraph ? 'success':'danger'}>{!this.state.areaGraph ? 'Ver sombra de restrições':'Ocultar sombra de restrições'}</Button>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Row className='mx-auto'>
                        <XYPlot onMouseLeave={() => this.setState({pointer: null})} width={500} height={500}>
                            <HorizontalGridLines/>
                            <VerticalGridLines/>
                            <XAxis title='Variable X1' />
                            <YAxis  title='Variable X2'/>

                            {areaGraph && this.mapperAreaSeries(lines,referencias)}
                            
                            {this.mapperLinesSeries(lines,referencias)}

                            <AreaSeries fill='green' stroke='#fffff' style={{strokeWidth: 0}} opacity={0.6} data={convexPoints}/>

                            <LineSeries color='red' strokeStyle='dashed' data={lineFunctional}/>
                            
                            <MarkSeries onValueMouseOver={this.showPoint} onValueMouseOut={this.hidePoint}
                                        color={'blue'} opacity={0.7} data={points}/>
                            
                            <MarkSeries onValueMouseOver={this.showPoint} onValueMouseOut={this.hidePoint}
                                        color={'green'} data={optimMark}/>
                            {value && <Hint value={value} />}

                        </XYPlot>
                    </Row>
                    <Row className='mx-auto'><DiscreteColorLegend orientation="horizontal" items={referencias}/></Row>
                    <Row><ReferencesList variables={variables} restricciones={restricciones}/></Row>
                </CardBody>
                <CardFooter>
                    {tableResult}
                </CardFooter>
            </Card>
        </CardBody> )
    }
}

export default GraphicPresentation;