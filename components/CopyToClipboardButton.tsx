import { useState } from 'react';
import copy from 'clipboard-copy';
import { Copy, Check } from 'lucide-react';
const CopyToClipboardButton = ({ text }: { text: string }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyClick = async () => {
        try {
            await copy(text);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 3000);
        } catch (error) {
            console.error('Failed to copy text to clipboard', error);
        }
    };

    return (
        <div>
            <button onClick={handleCopyClick}>
                <p className='hover:bg-gray-200 p-1 rounded-sm text-gray-500'> {isCopied ? <Check size={18} /> : <Copy size={18} />}</p>
            </button>
        </div>
    );
};

export default CopyToClipboardButton;