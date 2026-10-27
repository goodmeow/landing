import { ViewportSizeIndicator } from "@/components/viewport-size-indicator";
import { useBuildInfo } from "@/hooks/use-build-info";

const IS_DEV = import.meta.env.DEV;

export function SiteFooter() {
  const { version, commitInfo } = useBuildInfo();

  return (
    <footer className="site-footer">
      <div className="container">
        <p className="muted license">
          <a
            aria-label="Content licensed under CC BY-SA 4.0"
            className="license-badge"
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            rel="license noopener noreferrer"
            target="_blank"
          >
            <svg
              aria-hidden="true"
              fill="currentColor"
              height="16"
              viewBox="0 0 24 24"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 110-16 8 8 0 010 16z" />
              <path d="M9.5 10.25a1.75 1.75 0 103.5 0 1.75 1.75 0 10-3.5 0zm5.5 0a1.75 1.75 0 103.5 0 1.75 1.75 0 10-3.5 0z" />
              <path
                d="M7 15.25c.9-1.2 2.5-2 5-2s4.1.8 5 2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            CC BY-SA 4.0
          </a>
          <span className="license-meta">
            <span aria-hidden="true">·</span>
            <span>v</span>
            {commitInfo ? (
              <a
                aria-label={`View commit ${commitInfo.sha} on GitHub`}
                href={commitInfo.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {version}
              </a>
            ) : (
              <span>{version}</span>
            )}
          </span>
          {IS_DEV ? <ViewportSizeIndicator /> : null}
        </p>
      </div>
    </footer>
  );
}
