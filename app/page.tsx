import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { hasPlaybookAccess } from "@/lib/access";
import "./sales.css";

export const dynamic = "force-dynamic";

const PRICE = "CA$99";

const PARTS = [
  { name: "Start here", chapters: ["Welcome", "What we're building", "What you need", "Meet your tools"] },
  { name: "Set up", chapters: ["Prepare your computer", "Let Claude prepare it"] },
  {
    name: "Install",
    chapters: ["Download the editor", "Install the editor", "Choose transcription", "Connect Groq", "Local transcription"],
  },
  { name: "Edit", chapters: ["Find your folders", "Edit your first video", "Your editing style", "Request revisions"] },
  { name: "Finish line", chapters: ["Troubleshooting", "Prompt library", "Final checklist", "Congratulations!"] },
];

const OUTCOMES = [
  "Understand the tools behind AI-assisted editing, explained in plain English",
  "Install Claude Code and prepare your computer, step by step",
  "Download and set up your own AI video editor",
  "Set up transcription so captions are generated for you",
  "Edit your first video by describing what you want",
  "Save your own editing style so every video looks like you",
  "Export, review and revise your finished MP4",
];

const SWAPS = [
  ["Cutting every pause by hand", "Ask AI to find and remove the pauses"],
  ["Typing captions line by line", "Transcription writes your captions"],
  ["Fiddling with every edit", "Describe your style once, reuse it"],
  ["Repeating the same steps each video", "Reuse ready-made prompts"],
  ["Learning complicated editing software", "Give instructions in everyday language"],
];

const FAQ = [
  {
    q: "Do I need to know how to code?",
    a: "No. The playbook assumes you're starting from zero. You don't need to know what Git, Node.js, FFmpeg or an API key is. Every step is explained, and you copy and paste the prompts.",
  },
  {
    q: "Does it work on Mac and Windows?",
    a: "Yes. You'll need a Mac or Windows computer, an internet connection and about 1 GB of free storage plus room for your videos.",
  },
  {
    q: "Is there anything else I need to pay for?",
    a: "Claude Code needs a paid Claude plan (Pro or higher). The other tools are free, and transcription has a free option. Your purchase doesn't include third-party subscriptions or API credits.",
  },
  {
    q: "How long does setup take?",
    a: "Plan for 30 to 90 minutes the first time, a little longer if you need to troubleshoot. After that, editing a video is a prompt away.",
  },
  {
    q: "How do I get access after I buy?",
    a: "Right after checkout you'll get an email from EA Academy with an invitation to create your personal login. The playbook lives on this private members site, and your progress is saved as you go.",
  },
];

function BuyButton({ href, label = `Get the playbook · ${PRICE}` }: { href?: string; label?: string }) {
  if (!href) return null;
  return (
    <a className="sp-buy" href={href}>
      {label}
      <span aria-hidden="true">→</span>
    </a>
  );
}

export default async function Home() {
  const user = await currentUser();
  if (user && hasPlaybookAccess(user)) redirect("/playbook");

  const buyUrl = process.env.NEXT_PUBLIC_BUY_URL;

  return (
    <div className="sp">
      <header className="sp-top">
        <div className="sp-wrap sp-top-in">
          <span className="sp-brand">EA Academy</span>
          <a className="sp-signin" href={user ? "/playbook" : "/sign-in"}>
            {user ? "Open the playbook" : "Member sign in"}
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="sp-hero">
          <div className="sp-wrap sp-hero-in">
            <div className="sp-hero-copy">
              <div className="eyebrow">The complete beginner&apos;s playbook</div>
              <h1 className="sp-h1">
                Build your own <em>AI video editor</em>
              </h1>
              <p className="sp-lead">
                Stop spending hours cutting pauses and typing captions. Set up an AI editor that does it for you,
                from instructions in plain English. No coding experience required.
              </p>
              <BuyButton href={buyUrl} />
              <p className="sp-fine">
                Not a PDF. A private, interactive members portal · One-time payment · Instant access
              </p>
            </div>
            <figure className="sp-phone">
              <video
                controls
                playsInline
                preload="metadata"
                poster="/sample/ai-edited-sample.jpg"
                aria-label="Sample reel edited with AI"
              >
                <source src="/sample/ai-edited-sample.mp4" type="video/mp4" />
              </video>
              <figcaption>This reel was edited by AI. Press play.</figcaption>
            </figure>
          </div>
        </section>

        {/* Numbers */}
        <section className="sp-stats" aria-label="At a glance">
          <div className="sp-wrap sp-stats-in">
            <div><b>0</b><span>lines of code to write</span></div>
            <div><b>19</b><span>step-by-step chapters</span></div>
            <div><b>15</b><span>copy-and-paste prompts</span></div>
            <div><b>30–90</b><span>minutes to set up</span></div>
          </div>
        </section>

        {/* Not a PDF */}
        <section className="sp-sec sp-portal">
          <div className="sp-wrap">
            <div className="sp-notpdf">Not just another PDF</div>
            <h2 className="sp-h2">An interactive members portal you work through, step by step</h2>
            <p className="sp-sub">
              You don&apos;t download a file and get lost in it. You log in to your own private portal that walks you
              through the setup and keeps track of where you are.
            </p>
            <div className="sp-feats">
              <div>
                <b>Your own login</b>
                <p>A personal account on a private members site. Sign in from any computer, any time.</p>
              </div>
              <div>
                <b>One-click copy prompts</b>
                <p>15 ready-made prompts. Click copy, paste into Claude, done. No retyping, no typos.</p>
              </div>
              <div>
                <b>Progress tracking</b>
                <p>Tick the checkpoints as you go and watch your progress bar fill up. Your progress is saved on your device.</p>
              </div>
              <div>
                <b>Chapter navigation</b>
                <p>Jump to any of the 19 chapters from the side menu, or from the chapter picker on your phone.</p>
              </div>
              <div>
                <b>Always up to date</b>
                <p>Tools change. When the steps change, the portal is updated, and you see the new version.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Before / after */}
        <section className="sp-sec">
          <div className="sp-wrap">
            <div className="eyebrow">Sound familiar?</div>
            <h2 className="sp-h2">Editing shouldn&apos;t eat your whole week</h2>
            <p className="sp-sub">
              Instead of doing every edit by hand, you describe what you want, and Claude uses the editing tools on
              your computer to do it.
            </p>
            <div className="sp-swap">
              <div className="sp-swap-head"><span>The old way</span><span>With your AI editor</span></div>
              {SWAPS.map(([before, after]) => (
                <div className="sp-swap-row" key={before}>
                  <span className="sp-before">{before}</span>
                  <span className="sp-after">{after}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Outcomes */}
        <section className="sp-sec sp-tint">
          <div className="sp-wrap sp-two">
            <div>
              <div className="eyebrow">By the end, you will</div>
              <h2 className="sp-h2">Go from zero to your first AI-edited video</h2>
              <p className="sp-sub">
                Made for business owners, VAs and creators who want to turn raw footage into reels, with captions
                and clean cuts, without learning editing software.
              </p>
            </div>
            <ol className="sp-outcomes">
              {OUTCOMES.map((o, i) => (
                <li key={o}>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  {o}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Inside */}
        <section className="sp-sec">
          <div className="sp-wrap">
            <div className="eyebrow">What&apos;s inside</div>
            <h2 className="sp-h2">19 chapters, in the order you&apos;ll need them</h2>
            <div className="sp-parts">
              {PARTS.map((p) => (
                <div className="sp-part" key={p.name}>
                  <h3>{p.name}</h3>
                  <ul>
                    {p.chapters.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <ul className="sp-extras">
              <li>Checkpoints that track your progress</li>
              <li>A prompt library to copy and paste</li>
              <li>A troubleshooting chapter for when things go sideways</li>
            </ul>
          </div>
        </section>

        {/* About Hana */}
        <section className="sp-sec sp-tint">
          <div className="sp-wrap sp-about">
            <div className="eyebrow">Your guide</div>
            <h2 className="sp-h2">Hi, I&apos;m Hana. I&apos;m a business owner, not a programmer.</h2>
            <p>
              I&apos;m always juggling a hundred things, so I went looking for a simpler way to keep up with video.
              With Claude Code, I built my own AI-assisted editing workflow without knowing how to code. I give it
              instructions and my editing preferences, and it turns raw footage into edited videos.
            </p>
            <p>
              Through EA Academy I&apos;ve helped over 50 VAs, from video editors to executive assistants, start and
              grow their careers. This playbook is the step-by-step guide I wish I&apos;d had.
            </p>
            <div className="sp-sign">Hana Marigmen, Founder &amp; CEO, EA Academy</div>
          </div>
        </section>

        {/* Price */}
        <section className="sp-sec" id="get">
          <div className="sp-wrap">
            <div className="sp-price">
              <div className="eyebrow">Get instant access</div>
              <h2 className="sp-h2">Build Your Own AI Video Editor</h2>
              <div className="sp-amount">
                {PRICE}
                <small>one-time</small>
              </div>
              <ul className="sp-includes">
                <li>Your own login to the interactive members portal</li>
                <li>All 19 chapters, with progress tracking</li>
                <li>15 one-click copy-and-paste prompts</li>
                <li>Progress checkpoints and a final checklist</li>
                <li>
                  <strong>Bonus:</strong> your {PRICE} counts toward the video-guided program when it launches
                </li>
              </ul>
              <BuyButton href={buyUrl} label="Get the playbook" />
              <p className="sp-fine">
                After checkout, check your email for your invitation from EA Academy to create your login.
              </p>
            </div>

            <div className="sp-community">
              <div className="eyebrow">EA Academy community</div>
              <h3>Part of EA Academy? You may qualify for a discount code.</h3>
              <div className="sp-community-grid">
                <div>
                  <h4>Active interns &amp; staff</h4>
                  <p>
                    You attended your weekly check-ins in the past 30 days and attended the EA Academy webinar,
                    verified by your batch leader and batch manager.
                  </p>
                </div>
                <div>
                  <h4>Past &amp; current clients</h4>
                  <p>You&apos;re working with EA Academy now, or have worked with us before, as a client.</p>
                </div>
              </div>
              <p className="sp-community-how">
                Reach out to Hana for your code before you check out, then enter it on the checkout page under{" "}
                <strong>Add promotion code</strong>.
              </p>
              <a className="sp-community-btn" href="https://ig.me/m/hana.marigmen" target="_blank" rel="noopener">
                Message Hana for your code
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="sp-sec sp-tint">
          <div className="sp-wrap sp-faq-wrap">
            <div className="eyebrow">Questions</div>
            <h2 className="sp-h2">Before you buy</h2>
            <div className="sp-faq">
              {FAQ.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
            <div className="sp-final">
              <BuyButton href={buyUrl} />
            </div>
          </div>
        </section>
      </main>

      <footer className="sp-foot">
        <div className="sp-wrap sp-foot-in">
          <span>
            <strong>Already bought it?</strong> Check your email for your invitation, or{" "}
            <a href="/sign-in">sign in here</a>.
          </span>
          <span>Created by Hana Marigmen · EA Academy</span>
        </div>
      </footer>
    </div>
  );
}
