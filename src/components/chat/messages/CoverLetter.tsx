interface Props {
  content: string;
}

export default function CoverLetter({ content }: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="my-3 bg-background border border-accent/20 rounded-lg p-4 relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-accent uppercase tracking-wide font-medium">
          Cover Letter
        </span>
        <button
          onClick={handleCopy}
          className="text-[10px] text-muted hover:text-accent transition-colors"
        >
          Copy
        </button>
      </div>
      <div className="text-sm leading-relaxed whitespace-pre-wrap border-l-2 border-accent/30 pl-3">
        {content}
      </div>
    </div>
  );
}
