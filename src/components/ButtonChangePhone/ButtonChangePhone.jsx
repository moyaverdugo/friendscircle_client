import { Link } from 'react-router-dom';
import './ButtonChangePhone.scss';

function ButtonChangePhone(props) {

    return (
        <Link to={props.path} className="ButtonChangePhone">
            {props.text}
        </Link>
    )
}

export default ButtonChangePhone;