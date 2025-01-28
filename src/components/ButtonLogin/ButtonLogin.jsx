import './ButtonLogin.scss';

function ButtonLogin(props) {
    return (
        <button className="ButtonLogin" onClick={props.onClick}>
            {props.text}
        </button>
    );
}

export default ButtonLogin;