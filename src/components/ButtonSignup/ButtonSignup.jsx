import { Link } from 'react-router-dom';
import './ButtonSignup.scss';

function ButtonSignup(props) {

    return (
        <Link to={props.path} className="ButtonSignup">
            {props.text}
        </Link>
    )
}

export default ButtonSignup;