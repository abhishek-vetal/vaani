'use client';

import { useMemo } from 'react';
import { Style, Avatar } from '@dicebear/core';
import glass from '@dicebear/styles/glass.json' with { type: 'json' };

const style = new Style(glass);

export function UseVoiceAvatar({ seed = 'Aron' }: { seed?: string }) {
  return useMemo(
    () =>
      new Avatar(style, {
        seed,
        size: 128,
        // ... other options
      }).toDataUri(),
    [seed],
  );
}