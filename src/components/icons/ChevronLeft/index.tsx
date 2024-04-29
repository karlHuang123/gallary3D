import React from 'react'

export type ChevronLeftProps = React.SVGProps<React.ReactSVGElement> & {
  size?: number
  color?: string
}

const ChevronLeft: React.FC<ChevronLeftProps> = ({
  size = 24,
  color = '#000000',
  style = undefined,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={style}
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
)
export default ChevronLeft
