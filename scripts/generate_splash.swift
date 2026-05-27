import AppKit
import Foundation

struct SplashTarget {
    let path: String
    let width: Int
    let height: Int
}

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let logoPath = root.appendingPathComponent("assets/meteocatch-logo-v2.png").path
guard let logo = NSImage(contentsOfFile: logoPath) else {
    fatalError("Unable to read logo at \(logoPath)")
}

let iosSplash = root.appendingPathComponent("ios/App/App/Assets.xcassets/Splash.imageset")
var targets = [
    SplashTarget(path: iosSplash.appendingPathComponent("splash-2732x2732.png").path, width: 2732, height: 2732),
    SplashTarget(path: iosSplash.appendingPathComponent("splash-2732x2732-1.png").path, width: 2732, height: 2732),
    SplashTarget(path: iosSplash.appendingPathComponent("splash-2732x2732-2.png").path, width: 2732, height: 2732),
]

let androidTargets: [(String, Int, Int)] = [
    ("android/app/src/main/res/drawable/splash.png", 480, 320),
    ("android/app/src/main/res/drawable-land-mdpi/splash.png", 480, 320),
    ("android/app/src/main/res/drawable-land-hdpi/splash.png", 800, 480),
    ("android/app/src/main/res/drawable-land-xhdpi/splash.png", 1280, 720),
    ("android/app/src/main/res/drawable-land-xxhdpi/splash.png", 1600, 960),
    ("android/app/src/main/res/drawable-land-xxxhdpi/splash.png", 1920, 1280),
    ("android/app/src/main/res/drawable-port-mdpi/splash.png", 320, 480),
    ("android/app/src/main/res/drawable-port-hdpi/splash.png", 480, 800),
    ("android/app/src/main/res/drawable-port-xhdpi/splash.png", 720, 1280),
    ("android/app/src/main/res/drawable-port-xxhdpi/splash.png", 960, 1600),
    ("android/app/src/main/res/drawable-port-xxxhdpi/splash.png", 1280, 1920),
]

targets.append(contentsOf: androidTargets.map { target in
    SplashTarget(path: root.appendingPathComponent(target.0).path, width: target.1, height: target.2)
})

let background = NSColor(red: 240 / 255, green: 246 / 255, blue: 255 / 255, alpha: 1)
let meteoColor = NSColor(red: 0 / 255, green: 47 / 255, blue: 93 / 255, alpha: 1)
let catchColor = NSColor(red: 9 / 255, green: 168 / 255, blue: 181 / 255, alpha: 1)

func drawSplash(_ target: SplashTarget) throws {
    let rect = NSRect(x: 0, y: 0, width: target.width, height: target.height)
    guard let bitmap = NSBitmapImageRep(
        bitmapDataPlanes: nil,
        pixelsWide: target.width,
        pixelsHigh: target.height,
        bitsPerSample: 8,
        samplesPerPixel: 4,
        hasAlpha: true,
        isPlanar: false,
        colorSpaceName: .deviceRGB,
        bytesPerRow: 0,
        bitsPerPixel: 0
    ) else {
        fatalError("Unable to create bitmap for \(target.path)")
    }

    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)

    background.setFill()
    rect.fill()

    let minDimension = CGFloat(min(target.width, target.height))
    let landscape = target.width > target.height
    let logoSide = minDimension * (landscape ? 0.25 : 0.30)
    let titleSize = max(minDimension * (landscape ? 0.095 : 0.10), 28)
    let gap = minDimension * (landscape ? 0.055 : 0.065)
    let font = NSFont.systemFont(ofSize: titleSize, weight: .black)
    let meteoAttributes: [NSAttributedString.Key: Any] = [
        .font: font,
        .foregroundColor: meteoColor,
    ]
    let catchAttributes: [NSAttributedString.Key: Any] = [
        .font: font,
        .foregroundColor: catchColor,
    ]
    let meteo = NSAttributedString(string: "Meteo", attributes: meteoAttributes)
    let catchTitle = NSAttributedString(string: "Catch", attributes: catchAttributes)
    let titleWidth = meteo.size().width + catchTitle.size().width
    let titleHeight = max(meteo.size().height, catchTitle.size().height)
    let totalHeight = logoSide + gap + titleHeight
    let logoY = CGFloat(target.height) * 0.5 + totalHeight * 0.5 - logoSide
    let logoRect = NSRect(
        x: (CGFloat(target.width) - logoSide) * 0.5,
        y: logoY,
        width: logoSide,
        height: logoSide
    )
    logo.draw(in: logoRect, from: .zero, operation: .sourceOver, fraction: 1)

    let textX = (CGFloat(target.width) - titleWidth) * 0.5
    let textY = logoY - gap - titleHeight
    meteo.draw(at: NSPoint(x: textX, y: textY))
    catchTitle.draw(at: NSPoint(x: textX + meteo.size().width, y: textY))

    NSGraphicsContext.restoreGraphicsState()

    guard let data = bitmap.representation(using: .png, properties: [:]) else {
        fatalError("Unable to encode \(target.path)")
    }
    try data.write(to: URL(fileURLWithPath: target.path))
}

for target in targets {
    try drawSplash(target)
}

print("Generated \(targets.count) MeteoCatch splash assets")
