export default function TextLimiter({ text }) {
    var definitiveText;
    if (text.length > 250) {
        var textTrimmered = text.slice(0, 250);
        definitiveText = textTrimmered + "...";
    } else {
        definitiveText = text;
    }

    return (
        <p>{definitiveText}</p>
    );
}