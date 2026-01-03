import { Copy } from "lucide-react";
import { toast } from "react-toastify";

const CopyText = ({ text }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-xs">{text}</span>

      <button
        type="button"
        onClick={handleCopy}
        className="p-1 rounded hover:bg-gray-100"
        aria-label="Copy"
      >
        <Copy size={16} className="cursor-pointer"/>
      </button>
    </span>
  );
};

export default CopyText;
