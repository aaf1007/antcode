import { NavLink } from "react-router";

function Navbar() {
    return(
        <nav>
            <p>antcode</p>
            <NavLink to="/">Home</NavLink>
        </nav>
    );
}

export default Navbar;