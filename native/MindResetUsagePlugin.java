package com.mindreset.app.plugins;

import android.app.AppOpsManager;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.provider.Settings;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@CapacitorPlugin(name = "MindResetUsage")
public class MindResetUsagePlugin extends Plugin {

    private boolean hasUsagePermission() {
        try {
            AppOpsManager appOps = (AppOpsManager) getContext()
                    .getSystemService(Context.APP_OPS_SERVICE);
            if (appOps == null) return false;

            int mode = appOps.checkOpNoThrow(
                    AppOpsManager.OPSTR_GET_USAGE_STATS,
                    getContext().getApplicationInfo().uid,
                    getContext().getPackageName()
            );
            return mode == AppOpsManager.MODE_ALLOWED;
        } catch (Exception e) {
            return false;
        }
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

    /**
     * Returns today's real Android usage, including total screen/app time,
     * social-media time, number of apps used and the most-used apps.
     */
    @PluginMethod
    public void getTodayUsage(PluginCall call) {
        if (!hasUsagePermission()) {
            call.reject("Usage Access permission is not granted");
            return;
        }

        try {
            UsageStatsManager manager = (UsageStatsManager) getContext()
                    .getSystemService(Context.USAGE_STATS_SERVICE);

            if (manager == null) {
                call.reject("UsageStatsManager is unavailable");
                return;
            }

            Calendar start = Calendar.getInstance();
            start.set(Calendar.HOUR_OF_DAY, 0);
            start.set(Calendar.MINUTE, 0);
            start.set(Calendar.SECOND, 0);
            start.set(Calendar.MILLISECOND, 0);

            long startMs = start.getTimeInMillis();
            long now = System.currentTimeMillis();

            List<UsageStats> stats = manager.queryUsageStats(
                    UsageStatsManager.INTERVAL_DAILY,
                    startMs,
                    now
            );

            long screen = 0L;
            long social = 0L;
            int appsUsed = 0;
            List<AppUsage> apps = new ArrayList<>();

            String ownPackage = getContext().getPackageName();

            if (stats != null) {
                for (UsageStats s : stats) {
                    long foreground = s.getTotalTimeInForeground();
                    String pkg = s.getPackageName();

                    if (foreground <= 0 || pkg == null) continue;
                    if (pkg.equals(ownPackage)) continue;

                    screen += foreground;

                    if (isSocial(pkg)) {
                        social += foreground;
                    }

                    appsUsed++;
                    apps.add(new AppUsage(pkg, foreground, isSocial(pkg)));
                }
            }

            Collections.sort(apps, new Comparator<AppUsage>() {
                @Override
                public int compare(AppUsage a, AppUsage b) {
                    return Long.compare(b.timeMs, a.timeMs);
                }
            });

            JSArray topApps = new JSArray();
            int limit = Math.min(10, apps.size());
            for (int i = 0; i < limit; i++) {
                AppUsage app = apps.get(i);
                JSObject item = new JSObject();
                item.put("packageName", app.packageName);
                item.put("timeMs", app.timeMs);
                item.put("social", app.social);
                topApps.put(item);
            }

            JSObject ret = new JSObject();
            ret.put("screenTimeMs", screen);
            ret.put("socialTimeMs", social);
            ret.put("appsUsed", appsUsed);
            ret.put("topApps", topApps);
            ret.put("updatedAt", System.currentTimeMillis());
            ret.put("hasPermission", true);
            call.resolve(ret);

        } catch (SecurityException e) {
            call.reject("Android Usage Access permission is not available", e);
        } catch (Exception e) {
            call.reject("Unable to read Android usage data", e);
        }
    }

    /**
     * Returns usage totals for each of the last requested number of days.
     * Useful for the MindReset weekly chart.
     */
    @PluginMethod
    public void getUsageHistory(PluginCall call) {
        if (!hasUsagePermission()) {
            call.reject("Usage Access permission is not granted");
            return;
        }

        try {
            int requestedDays = call.getInt("days", 7);
            int days = Math.max(1, Math.min(requestedDays, 31));

            UsageStatsManager manager = (UsageStatsManager) getContext()
                    .getSystemService(Context.USAGE_STATS_SERVICE);

            if (manager == null) {
                call.reject("UsageStatsManager is unavailable");
                return;
            }

            Calendar end = Calendar.getInstance();
            long endMs = end.getTimeInMillis();

            Calendar begin = (Calendar) end.clone();
            begin.set(Calendar.HOUR_OF_DAY, 0);
            begin.set(Calendar.MINUTE, 0);
            begin.set(Calendar.SECOND, 0);
            begin.set(Calendar.MILLISECOND, 0);
            begin.add(Calendar.DAY_OF_YEAR, -(days - 1));
            long beginMs = begin.getTimeInMillis();

            List<UsageStats> stats = manager.queryUsageStats(
                    UsageStatsManager.INTERVAL_DAILY,
                    beginMs,
                    endMs
            );

            JSArray history = new JSArray();

            for (int offset = days - 1; offset >= 0; offset--) {
                Calendar dayStart = Calendar.getInstance();
                dayStart.set(Calendar.HOUR_OF_DAY, 0);
                dayStart.set(Calendar.MINUTE, 0);
                dayStart.set(Calendar.SECOND, 0);
                dayStart.set(Calendar.MILLISECOND, 0);
                dayStart.add(Calendar.DAY_OF_YEAR, -offset);

                Calendar dayEnd = (Calendar) dayStart.clone();
                dayEnd.add(Calendar.DAY_OF_YEAR, 1);

                long total = 0L;
                long social = 0L;

                if (stats != null) {
                    for (UsageStats s : stats) {
                        long bucketBegin = s.getFirstTimeStamp();
                        long bucketEnd = s.getLastTimeStamp();

                        // INTERVAL_DAILY normally returns daily buckets. The
                        // overlap check also makes this robust across devices.
                        if (bucketEnd < dayStart.getTimeInMillis() ||
                                bucketBegin >= dayEnd.getTimeInMillis()) {
                            continue;
                        }

                        long time = s.getTotalTimeInForeground();
                        if (time <= 0) continue;

                        total += time;
                        if (isSocial(s.getPackageName())) social += time;
                    }
                }

                JSObject day = new JSObject();
                day.put("date", formatDate(dayStart));
                day.put("dayOfWeek", dayStart.get(Calendar.DAY_OF_WEEK));
                day.put("screenTimeMs", total);
                day.put("socialTimeMs", social);
                history.put(day);
            }

            JSObject ret = new JSObject();
            ret.put("days", history);
            ret.put("count", days);
            ret.put("hasPermission", true);
            call.resolve(ret);

        } catch (Exception e) {
            call.reject("Unable to read usage history", e);
        }
    }

    /** Returns a simple percentage of today's usage that belongs to social apps. */
    @PluginMethod
    public void getSocialUsagePercentage(PluginCall call) {
        if (!hasUsagePermission()) {
            call.reject("Usage Access permission is not granted");
            return;
        }

        try {
            UsageStatsManager manager = (UsageStatsManager) getContext()
                    .getSystemService(Context.USAGE_STATS_SERVICE);

            Calendar start = Calendar.getInstance();
            start.set(Calendar.HOUR_OF_DAY, 0);
            start.set(Calendar.MINUTE, 0);
            start.set(Calendar.SECOND, 0);
            start.set(Calendar.MILLISECOND, 0);

            List<UsageStats> stats = manager.queryUsageStats(
                    UsageStatsManager.INTERVAL_DAILY,
                    start.getTimeInMillis(),
                    System.currentTimeMillis()
            );

            long total = 0L;
            long social = 0L;

            if (stats != null) {
                for (UsageStats s : stats) {
                    long time = s.getTotalTimeInForeground();
                    if (time <= 0) continue;
                    total += time;
                    if (isSocial(s.getPackageName())) social += time;
                }
            }

            double percentage = total > 0 ? (social * 100.0) / total : 0.0;

            JSObject ret = new JSObject();
            ret.put("percentage", percentage);
            ret.put("totalMs", total);
            ret.put("socialMs", social);
            call.resolve(ret);

        } catch (Exception e) {
            call.reject("Unable to calculate social usage", e);
        }
    }

    private String formatDate(Calendar calendar) {
        return String.format(
                Locale.US,
                "%04d-%02d-%02d",
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH) + 1,
                calendar.get(Calendar.DAY_OF_MONTH)
        );
    }

    private boolean isSocial(String pkg) {
        if (pkg == null) return false;

        String p = pkg.toLowerCase(Locale.ROOT);
        String[] keys = {
                "instagram",
                "facebook",
                "tiktok",
                "musically",
                "snapchat",
                "twitter",
                "x.android",
                "reddit",
                "threads",
                "pinterest",
                "discord",
                "telegram",
                "whatsapp",
                "messenger",
                "kwai",
                "likee",
                "clubhouse"
        };

        for (String key : keys) {
            if (p.contains(key)) return true;
        }
        return false;
    }

    private static class AppUsage {
        final String packageName;
        final long timeMs;
        final boolean social;

        AppUsage(String packageName, long timeMs, boolean social) {
            this.packageName = packageName;
            this.timeMs = timeMs;
            this.social = social;
        }
    }
}
