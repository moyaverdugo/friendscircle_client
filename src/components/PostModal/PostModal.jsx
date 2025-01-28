import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./PostModal.scss";
import calendarIcon from '../../assets/icons/calendar.svg';
import selectIcon from '../../assets/icons/select.svg';
import care from '../../assets/icons/care.svg';
import share from '../../assets/icons/share.svg';
import visit from '../../assets/icons/visit.svg';

function PostModal({ onClose, onSubmit }) {
    const [shortTitle, setShortTitle] = useState("");
    const [selectedTab, setSelectedTab] = useState("Share");
    const [requestType, setRequestType] = useState("Request");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState(null);
    const [files, setFiles] = useState([]);
    const [shareWith, setShareWith] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFiles([...files, file]);
        }
    };

    const handleCheckbox = (category) => {
        setShareWith((prev) =>
            prev.includes(category)
                ? prev.filter((item) => item !== category)
                : [...prev, category]
        );
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const postData = {
            shortTitle,
            selectedTab,
            requestType,
            description,
            dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null,
            files,
            shareWith,
        };
        try {
            await onSubmit(postData); // Pass postData to the parent component
            onClose(); // Close the modal
        } catch (error) {
            console.error("Error submitting post:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const tabOptions = {
        Share: ["Request", "Gift", "Borrow", "Marketplace", "Learn", "My Item"],
        Care: ["Caretake Request", "Available Caretaker"],
        Visit: ["Request Visit", "Guest Room", "Home Swaps"],
    };

    return (
        <div className="post-modal-overlay">
            <div className="post-modal">
                {/* Tab Navigation */}
                <div className="tab-navigation">
                    {["Share", "Care", "Visit"].map((tab) => (
                        <button
                            key={tab}
                            className={`tab-button ${selectedTab === tab ? "active" : ""}`}
                            onClick={() => {
                                setSelectedTab(tab);
                                setRequestType(tabOptions[tab][0]); // Reset dropdown to the first option
                            }}
                        >
                            <img
                                src={tab === "Share" ? share : tab === "Care" ? care : visit}
                                alt={`${tab} Icon`}
                                className="tab-icon"
                            />
                            <span>{tab}</span>
                        </button>
                    ))}
                </div>

                {/* Form Fields */}
                <div className="form-group">
                    <label>Request Type</label>
                    <div className="select-container">
                        <select
                            value={requestType}
                            onChange={(e) => setRequestType(e.target.value)}
                        >
                            {tabOptions[selectedTab].map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <img src={selectIcon} alt="Select Icon" className="select-icon" />
                    </div>
                </div>

                <div className="form-group">
                    <label>Short Title</label>
                    <input
                        type="text"
                        maxLength="14"
                        value={shortTitle}
                        onChange={(e) => setShortTitle(e.target.value)}
                        placeholder="Enter short title"
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        maxLength="100"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description"
                    />
                </div>

                <div className="form-group">
                    <label>Due Date</label>
                    <div className="date-picker-container">
                        <ReactDatePicker
                            selected={dueDate}
                            onChange={(date) => setDueDate(date)}
                            placeholderText="Select a date"
                            dateFormat="yyyy/MM/dd"
                        />
                        <button
                            type="button"
                            className="calendar-button"
                            onClick={() => document.querySelector(".react-datepicker__input-container input").focus()}
                        >
                            <img src={calendarIcon} alt="Calendar Icon" className="calendar-icon" />
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label>Upload Image / Docs</label>
                    <div
                        className="upload-container"
                        onClick={() => document.getElementById("uploadFile").click()}
                    >
                        <label className="upload__square" htmlFor="uploadFile">
                            <span className="upload__square-plus">+</span>
                        </label>
                        <input
                            type="file"
                            id="uploadFile"
                            name="uploadFile"
                            onChange={handleFileUpload}
                            style={{ display: "none" }}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Share With</label>
                    <div className="share-with-options">
                        {["Family", "Work", "Tennis"].map((category) => (
                            <div key={category} className="option">
                                <span>{category}</span>
                                <input
                                    type="checkbox"
                                    checked={shareWith.includes(category)}
                                    onChange={() => handleCheckbox(category)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="modal-actions">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PostModal;