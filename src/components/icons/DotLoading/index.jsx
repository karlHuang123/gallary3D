import './index.css'
export default function DotLoading({ style }) {
  return (
    <div className="lds-ellipsis" style={style}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
