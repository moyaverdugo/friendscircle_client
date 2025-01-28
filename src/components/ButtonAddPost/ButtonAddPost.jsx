import './ButtonAddPost.scss';

function ButtonAddPost({ text, onClick }) {
    return (
        <button type="button" className="ButtonAddPost" onClick={onClick}>
            {text}
        </button>
    );
}

export default ButtonAddPost;