const DEFAULT_AVATAR_SIZE = 512

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    const url = URL.createObjectURL(file)

    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Не удалось прочитать изображение'))
    }
    image.src = url
  })
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Не удалось подготовить изображение'))
        }
      },
      'image/jpeg',
      0.9
    )
  })
}

export async function resizeAvatarFile(
  file: File,
  scale: number,
  outputSize = DEFAULT_AVATAR_SIZE
) {
  const image = await loadImage(file)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas недоступен')
  }

  const normalizedScale = Math.min(Math.max(scale, 0.75), 1.5)
  const sourceSize = Math.min(image.width, image.height) / normalizedScale
  const sourceX = (image.width - sourceSize) / 2
  const sourceY = (image.height - sourceSize) / 2

  canvas.width = outputSize
  canvas.height = outputSize

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, outputSize, outputSize)
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    outputSize,
    outputSize
  )

  const blob = await canvasToBlob(canvas)
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'avatar'

  return new File([blob], `${baseName}.jpg`, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  })
}
