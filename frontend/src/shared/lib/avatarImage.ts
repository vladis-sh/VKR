const DEFAULT_AVATAR_SIZE = 512

export interface AvatarCropOptions {
  zoom: number
  offsetX: number
  offsetY: number
  viewportSize: number
  outputSize?: number
}

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

function createAvatarFile(blob: Blob, sourceFile: File) {
  const baseName = sourceFile.name.replace(/\.[^.]+$/, '') || 'avatar'

  return new File([blob], `${baseName}.jpg`, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  })
}

export async function cropAvatarFile(file: File, options: AvatarCropOptions) {
  const image = await loadImage(file)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas недоступен')
  }

  const outputSize = options.outputSize ?? DEFAULT_AVATAR_SIZE
  const normalizedZoom = Math.min(Math.max(options.zoom, 1), 3)
  const baseScale = outputSize / Math.min(image.width, image.height)
  const viewportToOutput = outputSize / options.viewportSize
  const drawWidth = image.width * baseScale * normalizedZoom
  const drawHeight = image.height * baseScale * normalizedZoom
  const drawX = (outputSize - drawWidth) / 2 + options.offsetX * viewportToOutput
  const drawY = (outputSize - drawHeight) / 2 + options.offsetY * viewportToOutput

  canvas.width = outputSize
  canvas.height = outputSize

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, outputSize, outputSize)
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight)

  const blob = await canvasToBlob(canvas)

  return createAvatarFile(blob, file)
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

  return createAvatarFile(blob, file)
}
