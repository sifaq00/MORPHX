import { useEffect, useRef, memo } from 'react';

// Odometer flip digits (OddsLine style). Number rolls digits vertically.
// aria-live friendly: announces the final value while visually rolling.
type Props = {
  value: number;
  fontSize?: number;
  className?: string;
  label?: string;
};

const Digit = memo(function Digit({ digit, fontSize }: { digit: number; fontSize: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const unit = fontSize * 1.14;

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = `translateY(-${digit * unit}px)`;
    }
  }, [digit, unit]);

  return (
    <span
      className="relative inline-block overflow-hidden font-mono font-bold select-none will-change-transform"
      style={{ width: fontSize * 0.66, height: unit, fontSize }}
    >
      <span
        ref={ref}
        className="absolute inset-x-0 flex flex-col will-change-transform"
        style={{ transition: 'transform 0.85s cubic-bezier(0.16, 0.86, 0.2, 1)' }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="flex items-center justify-center" style={{ height: unit }}>
            {i}
          </span>
        ))}
      </span>
    </span>
  );
});

export const FlipCounter = memo(function FlipCounter({
  value,
  fontSize = 32,
  className,
  label,
}: Props) {
  const safeValue = Math.max(0, Math.floor(Number(value) || 0));
  const digits = String(safeValue).split('');

  return (
    <span className={className} role="img" aria-label={label ?? String(safeValue)}>
      {digits.map((d, i) => (
        <Digit key={`${digits.length - i}-${d}`} digit={Number(d)} fontSize={fontSize} />
      ))}
    </span>
  );
});