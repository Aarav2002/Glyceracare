import React from 'react';
import { Hero } from '../components/Hero';
import { Process } from '../components/Process';

export function HomePage() {
  return (
    <div className="pt-20">
      <Hero />
      <Process />
    </div>
  );
}
