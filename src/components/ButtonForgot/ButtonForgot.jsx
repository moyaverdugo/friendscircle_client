import { Link } from 'react-router-dom';
import './ButtonForgot.scss';

function ButtonForgot(props) {

    return (
        <Link to={props.path} className="ButtonForgot">
            {props.text}
        </Link>
    )
}

export default ButtonForgot;