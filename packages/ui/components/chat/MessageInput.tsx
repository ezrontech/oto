import React from 'react';

export function MessageInput({
  disabled = false,
  value,
  onChange,
}: {
  disabled?: boolean;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={`w-full p-2 rounded border border-token bg-input-background text-foreground ${
            disabled ? 'opacity-60 cursor-not-allowed' : 'opacity-100'
          }`}
          placeholder={disabled ? 'Input disabled' : 'Type a message...'}
        />
        <button
          disabled={disabled}
          className={`px-3 py-1 rounded bg-primary text-primary-foreground ${
            disabled ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
