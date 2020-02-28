import React from 'react';
import {InputGroupText,InputGroup, Input,InputGroupAddon,UncontrolledPopover,PopoverBody} from 'reactstrap';

const Restriction = props => {
    let {ri,descripcion} = props.restriccion
    
    const handleChange = e => props.handleChange(ri,e.target.value)
    return(
        <InputGroup className="mt-1" id={"TTR" + ri} key={"RTD" + ri}>

        <InputGroupAddon addonType="prepend">
          <InputGroupText name="ri" id="restriccion">{"R" + ri}</InputGroupText>
        </InputGroupAddon>

        <Input
          name={ri}
          placeholder="Descrição da Restrição"
          aria-label="Descripcion"
          aria-describedby="restriccion"
          onChange={handleChange}
          value={descripcion}/>

        <UncontrolledPopover flip={false} trigger="focus hover" placement="auto" target={"TTR" + ri}>
          <PopoverBody>Aqui você deve inserir o que a restrição representa no modelo.</PopoverBody>
        </UncontrolledPopover>

      </InputGroup>)
    
}

export default Restriction;