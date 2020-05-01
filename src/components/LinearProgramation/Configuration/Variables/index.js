import React from 'react';
import Variable from './Variable';

const Variables = props => {
    let { variables,method } = props
        //Função que lida com mudanças nas variáveis.
        const deleteVar = xi => {
            if (variables.length > 2){
                variables.splice(xi, 1)
                variables.forEach( (vari,index) => vari.xi = index )
            }else{
                variables[xi].descripcion = ''
            }
        }
        //Função responsável por manipular as modificações das restrições.
        const handleChangesVar = (xi,desc) => {
            //Se a mudança é para deixá-lo vazio, eliminamos a restrição. Mas, armazenamos o valor
            if (desc === '') { deleteVar(xi) }else{ variables[xi].descripcion = desc }
            //pedimos ao pai para guardar as alterações
            props.handleVariables(variables);
        };
        //Função responsável por adicionar uma variável, se necessário.
    const handleNewsVar = () => {
        if (method === "simplex") {
            if( variables.length < 20 ){
                //Se o método é Simplex, pode-se colocar mais de duas variáveis.
                let counterWitheVar = variables.filter(element => element.descripcion.length === 0).length;
                //Se a quiantidade de variáveis livre é igual a 0, coloca-se uma a mais.
                if (counterWitheVar === 0) {
                variables.push({ xi: variables.length, descripcion: "", coeficiente: "" });
                 props.handleVariables(variables);
                }
            }
        } else {
        //Se não, asseguramos que existam apenas duas, então eliminamos a que está a mais.
            if (variables.length > 2) {
                variables.splice(2);
                props.handleVariables(variables);
            }
        }
    };
    handleNewsVar();
    return variables.map( variable => <Variable key={'VAR-'+variable.xi} handleChanges={handleChangesVar} variable={variable}/> )
}

export default Variables;