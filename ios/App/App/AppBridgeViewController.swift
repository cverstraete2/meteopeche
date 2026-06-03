import Capacitor

@objc(AppBridgeViewController)
class AppBridgeViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        super.capacitorDidLoad()
        view.backgroundColor = .clear
        webView?.backgroundColor = .clear
        webView?.isOpaque = false
        webView?.scrollView.backgroundColor = .clear
        bridge?.registerPluginInstance(MeteoPecheMapPlugin())
    }
}
