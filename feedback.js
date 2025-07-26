
document.addEventListener("DOMContentLoaded", function () {
    const feedbackButton = document.getElementById("feedback-item");
    const feedbackPopup = document.getElementById("feedback-popup");

    if (!feedbackButton || !feedbackPopup) {
        console.error("Required elements not found!");
        return;
    }

    console.log("Feedback button found!");

    // ✅ Ensure only one React root is created
    if (!feedbackPopup.__root) {
        feedbackPopup.__root = ReactDOM.createRoot(feedbackPopup);
    }

    feedbackButton.addEventListener("click", function () {
        console.log("Feedback button clicked!");

        // ✅ Render FeedbackForm when button is clicked
        feedbackPopup.__root.render(<FeedbackForm showPopup={true} setShowPopup={() => {}} />);
    });
});


function FeedbackApp() {
    const [showPopup, setShowPopup] = React.useState(false);

    return (
        <>
            {/* Navbar Feedback Button */}
            <li id="feedback-item"
                style={{ cursor: "pointer", color: "blue", fontWeight: "bold" }}
                onClick={() => setShowPopup(true)}
            >
                ❀ Feedback
            </li>

            {/* Feedback Form Component */}
            <FeedbackForm showPopup={showPopup} setShowPopup={setShowPopup} />
        </>
    );
}

function FeedbackForm({ showPopup, setShowPopup }) {
    const [feedback, setFeedback] = React.useState("");
    const [rating, setRating] = React.useState(0);
    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setShowPopup(false);
        }, 3000);
        setFeedback("");
        setRating(0);
    };

    if (!showPopup) return null; // Hide when showPopup is false

    return (
        <>
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "#fff",
                    padding: "20px",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                    borderRadius: "10px",
                    zIndex: 1000
                }}
            >
                <h3>Feedback</h3>
                {submitted ? (
                    <p style={{ color: "green" }}>Thank you for your feedback!</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Rating: </label>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    onClick={() => setRating(star)}
                                    style={{
                                        cursor: "pointer",
                                        color: star <= rating ? "gold" : "gray",
                                        fontSize: "20px"
                                    }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Write your feedback..."
                            style={{ width: "100%", minHeight: "100px", marginTop: "10px" }}
                        />

                        <br />
                        <button type="submit" style={{ marginTop: "10px" }}>Submit</button>
                        <button type="button" onClick={() => setShowPopup(false)}
                            style={{ marginLeft: "10px" }}>Close</button>
                    </form>
                )}
            </div>

            {/* Dark overlay for popup */}
            <div
                onClick={() => setShowPopup(false)}
                style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 999
                }}
            />
        </>
    );
}

// Render FeedbackApp
ReactDOM.createRoot(document.getElementById("feedback-popup")).render(<FeedbackApp />);
