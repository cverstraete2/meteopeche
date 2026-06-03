import Capacitor
import MapKit
import UIKit
import WebKit

final class MeteoPechePassthroughWebView: WKWebView {
    var nativeMapPassthroughEnabled = false
    var nativeMapFrame: CGRect = .null
    var nativeMapInteractiveRects: [CGRect] = []

    override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
        guard
            nativeMapPassthroughEnabled,
            nativeMapFrame.contains(point),
            !nativeMapInteractiveRects.contains(where: { $0.contains(point) }),
            let mapView = findNativeMapView()
        else {
            return super.hitTest(point, with: event)
        }

        let mapPoint = mapView.convert(point, from: self)
        return mapView.hitTest(mapPoint, with: event) ?? mapView
    }

    private func findNativeMapView() -> MKMapView? {
        if let mapView = subviews.compactMap({ $0 as? MKMapView }).first {
            return mapView
        }

        for subview in subviews {
            if let mapView = findNativeMapView(in: subview) {
                return mapView
            }
        }

        return nil
    }

    private func findNativeMapView(in view: UIView) -> MKMapView? {
        if let mapView = view as? MKMapView {
            return mapView
        }

        for subview in view.subviews {
            if let mapView = findNativeMapView(in: subview) {
                return mapView
            }
        }

        return nil
    }
}

@objc(AppBridgeViewController)
class AppBridgeViewController: CAPBridgeViewController {
    override open func webView(with frame: CGRect, configuration: WKWebViewConfiguration) -> WKWebView {
        MeteoPechePassthroughWebView(frame: frame, configuration: configuration)
    }

    override open func capacitorDidLoad() {
        super.capacitorDidLoad()
        view.backgroundColor = .clear
        webView?.backgroundColor = .clear
        webView?.isOpaque = false
        webView?.scrollView.backgroundColor = .clear
        bridge?.registerPluginInstance(MeteoPecheMapPlugin())
    }
}
