import React from 'react';
import Restriction from './Restriction';

const Restrictions = props => {
    
    let {restricciones} = props;
    
    const deleteRes = ri => {
        restricciones.splice(ri, 1)
        restricciones.forEach( (restri,index) => restri.ri = index )
    }
    //Função que lida com modificações de restrições.
    const handleChangeRes = (ri,desc) => {
        //Se a mudança é para deixá-lo vazio, eliminamos a restrição. Mas, armazenamos o valor
        if (desc === '') { deleteRes(ri) }else{ restricciones[ri].descripcion = desc }
        //pedimos ao pai para guardar as alterações
        props.handleRestrictions(restricciones);
        //Chamamos para gerar novas restrições
        handleNewRes();
    };
    //Função responsável por adicionar uma restrição, se necessário.
    const handleNewRes = () => {
        //Limitando restrições
        if(restricciones.length < 30 ){
        //Contador de restrições sem desfrições.
        let counterWitheRes = restricciones.filter(element => element.descripcion.length === 0).length;
        //Se o contador de restrições vazias é igual a 0 então adicionamos mais uma restrição.
            if (counterWitheRes === 0) {
            restricciones.push({
                ri: restricciones.length,
                descripcion: "",
                coeficientes: [],
                eq: ">=",
                derecha: ""
            });
            props.handleRestrictions(restricciones);
            }
        }
        };
    handleNewRes();
    return restricciones.map( restri => <Restriction key={'RES-'+restri.ri} handleChange={handleChangeRes} restriccion={restri}/>)
}

export default Restrictions;