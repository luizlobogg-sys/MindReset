package com.mindreset.app.plugins;

import android.app.AppOpsManager;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.provider.Settings;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.Calendar;
import java.util.List;
import java.util.Locale;

@CapacitorPlugin(name = "MindResetUsage")
public class MindResetUsagePlugin extends Plugin {
    private boolean hasUsagePermission() {
        AppOpsManager appOps = (AppOpsManager) getContext().getSystemService(Context.APP_OPS_SERVICE);
        int mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, getContext().getApplicationInfo().uid, getContext().getPackageName());
        return mode == AppOpsManager.MODE_ALLOWED;
    }

    @PluginMethod
    public void hasUsageAccess(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("granted", hasUsagePermission());
        call.resolve(ret);
    }

    @PluginMethod
    public void openUsageAccessSettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Unable to open Usage Access settings", e);
        }
    }

    @PluginMethod
    public void getTodayUsage(PluginCall call) {
        if (!hasUsagePermission()) {
            call.reject("Usage Access permission is not granted");
            return;
        }
        UsageStatsManager manager = (UsageStatsManager) getContext().getSystemService(Context.USAGE_STATS_SERVICE);
        Calendar start = Calendar.getInstance();
        start.set(Calendar.HOUR_OF_DAY, 0);
        start.set(Calendar.MINUTE, 0);
        start.set(Calendar.SECOND, 0);
        start.set(Calendar.MILLISECOND, 0);
        long now = System.currentTimeMillis();
        List<UsageStats> stats = manager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, start.getTimeInMillis(), now);
        long screen = 0;
        long social = 0;
        if (stats != null) {
            for (UsageStats s : stats) {
                long t = s.getTotalTimeInForeground();
                if (t <= 0) continue;
                screen += t;
                if (isSocial(s.getPackageName())) social += t;
            }
        }
        JSObject ret = new JSObject();
        ret.put("screenTimeMs", screen);
        ret.put("socialTimeMs", social);
        call.resolve(ret);
    }

    private boolean isSocial(String pkg) {
        if (pkg == null) return false;
        String p = pkg.toLowerCase(Locale.ROOT);
        String[] keys = {"instagram", "facebook", "tiktok", "musically", "snapchat", "twitter", "reddit", "threads", "pinterest", "discord", "telegram"};
        for (String key : keys) if (p.contains(key)) return true;
        return false;
    }
}
