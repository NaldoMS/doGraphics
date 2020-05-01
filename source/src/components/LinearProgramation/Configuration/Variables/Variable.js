import React from 'react';
import {InputGroupText,InputGroup, Input,InputGroupAddon,UncontrolledPopover,PopoverBody} from 'reactstrap';

const Variable = props => {
    let {xi,descripcion} = props.variable
    const handleChange = e => props.handleChanges(xi,e.target.value) 
    return(
        <InputGroup className="mt-1" id={"XTT" + xi} key={"VTD" + xi}>
        <InputGroupAddon addonType="prepend">
          <InputGroupText name="xi" id="variable">
            {"X" + (xi+1)}
          </InputGroupText>
        </InputGroupAddon>
        <Input
          name={xi}
          placeholder="Descrição da Variável"
          aria-label="Descripcion"
          aria-describedby="variable"
          onChange={handleChange}
          value={descripcion}
        />
        <UncontrolledPopover flip={false} trigger="focus hover" placement="auto" target={"XTT" + xi}>
          <PopoverBody>Aqui deve inserir a descrição das variáveis que representam o modelo.</PopoverBody>
        </UncontrolledPopover>
      </InputGroup>)
    
}

export default Variable;