export const metadata = {
  title: "User journey - Welltread Vault",
  robots: { index: false, follow: false, nocache: true },
};

export default function UserJourney() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          15 - User journey
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
          The paid user&rsquo;s{" "}
          <span className="text-sage italic font-normal">happy path</span>.
        </h1>
        <p className="mt-6 text-lg text-ink-soft max-w-3xl leading-relaxed">
          From welcome email to week 12 graduation. Every screen, every
          nudge, every adaptation moment. The opposite of an MVP wireframe -
          this is the whole arc, and what each subsystem in{" "}
          <a className="text-sage hover:underline" href="/vault/product-scope">
            /vault/product-scope
          </a>{" "}
          has to deliver.
        </p>
      </header>

      <Section eyebrow="A" title="The triggers (what brings them in)">
        <p className="text-ink-soft mb-6 max-w-3xl leading-relaxed">
          Q26 (notification preference) determines which triggers fire. All
          paths land on <code className="text-xs bg-paper-warm/40 px-2 py-1 rounded">/app/today</code>.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Card title="Welcome email magic link" body="Day 0. From Stripe checkout success → Resend transactional. One-click sign-in lands them on Day 1." />
          <Card title="Daily push notification" body="If Q26 = 'daily nudge'. Sent at user's preferred time (default: 9am local). 'Today: 12 min foundation, with Maria.'" />
          <Card title="Weekly summary email" body="If Q26 = 'weekly summary'. Sunday evening. Recap of last week + preview of next." />
          <Card title="Streak nudge" body="After a missed day. Soft - 'Day 3 is here when you are' - no panic, no streak loss messaging." />
          <Card title="Self-initiated" body="Quiet mode users + anyone who picks up the app on their own. Always works the same way." />
          <Card title="In-app return banner" body="If they last opened > 36h ago: 'Welcome back. Today's session is shorter than usual.' (the 'meet them where they are' principle)" />
        </div>
      </Section>

      <Section eyebrow="B" title="Day 1 - the first open">
        <Beat
          n="1"
          title="Magic link → /app/today"
          body="Single-tap from the welcome email. No password screen. Loads in <1.5s."
        />
        <Beat
          n="2"
          title="Splash"
          body="1-second branded splash: 'Welcome, Eleanor.' Calm, no animation. The first impression should feel quiet, not energetic."
        />
        <Beat
          n="3"
          title="The Today screen lands"
          body="Header: small Welltread logo + nav (today / week / profile). Mobile-first single-column."
        />
        <Beat
          n="4"
          title="Hero card: today's session"
          body={
            <>
              Day 1 - Foundation Movement - 12 minutes. Cast portrait of Maria
              (per locked distribution: M/D/E/J in sessions 1/2/3/4). Subtitle:
              <em> with Maria</em>. Single big <strong>Start session</strong> button.
              <br />
              <br />
              Above the play button, one line of welcome copy: <em>Day 1 sets the foundation. Just show up.</em>
            </>
          }
        />
        <Beat
          n="5"
          title="Below the fold (intentionally minimal on Day 1)"
          body={
            <>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>This week (compact 7-day grid - today highlighted, others greyed)</li>
                <li>Streak: 0 days (de-emphasized typography on Day 1)</li>
                <li>Single secondary link: &ldquo;What to expect&rdquo; (modal that explains the 3 phases of the program)</li>
              </ul>
              <br />
              No leaderboard. No achievements. No social. No notifications-permission-asks (we earned that already in the welcome email).
            </>
          }
        />
      </Section>

      <Section eyebrow="C" title="The session player">
        <Beat
          n="1"
          title="Pre-roll (3 sec)"
          body="Brand splash + 'Day 1 - Foundation' + cast portrait. No music in source. Subtle ambient room tone."
        />
        <Beat
          n="2"
          title="Movement 1"
          body={
            <>
              Full-screen video of Maria performing the first movement. Top-of-screen: small progress dots (movement 1 of 6). Bottom-of-screen overlays:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Cue text: <em>&ldquo;Sit cross-legged. Soft spine.&rdquo;</em></li>
                <li>Timer (counts down) or rep counter (counts up)</li>
                <li>Three minimal controls: pause / skip movement / &ldquo;this hurts&rdquo; (small, not prominent)</li>
              </ul>
            </>
          }
        />
        <Beat
          n="3"
          title="Transition between movements"
          body="2-second card: 'Next: gentle hip openers.' Drill-archetype shape backdrop. Calm. Not a hype-cut."
        />
        <Beat
          n="4"
          title="Cycle through all movements"
          body="5-7 movements per session in v1. Auto-advances. User can pause anytime - state preserved if they background the app."
        />
        <Beat
          n="5"
          title="Cooldown"
          body="Last movement is always a recovery / breath block. ~60 sec. Slower video, gentler cue."
        />
        <Beat
          n="6"
          title="End"
          body="Full-screen 'You're done.' card. Subtle breath animation. 1.5-second hold, then auto-advance to /app/done."
        />
      </Section>

      <Section eyebrow="D" title="Post-session check-in">
        <Beat
          n="1"
          title="Land on /app/done"
          body="Header: 'Day 1, complete.' (no hyphens, just a clean stop)"
        />
        <Beat
          n="2"
          title="Two sliders"
          body={
            <>
              <strong>How does your body feel?</strong> 1-5, smiley→tense (sage gradient).
              <br />
              <strong>Energy?</strong> 1-5, drained→steady.
              <br />
              <br />
              Both auto-default to 3 (middle) so Continue is enabled immediately - same pattern as the quiz sliders.
            </>
          }
        />
        <Beat
          n="3"
          title="Qualitative chip"
          body={
            <>
              Single chip select: <em>too easy / just right / too hard / hurt me</em>. Drives adaptation.
            </>
          }
        />
        <Beat
          n="4"
          title="Optional flag"
          body={
            <>
              <em>&ldquo;Anything you want to flag?&rdquo;</em> Free text, optional. Reviewed by PT triage queue if &ldquo;hurt me&rdquo; was selected.
            </>
          }
        />
        <Beat
          n="5"
          title="Submit → back to /app/today"
          body="Subtle celebration on first-ever completion (small breath-pulse animation). After Day 1, just clean transition - no daily celebrations, that gets old."
        />
      </Section>

      <Section eyebrow="E" title="Day 2 onwards - the routine settles in">
        <p className="text-ink-soft mb-6 max-w-3xl leading-relaxed">
          /app/today starts looking different on Day 2. Less ceremony, more
          rhythm.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Card
            title="Streak counter (gentle)"
            body="1 day streak. Plain typography, sage. No fire emoji, no shame on miss. Streak resets quietly without a 'YOU LOST YOUR STREAK' moment."
          />
          <Card
            title="Yesterday card (collapsed)"
            body="Day 1 ✓ - shows pain/energy ratings if user wants to expand. Otherwise out of the way."
          />
          <Card
            title="Today's session card"
            body="Day 2 - with James - 14 min - Foundation. Same hero treatment as Day 1."
          />
          <Card
            title="Rest day variant"
            body="If today is a rest day: 'Day 3 is a rest day. We'll see you tomorrow.' No play button. Optional 'Recovery practices' card with 3 micro-options (1-min breath, 2-min stretch, longer walk)."
          />
        </div>
      </Section>

      <Section eyebrow="F" title="The week rhythm">
        <Beat
          n="Mon-Fri/Sat"
          title="5 sessions (commitment-dependent)"
          body="3-day commitment users get MWF; 4-day get MTuTh+1; 5-day get full Mon-Fri. Rest days are explicit on /app/week."
        />
        <Beat
          n="End of week"
          title="Sunday weekly check-in"
          body="If user opens app Sunday evening, /app/today swaps to a check-in prompt card. If they don't open by Tuesday, soft email nudge. 5 questions, 90 sec."
        />
        <Beat
          n="Week 3 milestone"
          title="'Less stiff' banner"
          body="Subtle banner across /app/today on the first day of week 3: 'Week 3 - things should be loosening up.' Matches the difficulty curve transition (tier 1.5 → 2)."
        />
      </Section>

      <Section eyebrow="G" title="Week 4 - first re-eval">
        <Beat
          n="1"
          title="App opens to a different /app/today"
          body="Today card replaced with: 'It's been 4 weeks. Quick check-in?' Single Continue button. Skip option for stickier users (rare; most appreciate the moment)."
        />
        <Beat
          n="2"
          title="5-question mini-assessment (90 sec)"
          body={
            <>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>How&rsquo;s your activity from Q19? Better / same / worse</li>
                <li>Energy change? +/-/=</li>
                <li>Sleep change? +/-/=</li>
                <li>New pain anywhere? (body diagram if yes)</li>
                <li>Want to add or change anything? (free text, optional)</li>
              </ul>
            </>
          }
        />
        <Beat
          n="3"
          title="Adaptation summary"
          body={
            <>
              <em>&ldquo;Based on your check-in, here&rsquo;s what&rsquo;s adjusting:&rdquo;</em>
              <br />
              <br />
              2-3 specific changes - e.g. &ldquo;We&rsquo;re increasing knee mobility work after seeing you flagged it.&rdquo; Drill-shape backdrop on the change cards. User taps Continue, plan rolls forward.
            </>
          }
        />
      </Section>

      <Section eyebrow="H" title="Week 6 - the inflection">
        <Beat
          n="1"
          title="'Stronger' banner on /app/today"
          body="Week 6 milestone matches the curve transition (tier 2 → 2.5). Strength-shape backdrop."
        />
        <Beat
          n="2"
          title="Eleanor's session 7 - emotional anchor"
          body="The plan rotation puts Eleanor on session 7 (chair-supported balance progression). For seniors users, this is the brand moment - 'this could be me.'"
        />
        <Beat
          n="3"
          title="Cross-niche prompt (if applicable)"
          body="If user's check-in answers suggest a different niche would help (e.g. seniors user reports posture pain), a soft card: 'Want to add 5 min of posture work this week?' One-tap accept = a 5-min add-on session this week. Phase 3 feature."
        />
      </Section>

      <Section eyebrow="I" title="Week 8 - second re-eval">
        <Beat
          n=""
          title="Same as week 4 mechanic"
          body="5-question mini-assessment, plan rolls forward. By now most users have a strong sense of what works - changes are smaller, more confident."
        />
      </Section>

      <Section eyebrow="J" title="Week 12 - graduation">
        <Beat
          n="1"
          title="Final session feels different"
          body="Cooldown is longer, more reflective. Last cue: 'You built this.' Cast member's expression slightly warmer than usual. Brand moment, not hype."
        />
        <Beat
          n="2"
          title="Post-session screen replaced"
          body={
            <>
              Full-screen <em>&ldquo;12 weeks complete.&rdquo;</em>. Subtle confetti, breath-pulse animation. Hold 3 seconds, then advance to retrospective.
            </>
          }
        />
        <Beat
          n="3"
          title="Retrospective"
          body={
            <>
              <em>&ldquo;12 weeks ago you said you wanted to garden without your back hurting. Today, how does it feel?&rdquo;</em>
              <br />
              <br />
              Plus: total sessions completed, streak high, body ratings trend (energy + pain over the 12 weeks, sage line graph).
            </>
          }
        />
        <Beat
          n="4"
          title="What's next? (the offer)"
          body={
            <>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Continue with maintenance</strong> - 12 more weeks at integration tier (your current level)</li>
                <li><strong>Switch to a new focus</strong> - posture / strength / mobility deeper-dive</li>
                <li><strong>Take a break</strong> - access stays through period_end, come back anytime, plan is preserved</li>
              </ul>
            </>
          }
        />
      </Section>

      <Section eyebrow="K" title="Edge cases the happy path explicitly handles">
        <div className="space-y-3">
          <Edge
            title="Missed session"
            handle="Gentle nudge same evening. Next morning: 'Day 3 is fresh. Just 6 minutes if that's all you've got.' Streak shown but never panicked - 'streak: 4' becomes 'streak: 5' on next completion, no 'streak broken!' messaging."
          />
          <Edge
            title="Hurts button pressed"
            handle="Session pauses immediately. Modal: 'Tell us what hurts?' Body region selector (same diagram from Q5). User selects → alternate movement served (regression). daily_completion row gets pain_flagged=true. PT triage queue notified."
          />
          <Edge
            title="3 sessions in a row 'too easy'"
            handle="Auto-bump difficulty for next session. Banner on /app/today: 'You're ready for more. Today's session steps up.' No interruption to the flow."
          />
          <Edge
            title="Pain ≥4 reported on a region"
            handle="Next 3 sessions taper that region (avoid loaded movements there). Subtle notice: 'Going gentler on your knees this week.'"
          />
          <Edge
            title="Weekly check-in flags 'hurt'"
            handle="Plan pauses. Surface: 'Something to talk to your provider about?' Provide PT-vetted recovery sessions. Re-offer the program after 7 days unless user explicitly cancels."
          />
          <Edge
            title="Failed payment (subscription past_due)"
            handle="Plan + progress preserved. /app/today shows banner: 'Update payment to keep going.' Single click → Stripe Customer Portal. No content gating until day 4 of past_due (Stripe Smart Retries window)."
          />
          <Edge
            title="Lost device / new device"
            handle="Magic link from any email re-establishes session. Plan + progress + streak all server-side, hydrate immediately. localStorage is a cache, not source of truth."
          />
          <Edge
            title="Going on vacation"
            handle="Optional pause: /app/profile → 'Pause for 2 weeks?' Plan freezes, billing freezes, streak freezes. Resume on return."
          />
        </div>
      </Section>

      <Section eyebrow="L" title="The variants by Q24 (commitment) and Q26 (notification)">
        <h3 className="text-lg font-semibold text-ink mt-4 mb-3">Q24 - commitment level</h3>
        <table className="w-full text-sm rounded-2xl overflow-hidden border border-line mb-8">
          <thead className="bg-paper-warm/40 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-sage">Score</th>
              <th className="px-4 py-3 font-semibold text-sage">App behavior</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 bg-paper">
            <VRow score="1-4 (low)" body="Gentler nudges. 'Just 6 min today' framing on tight days. Streak is muted in the UI. More forgiveness on misses (no ramp-down on missed days). Push notifications: skip the 'tomorrow' one if today wasn't done." />
            <VRow score="5-7 (mid)" body="Default cadence. Streak shown but not shouty. Standard nudges. The bulk of users." />
            <VRow score="8-10 (high)" body="Streak prominent. 'Day X of 60' framing. Slight density bump - sessions average 14 min vs 12. Push timing tighter (morning + evening reminder if nothing done by 6pm)." />
          </tbody>
        </table>

        <h3 className="text-lg font-semibold text-ink mt-4 mb-3">Q26 - notification preference</h3>
        <table className="w-full text-sm rounded-2xl overflow-hidden border border-line">
          <thead className="bg-paper-warm/40 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-sage">Pref</th>
              <th className="px-4 py-3 font-semibold text-sage">App behavior</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 bg-paper">
            <VRow score="Daily nudge" body="Push at preferred time (default 9am local). One per day max. Skipped on rest days. No emails except weekly summary + billing." />
            <VRow score="Weekly summary" body="No daily push. Sunday evening email: last week's recap, this week's preview. Plus billing emails." />
            <VRow score="Quiet mode" body="No push, no engagement emails. Only billing emails (welcome, payment, cancel, refund). Soft re-engagement at week 2 if no opens at all (single email from Lior, not automated)." />
          </tbody>
        </table>
      </Section>

      <Section eyebrow="M" title="What it should feel like (brand register)">
        <ul className="space-y-3 text-ink leading-relaxed">
          <Item><strong>Quiet, not energetic.</strong> Even on Day 1. The opposite of a fitness-app pump-up.</Item>
          <Item><strong>Confident, not pushy.</strong> The app never sells you on the next session. It just shows up when you do.</Item>
          <Item><strong>Forgiving, not soft.</strong> Missing a day doesn&rsquo;t trigger panic. It also doesn&rsquo;t pretend nothing happened. &ldquo;Welcome back&rdquo; lands in just the right register.</Item>
          <Item><strong>Sequenced, not random.</strong> The user always knows what&rsquo;s next - today&rsquo;s session, this week&rsquo;s rhythm, the milestone they&rsquo;re working toward.</Item>
          <Item><strong>Specific, not generic.</strong> The activity from Q19 shows up everywhere - plan reveal hero, week 3 banner subtitle, week 6 milestone, graduation retrospective. The user&rsquo;s own words, used precisely.</Item>
          <Item><strong>The body is the starting line.</strong> Every adaptation, every regression, every &ldquo;skip this if it hurts&rdquo; reinforces this. The app is on the user&rsquo;s side.</Item>
        </ul>
      </Section>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line pt-10">
      <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-ink mb-6">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Beat({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5 flex gap-5">
      {n && (
        <span className="text-xs font-mono text-clay shrink-0 mt-1 min-w-[60px]">{n}</span>
      )}
      <div>
        <h3 className="font-semibold text-ink mb-1">{title}</h3>
        <div className="text-sm text-ink-soft leading-relaxed">{body}</div>
      </div>
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <h3 className="text-base font-semibold text-ink mb-2">{title}</h3>
      <p className="text-sm text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}

function Edge({ title, handle }: { title: string; handle: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <h3 className="text-base font-semibold text-ink mb-2">{title}</h3>
      <p className="text-sm text-ink-soft leading-relaxed">{handle}</p>
    </div>
  );
}

function VRow({ score, body }: { score: string; body: string }) {
  return (
    <tr>
      <td className="px-4 py-3 align-top text-ink font-medium whitespace-nowrap">{score}</td>
      <td className="px-4 py-3 align-top text-ink-soft">{body}</td>
    </tr>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-sage shrink-0" />
      <span>{children}</span>
    </li>
  );
}
