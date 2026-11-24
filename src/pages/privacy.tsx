import { useEffect } from "react";

import { PageHeader } from "@/components/page-header";
import { SiteFooter } from "@/components/site-footer";

const LAST_UPDATED = "November 16, 2026";

export default function PrivacyPage() {
  useEffect(() => {
    document.title = "Privacy Policy | goodmeow.dev";
  }, []);

  return (
    <>
      <PageHeader />

      <main className="section">
        <div className="container">
          <article className="page-copy page-legal">
            <header>
              <h1>Privacy Policy</h1>
              <p className="muted">Last updated: {LAST_UPDATED}</p>
              <p>
                This policy explains how the Multi-Stream Gateway at
                stream.goodmeow.my.id (&quot;the Service&quot;) handles
                information. The Service is a self-hosted tool operated by Harun
                Al Rasyid for broadcasting to platforms chosen by its operator.
              </p>
            </header>

            <section>
              <h2>1. Information we process</h2>
              <ul>
                <li>
                  Google account data obtained through OAuth: access and refresh
                  tokens, the YouTube channel ID and name, and the granted{" "}
                  <code>youtube.force-ssl</code> permission.
                </li>
                <li>
                  Twitch account data obtained through OAuth: access and refresh
                  tokens, and the channel login, under the{" "}
                  <code>channel:read:stream_key</code> permission.
                </li>
                <li>
                  Broadcast settings you submit: live title, description,
                  privacy status, enabled destinations, and stream keys or URLs
                  for Twitch, TikTok, and Streamlabs.
                </li>
                <li>
                  Technical data: IP address, timestamps, and requested paths in
                  server access logs, plus a session cookie used for dashboard
                  login.
                </li>
              </ul>
            </section>

            <section>
              <h2>2. How we use it</h2>
              <p>
                Data is used only to create, bind, start, and end live
                broadcasts; to set broadcast metadata and privacy status; to
                obtain stream keys from connected platforms; to authenticate
                dashboard access and rate-limit login attempts; and to
                troubleshoot errors in the relay. We do not use data for
                advertising, profiling, or any purpose unrelated to operating
                the Service.
              </p>
            </section>

            <section>
              <h2>3. Storage and security</h2>
              <p>
                OAuth tokens and platform credentials are stored server-side in
                an encrypted SQLite database on a self-hosted server, with
                access restricted to the Service. Stream keys are written only
                to the local relay runtime. Traffic to the dashboard and OAuth
                callbacks uses HTTPS, and the RTMP ingest is authenticated with
                a private stream key.
              </p>
              <p>
                Data is not sold or shared with third parties, other than the
                platform APIs required to deliver the stream: Google/YouTube,
                Twitch, TikTok, and Streamlabs.
              </p>
            </section>

            <section>
              <h2>4. Cookies</h2>
              <p>
                The dashboard sets one session cookie after login. It is
                HttpOnly, Secure, and SameSite=Lax, and contains only the
                authenticated session state. This site uses no analytics,
                advertising, or third-party cookies.
              </p>
            </section>

            <section>
              <h2>5. Retention</h2>
              <ul>
                <li>
                  OAuth tokens are kept until you disconnect the platform in
                  Settings → Connections or request deletion.
                </li>
                <li>
                  Stream keys and broadcast settings are kept until replaced or
                  deleted.
                </li>
                <li>
                  Server access logs are rotated and kept only as long as needed
                  for security and troubleshooting.
                </li>
              </ul>
            </section>

            <section>
              <h2>6. Your choices and deletion</h2>
              <p>
                You can disconnect YouTube or Twitch in Settings → Connections,
                which deletes the stored token immediately. You can also revoke
                access from your Google account permissions page or Twitch
                connections page. To request deletion of any other stored data,
                email <a href="mailto:aarunalr@pm.me">aarunalr@pm.me</a>;
                requests are handled within 7 days.
              </p>
            </section>

            <section>
              <h2>7. Google API Limited Use</h2>
              <p>
                goodmeow.my.id&apos;s use and transfer to any other app of
                information received from Google APIs will adhere to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
              <p>
                The Service accesses only the YouTube channel of the account
                that authorized it, and only for the broadcast-management
                features described above.
              </p>
            </section>

            <section>
              <h2>8. Children</h2>
              <p>
                The Service is not directed to children under 13, and no such
                data is knowingly collected.
              </p>
            </section>

            <section>
              <h2>9. Changes</h2>
              <p>
                This policy may be updated. Material changes will appear on this
                page with a new &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2>10. Contact</h2>
              <p>
                Harun Al Rasyid —{" "}
                <a href="mailto:aarunalr@pm.me">aarunalr@pm.me</a>
              </p>
            </section>
          </article>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
