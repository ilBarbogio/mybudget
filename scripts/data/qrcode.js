const isBarcodeDetectionSupported=()=>{
  return 'BarcodeDetector' in window
}

export const scanWithNativeAPI=async ()=>{
  if (!isBarcodeDetectionSupported()) {
      console.log('Barcode Detection API not supported')
      return
  }

  try {
      // Check supported formats
      const supportedFormats = await BarcodeDetector.getSupportedFormats()
      console.log('Supported formats:', supportedFormats)

      const detector = new BarcodeDetector({
          formats: ['qr_code', 'code_128', 'ean_13']
      })

      // Scan from camera
      const video = document.getElementById('video')
      const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
      })
      console.log(stream)
      video.srcObject = stream
      video.play()

      // Continuous scanning
      function tick() {
          detector.detect(video)
              .then(barcodes => {
                  if (barcodes.length > 0) {
                      barcodes.forEach(barcode => {
                          console.log('Detected:', barcode.rawValue)
                          console.log('Format:', barcode.format)
                          console.log('Bounding Box:', barcode.boundingBox)
                      })
                  }
              })
              .catch(err => console.error('Detection error:', err))

          requestAnimationFrame(tick)
      }
      
      video.addEventListener('loadedmetadata', tick)

  } catch (error) {
      console.error('Error accessing camera:', error)
  }
}

// Scan from image file
const scanImageWithNativeAPI=async (file)=>{
  if (!isBarcodeDetectionSupported()) {
      console.log('Barcode Detection API not supported')
      return
  }

  const detector = new BarcodeDetector({ formats: ['qr_code'] })
  const img = new Image()
  
  img.onload = async () => {
      try {
          const barcodes = await detector.detect(img)
          if (barcodes.length > 0) {
              console.log('QR Code found:', barcodes[0].rawValue)
          } else {
              console.log('No QR code found')
          }
      } catch (error) {
          console.error('Detection failed:', error)
      }
  }
  
  img.src = URL.createObjectURL(file)
}