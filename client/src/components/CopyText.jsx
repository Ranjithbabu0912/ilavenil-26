import { useState } from "react";

export default function CopyText({ text }) {
    // const text = "ilavenil26@upi";
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="font-bold">{text}</span>
            <button
                onClick={handleCopy}
                className="px-2 py-1 text-sm bg-black text-white rounded"
            >
                {copied ? "Copied!" : "Copy"}
            </button>
        </div>
    );
}
