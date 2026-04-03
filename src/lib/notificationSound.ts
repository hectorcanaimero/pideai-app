import { Audio } from "expo-av";

let sound: Audio.Sound | null = null;

/**
 * Play the order notification sound.
 * Uses a sine wave tone generated as a WAV data URI.
 * Respects volume (0-100) and repeat count settings.
 */
export async function playNotificationSound(
  volume: number = 80,
  repeatCount: number = 3
): Promise<void> {
  try {
    // Ensure audio mode is set for playback
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true, // Critical: play even in silent mode
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    const normalizedVolume = Math.max(0, Math.min(100, volume)) / 100;

    for (let i = 0; i < repeatCount; i++) {
      // Unload previous sound if exists
      if (sound) {
        await sound.unloadAsync();
        sound = null;
      }

      // Use system notification sound
      // On iOS this plays the default notification sound
      // On Android it uses the default notification channel sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        generateToneWav(),
        {
          volume: normalizedVolume,
          shouldPlay: true,
        }
      );
      sound = newSound;

      // Wait for sound to finish + small gap between repeats
      await new Promise<void>((resolve) => {
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            resolve();
          }
        });
        // Fallback timeout in case callback doesn't fire
        setTimeout(resolve, 1000);
      });

      // Gap between repeats
      if (i < repeatCount - 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  } catch (error) {
    console.error("Error playing notification sound:", error);
  }
}

/**
 * Generate a simple WAV tone as a data URI.
 * Creates a 800Hz sine wave, 0.4 seconds, 8000Hz sample rate.
 */
function generateToneWav(): { uri: string } {
  const sampleRate = 8000;
  const frequency = 800;
  const duration = 0.4;
  const numSamples = Math.floor(sampleRate * duration);

  // WAV header
  const buffer = new ArrayBuffer(44 + numSamples);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + numSamples, true);
  writeString(view, 8, "WAVE");

  // fmt chunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true); // byte rate
  view.setUint16(32, 1, true); // block align
  view.setUint16(34, 8, true); // bits per sample

  // data chunk
  writeString(view, 36, "data");
  view.setUint32(40, numSamples, true);

  // Generate sine wave samples
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Sine wave with envelope (fade in/out)
    const envelope =
      t < 0.05
        ? t / 0.05
        : t > duration - 0.05
        ? (duration - t) / 0.05
        : 1;
    const sample = Math.sin(2 * Math.PI * frequency * t) * envelope;
    // Convert to unsigned 8-bit (0-255, center at 128)
    view.setUint8(44 + i, Math.floor(128 + sample * 100));
  }

  // Convert to base64 data URI
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  return { uri: `data:audio/wav;base64,${base64}` };
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/**
 * Clean up sound resources
 */
export async function unloadNotificationSound(): Promise<void> {
  if (sound) {
    await sound.unloadAsync();
    sound = null;
  }
}
