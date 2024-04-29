import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export const useQrcode = (rawStr: string) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>()
  useEffect(() => {
    QRCode.toDataURL(rawStr).then(setQrDataUrl).catch(console.error)
  }, [rawStr])

  return { dataUrl: qrDataUrl, loading: !qrDataUrl }
}
