// This component draws a simple faceless faculty avatar like a profile placeholder.
// Use variant="woman" or variant="man" to change only the hair and shoulder outline.
function AnonymousFacultyAvatar({ variant = "woman", className = "" }) {
  const isWoman = variant === "woman";

  return (
    <svg
      viewBox="0 0 240 240"
      role="img"
      aria-label={`Anonymous ${isWoman ? "woman" : "man"} faculty avatar`}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle keeps every avatar visually consistent. */}
      <circle cx="120" cy="120" r="104" stroke="currentColor" strokeWidth="8" />

      {isWoman ? (
        <>
          {/* Rounded hair outline used for the feminine avatar. */}
          <path
            d="M77 132C59 132 55 118 55 104V86C55 49 80 31 120 31C160 31 185 49 185 86V104C185 118 181 132 163 132C170 121 172 109 172 94V83C149 84 128 73 112 55C101 70 86 80 68 84V94C68 109 70 121 77 132Z"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          {/* Blank face shape: deliberately contains no eyes, nose, or mouth. */}
          <path
            d="M72 84V104C72 136 91 154 120 154C149 154 168 136 168 104V84"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          {/* Short hair outline used for the masculine avatar. */}
          <path
            d="M73 88C73 52 91 35 120 35C149 35 167 52 167 88V101"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Blank face shape: deliberately contains no eyes, nose, or mouth. */}
          <path
            d="M73 85V104C73 136 92 154 120 154C148 154 167 136 167 104V85C148 84 132 76 119 62C107 76 91 84 73 85Z"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinejoin="round"
          />
        </>
      )}

      {/*
        Neck and shoulders complete the anonymous profile shape.
        Their bottom points stop at the inside edge of the outer circle,
        preventing the shoulder lines from crossing outside it.
      */}
      <path
        d="M98 149V164L78 175C63 184 57 195 55 205M142 149V164L162 175C177 184 183 195 185 205"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M98 164L120 179L142 164"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default AnonymousFacultyAvatar;
