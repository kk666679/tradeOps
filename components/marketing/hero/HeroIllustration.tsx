export function HeroIllustration() {
  return (
    <div className="relative aspect-[30/19] w-full max-w-md">
      <svg
        aria-labelledby="hero-illustration-title"
        className="h-full w-full overflow-visible"
        role="img"
        viewBox="0 0 1200 760"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id="hero-illustration-title">
          TradeOps logistics control tower showing connected free zones and live operations
        </title>
        <defs>
          <pattern
            height="32"
            id="hero-grid"
            patternUnits="userSpaceOnUse"
            width="32"
          >
            <path
              d="M32 0H0V32"
              opacity="0.52"
              stroke="#17303B"
              strokeWidth="1"
            />
            <circle cx="0" cy="0" fill="#28505B" opacity="0.65" r="1.3" />
          </pattern>
          <linearGradient
            id="hero-background"
            x1="0"
            x2="1200"
            y1="0"
            y2="760"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#081219" />
            <stop offset="0.55" stopColor="#09141C" />
            <stop offset="1" stopColor="#0B101A" />
          </linearGradient>
          <linearGradient
            id="hero-card"
            x1="0"
            x2="1"
            y1="0"
            y2="1"
          >
            <stop stopColor="#10232D" stopOpacity="0.96" />
            <stop offset="1" stopColor="#0A151D" stopOpacity="0.96" />
          </linearGradient>
          <linearGradient id="hero-route" x1="180" x2="780" y1="500" y2="300">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#34D399" />
          </linearGradient>
          <filter
            height="1.5"
            id="hero-shadow"
            width="1.5"
            x="-0.25"
            y="-0.25"
          >
            <feDropShadow
              dx="0"
              dy="18"
              floodColor="#000000"
              floodOpacity="0.35"
              stdDeviation="18"
            />
          </filter>
          <clipPath id="hero-clip">
            <rect height="740" rx="28" width="1180" x="10" y="10" />
          </clipPath>
        </defs>

        <g filter="url(#hero-shadow)">
          <rect
            fill="url(#hero-background)"
            height="740"
            rx="28"
            width="1180"
            x="10"
            y="10"
          />
          <g clipPath="url(#hero-clip)">
            <rect
              fill="url(#hero-grid)"
              height="760"
              opacity="0.8"
              width="1200"
            />
            <circle cx="845" cy="145" fill="#0EA5E9" opacity="0.08" r="220" />
            <circle cx="290" cy="650" fill="#10B981" opacity="0.06" r="250" />

            <path d="M10 82H1190" stroke="#23404A" strokeOpacity="0.72" />
            <rect fill="#0D1B23" height="740" width="82" x="10" y="82" />
            <path d="M92 82V750" stroke="#23404A" strokeOpacity="0.72" />

            <rect
              fill="#0F2933"
              height="42"
              rx="12"
              stroke="#1E4653"
              width="42"
              x="30"
              y="28"
            />
            <path
              d="M41 57V43L51 37L61 43V57M45 57V48H57V57"
              fill="none"
              stroke="#5EEAD4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <text
              fill="#E2F3F4"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="15"
              fontWeight="700"
              letterSpacing="2.4"
              x="88"
              y="47"
            >
              TRADEOPS
            </text>
            <text
              fill="#73909A"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="10"
              letterSpacing="1.5"
              x="89"
              y="64"
            >
              OPERATIONS CONTROL TOWER
            </text>
            <rect
              fill="#0C211F"
              height="30"
              rx="15"
              stroke="#155E53"
              width="91"
              x="1071"
              y="34"
            />
            <circle cx="1089" cy="49" fill="#34D399" r="4" />
            <text
              fill="#9FE8D2"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="10"
              fontWeight="600"
              letterSpacing="1"
              x="1101"
              y="53"
            >
              SYSTEM LIVE
            </text>

            <rect
              fill="#10303A"
              height="42"
              rx="12"
              stroke="#276071"
              width="42"
              x="30"
              y="108"
            />
            <path
              d="M42 129H60M45 123H57M48 117H54M45 135H57"
              stroke="#67E8F9"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <path
              d="M44 183H60M44 189H60M44 195H55"
              stroke="#52727D"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <path
              d="M44 246H60M44 252H60M44 258H55"
              stroke="#52727D"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <path
              d="M44 309H60M44 315H60M44 321H55"
              stroke="#52727D"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <circle cx="51" cy="378" r="9" stroke="#52727D" strokeWidth="2" />
            <path
              d="M37 430H65M42 437H60"
              stroke="#52727D"
              strokeLinecap="round"
              strokeWidth="2"
            />

            <text
              fill="#E2EEF1"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="20"
              fontWeight="600"
              x="122"
              y="125"
            >
              Network overview
            </text>
            <text
              fill="#77919A"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="12"
              x="122"
              y="149"
            >
              Live cargo movement across your free-zone network
            </text>
            <text
              fill="#76909A"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="11"
              x="1010"
              y="124"
            >
              TODAY
            </text>
            <path
              d="M1060 120L1065 125L1070 120"
              fill="none"
              stroke="#76909A"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />

            <g>
              <rect
                fill="url(#hero-card)"
                height="102"
                rx="16"
                stroke="#1A3540"
                width="320"
                x="122"
                y="174"
              />
              <rect
                fill="#10313B"
                height="36"
                rx="11"
                width="36"
                x="142"
                y="193"
              />
              <path
                d="M151 205H169M153 199H167M155 211H165"
                stroke="#67E8F9"
                strokeLinecap="round"
                strokeWidth="1.7"
              />
              <text
                fill="#87A1AA"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                fontSize="12"
                x="190"
                y="204"
              >
                ACTIVE SHIPMENTS
              </text>
              <text
                fill="#F0FAFB"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                fontSize="27"
                fontWeight="600"
                x="190"
                y="241"
              >
                1,284
              </text>
              <circle cx="383" cy="228" fill="#34D399" opacity="0.16" r="21" />
              <path
                d="M376 228L381 233L391 222"
                fill="none"
                stroke="#5EEAD4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />

              <rect
                fill="url(#hero-card)"
                height="102"
                rx="16"
                stroke="#1A3540"
                width="320"
                x="462"
                y="174"
              />
              <rect
                fill="#1C2B2A"
                height="36"
                rx="11"
                width="36"
                x="482"
                y="193"
              />
              <path
                d="M491 201H509V213H491zM495 197V201M505 197V201M495 213V217M505 213V217"
                fill="none"
                stroke="#6EE7B7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
              />
              <text
                fill="#87A1AA"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                fontSize="12"
                x="530"
                y="204"
              >
                BONDED INVENTORY
              </text>
              <text
                fill="#F0FAFB"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                fontSize="27"
                fontWeight="600"
                x="530"
                y="241"
              >
                8,492
              </text>
              <text
                fill="#6EE7B7"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                fontSize="12"
                x="685"
                y="235"
              >
                lots tracked
              </text>

              <rect
                fill="url(#hero-card)"
                height="102"
                rx="16"
                stroke="#1A3540"
                width="320"
                x="802"
                y="174"
              />
              <rect
                fill="#2C281D"
                height="36"
                rx="11"
                width="36"
                x="822"
                y="193"
              />
              <path
                d="M831 198H849V216H831zM835 202H845M835 206H845M835 210H842"
                fill="none"
                stroke="#FCD34D"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
              />
              <text
                fill="#87A1AA"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                fontSize="12"
                x="870"
                y="204"
              >
                CLEARANCE QUEUE
              </text>
              <text
                fill="#F0FAFB"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                fontSize="27"
                fontWeight="600"
                x="870"
                y="241"
              >
                36
              </text>
              <text
                fill="#FCD34D"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                fontSize="12"
                x="918"
                y="235"
              >
                in review
              </text>
            </g>

            <rect
              fill="url(#hero-card)"
              height="382"
              rx="18"
              stroke="#1A3540"
              width="610"
              x="122"
              y="294"
            />
            <text
              fill="#D8E8EB"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="14"
              fontWeight="600"
              x="148"
              y="330"
            >
              Zone connections
            </text>
            <text
              fill="#718C96"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="11"
              x="148"
              y="351"
            >
              Cargo flows · Malaysia
            </text>
            <circle cx="554" cy="326" fill="#38BDF8" r="4" />
            <text
              fill="#78919A"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="10"
              x="565"
              y="330"
            >
              LIVE ROUTE
            </text>
            <path
              d="M148 375H706"
              stroke="#1B3540"
              strokeDasharray="3 7"
            />

            <g opacity="0.48" stroke="#31515A" strokeWidth="1">
              <path d="M159 422H695M159 464H695M159 506H695M159 548H695M159 590H695" />
              <path d="M210 392V641M280 392V641M350 392V641M420 392V641M490 392V641M560 392V641M630 392V641" />
            </g>
            <path
              d="M208 530C260 505 273 434 342 449C414 465 416 563 499 548C566 536 577 448 665 430"
              fill="none"
              opacity="0.18"
              stroke="url(#hero-route)"
              strokeLinecap="round"
              strokeWidth="12"
            />
            <path
              d="M208 530C260 505 273 434 342 449C414 465 416 563 499 548C566 536 577 448 665 430"
              fill="none"
              stroke="url(#hero-route)"
              strokeDasharray="5 9"
              strokeLinecap="round"
              strokeWidth="2.5"
            />
            <path
              d="M342 449C366 490 399 516 442 529"
              fill="none"
              opacity="0.65"
              stroke="#34D399"
              strokeDasharray="4 8"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
            <circle cx="208" cy="530" fill="#38BDF8" opacity="0.2" r="17" />
            <circle cx="208" cy="530" fill="#67E8F9" r="6" />
            <circle cx="342" cy="449" fill="#38BDF8" opacity="0.2" r="17" />
            <circle cx="342" cy="449" fill="#67E8F9" r="6" />
            <circle cx="499" cy="548" fill="#34D399" opacity="0.2" r="17" />
            <circle cx="499" cy="548" fill="#6EE7B7" r="6" />
            <circle cx="665" cy="430" fill="#34D399" opacity="0.2" r="17" />
            <circle cx="665" cy="430" fill="#6EE7B7" r="6" />

            <rect
              fill="#0C1A22"
              height="24"
              rx="7"
              stroke="#24505B"
              width="84"
              x="166"
              y="562"
            />
            <text
              fill="#A8C1C8"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="10"
              fontWeight="600"
              x="180"
              y="578"
            >
              PORT KLANG
            </text>
            <rect
              fill="#0C1A22"
              height="24"
              rx="7"
              stroke="#24505B"
              width="48"
              x="318"
              y="480"
            />
            <text
              fill="#A8C1C8"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="10"
              fontWeight="600"
              x="331"
              y="496"
            >
              FIZ
            </text>
            <rect
              fill="#0C1A22"
              height="24"
              rx="7"
              stroke="#24505B"
              width="48"
              x="475"
              y="579"
            />
            <text
              fill="#A8C1C8"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="10"
              fontWeight="600"
              x="488"
              y="595"
            >
              FCZ
            </text>
            <rect
              fill="#0C1A22"
              height="24"
              rx="7"
              stroke="#24505B"
              width="91"
              x="625"
              y="444"
            />
            <text
              fill="#A8C1C8"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="10"
              fontWeight="600"
              x="638"
              y="460"
            >
              JOHOR PORT
            </text>

            <rect
              fill="url(#hero-card)"
              height="382"
              rx="18"
              stroke="#1A3540"
              width="420"
              x="752"
              y="294"
            />
            <text
              fill="#D8E8EB"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="14"
              fontWeight="600"
              x="778"
              y="330"
            >
              Operations feed
            </text>
            <circle cx="1126" cy="326" fill="#34D399" r="4" />
            <text
              fill="#71909A"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="10"
              x="1137"
              y="330"
            >
              LIVE
            </text>
            <path d="M778 352H1146" stroke="#1B3540" />

            <circle cx="790" cy="389" fill="#102F39" r="15" />
            <path
              d="M784 389H796M787 385H793M787 393H793"
              stroke="#67E8F9"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
            <text
              fill="#CFE0E4"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="11"
              fontWeight="500"
              x="818"
              y="386"
            >
              Customs declaration cleared
            </text>
            <text
              fill="#6F8993"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="10"
              x="818"
              y="404"
            >
              Shipment MY-28491 · 2 min ago
            </text>
            <circle cx="790" cy="449" fill="#173127" r="15" />
            <path
              d="M784 449L788 453L796 445"
              fill="none"
              stroke="#6EE7B7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
            />
            <text
              fill="#CFE0E4"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="11"
              fontWeight="500"
              x="818"
              y="446"
            >
              Bonded transfer verified
            </text>
            <text
              fill="#6F8993"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="10"
              x="818"
              y="464"
            >
              Port Klang → FIZ · 8 min ago
            </text>
            <circle cx="790" cy="509" fill="#302919" r="15" />
            <path
              d="M790 501V510L796 513"
              fill="none"
              stroke="#FCD34D"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.6"
            />
            <text
              fill="#CFE0E4"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="11"
              fontWeight="500"
              x="818"
              y="506"
            >
              Inspection scheduled
            </text>
            <text
              fill="#6F8993"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="10"
              x="818"
              y="524"
            >
              Declaration MY-28476 · 12 min ago
            </text>
            <circle cx="790" cy="569" fill="#102F39" r="15" />
            <path
              d="M783 569H797M790 562V576M785 564L795 574M795 564L785 574"
              stroke="#67E8F9"
              strokeLinecap="round"
              strokeWidth="1.3"
            />
            <text
              fill="#CFE0E4"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="11"
              fontWeight="500"
              x="818"
              y="566"
            >
              Demand forecast updated
            </text>
            <text
              fill="#6F8993"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="10"
              x="818"
              y="584"
            >
              Warehouse capacity · 18 min ago
            </text>

            <path d="M778 612H1146" stroke="#1B3540" />
            <rect
              fill="#0D211F"
              height="32"
              rx="9"
              stroke="#1B554B"
              width="158"
              x="778"
              y="628"
            />
            <circle cx="795" cy="644" fill="#34D399" r="3" />
            <text
              fill="#9FE8D2"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="10"
              fontWeight="500"
              x="806"
              y="648"
            >
              All systems operational
            </text>

            <text
              fill="#58727C"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="10"
              letterSpacing="1"
              x="122"
              y="710"
            >
              CUSTOMS · BONDED WMS · DIGITAL TWIN
            </text>
            <text
              fill="#58727C"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontSize="10"
              x="1060"
              y="710"
            >
              UPDATED NOW
            </text>
          </g>
          <rect
            fill="none"
            height="740"
            pointerEvents="none"
            rx="28"
            stroke="#31505A"
            strokeOpacity="0.7"
            width="1180"
            x="10"
            y="10"
          />
        </g>
      </svg>
    </div>
  );
}

export default HeroIllustration;
