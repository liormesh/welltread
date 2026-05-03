"use client";

type Zone = {
  value: string;
  label: string;
};

type Props = {
  options: Zone[];
  value: string[];
  onChange: (v: string[]) => void;
};

export function BodyMap({ options, value, onChange }: Props) {
  function toggle(zone: string) {
    if (zone === "none") {
      onChange(value.includes("none") ? [] : ["none"]);
      return;
    }
    const without = value.filter((v) => v !== "none");
    onChange(
      without.includes(zone)
        ? without.filter((v) => v !== zone)
        : [...without, zone],
    );
  }

  function isSelected(zone: string): boolean {
    return value.includes(zone);
  }

  function fillFor(zone: string): string {
    return isSelected(zone) ? "#2D4F4A" : "#E6DFCF";
  }

  function strokeFor(zone: string): string {
    return isSelected(zone) ? "#1F3A36" : "#C9C0A8";
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-line bg-paper-warm/30 p-6 sm:p-8">
        <svg
          viewBox="0 0 400 600"
          className="w-full max-w-md mx-auto h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body silhouette outline (subtle) */}
          <path
            d="M200 30
               C 180 30, 165 45, 165 65
               C 165 78, 170 90, 178 95
               L 175 110
               C 160 115, 145 125, 140 145
               L 130 200
               C 128 215, 130 225, 134 235
               L 130 280
               C 128 320, 130 360, 135 400
               L 140 480
               C 142 510, 145 540, 150 565
               L 165 565
               C 168 540, 170 510, 172 480
               L 178 410
               C 180 405, 185 405, 190 405
               L 200 405
               L 210 405
               C 215 405, 220 405, 222 410
               L 228 480
               C 230 510, 232 540, 235 565
               L 250 565
               C 255 540, 258 510, 260 480
               L 265 400
               C 270 360, 272 320, 270 280
               L 266 235
               C 270 225, 272 215, 270 200
               L 260 145
               C 255 125, 240 115, 225 110
               L 222 95
               C 230 90, 235 78, 235 65
               C 235 45, 220 30, 200 30 Z"
            fill="#FAF7F2"
            stroke="#E6DFCF"
            strokeWidth="1.5"
          />

          {/* Zone: Neck */}
          <Zone
            value="neck"
            d="M178 95 Q200 105 222 95 L222 110 Q200 117 178 110 Z"
            fill={fillFor("neck")}
            stroke={strokeFor("neck")}
            onClick={() => toggle("neck")}
          />
          <Label x={200} y={107} text="Neck" selected={isSelected("neck")} />

          {/* Zone: Shoulders */}
          <Zone
            value="shoulders-l"
            d="M165 110 L 145 125 L 138 145 L 145 145 L 165 130 L 175 115 Z"
            fill={fillFor("shoulders")}
            stroke={strokeFor("shoulders")}
            onClick={() => toggle("shoulders")}
          />
          <Zone
            value="shoulders-r"
            d="M235 110 L 255 125 L 262 145 L 255 145 L 235 130 L 225 115 Z"
            fill={fillFor("shoulders")}
            stroke={strokeFor("shoulders")}
            onClick={() => toggle("shoulders")}
          />
          <Label x={148} y={138} text="Shoulder" selected={isSelected("shoulders")} small />
          <Label x={252} y={138} text="Shoulder" selected={isSelected("shoulders")} small />

          {/* Zone: Upper back / chest area */}
          <Zone
            value="upper-back"
            d="M145 130 L 165 130 L 175 145 L 175 175 L 145 175 Z M255 130 L 235 130 L 225 145 L 225 175 L 255 175 Z"
            fill={fillFor("upper-back")}
            stroke={strokeFor("upper-back")}
            onClick={() => toggle("upper-back")}
          />
          <Label x={160} y={160} text="Upper" selected={isSelected("upper-back")} small />
          <Label x={240} y={160} text="back" selected={isSelected("upper-back")} small />

          {/* Zone: Lower back */}
          <Zone
            value="lower-back"
            d="M145 195 L 175 195 L 175 240 L 145 240 Z M255 195 L 225 195 L 225 240 L 255 240 Z"
            fill={fillFor("lower-back")}
            stroke={strokeFor("lower-back")}
            onClick={() => toggle("lower-back")}
          />
          <Label x={160} y={222} text="Lower" selected={isSelected("lower-back")} small />
          <Label x={240} y={222} text="back" selected={isSelected("lower-back")} small />

          {/* Zone: Hips */}
          <Zone
            value="hips-l"
            d="M134 245 L 175 245 L 175 290 L 130 290 Z"
            fill={fillFor("hips")}
            stroke={strokeFor("hips")}
            onClick={() => toggle("hips")}
          />
          <Zone
            value="hips-r"
            d="M266 245 L 225 245 L 225 290 L 270 290 Z"
            fill={fillFor("hips")}
            stroke={strokeFor("hips")}
            onClick={() => toggle("hips")}
          />
          <Label x={155} y={272} text="Hip" selected={isSelected("hips")} />
          <Label x={245} y={272} text="Hip" selected={isSelected("hips")} />

          {/* Zone: Knees */}
          <Zone
            value="knees-l"
            d="M140 360 L 178 360 L 180 405 L 140 405 Z"
            fill={fillFor("knees")}
            stroke={strokeFor("knees")}
            onClick={() => toggle("knees")}
          />
          <Zone
            value="knees-r"
            d="M260 360 L 222 360 L 220 405 L 260 405 Z"
            fill={fillFor("knees")}
            stroke={strokeFor("knees")}
            onClick={() => toggle("knees")}
          />
          <Label x={159} y={385} text="Knee" selected={isSelected("knees")} />
          <Label x={241} y={385} text="Knee" selected={isSelected("knees")} />

          {/* Zone: Ankles / feet */}
          <Zone
            value="ankles-l"
            d="M145 535 L 168 535 L 165 565 L 150 565 Z"
            fill={fillFor("ankles")}
            stroke={strokeFor("ankles")}
            onClick={() => toggle("ankles")}
          />
          <Zone
            value="ankles-r"
            d="M255 535 L 232 535 L 235 565 L 250 565 Z"
            fill={fillFor("ankles")}
            stroke={strokeFor("ankles")}
            onClick={() => toggle("ankles")}
          />
          <Label x={156} y={555} text="Ankle" selected={isSelected("ankles")} small />
          <Label x={244} y={555} text="Ankle" selected={isSelected("ankles")} small />

          {/* Zone: Wrists/Hands - placed near hip line as small targets */}
          <circle
            cx={108}
            cy={290}
            r={18}
            fill={fillFor("wrists")}
            stroke={strokeFor("wrists")}
            strokeWidth="1.5"
            className="cursor-pointer"
            onClick={() => toggle("wrists")}
          />
          <circle
            cx={292}
            cy={290}
            r={18}
            fill={fillFor("wrists")}
            stroke={strokeFor("wrists")}
            strokeWidth="1.5"
            className="cursor-pointer"
            onClick={() => toggle("wrists")}
          />
          <Label x={108} y={293} text="Wrist" selected={isSelected("wrists")} small />
          <Label x={292} y={293} text="Wrist" selected={isSelected("wrists")} small />
        </svg>

        {/* "None" toggle outside the body diagram */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => toggle("none")}
            className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${
              isSelected("none")
                ? "border-sage bg-sage text-paper"
                : "border-line bg-paper text-ink-soft hover:border-sage/50 hover:text-ink"
            }`}
          >
            None of the above
          </button>
        </div>
      </div>

      {/* Selected list */}
      {value.length > 0 && !value.includes("none") && (
        <div className="rounded-2xl bg-paper-warm/40 border border-line px-4 py-3">
          <p className="text-xs text-ink-soft/70 mb-2">Selected:</p>
          <div className="flex flex-wrap gap-2">
            {value.map((v) => {
              const opt = options.find((o) => o.value === v);
              if (!opt) return null;
              return (
                <span
                  key={v}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-sage/10 border border-sage/30 text-sage text-sm"
                >
                  {opt.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Zone({
  d,
  fill,
  stroke,
  onClick,
}: {
  value: string;
  d: string;
  fill: string;
  stroke: string;
  onClick: () => void;
}) {
  return (
    <path
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth="1.5"
      className="cursor-pointer transition-colors hover:opacity-80"
      onClick={onClick}
    />
  );
}

function Label({
  x,
  y,
  text,
  selected,
  small,
}: {
  x: number;
  y: number;
  text: string;
  selected?: boolean;
  small?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={small ? 9 : 10}
      fill={selected ? "#FAF7F2" : "#4B5152"}
      textAnchor="middle"
      pointerEvents="none"
      className="font-medium"
    >
      {text}
    </text>
  );
}
