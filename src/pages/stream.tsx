import { useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Link } from "react-router-dom";

import { PageHeader } from "@/components/page-header";
import { SiteFooter } from "@/components/site-footer";

const STEPS = [
  {
    title: "Publish",
    body: "Point OBS at rtmp://rtmp.goodmeow.my.id:1935/live and use the private stream key from the dashboard.",
  },
  {
    title: "Relay",
    body: "The gateway validates the key, then starts one encoder for each enabled destination.",
  },
  {
    title: "Go live",
    body: "The YouTube broadcast is created, bound, and transitioned automatically. Twitch and TikTok receive the same feed.",
  },
];

export default function StreamPage() {
  useEffect(() => {
    document.title = "Multi-Stream Gateway | goodmeow.dev";
  }, []);

  return (
    <>
      <PageHeader />

      <main>
        <section className="hero">
          <div className="container">
            <h1>Multi-Stream Gateway</h1>
            <p className="lead page-hero-lead">
              A self-hosted RTMP relay that takes one live stream from OBS and
              publishes it to YouTube, Twitch, and TikTok at the same time.
            </p>
            <div className="cta">
              <Button
                as="a"
                className="cta-accent"
                href="https://stream.goodmeow.my.id"
                radius="full"
                size="md"
              >
                Open dashboard
              </Button>
              <Button
                as={Link}
                className="contact-button"
                radius="full"
                size="md"
                to="/privacy"
                variant="bordered"
              >
                Privacy Policy
              </Button>
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <div className="page-grid">
              {STEPS.map((step) => (
                <Card key={step.title} radius="lg" shadow="sm">
                  <CardBody className="page-card-body">
                    <h2>{step.title}</h2>
                    <p>{step.body}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <div className="page-copy">
              <section>
                <h2>YouTube integration</h2>
                <p>
                  Connecting a Google account grants the{" "}
                  <code>youtube.force-ssl</code> scope. The gateway uses it only
                  to create and manage live broadcasts on the channel that
                  authorized it: insert a broadcast and stream, bind them, set
                  the title, description, and privacy status, transition to
                  live, and end the broadcast. It does not read or modify other
                  channels, videos, or account data.
                </p>
                <p>
                  Tokens are stored server-side and are never sent anywhere
                  except Google&apos;s own API endpoints. See the{" "}
                  <Link to="/privacy">privacy policy</Link> for details on
                  storage, retention, and deletion.
                </p>
              </section>

              <section>
                <h2>Private by design</h2>
                <p>
                  The dashboard is a private control panel behind a login. This
                  site has no analytics, advertising, or third-party trackers,
                  and there is no public viewer-facing feature collecting
                  personal data.
                </p>
                <p>
                  Questions or deletion requests:{" "}
                  <a href="mailto:aarunalr@pm.me">aarunalr@pm.me</a>.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
