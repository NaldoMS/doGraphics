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
                //Si el metodo es Simplex, se permite agregar más de dos variables.
                let counterWitheVar = variables.filter(element => element.descripcion.length === 0).length;
                //Si la cantidad de Variables Libres es igual a 0 se agrega una más.
                if (counterWitheVar === 0) {
                variables.push({ xi: variables.length, descripcion: "", coeficiente: "" });
                props.handleVariables(variables);
                }
            }
        } else {
        //Si no lo es, aseguramos que existan solo dos, entonces eliminamos lo que está de más.
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