import './ButtonNext.scss';

function ButtonNext(props) {
    return (
        <button type="submit" className="ButtonNext">
            {props.text}
        </button>
    );
}

export default ButtonNext;