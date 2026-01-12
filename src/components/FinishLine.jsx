import { GAME_WIDTH } from '../config/gameSettings'

export default function FinishLine({ y }) {
  const bannerWidth = GAME_WIDTH - 100
  const bannerHeight = 30
  const checkerSize = 15

  return (
    <svg
      style={{
        position: 'absolute',
        top: y,
        left: GAME_WIDTH / 2,
        transform: 'translate(-50%, -50%)',
        overflow: 'visible',
        width: bannerWidth + 40,
        height: bannerHeight + 60,
      }}
      viewBox={`-${(bannerWidth + 40) / 2} -${(bannerHeight + 60) / 2} ${bannerWidth + 40} ${bannerHeight + 60}`}
    >
      {/* Left pole */}
      <rect x={-bannerWidth / 2 - 4} y={-bannerHeight / 2} width={8} height={50} fill="#374151" />
      <rect x={-bannerWidth / 2 - 3} y={-bannerHeight / 2} width={6} height={50} fill="#4b5563" />

      {/* Right pole */}
      <rect x={bannerWidth / 2 - 4} y={-bannerHeight / 2} width={8} height={50} fill="#374151" />
      <rect x={bannerWidth / 2 - 3} y={-bannerHeight / 2} width={6} height={50} fill="#4b5563" />

      {/* Banner background */}
      <rect
        x={-bannerWidth / 2}
        y={-bannerHeight / 2}
        width={bannerWidth}
        height={bannerHeight}
        fill="white"
        stroke="#1f2937"
        strokeWidth="2"
      />

      {/* Checkered pattern */}
      <defs>
        <pattern id="checkerPattern" width={checkerSize * 2} height={checkerSize * 2} patternUnits="userSpaceOnUse">
          <rect width={checkerSize} height={checkerSize} fill="black" />
          <rect x={checkerSize} y={checkerSize} width={checkerSize} height={checkerSize} fill="black" />
        </pattern>
        <clipPath id="bannerClip">
          <rect x={-bannerWidth / 2 + 2} y={-bannerHeight / 2 + 2} width={bannerWidth - 4} height={bannerHeight - 4} />
        </clipPath>
      </defs>

      <rect
        x={-bannerWidth / 2}
        y={-bannerHeight / 2}
        width={bannerWidth}
        height={bannerHeight}
        fill="url(#checkerPattern)"
        clipPath="url(#bannerClip)"
      />

      {/* FINISH text */}
      <text
        x="0"
        y="4"
        textAnchor="middle"
        fontSize="16"
        fontWeight="bold"
        fill="white"
        stroke="#1f2937"
        strokeWidth="3"
        paintOrder="stroke"
      >
        FINISH
      </text>
    </svg>
  )
}
