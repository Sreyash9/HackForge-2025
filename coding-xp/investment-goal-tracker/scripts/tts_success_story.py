import argparse
import os
import sys
from pathlib import Path

# Prefer pyttsx3 (offline) if available; fallback to gTTS (online) if installed

from typing import Optional


def tts_with_pyttsx3(text: str, out_path: Path) -> Optional[Path]:
    try:
        import pyttsx3  # type: ignore
    except Exception:
        return None

    engine = pyttsx3.init()
    # Slightly slower, more natural pace
    engine.setProperty('rate', 180)
    # Slightly deeper voice if available
    # voices = engine.getProperty('voices')
    # if voices:
    #     engine.setProperty('voice', voices[0].id)

    tmp_wav = out_path.with_suffix('.wav')
    engine.save_to_file(text, str(tmp_wav))
    engine.runAndWait()

    # Convert to mp3 if pydub available, else keep wav
    try:
        from pydub import AudioSegment  # type: ignore
        AudioSegment.from_wav(str(tmp_wav)).export(str(out_path), format='mp3', bitrate='128k')
        tmp_wav.unlink(missing_ok=True)
        return out_path
    except Exception:
        # Fallback: keep wav file and return wav path
        return tmp_wav if tmp_wav.exists() else None


def tts_with_gtts(text: str, out_path: Path) -> Optional[Path]:
    try:
        from gtts import gTTS  # type: ignore
    except Exception:
        return None
    try:
        tts = gTTS(text=text, lang='en')
        tts.save(str(out_path))
        return out_path
    except Exception:
        return None


def ensure_dir(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def main():
    parser = argparse.ArgumentParser(description='Generate TTS audio for a success story.')
    parser.add_argument('--name', required=True, help='Investor name slug, used as filename (e.g., warren-buffett)')
    parser.add_argument('--text', required=True, help='Narration text')
    parser.add_argument('--outDir', default='public/audio/success-stories', help='Output directory for audio files')
    args = parser.parse_args()

    safe_name = ''.join(c.lower() if c.isalnum() or c in ('-', '_') else '-' for c in args.name).strip('-')
    out_dir = Path(args.outDir)
    ensure_dir(out_dir)
    out_path = out_dir / f"{safe_name}.mp3"

    text = args.text.strip()
    if not text:
        print('No text provided', file=sys.stderr)
        sys.exit(2)

    # Try offline first
    p = tts_with_pyttsx3(text, out_path)
    if p is not None:
        print(str(p))
        return

    # Fallback to gTTS (online)
    p = tts_with_gtts(text, out_path)
    if p is not None:
        print(str(p))
        return

    print('TTS generation failed. Please install pyttsx3 or gTTS.', file=sys.stderr)
    sys.exit(1)


if __name__ == '__main__':
    main()
