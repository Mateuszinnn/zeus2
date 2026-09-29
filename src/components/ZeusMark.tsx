/* A marca. O raio é recortado para fora do Z — a fenda entre as duas metades
 * é a forma, não um raio colocado por cima. Construção plana: sem bisel, sem
 * contorno, sem sombra.
 *
 * Com a paleta monocromática, azul sobre azul viraria lama. Então o Z herda a
 * cor do contexto (`currentColor`): escuro sobre o login claro, branco sobre a
 * faixa de navegação. O raio fica no azul claro da marca e é o único elemento
 * fixo — é ele que identifica o produto nos dois fundos.
 *
 * Ver DESIGN.md §Shapes.
 */

const BOLT = '34,8 10,37 32,37 30,56 54,27 32,27'

export function ZeusMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <mask id="zeus-bolt-cut">
        <rect width="64" height="64" fill="#fff" />
        <polygon points={BOLT} fill="#000" stroke="#000" strokeWidth="5" strokeLinejoin="round" />
      </mask>
      <path
        d="M12,10 H52 V21 L30,43 H52 V54 H12 V43 L34,21 H12 Z"
        fill="currentColor"
        mask="url(#zeus-bolt-cut)"
      />
      <polygon points={BOLT} className="fill-accent-bright" />
    </svg>
  )
}
