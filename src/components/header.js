import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import { 
    Container, 
    Nav, 
    NavItem, 
    DropdownItem, 
    UncontrolledDropdown,
    DropdownToggle, 
    DropdownMenu, 
} from "reactstrap";
import logo from './Inicio/logoSite.png';

const Header = () =>{
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return(
        <Container fluid className="App">
        <div className="Menu">
            <Nav className="Navbar">
                <NavItem className="Nav-Item">
                    <Link to={"/"}>
                        <img className="LogoMenu" src={logo} alt="Logo" />
                    </Link>
                </NavItem>

                <NavItem className="Nav-Item">
                    <Link to={"/"}>
                        <p className="Pmenu">doGraphics</p>
                    </Link>
                </NavItem>

                <NavItem className="Nav-Item">
                    <Link to={"/"}>
                        <p className="Pmenu">Pesquisa Operacional</p>
                    </Link>
                </NavItem>

                <NavItem className="Nav-Item">
                    <Link to={"/"}>
                        <p className="Pmenu">Método Gráfico</p>
                    </Link>
                </NavItem>

                <UncontrolledDropdown className="" nav inNavbar>
                    <DropdownToggle className="DropA" nav caret>
                        <span className="Pmenu">Resolver</span>
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem>
                            <Link className="LinkDrop" to={"/LinearProgramation/InSteps"}>
                                <span className="">Passo-a-passo</span>
                            </Link>
                        </DropdownItem>

                        <DropdownItem>
                            <Link className="LinkDrop" to={"/LinearProgramation/SinglePage"}>
                                <span className="">Única página</span>
                            </Link>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>

                <NavItem className="Nav-Item">
                    <Link to={"/Evaluete"}>
                        <p className="Pmenu">Avaliar</p>
                    </Link>
                </NavItem>
            </Nav>
        </div>
    </Container>
  )
};

export default Header;