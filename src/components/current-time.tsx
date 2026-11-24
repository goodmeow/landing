import { useEffect, useMemo, useState } from "react";

const timeFormatOptions: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

export type CurrentTimeProps = {
  className?: string;
};

export function CurrentTime({ className }: CurrentTimeProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const formatter = useMemo(
    () => new Intl.DateTimeFormat(undefined, timeFormatOptions),
    [],
  );

  const formatted = useMemo(() => formatter.format(now), [formatter, now]);

  return (
    <time
      suppressHydrationWarning
      className={className}
      dateTime={now.toISOString()}
    >
      {formatted}
    </time>
  );
}
