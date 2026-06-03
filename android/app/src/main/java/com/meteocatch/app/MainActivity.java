package com.meteocatch.app;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(MeteoPecheMapPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
