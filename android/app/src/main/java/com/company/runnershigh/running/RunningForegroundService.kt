package com.company.runnershigh.running

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.SystemClock
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.company.runnershigh.MainActivity
import java.util.Locale
import kotlin.math.floor
import kotlin.math.max

class RunningForegroundService : Service() {
  private val handler = Handler(Looper.getMainLooper())
  private val ticker = object : Runnable {
    override fun run() {
      if (!isRunning) return

      NotificationManagerCompat.from(this@RunningForegroundService).notify(
        NOTIFICATION_ID,
        buildNotification()
      )
      handler.postDelayed(this, 1000L)
    }
  }

  private var isRunning = false
  private var distanceMeters = 0.0
  private var baseElapsedSeconds = 0
  private var anchorElapsedRealtime = 0L
  private var paceText = "00'00\""

  override fun onCreate() {
    super.onCreate()
    createNotificationChannel()
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    when (intent?.action) {
      ACTION_STOP -> {
        stopTicker()
        clearSnapshot(this)
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
        return START_NOT_STICKY
      }

      ACTION_START,
      ACTION_UPDATE -> {
        val distance = intent.getDoubleExtra(EXTRA_DISTANCE, 0.0)
        val seconds = intent.getIntExtra(EXTRA_SECONDS, 0)
        val pace = intent.getStringExtra(EXTRA_PACE)
        syncMetrics(distance, seconds, pace)

        val notification = buildNotification()
        if (!isRunning) {
          startForeground(NOTIFICATION_ID, notification)
        } else {
          NotificationManagerCompat.from(this).notify(NOTIFICATION_ID, notification)
        }

        isRunning = true
        startTicker()
      }
    }

    return START_STICKY
  }

  override fun onDestroy() {
    stopTicker()
    isRunning = false
    clearSnapshot(this)
    super.onDestroy()
  }

  override fun onBind(intent: Intent?): IBinder? = null

  private fun syncMetrics(distance: Double, seconds: Int) {
    syncMetrics(distance, seconds, null)
  }

  private fun syncMetrics(distance: Double, seconds: Int, pace: String?) {
    distanceMeters = max(0.0, distance)
    baseElapsedSeconds = max(0, seconds)
    anchorElapsedRealtime = SystemClock.elapsedRealtime()
    paceText = if (!pace.isNullOrBlank()) {
      pace
    } else {
      formatPace(distanceMeters, baseElapsedSeconds)
    }
    persistSnapshot(
      this,
      distanceMeters,
      baseElapsedSeconds,
      anchorElapsedRealtime,
      paceText,
      true
    )
  }

  private fun startTicker() {
    handler.removeCallbacks(ticker)
    handler.post(ticker)
  }

  private fun stopTicker() {
    handler.removeCallbacks(ticker)
  }

  private fun currentElapsedSeconds(): Int {
    if (!isRunning) return baseElapsedSeconds
    val elapsedRealtimeSeconds =
      ((SystemClock.elapsedRealtime() - anchorElapsedRealtime) / 1000L).toInt()
    return max(0, baseElapsedSeconds + elapsedRealtimeSeconds)
  }

  private fun buildNotification(): Notification {
    val launchIntent = Intent(this, MainActivity::class.java).apply {
      addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
    }
    val pendingIntent = PendingIntent.getActivity(
      this,
      0,
      launchIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

    return NotificationCompat.Builder(this, CHANNEL_ID)
      .setContentTitle("Running")
      .setContentText(
        "${formatDistance(distanceMeters)} | ${formatDuration(currentElapsedSeconds())} | ${paceText}"
      )
      .setSmallIcon(android.R.drawable.ic_media_play)
      .setContentIntent(pendingIntent)
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .setSilent(true)
      .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE)
      .build()
  }

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

    val notificationManager =
      getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    val channel = NotificationChannel(
      CHANNEL_ID,
      "Running Status",
      NotificationManager.IMPORTANCE_LOW
    ).apply {
      description = "Shows active running metrics while tracking is enabled."
      setShowBadge(false)
    }
    notificationManager.createNotificationChannel(channel)
  }

  companion object {
    private const val CHANNEL_ID = "running_foreground_channel"
    private const val PREFS_NAME = "running_foreground_service"
    private const val KEY_IS_RUNNING = "is_running"
    private const val KEY_DISTANCE = "distance"
    private const val KEY_BASE_SECONDS = "base_seconds"
    private const val KEY_ANCHOR_ELAPSED_REALTIME = "anchor_elapsed_realtime"
    private const val KEY_PACE = "pace"

    const val ACTION_START = "com.company.runnershigh.running.START"
    const val ACTION_UPDATE = "com.company.runnershigh.running.UPDATE"
    const val ACTION_STOP = "com.company.runnershigh.running.STOP"

    const val EXTRA_DISTANCE = "extra_distance"
    const val EXTRA_SECONDS = "extra_seconds"
    const val EXTRA_PACE = "extra_pace"

    const val NOTIFICATION_ID = 5201

    data class Snapshot(
      val isRunning: Boolean,
      val distance: Double,
      val seconds: Int,
      val pace: String,
    )

    fun buildIntent(
      context: Context,
      action: String,
      distance: Double = 0.0,
      seconds: Int = 0,
      pace: String? = null,
    ) = Intent(context, RunningForegroundService::class.java).apply {
      this.action = action
      putExtra(EXTRA_DISTANCE, distance)
      putExtra(EXTRA_SECONDS, seconds)
      if (pace != null) {
        putExtra(EXTRA_PACE, pace)
      }
    }

    fun readSnapshot(context: Context): Snapshot {
      val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
      val isRunning = prefs.getBoolean(KEY_IS_RUNNING, false)
      val distance = prefs.getFloat(KEY_DISTANCE, 0f).toDouble()
      val baseSeconds = prefs.getInt(KEY_BASE_SECONDS, 0)
      val anchorElapsedRealtime = prefs.getLong(KEY_ANCHOR_ELAPSED_REALTIME, 0L)
      val pace = prefs.getString(KEY_PACE, null)
      val elapsedSeconds =
        if (isRunning && anchorElapsedRealtime > 0L) {
          max(
            0,
            baseSeconds + ((SystemClock.elapsedRealtime() - anchorElapsedRealtime) / 1000L).toInt()
          )
        } else {
          max(0, baseSeconds)
        }

      return Snapshot(
        isRunning = isRunning,
        distance = distance,
        seconds = elapsedSeconds,
        pace = pace ?: formatPace(distance, elapsedSeconds),
      )
    }

    fun persistSnapshot(
      context: Context,
      distance: Double,
      baseSeconds: Int,
      anchorElapsedRealtime: Long,
      pace: String,
      isRunning: Boolean,
    ) {
      context
        .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        .edit()
        .putBoolean(KEY_IS_RUNNING, isRunning)
        .putFloat(KEY_DISTANCE, distance.toFloat())
        .putInt(KEY_BASE_SECONDS, max(0, baseSeconds))
        .putLong(KEY_ANCHOR_ELAPSED_REALTIME, anchorElapsedRealtime)
        .putString(KEY_PACE, pace)
        .apply()
    }

    fun clearSnapshot(context: Context) {
      context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).edit().clear().apply()
    }

    private fun formatDistance(distance: Double): String {
      return String.format(Locale.US, "%.2fkm", max(0.0, distance) / 1000.0)
    }

    private fun formatDuration(totalSeconds: Int): String {
      val safeSeconds = max(0, totalSeconds)
      val hours = safeSeconds / 3600
      val minutes = (safeSeconds % 3600) / 60
      val seconds = safeSeconds % 60

      return String.format(Locale.US, "%02d:%02d:%02d", hours, minutes, seconds)
    }

    private fun formatPace(distance: Double, seconds: Int): String {
      if (distance <= 0.0 || seconds <= 0) {
        return "00'00\""
      }

      val speedMs = distance / seconds.toDouble()
      if (speedMs <= 0.0) {
        return "00'00\""
      }

      val kmPerHour = speedMs * 3.6
      if (kmPerHour <= 0.0) {
        return "00'00\""
      }

      val minutesPerKm = 60.0 / kmPerHour
      val minutes = floor(minutesPerKm).toInt()
      val paceSeconds = ((minutesPerKm - minutes) * 60.0).toInt()

      return String.format(Locale.US, "%02d'%02d\"", minutes, paceSeconds)
    }
  }
}
