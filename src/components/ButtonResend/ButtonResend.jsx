import { Link } from 'react-router-dom';
import './ButtonResend.scss';

function ButtonResend(props) {

    return (
        <Link to={props.path} className="ButtonResend">
            {props.text}
        </Link>
    )
}

export default ButtonResend;