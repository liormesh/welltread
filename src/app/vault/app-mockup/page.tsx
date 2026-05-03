import Image from "next/image";

export const metadata = {
  title: "App mockup - Welltread Vault",
  robots: { index: false, follow: false, nocache: true },
};

export default function AppMockup() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="mb-16 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-4">
          16 - App mockup
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
          What he sees,{" "}
          <span className="text-sage italic font-normal">screen by screen</span>.
        </h1>
        <p className="mt-6 text-lg text-ink-soft leading-relaxed">
          The paid-user happy path, mocked at mobile fidelity. Each frame is a
          real screen with real copy, real cast, real palette. Annotations on
          the right tell you what to look at and what to push back on.
        </p>
        <p className="mt-3 text-sm text-ink-soft/70">
          Sample user: <strong>Eleanor</strong>, 67, senior niche, Q19 = &ldquo;garden without your back hurting&rdquo;, $59 3-month plan, daily-nudge cadence.
        </p>
      </header>

      <Frame
        n="01"
        label="Day 1 - first open"
        scenario="Eleanor clicks the magic link in her welcome email. Lands here."
        notes={[
          "Single hero card. No leaderboard. No achievements. No notifications-permission ask (we earned that in the email).",
          "The cast member changes per session per the locked rotation. Today is Day 1 → Maria.",
          "Welcome line is intentionally soft: 'Day 1 sets the foundation. Just show up.'",
          "Below the fold: streak (0 days, muted) + this week (today highlighted) + 'What to expect' modal link.",
        ]}
      >
        <PhoneFrame>
          <AppHeader title="Today" />
          <div className="flex-1 overflow-y-auto pb-24">
            <div className="px-6 pt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">
                Day 1
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-ink leading-tight">
                Foundation Movement
              </h2>
              <p className="mt-1 text-sm text-ink-soft">12 minutes - with Maria</p>
            </div>

            <div className="px-6 mt-5">
              <div className="rounded-3xl overflow-hidden bg-paper-warm/40 border border-line">
                <div className="aspect-[4/5] relative bg-paper-warm">
                  <Image
                    src="/cast/maria.png"
                    alt="Maria"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="p-5 bg-paper">
                  <p className="text-sm text-ink-soft leading-relaxed">
                    Day 1 sets the foundation. Just show up.
                  </p>
                  <button className="mt-5 w-full h-13 py-3.5 rounded-2xl bg-sage text-paper text-base font-medium">
                    Start session &rarr;
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 mt-8">
              <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
                This week
              </p>
              <WeekStrip activeDay={0} doneDays={[]} />
            </div>

            <div className="px-6 mt-8">
              <button className="text-sm text-sage underline-offset-4 hover:underline">
                What to expect &rarr;
              </button>
            </div>
          </div>
          <AppNav active="today" />
        </PhoneFrame>
      </Frame>

      <Frame
        n="02"
        label="Session player - mid-movement"
        scenario="She tapped Start. Now in movement 3 of 6."
        notes={[
          "Full-screen video. Cue text overlay on top of slight gradient for legibility.",
          "Three minimal controls at bottom-right. 'This hurts' is small, intentionally not prominent - we don't want to suggest it as a default.",
          "Top: progress dots (3 of 6) + 'Welltread' wordmark for orientation.",
          "Timer counts down. Movement auto-advances when complete.",
        ]}
      >
        <PhoneFrame variant="dark">
          {/* Video area */}
          <div className="flex-1 relative bg-ink overflow-hidden">
            <Image
              src="/scenes/maria_cat_cow.png"
              alt="Maria mid-movement"
              fill
              unoptimized
              className="object-cover opacity-90"
            />
            {/* Top gradient + content */}
            <div className="absolute top-0 left-0 right-0 p-5 bg-gradient-to-b from-ink/70 to-transparent">
              <div className="flex items-center justify-between text-paper">
                <span className="text-xs uppercase tracking-[0.2em] opacity-80">
                  Welltread
                </span>
                <ProgressDots total={6} active={2} />
              </div>
            </div>

            {/* Cue + timer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent">
              <p className="text-paper/95 text-2xl font-semibold leading-snug max-w-[80%]">
                Round your back gently. Soft spine.
              </p>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-paper/80 text-xs uppercase tracking-[0.2em]">
                  Cat-cow
                </span>
                <span className="text-paper text-3xl font-semibold tabular-nums">
                  0:18
                </span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <button className="w-12 h-12 rounded-full border border-paper/40 text-paper flex items-center justify-center">
                  ▌▌
                </button>
                <button className="w-12 h-12 rounded-full border border-paper/40 text-paper flex items-center justify-center">
                  ▶▶
                </button>
                <span className="flex-1" />
                <button className="text-paper/60 text-xs underline-offset-4 underline">
                  this hurts
                </button>
              </div>
            </div>
          </div>
        </PhoneFrame>
      </Frame>

      <Frame
        n="03"
        label="Transition between movements"
        scenario="Movement 3 just ended. 2-second card before movement 4."
        notes={[
          "Drill-shape backdrop from the brand vocabulary (this one: balance).",
          "Calm, not a pump-cut. The opposite of a fitness-app tabata-style transition.",
          "Auto-advances after 2 seconds. No tap needed.",
        ]}
      >
        <PhoneFrame variant="dark">
          <div
            className="flex-1 relative bg-paper-warm flex flex-col items-center justify-center overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage: "url(/shapes/balance.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="relative text-center px-8">
              <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
                Next
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-ink">
                Standing balance basics
              </h2>
              <p className="mt-3 text-sm text-ink-soft">3 minutes - chair within reach</p>
            </div>
          </div>
        </PhoneFrame>
      </Frame>

      <Frame
        n="04"
        label="Post-session check-in"
        scenario="Last movement is done. She lands on this screen."
        notes={[
          "Sliders auto-default to 3 (middle). Continue is enabled immediately - same pattern as the quiz.",
          "Single chip selector for the qualitative read. 'Hurt me' triggers PT triage queue + softer next session.",
          "Free-text flag is optional, not required. We don't make her work to leave.",
          "Subtle breath-pulse celebration on first-ever submission. After Day 1: just clean transition, no daily celebrations.",
        ]}
      >
        <PhoneFrame>
          <AppHeader title="" subdued />
          <div className="flex-1 overflow-y-auto pb-24 px-6 pt-3">
            <p className="text-xs uppercase tracking-[0.2em] text-clay">
              Done
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
              Day 1, complete.
            </h2>
            <p className="mt-3 text-sm text-ink-soft leading-relaxed">
              Two quick taps and you&rsquo;re out. We use these to shape tomorrow.
            </p>

            <div className="mt-8 space-y-7">
              <SliderRow label="How does your body feel?" left="Tense" right="Easy" value={3} />
              <SliderRow label="Energy?" left="Drained" right="Steady" value={3} />
            </div>

            <div className="mt-8">
              <p className="text-sm font-medium text-ink mb-3">How did this feel?</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Too easy",
                  "Just right",
                  "Too hard",
                  "Hurt me",
                ].map((label, i) => (
                  <span
                    key={label}
                    className={`px-4 py-2 rounded-full border text-sm ${
                      i === 1
                        ? "border-sage bg-sage text-paper"
                        : "border-line bg-paper text-ink"
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <details className="mt-7">
              <summary className="text-sm text-sage underline-offset-4 hover:underline cursor-pointer">
                Anything to flag? (optional)
              </summary>
              <textarea
                className="mt-3 w-full px-4 py-3 rounded-2xl border border-line bg-paper-warm/30 text-ink text-sm focus:outline-none focus:border-sage resize-y"
                rows={3}
                placeholder="Soreness? Confusion? A win?"
              />
            </details>

            <button className="mt-8 w-full h-13 py-3.5 rounded-2xl bg-sage text-paper text-base font-medium">
              Save and finish
            </button>
          </div>
        </PhoneFrame>
      </Frame>

      <Frame
        n="05"
        label="Day 8 - the routine has settled"
        scenario="A week in. She opens the app on her own, no nudge needed."
        notes={[
          "Streak counter visible (7 days) but typographically muted - sage, plain.",
          "Yesterday card is collapsed - one line, expandable to see her ratings.",
          "Today's session card same treatment as Day 1 but with James (per rotation: session 8 = James).",
          "Week 3 milestone hasn't hit yet - that's a banner that appears on day 15.",
        ]}
      >
        <PhoneFrame>
          <AppHeader title="Today" />
          <div className="flex-1 overflow-y-auto pb-24">
            <div className="px-6 pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-soft">Streak</span>
                <span className="text-sage font-semibold tabular-nums">7 days</span>
              </div>
            </div>

            <div className="px-6 pt-5">
              <details className="rounded-2xl border border-line bg-paper-warm/30 px-4 py-3">
                <summary className="text-sm text-ink cursor-pointer flex items-center justify-between">
                  <span>Day 7 ✓ - 12 min</span>
                  <span className="text-ink-soft/70 text-xs">Tap to expand</span>
                </summary>
              </details>
            </div>

            <div className="px-6 mt-5">
              <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">
                Day 8
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-ink leading-tight">
                Foundation Strength
              </h2>
              <p className="mt-1 text-sm text-ink-soft">14 minutes - with James</p>
            </div>

            <div className="px-6 mt-5">
              <div className="rounded-3xl overflow-hidden bg-paper-warm/40 border border-line">
                <div className="aspect-[4/5] relative bg-paper-warm">
                  <Image
                    src="/cast/james.png"
                    alt="James"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="p-5 bg-paper">
                  <p className="text-sm text-ink-soft leading-relaxed">
                    Wall pushups today. Slow and steady.
                  </p>
                  <button className="mt-5 w-full h-13 py-3.5 rounded-2xl bg-sage text-paper text-base font-medium">
                    Start session &rarr;
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 mt-8">
              <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
                This week
              </p>
              <WeekStrip activeDay={1} doneDays={[0]} />
            </div>
          </div>
          <AppNav active="today" />
        </PhoneFrame>
      </Frame>

      <Frame
        n="06"
        label="Week overview"
        scenario="She taps the Week tab in nav."
        notes={[
          "7-day grid. Past sessions = completed/skipped status. Today = highlighted ring. Future = blurred until day-of (anti-anxiety design).",
          "Tapping any past day opens the session detail (read-only summary of what she did, her ratings).",
          "Bottom card: 'This week's theme' - subtle context for what the week is building toward.",
        ]}
      >
        <PhoneFrame>
          <AppHeader title="Week 2" />
          <div className="flex-1 overflow-y-auto pb-24">
            <div className="px-6 pt-5 mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-clay mb-1">Theme</p>
              <h2 className="text-xl font-semibold text-ink leading-tight">
                Hip and ankle mobility
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                Building range so the strength work has somewhere to go.
              </p>
            </div>

            <div className="px-6 grid grid-cols-1 gap-2.5">
              <DayRow day="Mon" name="Day 7 - Hip openers" status="done" minutes={12} />
              <DayRow day="Tue" name="Rest day" status="rest" />
              <DayRow day="Wed" name="Day 8 - Foundation Strength" status="today" minutes={14} />
              <DayRow day="Thu" name="Day 9 - Ankle mobility flow" status="future" minutes={12} />
              <DayRow day="Fri" name="Day 10 - Standing balance" status="future" minutes={13} />
              <DayRow day="Sat" name="Rest day" status="rest" />
              <DayRow day="Sun" name="Weekly check-in" status="future-checkin" />
            </div>

            <div className="px-6 mt-7">
              <div className="rounded-2xl border border-line bg-paper-warm/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">Coming up</p>
                <p className="text-sm text-ink leading-relaxed">
                  Week 3 starts the &ldquo;less stiff&rdquo; phase. Mobility blocks
                  start compounding.
                </p>
              </div>
            </div>
          </div>
          <AppNav active="week" />
        </PhoneFrame>
      </Frame>

      <Frame
        n="07"
        label="The 'this hurts' modal"
        scenario="Mid-session, she taps 'this hurts'. Session pauses."
        notes={[
          "Body region selector reuses the same chip language as quiz Q5 + Q7. Familiar pattern.",
          "She picks a region → we serve a regression for the current movement, not skip it entirely.",
          "Her daily_completion gets pain_flagged=true. PT triage queue notified.",
          "Three sessions of pain on the same region triggers a taper rule for that region (Phase 3 adaptive engine).",
        ]}
      >
        <PhoneFrame variant="dark">
          <div className="flex-1 relative bg-ink overflow-hidden">
            <Image
              src="/scenes/maria_cat_cow.png"
              alt=""
              fill
              unoptimized
              className="object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-ink/60" />

            <div className="absolute inset-x-0 bottom-0 bg-paper rounded-t-3xl p-6 pb-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-[0.2em] text-clay">Paused</p>
                <button className="text-sm text-ink-soft underline-offset-4">
                  Cancel
                </button>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
                Where does it hurt?
              </h2>
              <p className="mt-2 text-sm text-ink-soft">
                We&rsquo;ll swap to a gentler version. No skip needed.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "Lower back",
                  "Knees",
                  "Hips",
                  "Shoulders",
                  "Neck",
                  "Wrists",
                  "Other",
                ].map((label, i) => (
                  <span
                    key={label}
                    className={`px-4 py-2 rounded-full border text-sm ${
                      i === 0
                        ? "border-sage bg-sage text-paper"
                        : "border-line bg-paper text-ink"
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>

              <button className="mt-7 w-full h-13 py-3.5 rounded-2xl bg-sage text-paper text-base font-medium">
                Swap and continue
              </button>
            </div>
          </div>
        </PhoneFrame>
      </Frame>

      <Frame
        n="08"
        label="Week 4 - first re-eval"
        scenario="Day 22. App opens to a different /app/today."
        notes={[
          "Today card replaced with the re-eval prompt. The session can still be done after - just delayed by 90 sec.",
          "5-question mini-assessment. Same component primitives as the main quiz.",
          "After submit: 'Here's what's adjusting' - 2-3 specific changes shown on drill-shape cards.",
          "Plan rolls forward with the adaptations. User feels heard.",
        ]}
      >
        <PhoneFrame>
          <AppHeader title="Today" />
          <div className="flex-1 overflow-y-auto pb-24">
            <div className="px-6 pt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">
                Quick check-in
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-ink leading-tight">
                It&rsquo;s been four weeks.
              </h2>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                Five questions, ninety seconds. We use them to adjust your next four weeks.
              </p>
            </div>

            <div className="px-6 mt-6">
              <div
                className="rounded-3xl overflow-hidden border border-line bg-paper relative"
                style={{ minHeight: 220 }}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: "url(/shapes/breath.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="relative p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
                    Question 1 of 5
                  </p>
                  <p className="text-lg font-medium text-ink leading-snug">
                    How&rsquo;s your gardening - the thing you came here for?
                  </p>
                  <div className="mt-5 space-y-2">
                    {[
                      "Better than four weeks ago",
                      "About the same",
                      "Worse, actually",
                    ].map((label, i) => (
                      <div
                        key={label}
                        className={`px-4 py-3 rounded-2xl border text-sm ${
                          i === 0
                            ? "border-sage bg-sage/5 text-ink"
                            : "border-line bg-paper text-ink"
                        }`}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 mt-6">
              <button className="w-full h-12 py-3 rounded-2xl bg-paper text-ink-soft border border-line text-sm">
                Skip - I&rsquo;ll do this tomorrow
              </button>
            </div>
          </div>
          <AppNav active="today" />
        </PhoneFrame>
      </Frame>

      <Frame
        n="09"
        label="Week 12 - graduation"
        scenario="Last session is done. She just submitted her final check-in."
        notes={[
          "Full-screen retrospective. The activity from Q19 is plugged into the headline - same pattern as the plan-reveal hero.",
          "Stats are shown but understated: total sessions, body-rating trend (sage line graph), no PRs or rankings.",
          "Three paths forward: continue / switch / break. No upsell pressure - the door is open either way.",
          "If she picks 'break': access stays through period_end, billing pauses, plan + progress preserved indefinitely.",
        ]}
      >
        <PhoneFrame>
          <div className="flex-1 overflow-y-auto pb-24">
            <div className="relative h-48 bg-paper-warm overflow-hidden">
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage: "url(/shapes/alignment.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">
                  12 weeks complete
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-ink leading-tight">
                  You built this.
                </h2>
              </div>
            </div>

            <div className="px-6 pt-6">
              <p className="text-base text-ink-soft leading-relaxed">
                Twelve weeks ago, you said you wanted to{" "}
                <span className="text-sage italic">
                  garden without your back hurting
                </span>
                . How does it feel today?
              </p>
            </div>

            <div className="px-6 mt-6 grid grid-cols-3 gap-2">
              <Stat label="Sessions" value="48" />
              <Stat label="Days streak high" value="12" />
              <Stat label="Pain ↓" value="-38%" />
            </div>

            <div className="px-6 mt-7">
              <p className="text-xs uppercase tracking-[0.2em] text-clay mb-3">
                What&rsquo;s next?
              </p>
              <div className="space-y-2.5">
                <NextCard
                  title="Continue with maintenance"
                  body="Twelve more weeks at your current level."
                  primary
                />
                <NextCard
                  title="Switch focus"
                  body="Posture / strength / mobility deeper-dive."
                />
                <NextCard
                  title="Take a break"
                  body="Door is open. Plan and progress preserved."
                />
              </div>
            </div>
          </div>
          <AppNav active="today" />
        </PhoneFrame>
      </Frame>

      <section className="mt-20 border-t border-line pt-10">
        <p className="text-xs uppercase tracking-[0.2em] text-clay mb-2">
          Things to push back on
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-ink mb-6">
          What I want your eye on
        </h2>
        <ul className="space-y-3 text-ink leading-relaxed max-w-3xl">
          <Item>
            <strong>Day 1 hero copy</strong> - &ldquo;Just show up.&rdquo; Too soft? Too clinical? Too understated for a Day 1 brand moment?
          </Item>
          <Item>
            <strong>Streak treatment</strong> - mine is muted typography on the
            top-right. Most fitness apps go aggressive (fire emoji, &ldquo;DON&rsquo;T BREAK YOUR STREAK&rdquo;). Confirm the soft approach is right for our register.
          </Item>
          <Item>
            <strong>Session player overlays</strong> - is the cue text big enough at 2xl? Is &ldquo;this hurts&rdquo; visible enough at the bottom-right? It needs to be findable without being a default invitation.
          </Item>
          <Item>
            <strong>Week overview future-day blur</strong> - I propose &ldquo;blur until day-of&rdquo; for anti-anxiety. But maybe high-commitment users want to see the week ahead. Could be a Q24 variant.
          </Item>
          <Item>
            <strong>Re-eval framing at week 4</strong> - the prompt asks about the
            specific Q19 activity (&ldquo;How&rsquo;s your gardening?&rdquo;). Feels good or invasive?
          </Item>
          <Item>
            <strong>Graduation 'next' offer</strong> - 3 paths (continue / switch /
            break) feels right? Does the order matter? Should &ldquo;take a break&rdquo; be more prominent or less?
          </Item>
          <Item>
            <strong>Bottom nav</strong> - I have today / week / library / profile. Is library too prominent before P2 ships? Could collapse into profile.
          </Item>
        </ul>
      </section>
    </div>
  );
}

/* ====================== COMPONENTS ====================== */

function Frame({
  n,
  label,
  scenario,
  notes,
  children,
}: {
  n: string;
  label: string;
  scenario: string;
  notes: string[];
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-10 mb-20 items-start">
      <div className="flex justify-center lg:justify-start">{children}</div>
      <div className="lg:pt-8">
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-xs font-mono text-clay">{n}</span>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">{label}</h2>
        </div>
        <p className="text-sm text-ink-soft leading-relaxed mb-5 max-w-xl">
          <em>{scenario}</em>
        </p>
        <ul className="space-y-2 max-w-xl">
          {notes.map((note, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-ink-soft leading-relaxed">
              <span className="mt-2 inline-block h-1 w-1 rounded-full bg-sage shrink-0" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PhoneFrame({
  variant = "light",
  children,
}: {
  variant?: "light" | "dark";
  children: React.ReactNode;
}) {
  return (
    <div className="relative" style={{ width: 360 }}>
      {/* outer rim */}
      <div
        className="rounded-[44px] p-2"
        style={{
          background:
            "linear-gradient(160deg, #1F3A36 0%, #2D4F4A 50%, #1A1A1A 100%)",
          boxShadow:
            "0 30px 80px -20px rgba(31,58,54,0.45), 0 10px 30px -10px rgba(0,0,0,0.2)",
        }}
      >
        <div
          className="rounded-[36px] overflow-hidden flex flex-col"
          style={{
            width: 344,
            height: 720,
            background: variant === "dark" ? "#0e1816" : "#FAF7F2",
          }}
        >
          {/* notch */}
          <div className="relative h-7 bg-ink shrink-0">
            <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-24 h-4 rounded-full bg-black" />
          </div>
          {/* content */}
          {children}
        </div>
      </div>
    </div>
  );
}

function AppHeader({ title, subdued }: { title: string; subdued?: boolean }) {
  return (
    <div className="px-6 pt-3 pb-3 flex items-center justify-between border-b border-line/60 bg-paper/80 backdrop-blur-sm shrink-0">
      <span
        className={`text-sm font-semibold ${subdued ? "text-ink-soft/70" : "text-sage"}`}
      >
        welltread
      </span>
      <span className="text-xs uppercase tracking-[0.2em] text-ink-soft/70">
        {title}
      </span>
      <span className="text-ink-soft/40">⋯</span>
    </div>
  );
}

function AppNav({ active }: { active: "today" | "week" | "library" | "profile" }) {
  const items: Array<{ id: typeof active; label: string }> = [
    { id: "today", label: "Today" },
    { id: "week", label: "Week" },
    { id: "library", label: "Library" },
    { id: "profile", label: "Profile" },
  ];
  return (
    <div className="absolute bottom-0 left-0 right-0 px-6 py-3 bg-paper/90 backdrop-blur-sm border-t border-line/60">
      <div className="flex items-center justify-between text-xs">
        {items.map((it) => (
          <span
            key={it.id}
            className={`flex flex-col items-center gap-1 ${
              active === it.id ? "text-sage font-semibold" : "text-ink-soft/70"
            }`}
          >
            <span
              className={`block h-1 w-1 rounded-full ${
                active === it.id ? "bg-sage" : "bg-transparent"
              }`}
            />
            {it.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function WeekStrip({ activeDay, doneDays }: { activeDay: number; doneDays: number[] }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((d, i) => {
        const isActive = i === activeDay;
        const isDone = doneDays.includes(i);
        return (
          <div
            key={i}
            className={`text-center py-2 rounded-lg text-xs ${
              isActive
                ? "bg-sage text-paper font-semibold"
                : isDone
                  ? "bg-sage/10 text-sage"
                  : "bg-paper-warm/40 text-ink-soft"
            }`}
          >
            {d}
          </div>
        );
      })}
    </div>
  );
}

function ProgressDots({ total, active }: { total: number; active: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`block h-1 rounded-full transition-all ${
            i === active
              ? "w-6 bg-paper"
              : i < active
                ? "w-2 bg-paper/70"
                : "w-2 bg-paper/25"
          }`}
        />
      ))}
    </div>
  );
}

function SliderRow({
  label,
  left,
  right,
  value,
}: {
  label: string;
  left: string;
  right: string;
  value: number;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-ink mb-3">{label}</p>
      <div className="flex items-center gap-3">
        <span className="text-xs text-ink-soft w-12 text-right">{left}</span>
        <div className="flex-1 relative h-2 bg-line rounded-full">
          <div
            className="absolute left-0 top-0 bottom-0 rounded-full bg-sage"
            style={{ width: `${(value / 5) * 100}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-sage border-2 border-paper shadow"
            style={{ left: `calc(${(value / 5) * 100}% - 10px)` }}
          />
        </div>
        <span className="text-xs text-ink-soft w-12">{right}</span>
      </div>
      <div className="mt-2 flex justify-center">
        <span className="text-2xl font-semibold text-sage tabular-nums">{value}</span>
      </div>
    </div>
  );
}

function DayRow({
  day,
  name,
  status,
  minutes,
}: {
  day: string;
  name: string;
  status: "done" | "today" | "future" | "future-checkin" | "rest";
  minutes?: number;
}) {
  const blur = status === "future" ? "blur-[1px] opacity-60" : "";
  const ring = status === "today" ? "ring-2 ring-sage" : "border border-line";
  const bg =
    status === "rest"
      ? "bg-paper-warm/40"
      : status === "done"
        ? "bg-sage/5"
        : "bg-paper";

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl px-4 py-3 ${bg} ${ring} ${blur}`}
    >
      <span className="w-9 text-xs uppercase tracking-wider text-ink-soft/70">
        {day}
      </span>
      <div className="flex-1">
        <p className={`text-sm ${status === "today" ? "font-semibold text-ink" : "text-ink"}`}>
          {name}
        </p>
        {minutes && (
          <p className="text-xs text-ink-soft">{minutes} minutes</p>
        )}
      </div>
      {status === "done" && (
        <span className="text-sage text-sm">✓</span>
      )}
      {status === "today" && (
        <span className="text-xs uppercase tracking-wider text-sage font-semibold">
          Today
        </span>
      )}
      {status === "rest" && (
        <span className="text-xs text-ink-soft/60">rest</span>
      )}
      {status === "future-checkin" && (
        <span className="text-xs text-clay">check-in</span>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center rounded-2xl border border-line bg-paper p-3">
      <p className="text-xl font-semibold text-sage tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-ink-soft/70 mt-1">
        {label}
      </p>
    </div>
  );
}

function NextCard({
  title,
  body,
  primary,
}: {
  title: string;
  body: string;
  primary?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 border ${
        primary
          ? "border-2 border-sage bg-sage/5"
          : "border-line bg-paper"
      }`}
    >
      <p className={`font-semibold ${primary ? "text-sage" : "text-ink"}`}>{title}</p>
      <p className="mt-1 text-sm text-ink-soft leading-snug">{body}</p>
    </div>
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
