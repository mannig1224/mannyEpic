// app/bellschedule/page.tsx
"use client";
import React from 'react';
import DayTypesSection from '../../components/bellschedulePageComponents/DayTypesSection/DayTypesSection';
import CalendarYearSection from '../../components/bellschedulePageComponents/CalendarYearSection/CalendarYearSection';
import styles from './bellschedule.module.css';

const BellSchedulePage: React.FC = () => {
  return (
    <main className={styles.mainContent}>
      <DayTypesSection />
      <CalendarYearSection />
    </main>
  );
};

export default BellSchedulePage;
