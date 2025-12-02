'use client';

import { useState, useEffect } from 'react';
import NavbarNew from './NavbarNew';

export default function NavbarWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading skeleton
  }

  return <NavbarNew />;
}
