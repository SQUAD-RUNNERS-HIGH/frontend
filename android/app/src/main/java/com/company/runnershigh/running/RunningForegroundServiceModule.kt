package com.company.runnershigh.running

import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class RunningForegroundServiceModule(
  private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {
  override fun getName() = "RunningForegroundServiceModule"

  @ReactMethod
  fun start(distance: Double, seconds: Double, pace: String, promise: Promise) {
    try {
      val intent = RunningForegroundService.buildIntent(
        reactContext,
        RunningForegroundService.ACTION_START,
        distance,
        seconds.toInt(),
        pace,
      )
      ContextCompat.startForegroundService(reactContext, intent)
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("RUNNING_SERVICE_START_FAILED", error)
    }
  }

  @ReactMethod
  fun update(distance: Double, seconds: Double, pace: String, promise: Promise) {
    try {
      val intent = RunningForegroundService.buildIntent(
        reactContext,
        RunningForegroundService.ACTION_UPDATE,
        distance,
        seconds.toInt(),
        pace,
      )
      ContextCompat.startForegroundService(reactContext, intent)
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("RUNNING_SERVICE_UPDATE_FAILED", error)
    }
  }

  @ReactMethod
  fun stop(promise: Promise) {
    try {
      val intent = RunningForegroundService.buildIntent(
        reactContext,
        RunningForegroundService.ACTION_STOP,
      )
      reactContext.stopService(intent)
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("RUNNING_SERVICE_STOP_FAILED", error)
    }
  }

  @ReactMethod
  fun getSnapshot(promise: Promise) {
    try {
      val snapshot = RunningForegroundService.readSnapshot(reactContext)
      promise.resolve(
        Arguments.createMap().apply {
          putBoolean("isRunning", snapshot.isRunning)
          putDouble("distance", snapshot.distance)
          putInt("seconds", snapshot.seconds)
          putString("pace", snapshot.pace)
        }
      )
    } catch (error: Exception) {
      promise.reject("RUNNING_SERVICE_SNAPSHOT_FAILED", error)
    }
  }
}
